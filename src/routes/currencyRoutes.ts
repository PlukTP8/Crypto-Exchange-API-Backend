import express from 'express';
import { CurrencyController } from '../controllers/CurrencyController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Currency
 *   description: Currency management
 */

/**
 * @swagger
 * /currencies:
 *   get:
 *     summary: Get all Currency
 *     tags: [Currency]
 *     responses:
 *       200:
 *         description: List of Currency
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
 *                       currency_id:
 *                         type: integer
 *                       symbol:
 *                         type: string
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       is_active:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                       updatedAt:
 *                         type: string
 */

/**
 * @swagger
 * /currencies:
 *   post:
 *     summary: Create a new currency
 *     tags: [Currency]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - name
 *               - type
 *             properties:
 *               symbol:
 *                 type: string
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 example: crypto
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Currency created successfully
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
 *                     currency_id:
 *                       type: integer
 *                     symbol:
 *                       type: string
 *                     name:
 *                       type: string
 *                     type:
 *                       type: string
 *                     is_active:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 */

router.get('/', CurrencyController.getAll);
router.post('/', CurrencyController.create);

export default router;
