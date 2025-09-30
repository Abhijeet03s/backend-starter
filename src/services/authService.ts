import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Response } from 'express';
import { TokenResponse } from '@/types/auth';
import { AUTH_COOKIES } from '@/config/cookies';
import { AuthRepository } from '@/repositories/authRepository';

// Define interfaces to match the actual data structure

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }
  
   /**
    * Generate JWT access token
    */
   generateAccessToken(userId: string, email: string): string {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET not configured');

      return jwt.sign(
         { id: userId, email },
         secret,
         { expiresIn: '1h' }
      );
   }

   /**
    * Generate refresh token
    */
   generateRefreshToken(): string {
      return crypto.randomBytes(40).toString('hex');
   }

   /**
    * Generate and store tokens
    */
   async generateTokens(userId: string, email: string, res: Response): Promise<TokenResponse> {
      const accessToken = this.generateAccessToken(userId, email);
      const refreshToken = this.generateRefreshToken();

      // Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Store refresh token in database
      await this.repository.createRefreshToken({
         user_id: userId,
         refresh_token: refreshToken,
         expires_at: expiresAt,
         is_revoked: false
      });

      // Set refresh token as HttpOnly cookie
      res.cookie(
         AUTH_COOKIES.REFRESH_TOKEN.NAME,
         refreshToken,
         AUTH_COOKIES.REFRESH_TOKEN.CONFIG
      );

      return {
         accessToken,
         expiresIn: 3600
      };
   }

   /**
    * Register a new user
    */
   async registerUser(userData: {
      email: string;
      password: string;
      username: string;
      role: string;
      is_active: boolean;
      is_email_verified: boolean;
   }) {
      // Check if user exists
      const existingUser = await this.repository.findUserByUsernameOrEmail(
         userData.username,
         userData.email
      );

      if (existingUser) {
         throw new Error('User already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user with role
      const newUser = await this.repository.createUser({
         email: userData.email,
         password_hash: hashedPassword,
         username: userData.username,
         is_active: userData.is_active,
         is_email_verified: userData.is_email_verified,
         roles: [userData.role]
      });

      return newUser;
   }

   /**
    * Login a user
    */
   async loginUser(email: string, password: string) {
      // Find user with roles using direct db query
      const user = await this.repository.findUserByEmail(email);

      if (!user) {
         throw new Error('Invalid credentials');
      }

      // Check if user is active
      if (!user.is_active) {
         throw new Error('Account is inactive');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
         throw new Error('Invalid credentials');
      }

      // Format user data (remove password_hash)
      const { password_hash, ...userInfo } = user;

      return {
         ...userInfo,
         roles: user.roles || []
      };
   }

   /**
    * Refresh access token using refresh token
    */
   async refreshAccessToken(refreshToken: string) {
      if (!refreshToken) {
         throw new Error('Refresh token missing');
      }

      // Find the refresh token in the database using direct query
      const tokenRecord = await this.repository.findRefreshToken(refreshToken);

      if (!tokenRecord) {
         throw new Error('Invalid or expired refresh token');
      }

      const user = tokenRecord.user;
      if (!user) {
         throw new Error('User not found');
      }

      // Revoke the current refresh token
      await this.repository.revokeRefreshToken(tokenRecord.id);

      return {
         userId: user.id,
         email: user.email
      };
   }

   /**
    * Revoke a refresh token
    */
   async revokeToken(refreshToken: string) {
      if (!refreshToken) {
         throw new Error('Refresh token missing');
      }

      // Find and revoke the token using direct query
      const result = await this.repository.revokeRefreshTokenByValue(refreshToken);

      if (result.count === 0) {
         throw new Error('Token not found or already revoked');
      }

      return result;
   }
}

// Export a singleton instance
export const authService = new AuthService();
