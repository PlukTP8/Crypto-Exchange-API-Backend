import { Request, Response } from 'express';
import  Transaction  from '../models/Transaction';

export default class TransactionController {
  public static async getAllTransactions(req: Request, res: Response): Promise<void> {
    try {
      const transactions = await Transaction.findAll({
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        message: 'All transactions fetched successfully',
        data: transactions
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
