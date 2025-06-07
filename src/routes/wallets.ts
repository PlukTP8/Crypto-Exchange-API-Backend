import express from 'express';
import WalletController from '../controllers/WalletController';
import auth from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet management and transfer endpoints
 */

/**
 * @swagger
 * /wallets:
 *   get:
 *     summary: Get all wallets for the authenticated user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user wallets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       wallet_id:
 *                         type: integer
 *                       currency_id:
 *                         type: integer
 *                       balance:
 *                         type: number
 *                       locked_balance:
 *                         type: number
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 */
router.get('/', auth, (req, res, next) => {
  return WalletController.getUserWallets(req as unknown as AuthRequest, res, next);
});

/**
 * @swagger
 * /wallets:
 *   post:
 *     summary: Create a new wallet for the authenticated user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - currency_id
 *               - balance
 *             properties:
 *               user_id:
 *                 type: integer
 *               currency_id:
 *                 type: integer
 *               balance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     wallet_id:
 *                       type: integer
 *                     currency_id:
 *                       type: integer
 *                     balance:
 *                       type: number
 *                     locked_balance:
 *                       type: number
 */
router.post('/', auth, WalletController.createWallet);

/**
 * @swagger
 * /wallets/transfer:
 *   post:
 *     summary: Transfer funds to another user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to_user_id
 *               - currency_symbol
 *               - amount
 *             properties:
 *               to_user_id:
 *                 type: integer
 *               currency_symbol:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transfer completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     transaction_id:
 *                       type: integer
 *                     from_user_id:
 *                       type: integer
 *                     to_user_id:
 *                       type: integer
 *                     amount:
 *                       type: number
 *                     currency_id:
 *                       type: integer
 */
router.post('/transfer', auth, WalletController.transfer);

export default router;
