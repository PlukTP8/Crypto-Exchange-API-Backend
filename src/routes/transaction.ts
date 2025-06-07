import express from 'express';
import TransactionController from '../controllers/TransactionController';

const router = express.Router();

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: A list of all transactions
 */
router.get('/', TransactionController.getAllTransactions);

export default router;
