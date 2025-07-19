import express, { Router } from 'express';
import authRoutes from './authRoutes';

const router: Router = express.Router();

// Auth routes (public)
router.use('/auth', authRoutes);

export default router; 