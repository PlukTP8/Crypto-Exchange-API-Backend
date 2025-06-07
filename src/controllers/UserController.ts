import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Wallet, Currency } from '../models';
import { AuthRequest, ApiResponse } from '../types';

interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

class UserController {
  public async register(req: Request<{}, ApiResponse, RegisterRequest>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { email, password, full_name, phone } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        email,
        password: hashedPassword,
        full_name,
        phone
      });

      const currencies = await Currency.findAll({ where: { is_active: true } });
      for (const currency of currencies) {
        await Wallet.create({
          user_id: user.user_id,
          currency_id: currency.currency_id,
          balance: 0,
          locked_balance: 0
        });
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user_id: user.user_id,
          email: user.email,
          full_name: user.full_name
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  public async login(req: Request<{}, ApiResponse, LoginRequest>, res: Response<ApiResponse>): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      const token = jwt.sign(
        { user_id: user.user_id, email: user.email },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            user_id: user.user_id,
            email: user.email,
            full_name: user.full_name
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  public async getProfile(
    req: AuthRequest,
    res: Response<ApiResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await User.findByPk(req.user!.user_id, {
        include: [
          {
            model: Wallet,
            as: 'wallets',
            include: [
              {
                model: Currency,
                as: 'currency'
              }
            ]
          },
        ],
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error: any) {
      console.error('Error in getProfile:', error);
      next(error);
    }
  }
}

export default new UserController();