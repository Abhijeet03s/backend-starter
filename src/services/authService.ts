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
   generateAccessToken(userId: number, email: string): string {
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
   async generateTokens(userId: number, email: string, res: Response): Promise<TokenResponse> {
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

      // Create user with transaction to ensure both user and role are created
      return await this.repository.transaction(async (client: any) => {
         // Create user
         const createUserQuery = `
            INSERT INTO bestinciti_prod.m_users (
               email, 
               password_hash, 
               username, 
               is_active, 
               is_email_verified,
               created_at,
               updated_at
            ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING id, email, username, is_active, is_email_verified
         `;
         
         const userResult = await client.query(createUserQuery, [
            userData.email,
            hashedPassword,
            userData.username,
            userData.is_active,
            userData.is_email_verified
         ]);
         
         const newUser = userResult.rows[0];

         // Find the role
         const findRoleQuery = `
            SELECT * FROM bestinciti_prod.m_roles
            WHERE role_name = $1
         `;
         
         const roleResult = await client.query(findRoleQuery, [userData.role]);
         const role = roleResult.rows[0];

         if (!role) {
            throw new Error(`Role ${userData.role} not found`);
         }

         // Assign role to user
         const assignRoleQuery = `
            INSERT INTO bestinciti_prod.m_user_roles (
               user_id, 
               role_id, 
               created_at, 
               updated_at
            ) VALUES ($1, $2, NOW(), NOW())
         `;
         
         await client.query(assignRoleQuery, [newUser.id, role.id]);

         return newUser;
      });
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

      // Format user data (remove password_hash and format roles)
      const { password_hash, ...userInfo } = user;
      
      // Get role names from the roles array
      const userRoles = user.roles?.map((ur: { role: { role_name: string } }) => ur.role.role_name) || [];
      
      return {
         ...userInfo,
         roles: userRoles.filter(Boolean) // Filter out any undefined values
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
