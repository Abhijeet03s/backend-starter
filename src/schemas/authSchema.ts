import { z } from 'zod';

export const registerSchema = z.object({
   email: z.string().email(),
   password: z.string().min(6),
   username: z.string().min(3),
   role: z.enum(['user', 'business_owner', 'admin']).default('user'),
   is_active: z.boolean().optional().default(true),
   is_email_verified: z.boolean().optional().default(false)
});

export const loginSchema = z.object({
   email: z.string().email(),
   password: z.string()
});

export const refreshTokenSchema = z.object({
   refreshToken: z.string()
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>; 