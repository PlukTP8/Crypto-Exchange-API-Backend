import OrderController from '../controllers/OrderController';
import auth from '../middleware/auth';
import express from 'express';
import { AuthRequest } from '../types';

const router = express.Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders of the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's orders
 */
router.get('/', auth, (req, res, next) => {
  return OrderController.getUserOrders(req as unknown as AuthRequest, res, next);
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currency_symbol:
 *                 type: string
 *               order_type:
 *                 type: string
 *                 enum: [buy, sell]
 *               amount:
 *                 type: number
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/', auth, OrderController.createOrder);

/**
 * @swagger
 * /orders/market/{currency_symbol}:
 *   get:
 *     summary: Get market order book for a currency
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: currency_symbol
 *         schema:
 *           type: string
 *         required: true
 *         description: The symbol of the currency (e.g., BTC)
 *     responses:
 *       200:
 *         description: Buy and sell order book
 */
router.get('/market/:currency_symbol', OrderController.getMarketOrders);

export default router;
