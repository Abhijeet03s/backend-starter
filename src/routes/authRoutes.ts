import express, { Router } from 'express';
import { signup, login, refreshToken, revokeToken } from '@/controllers/authController';
import { isAuth } from '@/middlewares/authMiddleware';

const router: Router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', isAuth, revokeToken);

export default router; 