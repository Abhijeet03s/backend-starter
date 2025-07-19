import { authPaths } from './swagger/auth';

export const swaggerDocument = {
   openapi: '3.0.0',
   info: {
      title: 'Backend Starter API',
      version: '1.0.0',
      description: 'API documentation for Node.js TypeScript backend starter',
   },
   servers: [
      {
         url: 'http://localhost:8080',
         description: 'Development server',
      },
   ],
   components: {
      securitySchemes: {
         bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
         },
      },
      schemas: {
         Error: {
            type: 'object',
            properties: {
               success: {
                  type: 'boolean',
                  example: false
               },
               message: {
                  type: 'string',
                  description: 'Error message'
               },
               errors: {
                  type: 'array',
                  items: {
                     type: 'object'
                  },
                  description: 'Validation errors'
               }
            }
         }
      }
   },
   security: [
      {
         bearerAuth: [],
      },
   ],
   paths: {
      ...authPaths
   }
};

export const swaggerOptions = {
   explorer: true,
}; 