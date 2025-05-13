import { pool, executeTransaction } from '@/config/database';

export class AuthRepository {
   /**
    * Find a user by email with roles
    */
   async findUserByEmail(email: string) {
      const query = `
         SELECT 
            u.id, 
            u.email, 
            u.username, 
            u.password_hash, 
            u.is_active, 
            u.is_email_verified,
            COALESCE(json_agg(
              json_build_object(
                'role', json_build_object('role_name', r.role_name)
              )
            ) FILTER (WHERE r.role_name IS NOT NULL), '[]') as roles
         FROM bestinciti_prod.m_users u
         LEFT JOIN bestinciti_prod.m_user_roles ur ON u.id = ur.user_id
         LEFT JOIN bestinciti_prod.m_roles r ON ur.role_id = r.id
         WHERE u.email = $1
         GROUP BY u.id, u.email, u.username, u.password_hash, u.is_active, u.is_email_verified
      `;

      try {
         const result = await pool.query(query, [email]);
         return result.rows[0] || null;
      } catch (error) {
         console.error('Error finding user by email:', error);
         throw error;
      }
   }

   /**
    * Find a user by username or email
    */
   async findUserByUsernameOrEmail(username: string, email: string) {
      const query = `
         SELECT
            id,
            email,
            username,
            password_hash,
            is_active,
            is_email_verified,
            created_at,
            updated_at
         FROM bestinciti_prod.m_users
         WHERE email = $1 OR username = $2
         LIMIT 1
      `;

      try {
         const result = await pool.query(query, [email, username]);
         return result.rows[0] || null;
      } catch (error) {
         console.error('Error finding user by username or email:', error);
         throw error;
      }
   }

   /**
    * Create a new user
    */
   async createUser(data: {
      email: string;
      password_hash: string;
      username: string;
      is_active: boolean;
      is_email_verified: boolean;
   }) {
      const query = `
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

      try {
         const result = await pool.query(query, [
            data.email,
            data.password_hash,
            data.username,
            data.is_active,
            data.is_email_verified
         ]);
         return result.rows[0];
      } catch (error) {
         console.error('Error creating user:', error);
         throw error;
      }
   }

   /**
    * Find a role by name
    */
   async findRoleByName(roleName: string) {
      const query = `
         SELECT * FROM bestinciti_prod.m_roles
         WHERE role_name = $1
      `;

      try {
         const result = await pool.query(query, [roleName]);
         return result.rows[0] || null;
      } catch (error) {
         console.error('Error finding role by name:', error);
         throw error;
      }
   }

   /**
    * Assign a role to a user
    */
   async assignRoleToUser(userId: number, roleId: number) {
      const query = `
         INSERT INTO bestinciti_prod.m_user_roles (
            user_id,
            role_id,
            created_at,
            updated_at
         ) VALUES ($1, $2, NOW(), NOW())
         RETURNING user_id, role_id
      `;

      try {
         const result = await pool.query(query, [userId, roleId]);
         return result.rows[0];
      } catch (error) {
         console.error('Error assigning role to user:', error);
         throw error;
      }
   }

   /**
    * Create a refresh token
    */
   async createRefreshToken(data: {
      user_id: number;
      refresh_token: string;
      expires_at: Date;
      is_revoked: boolean;
   }) {
      const query = `
         INSERT INTO bestinciti_prod.m_refresh_tokens (
            user_id,
            refresh_token,
            expires_at,
            is_revoked,
            created_at,
            updated_at
         ) VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING id, user_id, refresh_token, expires_at, is_revoked
      `;

      try {
         const result = await pool.query(query, [
            data.user_id,
            data.refresh_token,
            data.expires_at,
            data.is_revoked
         ]);
         return result.rows[0];
      } catch (error) {
         console.error('Error creating refresh token:', error);
         throw error;
      }
   }

   /**
    * Find a refresh token
    */
   async findRefreshToken(token: string) {
      const query = `
         SELECT 
            rt.id, 
            rt.refresh_token, 
            rt.expires_at, 
            rt.is_revoked,
            json_build_object(
               'id', u.id,
               'email', u.email,
               'roles', COALESCE((
                  SELECT json_agg(
                     json_build_object(
                        'role', json_build_object('role_name', r.role_name)
                     )
                  )
                  FROM bestinciti_prod.m_user_roles ur
                  JOIN bestinciti_prod.m_roles r ON ur.role_id = r.id
                  WHERE ur.user_id = u.id
               ), '[]')
            ) as "user"
         FROM bestinciti_prod.m_refresh_tokens rt
         JOIN bestinciti_prod.m_users u ON rt.user_id = u.id
         WHERE rt.refresh_token = $1
         AND rt.expires_at > NOW()
         AND (rt.is_revoked IS NULL OR rt.is_revoked = false)
      `;

      try {
         const result = await pool.query(query, [token]);
         return result.rows[0] || null;
      } catch (error) {
         console.error('Error finding refresh token:', error);
         throw error;
      }
   }

   /**
    * Revoke a refresh token
    */
   async revokeRefreshToken(id: number) {
      const query = `
         UPDATE bestinciti_prod.m_refresh_tokens
         SET is_revoked = true, updated_at = NOW()
         WHERE id = $1
         RETURNING *
      `;

      try {
         const result = await pool.query(query, [id]);
         return result.rows[0] || null;
      } catch (error) {
         console.error('Error revoking refresh token:', error);
         throw error;
      }
   }

   /**
    * Revoke refresh token by token value
    */
   async revokeRefreshTokenByValue(token: string) {
      const query = `
         UPDATE bestinciti_prod.m_refresh_tokens
         SET is_revoked = true, updated_at = NOW()
         WHERE refresh_token = $1
         AND (is_revoked IS NULL OR is_revoked = false)
      `;

      try {
         const result = await pool.query(query, [token]);
         return { count: result.rowCount };
      } catch (error) {
         console.error('Error revoking refresh token by value:', error);
         throw error;
      }
   }

   /**
    * Execute a transaction
    */
   async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
      return executeTransaction(callback);
   }
}
