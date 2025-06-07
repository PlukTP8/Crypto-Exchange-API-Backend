import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Currency from '../models/Currency';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import { AuthRequest, ApiResponse } from '../types';
import { Op } from 'sequelize';

interface CreateOrderRequest {
  currency_symbol: string;
  order_type: 'buy' | 'sell';
  amount: number;
  price: number;
}

class OrderController {
  public async createOrder(req: Request<{}, ApiResponse, CreateOrderRequest>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { currency_symbol, order_type, amount, price } = req.body;
      const user_id = req.user!.user_id;

      const currency = await Currency.findOne({ where: { symbol: currency_symbol } });
      if (!currency) {
        res.status(404).json({ success: false, message: 'Currency not found' });
        return;
      }

      if (order_type === 'sell') {
        const wallet = await Wallet.findOne({ where: { user_id, currency_id: currency.currency_id } });

        if (!wallet || wallet.balance < amount) {
          res.status(400).json({ success: false, message: 'Insufficient balance' });
          return;
        }

        await wallet.update({
          balance: Number(wallet.balance) - Number(amount),
          locked_balance: Number(wallet.locked_balance) + Number(amount)
        });
      }

      const order = await Order.create({
        user_id,
        currency_id: currency.currency_id,
        order_type,
        amount,
        price
      });

      await OrderController.matchOrders(order);

      res.status(201).json({ success: true, message: 'Order created successfully', data: { order } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async matchOrders(order: Order): Promise<void> {
    const oppositeType = order.order_type === 'buy' ? 'sell' : 'buy';

    const matchOrder = await Order.findOne({
      where: {
        currency_id: order.currency_id,
        order_type: oppositeType,
        price: order.order_type === 'buy'
          ? { [Op.lte]: order.price }
          : { [Op.gte]: order.price },
        status: 'pending'
      },
      order: [['price', order.order_type === 'buy' ? 'ASC' : 'DESC']]
    });

    if (!matchOrder) return;

    const matchedAmount = Math.min(order.amount, matchOrder.amount);

    const buyerId = order.order_type === 'buy' ? order.user_id : matchOrder.user_id;
    const sellerId = order.order_type === 'sell' ? order.user_id : matchOrder.user_id;

    const buyerWallet = await Wallet.findOne({ where: { user_id: buyerId, currency_id: order.currency_id } });
    const sellerWallet = await Wallet.findOne({ where: { user_id: sellerId, currency_id: order.currency_id } });

    if (!buyerWallet || !sellerWallet) return;

    await buyerWallet.update({ balance: Number(buyerWallet.balance) + matchedAmount });
    await sellerWallet.update({
      locked_balance: Number(sellerWallet.locked_balance) - matchedAmount
    });

    await Transaction.create({
      from_user_id: sellerId,
      to_user_id: buyerId,
      currency_id: order.currency_id,
      amount: matchedAmount,
      transaction_type: 'trade',
      status: 'completed'
    });

    await matchOrder.update({
      filled_amount: Number(matchOrder.filled_amount) + matchedAmount,
      status: Number(matchOrder.filled_amount) + matchedAmount >= matchOrder.amount
        ? 'completed'
        : 'pending'
    });

    await order.update({
      filled_amount: Number(order.filled_amount) + matchedAmount,
      status: Number(order.filled_amount) + matchedAmount >= order.amount
        ? 'completed'
        : 'pending'
    });


  }


  public async getUserOrders(req: AuthRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const orders = await Order.findAll({
        where: { user_id: req.user!.user_id },
        include: [{ model: Currency, as: 'currency' }],
        order: [['createdAt', 'DESC']]
      });

      res.json({ success: true, data: { orders } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getMarketOrders(req: Request<{ currency_symbol: string }>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { currency_symbol } = req.params;

      const currency = await Currency.findOne({ where: { symbol: currency_symbol } });
      if (!currency) {
        res.status(404).json({ success: false, message: 'Currency not found' });
        return;
      }

      const buyOrders = await Order.findAll({
        where: { currency_id: currency.currency_id, order_type: 'buy', status: 'pending' },
        order: [['price', 'DESC']]
      });

      const sellOrders = await Order.findAll({
        where: { currency_id: currency.currency_id, order_type: 'sell', status: 'pending' },
        order: [['price', 'ASC']]
      });

      res.json({ success: true, data: { orderBook: { buy_orders: buyOrders, sell_orders: sellOrders } } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new OrderController();
