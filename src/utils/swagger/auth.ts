/**
 * @swagger
 * components:
 *   schemas:
 *     UserBase:
 *       type: object
 *       required:
 *         - email
 *         - username
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         username:
 *           type: string
 *           description: Username
 *         is_active:
 *           type: boolean
 *           description: Whether the user account is active
 *           default: true
 *         is_email_verified:
 *           type: boolean
 *           description: Whether the email is verified
 *           default: false
 *     
 *     UserCreate:
 *       allOf:
 *         - $ref: '#/components/schemas/UserBase'
 *         - type: object
 *           required:
 *             - password
 *           properties:
 *             password:
 *               type: string
 *               format: password
 *               minLength: 6
 *               description: User password
 *             role:
 *               type: string
 *               enum: [user, business_owner, admin]
 *               description: User role
 *               default: user
 *     
 *     UserResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/UserBase'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: User ID
 *             roles:
 *               type: array
 *               items:
 *                 type: string
 *               description: User's assigned roles
 *     
 *     TokenResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token
 *         expiresIn:
 *           type: integer
 *           description: Token expiration time in seconds
 *     
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             tokens:
 *               $ref: '#/components/schemas/TokenResponse'
 *             user:
 *               $ref: '#/components/schemas/UserResponse'
 *     
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email address
 *         password:
 *           type: string
 *           format: password
 *           description: User password
 *     
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: Error message
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *           description: Validation errors
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

// Auth API Swagger documentation
export const authPaths = {
   '/api/auth/signup': {
      /**
       * @swagger
       * /api/auth/signup:
       *   post:
       *     summary: Register a new user
       *     tags: [Authentication]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/UserCreate'
       *     responses:
       *       201:
       *         description: User registered successfully
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/AuthResponse'
       *       400:
       *         description: Invalid input or user already exists
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Error'
       *       500:
       *         description: Server error
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Error'
       */
      post: {
         tags: ['Auth'],
         summary: 'Register a new user',
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['username', 'email', 'password'],
                     properties: {
                        username: {
                           type: 'string',
                           description: 'User\'s username'
                        },
                        email: {
                           type: 'string',
                           format: 'email',
                           description: 'User\'s email address'
                        },
                        password: {
                           type: 'string',
                           format: 'password',
                           description: 'User\'s password'
                        },
                        role: {
                           type: 'string',
                           enum: ['user', 'business_owner', 'admin'],
                           default: 'user',
                           description: 'User\'s role in the system'
                        },
                        is_active: {
                           type: 'boolean',
                           default: true,
                           description: 'Whether the user is active'
                        },
                        is_email_verified: {
                           type: 'boolean',
                           default: false,
                           description: 'Whether the user\'s email is verified'
                        }
                     }
                  }
               }
            }
         },
         responses: {
            '201': {
               description: 'User registered successfully',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: {
                              type: 'boolean',
                              example: true
                           },
                           message: {
                              type: 'string',
                              example: 'User registered successfully'
                           }
                        }
                     }
                  }
               }
            },
            '400': {
               description: 'Validation error',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: {
                              type: 'boolean',
                              example: false
                           },
                           message: {
                              type: 'string'
                           }
                        }
                     }
                  }
               }
            }
         }
      }
   },

   '/api/auth/login': {
      /**
       * @swagger
       * /api/auth/login:
       *   post:
       *     summary: Login a user
       *     tags: [Authentication]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             $ref: '#/components/schemas/LoginRequest'
       *     responses:
       *       200:
       *         description: Login successful
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/AuthResponse'
       *       400:
       *         description: Invalid input
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Error'
       *       401:
       *         description: Invalid credentials or account inactive
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Error'
       *       500:
       *         description: Server error
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Error'
       */
      post: {
         tags: ['Auth'],
         summary: 'Login user',
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['email', 'password'],
                     properties: {
                        email: {
                           type: 'string',
                           format: 'email',
                           description: 'User\'s email address'
                        },
                        password: {
                           type: 'string',
                           format: 'password',
                           description: 'User\'s password'
                        }
                     }
                  }
               }
            }
         },
         responses: {
            '200': {
               description: 'Login successful',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: {
                              type: 'boolean',
                              example: true
                           },
                           token: {
                              type: 'string',
                              description: 'JWT token'
                           }
                        }
                     }
                  }
               }
            },
            '401': {
               description: 'Invalid credentials',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: {
                              type: 'boolean',
                              example: false
                           },
                           message: {
                              type: 'string',
                              example: 'Invalid credentials'
                           }
                        }
                     }
                  }
               }
            }
         }
      }
   },

   '/api/auth/refresh-token': {
      /**
       * @swagger
       * /api/auth/refresh-token:
       *   post:
       *     summary: Refresh access token
       *     description: Get a new access token using the refresh token cookie
       *     tags: [Authentication]
       *     responses:
       *       200:
       *         description: Token refreshed successfully
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 success:
       *                   type: boolean
       *                   example: true
       *                 data:
       *                   type: object
       *                   properties:
       *                     tokens:
       *                       $ref: '#/components/schemas/TokenResponse'
       *       401:
       *         description: Invalid, expired, or missing refresh token
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Error'
       *       500:
       *         description: Server error
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Error'
       */
      post: {
         tags: ['Auth'],
         summary: 'Refresh access token',
         description: 'Get a new access token using the refresh token cookie',
         responses: {
            '200': {
               description: 'Token refreshed successfully',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: {
                              type: 'boolean',
                              example: true
                           },
                           data: {
                              type: 'object',
                              properties: {
                                 token: {
                                    type: 'string',
                                    description: 'New JWT token'
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            },
            '401': {
               description: 'Invalid or expired refresh token',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            }
         }
      }
   },

   '/api/auth/revoke-token': {
      /**
       * @swagger
       * /api/auth/revoke-token:
       *   post:
       *     summary: Revoke refresh token
       *     description: Invalidate the refresh token stored in the cookie
       *     tags: [Authentication]
       *     security:
       *       - bearerAuth: []
       *     responses:
       *       200:
       *         description: Token revoked successfully
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 success:
       *                   type: boolean
       *                   example: true
       *                 message:
       *                   type: string
       *                   example: Token revoked successfully
       *       401:
       *         description: Authentication required
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Error'
       *       404:
       *         description: Token not found or already revoked
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Error'
       *       500:
       *         description: Server error
       *         content:
       *           application/json:
       *             schema:
       *               $ref: '#/components/schemas/Error'
       */
      post: {
         tags: ['Auth'],
         summary: 'Revoke refresh token',
         description: 'Invalidate the current refresh token',
         security: [{ bearerAuth: [] }],
         responses: {
            '200': {
               description: 'Token revoked successfully',
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           success: {
                              type: 'boolean',
                              example: true
                           },
                           message: {
                              type: 'string',
                              example: 'Token revoked successfully'
                           }
                        }
                     }
                  }
               }
            },
            '401': {
               description: 'Unauthorized',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            }
         }
      }
   }
};

export { }; 