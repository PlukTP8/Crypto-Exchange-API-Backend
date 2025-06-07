import './express';

export interface IUser {
  user_id: number;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICurrency {
  currency_id: number;
  symbol: string;
  name: string;
  type: 'crypto' | 'fiat';
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWallet {
  wallet_id: number;
  user_id: number;
  currency_id: number;
  balance: number;
  locked_balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  order_id: number;
  user_id: number;
  currency_id: number;
  order_type: 'buy' | 'sell';
  amount: number;
  price: number;
  filled_amount: number;
  status: 'pending' | 'partial' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction {
  transaction_id: number;
  from_user_id?: number;
  to_user_id?: number;
  currency_id: number;
  amount: number;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'trade';
  external_address?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}