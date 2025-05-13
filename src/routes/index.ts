import express, { Router } from 'express';
import businessRoutes from './businessRoutes';
import authRoutes from './authRoutes';

const router: Router = express.Router();

// Auth routes (public)
router.use('/auth', authRoutes);

// Business routes 
router.use('/businesses', businessRoutes);


export default router; 