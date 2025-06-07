import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { IWallet } from '../types';

interface WalletCreationAttributes extends Optional<IWallet, 'wallet_id' | 'balance' | 'locked_balance' | 'createdAt' | 'updatedAt'> { }

class Wallet extends Model<IWallet, WalletCreationAttributes> implements IWallet {
  public wallet_id!: number;
  public user_id!: number;
  public currency_id!: number;
  public balance!: number;
  public locked_balance!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Wallet.init({
  wallet_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  currency_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Currencies',
      key: 'currency_id'
    }
  },
  balance: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
    defaultValue: 0.00000000
  },
  locked_balance: {
    type: DataTypes.DECIMAL(20, 8),
    allowNull: false,
    defaultValue: 0.00000000
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Wallet',
  tableName: 'Wallets'
});

export default Wallet;