import User from './User';
import Wallet from './Wallet';
import Currency from './Currency';
import Order from './Order';

User.hasMany(Wallet, { 
    foreignKey: 'user_id', 
    as: 'wallets' 
});

Wallet.belongsTo(User, { 
    foreignKey: 'user_id', 
    as: 'user' 
});

Currency.hasMany(Wallet, { 
    foreignKey: 'currency_id', 
    as: 'wallets' 
});

Wallet.belongsTo(Currency, { 
    foreignKey: 'currency_id', 
    as: 'currency' 
});

Order.belongsTo(Currency, {
  foreignKey: 'currency_id',
  as: 'currency'
});

export { User, Wallet, Currency, Order };