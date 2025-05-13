import express, { Router } from 'express';
import {
   createBusiness,
   getAllBusinesses,
   getBusinessById,
   updateBusiness,
   deleteBusiness
} from '@/controllers/businessController';
import { isAuth, hasBusinessOwnerRole, isOwnerOfSpecificBusiness } from '@/middlewares/authMiddleware';

const router: Router = express.Router();

// Public routes - accessible to all users
router.get('/', getAllBusinesses);
router.get('/:id', getBusinessById);

// Protected routes - require business owner or admin role
router.post('/', isAuth, hasBusinessOwnerRole, createBusiness);
router.put('/:id', isAuth, isOwnerOfSpecificBusiness, updateBusiness);
router.delete('/:id', isAuth, isOwnerOfSpecificBusiness, deleteBusiness);

export default router; 