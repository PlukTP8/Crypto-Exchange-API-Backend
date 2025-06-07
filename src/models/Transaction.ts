import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../config/db';
import { ITransaction } from '../types';
import User from './User';
import Currency from './Currency';

interface TransactionCreationAttributes extends Optional<ITransaction, 'transaction_id' | 'status' | 'createdAt' | 'updatedAt'> {}

class Transaction extends Model<ITransaction, TransactionCreationAttributes> implements ITransaction {
  public transaction_id!: number;
  public from_user_id?: number;
  public to_user_id?: number;
  public currency_id!: number;
  public amount!: number;
  public transaction_type!: 'deposit' | 'withdrawal' | 'transfer' | 'trade';
  public external_address?: string;
  public status!: 'pending' | 'completed' | 'failed';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async getFromUser(): Promise<User | null> {
    if (!this.from_user_id) return null;
    const User = require('./User').default;
    return await User.findByPk(this.from_user_id);
  }

  public async getToUser(): Promise<User | null> {
    if (!this.to_user_id) return null;
    const User = require('./User').default;
    return await User.findByPk(this.to_user_id);
  }

  public async getCurrency(): Promise<Currency> {
    const Currency = require('./Currency').default;
    return await Currency.findByPk(this.currency_id);
  }
}

Transaction.init({
    transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    from_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    to_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    currency_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false
    },
    transaction_type: {
        type: DataTypes.ENUM('deposit', 'withdrawal', 'transfer', 'trade'),
        allowNull: false
    },
    external_address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
    },
    createdAt: '',
    updatedAt: ''
}, {
  sequelize,
  modelName: 'Transaction',
  tableName: 'Transactions'
});

export default Transaction;