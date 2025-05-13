/**
 * @swagger
 * tags:
 *   name: Businesses
 *   description: Business management endpoints
 */

export const businessPaths = {
   '/api/businesses': {
      get: {
         tags: ['Businesses'],
         summary: 'Get all businesses',
         description: 'Retrieve a list of businesses with pagination and filters',
         parameters: [
            {
               in: 'query',
               name: 'page',
               schema: {
                  type: 'integer',
                  minimum: 1,
                  default: 1
               },
               description: 'Page number for pagination'
            },
            {
               in: 'query',
               name: 'limit',
               schema: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 100,
                  default: 10
               },
               description: 'Number of items per page'
            },
            {
               in: 'query',
               name: 'name',
               schema: {
                  type: 'string'
               },
               description: 'Filter by business name'
            },
            {
               in: 'query',
               name: 'status',
               schema: {
                  type: 'string',
                  enum: ['pending_approval', 'approved', 'rejected']
               },
               description: 'Filter by business status'
            },
            {
               in: 'query',
               name: 'city_id',
               schema: {
                  type: 'integer'
               },
               description: 'Filter by city ID'
            },
            {
               in: 'query',
               name: 'service_id',
               schema: {
                  type: 'integer'
               },
               description: 'Filter by service ID'
            },
            {
               in: 'query',
               name: 'brand_id',
               schema: {
                  type: 'integer'
               },
               description: 'Filter by brand ID'
            },
            {
               in: 'query',
               name: 'specialization_id',
               schema: {
                  type: 'integer'
               },
               description: 'Filter by specialization ID'
            }
         ],
         responses: {
            '200': {
               description: 'List of businesses retrieved successfully',
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
                              type: 'array',
                              items: {
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
                                       }
                                    },
                                    operating_hours: {
                                       type: 'array',
                                       items: {
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
                           },
                           pagination: {
                              type: 'object',
                              properties: {
                                 total: {
                                    type: 'integer'
                                 },
                                 page: {
                                    type: 'integer'
                                 },
                                 limit: {
                                    type: 'integer'
                                 },
                                 pages: {
                                    type: 'integer'
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            },
            '400': {
               description: 'Invalid query parameters',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            },
            '500': {
               description: 'Internal server error',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            }
         }
      },
      post: {
         tags: ['Businesses'],
         summary: 'Create a new business',
         description: 'Create a new business with all related information',
         security: [{ bearerAuth: [] }],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     required: ['name', 'contact', 'location'],
                     properties: {
                        name: {
                           type: 'string',
                           description: 'Business name'
                        },
                        description_short: {
                           type: 'string',
                           maxLength: 500,
                           description: 'Short description of the business'
                        },
                        description_long: {
                           type: 'string',
                           description: 'Detailed description of the business'
                        },
                        is_featured: {
                           type: 'boolean',
                           description: 'Whether the business is featured',
                           default: false
                        },
                        price_range_indicator: {
                           type: 'string',
                           maxLength: 10,
                           description: 'Price range indicator (e.g., $, $$, $$$)'
                        },
                        status: {
                           type: 'string',
                           enum: ['pending_approval', 'approved', 'rejected'],
                           default: 'pending_approval',
                           description: 'Business approval status'
                        },
                        contact: {
                           type: 'object',
                           required: ['phone_primary'],
                           properties: {
                              phone_primary: {
                                 type: 'string',
                                 description: 'Primary contact phone number'
                              },
                              phone_secondary: {
                                 type: 'string',
                                 description: 'Secondary contact phone number'
                              },
                              email_primary: {
                                 type: 'string',
                                 format: 'email',
                                 description: 'Primary contact email'
                              },
                              website_url: {
                                 type: 'string',
                                 format: 'uri',
                                 description: 'Business website URL'
                              },
                              social_media_links: {
                                 type: 'object',
                                 properties: {
                                    facebook: {
                                       type: 'string',
                                       description: 'Facebook profile URL'
                                    },
                                    instagram: {
                                       type: 'string',
                                       description: 'Instagram profile URL'
                                    },
                                    twitter: {
                                       type: 'string',
                                       description: 'Twitter profile URL'
                                    },
                                    linkedin: {
                                       type: 'string',
                                       description: 'LinkedIn profile URL'
                                    }
                                 }
                              }
                           }
                        },
                        location: {
                           type: 'object',
                           required: ['address_line1', 'city_id', 'pincode'],
                           properties: {
                              address_line1: {
                                 type: 'string',
                                 description: 'Address line 1'
                              },
                              address_line2: {
                                 type: 'string',
                                 description: 'Address line 2'
                              },
                              area_locality: {
                                 type: 'string',
                                 description: 'Area or locality name'
                              },
                              city_id: {
                                 type: 'integer',
                                 description: 'City ID reference'
                              },
                              pincode: {
                                 type: 'string',
                                 description: 'Postal/ZIP code'
                              },
                              latitude: {
                                 type: 'number',
                                 format: 'float',
                                 description: 'Location latitude'
                              },
                              longitude: {
                                 type: 'number',
                                 format: 'float',
                                 description: 'Location longitude'
                              },
                              is_primary: {
                                 type: 'boolean',
                                 default: false,
                                 description: 'Whether this is the primary location'
                              }
                           }
                        },
                        operating_hours: {
                           type: 'array',
                           items: {
                              type: 'object',
                              required: ['day_of_week'],
                              properties: {
                                 day_of_week: {
                                    type: 'string',
                                    enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
                                    description: 'Day of week'
                                 },
                                 open_time: {
                                    type: 'string',
                                    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                                    description: 'Opening time in HH:mm format'
                                 },
                                 close_time: {
                                    type: 'string',
                                    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
                                    description: 'Closing time in HH:mm format'
                                 },
                                 is_closed: {
                                    type: 'boolean',
                                    default: false,
                                    description: 'Whether business is closed on this day'
                                 },
                                 location_id: {
                                    type: 'integer',
                                    description: 'Location ID reference'
                                 }
                              }
                           }
                        },
                        service_ids: {
                           type: 'array',
                           items: {
                              type: 'integer'
                           },
                           description: 'IDs of services offered by the business'
                        },
                        brand_ids: {
                           type: 'array',
                           items: {
                              type: 'integer'
                           },
                           description: 'IDs of brands associated with the business'
                        },
                        specialization_ids: {
                           type: 'array',
                           items: {
                              type: 'integer'
                           },
                           description: 'IDs of business specializations'
                        }
                     }
                  }
               }
            }
         },
         responses: {
            '201': {
               description: 'Business created successfully',
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
                                 created_at: {
                                    type: 'string',
                                    format: 'date-time'
                                 },
                                 updated_at: {
                                    type: 'string',
                                    format: 'date-time'
                                 }
                              }
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
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            },
            '401': {
               description: 'Authentication required',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            },
            '403': {
               description: 'Forbidden - User does not have required role',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            },
            '500': {
               description: 'Internal server error',
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
   '/api/businesses/{id}': {
      get: {
         tags: ['Businesses'],
         summary: 'Get business by ID',
         description: 'Retrieve a business by its ID',
         parameters: [
            {
               in: 'path',
               name: 'id',
               required: true,
               schema: {
                  type: 'integer'
               },
               description: 'Business ID'
            }
         ],
         responses: {
            '200': {
               description: 'Business retrieved successfully',
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
                                 },
                                 business_owners: {
                                    type: 'array',
                                    items: {
                                       type: 'object',
                                       properties: {
                                          owner: {
                                             type: 'object',
                                             properties: {
                                                id: {
                                                   type: 'integer'
                                                },
                                                email: {
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
                     }
                  }
               }
            },
            '404': {
               description: 'Business not found',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            },
            '500': {
               description: 'Internal server error',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            }
         }
      },
      put: {
         tags: ['Businesses'],
         summary: 'Update business',
         description: 'Update an existing business',
         security: [{ bearerAuth: [] }],
         parameters: [
            {
               in: 'path',
               name: 'id',
               required: true,
               schema: {
                  type: 'integer'
               },
               description: 'Business ID'
            }
         ],
         requestBody: {
            required: true,
            content: {
               'application/json': {
                  schema: {
                     type: 'object',
                     properties: {
                        name: {
                           type: 'string'
                        },
                        description_short: {
                           type: 'string',
                           maxLength: 500
                        },
                        description_long: {
                           type: 'string'
                        },
                        is_featured: {
                           type: 'boolean'
                        },
                        price_range_indicator: {
                           type: 'string',
                           maxLength: 10
                        },
                        status: {
                           type: 'string',
                           enum: ['pending_approval', 'approved', 'rejected']
                        },
                        contact: {
                           type: 'object',
                           properties: {
                              phone_primary: {
                                 type: 'string'
                              },
                              phone_secondary: {
                                 type: 'string'
                              },
                              email_primary: {
                                 type: 'string',
                                 format: 'email'
                              },
                              website_url: {
                                 type: 'string',
                                 format: 'uri'
                              },
                              social_media_links: {
                                 type: 'object',
                                 properties: {
                                    facebook: {
                                       type: 'string'
                                    },
                                    instagram: {
                                       type: 'string'
                                    },
                                    twitter: {
                                       type: 'string'
                                    },
                                    linkedin: {
                                       type: 'string'
                                    }
                                 }
                              }
                           }
                        },
                        location: {
                           type: 'object',
                           properties: {
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
                                 type: 'number',
                                 format: 'float'
                              },
                              longitude: {
                                 type: 'number',
                                 format: 'float'
                              }
                           }
                        },
                        service_ids: {
                           type: 'array',
                           items: {
                              type: 'integer'
                           }
                        },
                        brand_ids: {
                           type: 'array',
                           items: {
                              type: 'integer'
                           }
                        },
                        specialization_ids: {
                           type: 'array',
                           items: {
                              type: 'integer'
                           }
                        }
                     }
                  }
               }
            }
         },
         responses: {
            '200': {
               description: 'Business updated successfully',
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
                              $ref: '#/components/schemas/BusinessResponse'
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
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            },
            '401': {
               description: 'Authentication required',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            },
            '403': {
               description: 'Forbidden - User does not have permission',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            },
            '404': {
               description: 'Business not found',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            },
            '500': {
               description: 'Internal server error',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            }
         }
      },
      delete: {
         tags: ['Businesses'],
         summary: 'Delete business',
         description: 'Delete an existing business',
         security: [{ bearerAuth: [] }],
         parameters: [
            {
               in: 'path',
               name: 'id',
               required: true,
               schema: {
                  type: 'integer'
               },
               description: 'Business ID'
            }
         ],
         responses: {
            '200': {
               description: 'Business deleted successfully',
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
                              example: 'Business deleted successfully'
                           }
                        }
                     }
                  }
               }
            },
            '401': {
               description: 'Authentication required',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            },
            '403': {
               description: 'Forbidden - User does not have permission',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            },
            '404': {
               description: 'Business not found',
               content: {
                  'application/json': {
                     schema: {
                        $ref: '#/components/schemas/Error'
                     }
                  }
               }
            },
            '500': {
               description: 'Internal server error',
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