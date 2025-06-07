// middlewares/auth.ts
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  user_id: number;
  email: string;
}

const auth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as JwtPayload;
    const user = await User.findByPk(decoded.user_id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

export default auth;
