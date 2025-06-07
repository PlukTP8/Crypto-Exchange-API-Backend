import { DataTypes, Model, Optional } from 'sequelize';
import {sequelize} from '../config/db';
import { IOrder } from '../types';
import User from './User';
import Currency from './Currency';

interface OrderCreationAttributes extends Optional<IOrder, 'order_id' | 'filled_amount' | 'status' | 'createdAt' | 'updatedAt'> {}

class Order extends Model<IOrder, OrderCreationAttributes> implements IOrder {
  public order_id!: number;
  public user_id!: number;
  public currency_id!: number;
  public order_type!: 'buy' | 'sell';
  public amount!: number;
  public price!: number;
  public filled_amount!: number;
  public status!: 'pending' | 'partial' | 'completed' | 'cancelled';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async getUser(): Promise<User> {
    const User = require('./User').default;
    return await User.findByPk(this.user_id);
  }

  public async getCurrency(): Promise<Currency> {
    const Currency = require('./Currency').default;
    return await Currency.findByPk(this.currency_id);
  }
}

Order.init({
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currency_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_type: {
        type: DataTypes.ENUM('buy', 'sell'),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(20, 8),
        allowNull: false
    },
    filled_amount: {
        type: DataTypes.DECIMAL(20, 8),
        defaultValue: 0.00000000
    },
    status: {
        type: DataTypes.ENUM('pending', 'partial', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    createdAt: '',
    updatedAt: ''
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'Orders'
});

export default Order;