import express from 'express';
import auth from '../middleware/auth';
import UserController from '../controllers/UserController';
import { AuthRequest } from '../types';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints related to user profile
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', auth, (req, res, next) => {
  return UserController.getProfile(req as unknown as AuthRequest, res, next);
});

export default router;
