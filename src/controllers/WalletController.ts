import { Request, Response, NextFunction } from 'express';
import Wallet from '../models/Wallet';
import Currency from '../models/Currency';
import Transaction from '../models/Transaction';
import { AuthRequest, ApiResponse } from '../types';
import User from '../models/User';

interface TransferRequest {
  to_user_id: number;
  currency_symbol: string;
  amount: number;
}

class WalletController {
  public async getUserWallets(req: AuthRequest, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const wallets = await Wallet.findAll({
        where: { user_id: req.user!.user_id },
        include: [
          {
            model: Currency,
            as: 'currency'
          }
        ]
      });

      res.json({
        success: true,
        data: { wallets }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  public async createWallet(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, currency_id, balance = 0 } = req.body;

      const user = await User.findByPk(user_id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const currency = await Currency.findByPk(currency_id);
      if (!currency) {
        res.status(404).json({ success: false, message: 'Currency not found' });
        return;
      }

      const existingWallet = await Wallet.findOne({ where: { user_id, currency_id } });
      if (existingWallet) {
        res.status(400).json({ success: false, message: 'Wallet already exists for this user and currency' });
        return;
      }

      const wallet = await Wallet.create({
        user_id,
        currency_id,
        balance: Number(balance),
        locked_balance: 0
      });

      res.status(201).json({
        success: true,
        message: 'Wallet created successfully',
        data: wallet
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async transfer(req: Request<{}, ApiResponse, TransferRequest>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { to_user_id, currency_symbol, amount } = req.body;
      const from_user_id = req.user!.user_id;

      const currency = await Currency.findOne({ where: { symbol: currency_symbol } });
      if (!currency) {
        res.status(404).json({
          success: false,
          message: 'Currency not found'
        });
        return;
      }

      const senderWallet = await Wallet.findOne({
        where: { user_id: from_user_id, currency_id: currency.currency_id }
      });

      if (!senderWallet || senderWallet.balance < amount) {
        res.status(400).json({
          success: false,
          message: 'Insufficient balance'
        });
        return;
      }

      const receiverWallet = await Wallet.findOne({
        where: { user_id: to_user_id, currency_id: currency.currency_id }
      });

      if (!receiverWallet) {
        res.status(404).json({
          success: false,
          message: 'Receiver wallet not found'
        });
        return;
      }

      await senderWallet.update({
        balance: Number(senderWallet.balance) - Number(amount)
      });

      await receiverWallet.update({
        balance: Number(receiverWallet.balance) + Number(amount)
      });


      const transaction = await Transaction.create({
        from_user_id,
        to_user_id,
        currency_id: currency.currency_id,
        amount,
        transaction_type: 'transfer',
        status: 'completed'
      });

      res.json({
        success: true,
        message: 'Transfer completed successfully',
        data: { transaction }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new WalletController();