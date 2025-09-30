import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, UserData } from '@/types/auth';
import { db } from '@/config/firestore';

// Custom interface for Request with user property
interface RequestWithUser extends Request {
   user?: UserData;
}

/**
 * Middleware to verify if user is authenticated
 */
export const isAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.status(401).json({
            success: false,
            message: 'Authentication required'
         });
         return;
      }

      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET;

      if (!secret) {
         throw new Error('JWT_SECRET not configured');
      }

      // Verify token
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Get user from Firestore
      const userDoc = await db.collection('users').doc(decoded.id).get();

      if (!userDoc.exists) {
         res.status(401).json({
            success: false,
            message: 'User not found'
         });
         return;
      }

      const userData = userDoc.data() as any;

      if (!userData.is_active) {
         res.status(401).json({
            success: false,
            message: 'Account is inactive'
         });
         return;
      }

      // Attach user to request
      const authReq = req as RequestWithUser;
      authReq.user = {
         id: decoded.id,
         email: userData.email,
         username: userData.username,
         is_active: userData.is_active || false,
         is_email_verified: userData.is_email_verified,
         roles: userData.roles || []
      };

      next();
   } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
         res.status(401).json({
            success: false,
            message: 'Token expired',
            expired: true
         });
         return;
      }
      res.status(401).json({
         success: false,
         message: 'Authentication failed'
      });
   }
};

/**
 * Middleware to verify if user is an admin
 */
export const isAdmin: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
   try {
      const authReq = req as RequestWithUser;
      if (!authReq.user) {
         res.status(401).json({
            success: false,
            message: 'Authentication required'
         });
         return;
      }

      if (!authReq.user.roles.includes('admin')) {
         res.status(403).json({
            success: false,
            message: 'Admin privileges required'
         });
         return;
      }

      next();
   } catch (error) {
      console.error('Authorization error:', error);
      res.status(403).json({
         success: false,
         message: 'Authorization failed'
      });
   }
}; 