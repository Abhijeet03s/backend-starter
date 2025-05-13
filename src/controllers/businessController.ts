import { Request, Response, RequestHandler } from 'express';
import { z } from 'zod';
import { BusinessCreateInput } from '@/types/business';
import { BusinessService } from '@/services/businessService';
import { UserData } from '@/types/auth';
import { businessCreateSchema, businessUpdateSchema, businessSearchSchema } from '@/schemas/businessSchema';
import { BusinessRepository } from '@/repositories/businessRepository';

// Custom type for authenticated request
interface RequestWithUser extends Request {
   user?: UserData;
}

const businessRepository = new BusinessRepository();
const businessService = new BusinessService(businessRepository);

// Create a new business with all related information
export const createBusiness: RequestHandler = async (req, res) => {
   try {
      // Type assertion to access user property
      const authReq = req as RequestWithUser;
      const userId = authReq.user?.id;

      if (!userId || !authReq.user) {
         res.status(401).json({
            success: false,
            message: 'Authentication required'
         });
         return;
      }

      // Check if user has appropriate role
      if (!authReq.user.roles.includes('business_owner') && !authReq.user.roles.includes('admin')) {
         res.status(403).json({
            success: false,
            message: 'Business owner or admin privileges required'
         });
         return;
      }

      // Validate request body
      const validatedData = businessCreateSchema.parse(req.body) as BusinessCreateInput;

      // Create business using service
      const result = await businessService.createBusiness(validatedData, userId);

      res.status(201).json({
         success: true,
         data: result
      });
   } catch (error) {
      console.error('Error creating business:', error);
      if (error instanceof z.ZodError) {
         res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.errors
         });
         return;
      }

      // Check for duplicate business error
      if (error instanceof Error && error.message.includes('business with the same name at this location already exists')) {
         res.status(409).json({
            success: false,
            message: error.message
         });
         return;
      }

      res.status(500).json({
         success: false,
         message: 'Failed to create business'
      });
   }
};

// Get all businesses with pagination
export const getAllBusinesses: RequestHandler = async (req, res) => {
   try {
      const queryParams = businessSearchSchema.parse(req.query);
      const { page, limit, ...filters } = queryParams;

      const result = await businessService.getAllBusinesses(page, limit, filters);

      res.status(200).json({
         success: true,
         data: result.businesses,
         pagination: result.pagination
      });
   } catch (error) {
      console.error('Error fetching businesses:', error);
      if (error instanceof z.ZodError) {
         res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.errors
         });
         return;
      }
      res.status(500).json({
         success: false,
         message: 'Failed to fetch businesses'
      });
   }
};

// Get a single business by ID
export const getBusinessById: RequestHandler = async (req, res) => {
   try {
      const { id } = req.params;
      const businessId = parseInt(id);

      if (isNaN(businessId)) {
         res.status(400).json({
            success: false,
            message: 'Invalid business ID'
         });
         return;
      }

      const business = await businessService.getBusinessById(businessId);

      if (!business) {
         res.status(404).json({
            success: false,
            message: 'Business not found'
         });
         return;
      }

      res.status(200).json({
         success: true,
         data: business
      });
   } catch (error) {
      console.error('Error fetching business:', error);
      res.status(500).json({
         success: false,
         message: 'Failed to fetch business'
      });
   }
};

// Update a business
export const updateBusiness: RequestHandler = async (req, res) => {
   try {
      const { id } = req.params;
      const businessId = parseInt(id);

      if (isNaN(businessId)) {
         res.status(400).json({
            success: false,
            message: 'Invalid business ID'
         });
         return;
      }

      // Type assertion to access user property
      const authReq = req as RequestWithUser;
      const userId = authReq.user?.id;

      if (!userId || !authReq.user) {
         res.status(401).json({
            success: false,
            message: 'Authentication required'
         });
         return;
      }

      // Check if business exists
      const businessExists = await businessService.businessExists(businessId);
      if (!businessExists) {
         res.status(404).json({
            success: false,
            message: 'Business not found'
         });
         return;
      }

      // Check if user is owner of this business (skip for admins)
      if (!authReq.user.roles.includes('admin')) {
         const isOwner = await businessService.isBusinessOwner(businessId, userId);
         if (!isOwner) {
            res.status(403).json({
               success: false,
               message: 'You do not have permission to update this business'
            });
            return;
         }
      }

      // Validate request body
      const validatedData = businessUpdateSchema.parse(req.body);

      // Update business
      const updatedBusiness = await businessService.updateBusiness(businessId, validatedData, userId);

      res.status(200).json({
         success: true,
         data: updatedBusiness
      });
   } catch (error) {
      console.error('Error updating business:', error);
      if (error instanceof z.ZodError) {
         res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.errors
         });
         return;
      }
      res.status(500).json({
         success: false,
         message: 'Failed to update business'
      });
   }
};

// Delete a business
export const deleteBusiness: RequestHandler = async (req, res) => {
   try {
      const { id } = req.params;
      const businessId = parseInt(id);

      if (isNaN(businessId)) {
         res.status(400).json({
            success: false,
            message: 'Invalid business ID'
         });
         return;
      }

      // Type assertion to access user property
      const authReq = req as RequestWithUser;
      const userId = authReq.user?.id;

      if (!userId || !authReq.user) {
         res.status(401).json({
            success: false,
            message: 'Authentication required'
         });
         return;
      }

      // Check if business exists
      const businessExists = await businessService.businessExists(businessId);
      if (!businessExists) {
         res.status(404).json({
            success: false,
            message: 'Business not found'
         });
         return;
      }

      // Check if user is owner of this business (skip for admins)
      if (!authReq.user.roles.includes('admin')) {
         const isOwner = await businessService.isBusinessOwner(businessId, userId);
         if (!isOwner) {
            res.status(403).json({
               success: false,
               message: 'You do not have permission to delete this business'
            });
            return;
         }
      }

      // Delete business
      await businessService.deleteBusiness(businessId);

      res.status(200).json({
         success: true,
         message: 'Business deleted successfully'
      });
   } catch (error) {
      console.error('Error deleting business:', error);
      res.status(500).json({
         success: false,
         message: 'Failed to delete business'
      });
   }
}; 