// JWT payload structure
export interface JwtPayload {
   id: number;
   email: string;
}

// User role structure
export interface UserRole {
   role: {
      role_name: string;
   };
}

// User with roles structure used in authentication
export interface UserWithRoles {
   id: number;
   email: string;
   username: string;
   is_active: boolean | null;
   is_email_verified: boolean;
   roles: UserRole[];
}

// User data attached to request
export interface UserData {
   id: number;
   email: string;
   username: string;
   is_active: boolean;
   is_email_verified: boolean;
   roles: string[];
}

// Token response structure
export interface TokenResponse {
   accessToken: string;
   expiresIn: number;
}

// Refresh token request
export interface RefreshTokenRequest {
   refreshToken: string;
} 