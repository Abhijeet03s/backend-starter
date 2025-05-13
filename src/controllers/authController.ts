import { Request, Response, RequestHandler } from 'express';
import { z } from 'zod';
import { registerSchema, loginSchema } from '@/schemas/authSchema';
import { AuthService } from '@/services/authService';
import { AUTH_COOKIES } from '@/config/cookies';

// Create an instance of AuthService
const authService = new AuthService();

// Sign up controller
export const signup: RequestHandler = async (req, res) => {
   try {
      const validatedData = registerSchema.parse(req.body);

      // Register the user
      const user = await authService.registerUser({
         email: validatedData.email,
         password: validatedData.password,
         username: validatedData.username,
         role: validatedData.role,
         is_active: validatedData.is_active,
         is_email_verified: validatedData.is_email_verified
      });

      // Generate tokens
      const tokens = await authService.generateTokens(user.id, user.email, res);

      res.status(201).json({
         success: true,
         data: {
            tokens,
            user
         }
      });
   } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof z.ZodError) {
         res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.errors
         });
         return;
      }

      // Check for specific error messages
      if (error instanceof Error && error.message === 'User already exists') {
         res.status(400).json({
            success: false,
            message: error.message
         });
         return;
      }

      res.status(500).json({
         success: false,
         message: 'Registration failed'
      });
   }
};

// Login controller
export const login: RequestHandler = async (req, res) => {
   try {
      const validatedData = loginSchema.parse(req.body);

      // Login the user
      const user = await authService.loginUser(
         validatedData.email,
         validatedData.password
      );

      // Generate tokens
      const tokens = await authService.generateTokens(user.id, user.email, res);

      res.status(200).json({
         success: true,
         data: {
            tokens,
            user
         }
      });
   } catch (error) {
      console.error('Login error:', error);
      if (error instanceof z.ZodError) {
         res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: error.errors
         });
         return;
      }

      // Handle specific error messages
      if (error instanceof Error) {
         if (error.message === 'Invalid credentials') {
            res.status(401).json({
               success: false,
               message: error.message
            });
            return;
         } else if (error.message === 'Account is inactive') {
            res.status(401).json({
               success: false,
               message: error.message
            });
            return;
         }
      }

      res.status(500).json({
         success: false,
         message: 'Login failed'
      });
   }
};

// Refresh token controller
export const refreshToken: RequestHandler = async (req, res) => {
   try {
      // Get refresh token from cookie
      const refreshToken = req.cookies[AUTH_COOKIES.REFRESH_TOKEN.NAME];

      // Refresh the access token
      const user = await authService.refreshAccessToken(refreshToken);

      // Generate new tokens
      const tokens = await authService.generateTokens(user.userId, user.email, res);

      res.status(200).json({
         success: true,
         data: { tokens }
      });
   } catch (error) {
      console.error('Refresh token error:', error);
      
      // Handle specific error cases
      if (error instanceof Error) {
         if (error.message === 'Refresh token missing' || 
             error.message === 'Invalid or expired refresh token') {
            // Clear the invalid cookie
            res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN.NAME, { path: '/api/auth' });
            
            res.status(401).json({
               success: false,
               message: error.message
            });
            return;
         }
      }
      
      res.status(500).json({
         success: false,
         message: 'Token refresh failed'
      });
   }
};

// Revoke refresh token controller
export const revokeToken: RequestHandler = async (req, res) => {
   try {
      // Get refresh token from cookie
      const refreshToken = req.cookies[AUTH_COOKIES.REFRESH_TOKEN.NAME];

      // Revoke the token
      await authService.revokeToken(refreshToken);

      // Clear the cookie
      res.clearCookie(AUTH_COOKIES.REFRESH_TOKEN.NAME, { path: '/api/auth' });

      res.status(200).json({
         success: true,
         message: 'Token revoked successfully'
      });
   } catch (error) {
      console.error('Token revocation error:', error);
      
      // Handle specific error messages
      if (error instanceof Error) {
         if (error.message === 'Refresh token missing') {
            res.status(400).json({
               success: false,
               message: error.message
            });
            return;
         } else if (error.message === 'Token not found or already revoked') {
            res.status(404).json({
               success: false,
               message: error.message
            });
            return;
         }
      }
      
      res.status(500).json({
         success: false,
         message: 'Token revocation failed'
      });
   }
}; 