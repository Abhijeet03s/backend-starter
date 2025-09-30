import { db } from '@/config/firestore';

export class AuthRepository {
   /**
    * Find a user by email with roles
    */
   async findUserByEmail(email: string) {
      try {
         const usersSnapshot = await db.collection('users').where('email', '==', email).limit(1).get();

         if (usersSnapshot.empty) {
            return null;
         }

         const userDoc = usersSnapshot.docs[0];
         const data = userDoc.data();
         return {
            id: userDoc.id,
            email: data.email,
            username: data.username,
            password_hash: data.password_hash,
            is_active: data.is_active,
            is_email_verified: data.is_email_verified,
            roles: data.roles || []
         };
      } catch (error) {
         console.error('Error finding user by email:', error);
         throw error;
      }
   }

   /**
    * Find a user by username or email
    */
   async findUserByUsernameOrEmail(username: string, email: string) {
      try {
         // Check by email first
         const emailSnapshot = await db.collection('users').where('email', '==', email).limit(1).get();

         if (!emailSnapshot.empty) {
            const userDoc = emailSnapshot.docs[0];
            return {
               id: userDoc.id,
               ...userDoc.data()
            };
         }

         // Check by username
         const usernameSnapshot = await db.collection('users').where('username', '==', username).limit(1).get();

         if (!usernameSnapshot.empty) {
            const userDoc = usernameSnapshot.docs[0];
            return {
               id: userDoc.id,
               ...userDoc.data()
            };
         }

         return null;
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
      roles: string[];
   }) {
      try {
         const userRef = db.collection('users').doc();
         const userData = {
            ...data,
            created_at: new Date(),
            updated_at: new Date()
         };

         await userRef.set(userData);

         return {
            id: userRef.id,
            email: data.email,
            username: data.username,
            is_active: data.is_active,
            is_email_verified: data.is_email_verified,
            roles: data.roles
         };
      } catch (error) {
         console.error('Error creating user:', error);
         throw error;
      }
   }

   /**
    * Create a refresh token
    */
   async createRefreshToken(data: {
      user_id: string;
      refresh_token: string;
      expires_at: Date;
      is_revoked: boolean;
   }) {
      try {
         const tokenRef = db.collection('refresh_tokens').doc();
         const tokenData = {
            ...data,
            created_at: new Date(),
            updated_at: new Date()
         };

         await tokenRef.set(tokenData);

         return {
            id: tokenRef.id,
            ...tokenData
         };
      } catch (error) {
         console.error('Error creating refresh token:', error);
         throw error;
      }
   }

   /**
    * Find a refresh token
    */
   async findRefreshToken(token: string) {
      try {
         const now = new Date();
         const tokensSnapshot = await db.collection('refresh_tokens')
            .where('refresh_token', '==', token)
            .where('is_revoked', '==', false)
            .limit(1)
            .get();

         if (tokensSnapshot.empty) {
            return null;
         }

         const tokenDoc = tokensSnapshot.docs[0];
         const tokenData = tokenDoc.data();

         // Check expiration
         if (tokenData.expires_at.toDate() <= now) {
            return null;
         }

         // Get user data
         const userDoc = await db.collection('users').doc(tokenData.user_id).get();

         if (!userDoc.exists) {
            return null;
         }

         return {
            id: tokenDoc.id,
            refresh_token: tokenData.refresh_token,
            expires_at: tokenData.expires_at.toDate(),
            is_revoked: tokenData.is_revoked,
            user: {
               id: userDoc.id,
               email: userDoc.data()?.email,
               roles: userDoc.data()?.roles || []
            }
         };
      } catch (error) {
         console.error('Error finding refresh token:', error);
         throw error;
      }
   }

   /**
    * Revoke a refresh token by ID
    */
   async revokeRefreshToken(id: string) {
      try {
         await db.collection('refresh_tokens').doc(id).update({
            is_revoked: true,
            updated_at: new Date()
         });

         const tokenDoc = await db.collection('refresh_tokens').doc(id).get();
         return tokenDoc.exists ? { id: tokenDoc.id, ...tokenDoc.data() } : null;
      } catch (error) {
         console.error('Error revoking refresh token:', error);
         throw error;
      }
   }

   /**
    * Revoke refresh token by token value
    */
   async revokeRefreshTokenByValue(token: string) {
      try {
         const tokensSnapshot = await db.collection('refresh_tokens')
            .where('refresh_token', '==', token)
            .where('is_revoked', '==', false)
            .get();

         let count = 0;
         const batch = db.batch();

         tokensSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, {
               is_revoked: true,
               updated_at: new Date()
            });
            count++;
         });

         if (count > 0) {
            await batch.commit();
         }

         return { count };
      } catch (error) {
         console.error('Error revoking refresh token by value:', error);
         throw error;
      }
   }

   /**
    * Execute a transaction (Firestore version)
    */
   async transaction<T>(callback: (transaction: FirebaseFirestore.Transaction) => Promise<T>): Promise<T> {
      return db.runTransaction(callback);
   }
}
