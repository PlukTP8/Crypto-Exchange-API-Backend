import { Request, Response } from 'express';
import Currency from '../models/Currency';

export class CurrencyController {
    public static async getAll(req: Request, res: Response) {
        try {
            const currencies = await Currency.findAll();

            return res.json({
                success: true,
                message: 'Currencies fetched successfully',
                data: currencies
            });
        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }
    public static async create(req: Request, res: Response) {
        try {
            const { symbol, name, type, is_active } = req.body;

            const existing = await Currency.findOne({ where: { symbol } });
            if (existing) {
                return res.status(400).json({ success: false, message: 'Currency already exists' });
            }

            const currency = await Currency.create({
                symbol,
                name,
                type,
                is_active
            });

            return res.status(201).json({
                success: true,
                message: 'Currency created successfully',
                data: currency
            });
        } catch (err: any) {
            return res.status(500).json({ success: false, message: err.message });
        }
    }
}
