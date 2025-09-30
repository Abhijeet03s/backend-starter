// JWT payload structure
export interface JwtPayload {
   id: string;
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
   id: string;
   email: string;
   username: string;
   is_active: boolean | null;
   is_email_verified: boolean;
   roles: UserRole[];
}

// User data attached to request
export interface UserData {
   id: string;
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