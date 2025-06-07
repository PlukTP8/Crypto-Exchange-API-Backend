import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { IUser } from '../types';

interface UserCreationAttributes extends Optional<IUser, 'user_id' | 'is_verified' | 'createdAt' | 'updatedAt'> { }

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public user_id!: number;
  public email!: string;
  public password!: string;
  public full_name!: string;
  public phone?: string;
  public is_verified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  modelName: 'User',
  tableName: 'Users'
});

export default User;