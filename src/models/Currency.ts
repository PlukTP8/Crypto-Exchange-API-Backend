import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { ICurrency } from '../types';

interface CurrencyCreationAttributes extends Optional<ICurrency, 'currency_id' | 'is_active' | 'createdAt' | 'updatedAt'> { }

class Currency extends Model<ICurrency, CurrencyCreationAttributes> implements ICurrency {
    public currency_id!: number;
    public symbol!: string;
    public name!: string;
    public type!: 'crypto' | 'fiat';
    public is_active!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

}

Currency.init({
    currency_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    symbol: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('crypto', 'fiat'),
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
    modelName: 'Currency',
    tableName: 'Currencies',
});

export default Currency;