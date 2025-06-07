
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import walletRoutes from './routes/wallets';
import orderRoutes from './routes/orders';
import currencyRoutes from './routes/currencyRoutes';
import transactionRoutes from './routes/transaction';
import './models';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    message: 'Welcome to the Cryptocurrency Exchange API!' 
  });
})
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/wallets', walletRoutes);
app.use('/orders', orderRoutes);
app.use('/currencies', currencyRoutes);
app.use('/transactions', transactionRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

sequelize.authenticate()
  .then(() => {
    console.log('Connected to the database successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export default app;

