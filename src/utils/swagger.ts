import { businessPaths } from './swagger/business';
import { authPaths } from './swagger/auth';

export const swaggerDocument = {
   openapi: '3.0.0',
   info: {
      title: 'BestInCiti API',
      version: '1.0.0',
      description: 'API documentation for BestInCiti backend',
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
         },
         Location: {
            type: 'object',
            properties: {
               id: {
                  type: 'integer'
               },
               address_line1: {
                  type: 'string'
               },
               address_line2: {
                  type: 'string'
               },
               area_locality: {
                  type: 'string'
               },
               city_id: {
                  type: 'integer'
               },
               pincode: {
                  type: 'string'
               },
               latitude: {
                  type: 'number'
               },
               longitude: {
                  type: 'number'
               },
               is_primary: {
                  type: 'boolean'
               }
            }
         },
         OperatingHours: {
            type: 'object',
            properties: {
               day_of_week: {
                  type: 'string'
               },
               open_time: {
                  type: 'string'
               },
               close_time: {
                  type: 'string'
               },
               is_closed: {
                  type: 'boolean'
               }
            }
         },
         BusinessResponse: {
            type: 'object',
            properties: {
               id: {
                  type: 'integer'
               },
               name: {
                  type: 'string'
               },
               description_short: {
                  type: 'string'
               },
               description_long: {
                  type: 'string'
               },
               is_featured: {
                  type: 'boolean'
               },
               price_range_indicator: {
                  type: 'string'
               },
               status: {
                  type: 'string'
               },
               contact_info: {
                  type: 'object',
                  properties: {
                     phone_primary: {
                        type: 'string'
                     },
                     phone_secondary: {
                        type: 'string'
                     },
                     email_primary: {
                        type: 'string'
                     },
                     website_url: {
                        type: 'string'
                     },
                     social_media_links: {
                        type: 'object'
                     }
                  }
               },
               locations: {
                  type: 'array',
                  items: {
                     $ref: '#/components/schemas/Location'
                  }
               },
               operating_hours: {
                  type: 'array',
                  items: {
                     $ref: '#/components/schemas/OperatingHours'
                  }
               },
               business_services: {
                  type: 'array',
                  items: {
                     type: 'object',
                     properties: {
                        service: {
                           type: 'object',
                           properties: {
                              id: {
                                 type: 'integer'
                              },
                              name: {
                                 type: 'string'
                              }
                           }
                        }
                     }
                  }
               },
               business_brands: {
                  type: 'array',
                  items: {
                     type: 'object',
                     properties: {
                        brand: {
                           type: 'object',
                           properties: {
                              id: {
                                 type: 'integer'
                              },
                              name: {
                                 type: 'string'
                              }
                           }
                        }
                     }
                  }
               },
               business_specializations: {
                  type: 'array',
                  items: {
                     type: 'object',
                     properties: {
                        specialization: {
                           type: 'object',
                           properties: {
                              id: {
                                 type: 'integer'
                              },
                              name: {
                                 type: 'string'
                              }
                           }
                        }
                     }
                  }
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
      ...businessPaths,
      ...authPaths
   }
};

export const swaggerOptions = {
   explorer: true,
}; 