import { z } from 'zod';

// Business creation schema
export const businessCreateSchema = z.object({
   name: z.string().min(1).max(255),
   description_short: z.string().max(500).optional(),
   description_long: z.string().optional(),
   is_featured: z.boolean().optional().default(false),
   price_range_indicator: z.string().max(10).optional(),
   status: z.enum(['pending_approval', 'approved', 'rejected']).optional().default('pending_approval'),

   // Contact information
   contact: z.object({
      phone_primary: z.string().max(20),
      phone_secondary: z.string().max(20).optional(),
      email_primary: z.string().email().optional(),
      website_url: z.string().url().optional(),
      social_media_links: z.object({
         facebook: z.string().optional(),
         instagram: z.string().optional(),
         twitter: z.string().optional(),
         linkedin: z.string().optional()
      }).optional()
   }),

   // Location information
   location: z.object({
      address_line1: z.string().min(1).max(255),
      address_line2: z.string().max(255).optional(),
      area_locality: z.string().max(100).optional(),
      city_id: z.number().int().positive(),
      pincode: z.string().max(10),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      is_primary: z.boolean().optional().default(false)
   }),

   // Optional related data
   operating_hours: z.array(z.object({
      day_of_week: z.string().max(3),
      open_time: z.string().optional(),
      close_time: z.string().optional(),
      is_closed: z.boolean().optional().default(false),
      location_id: z.number().int().positive().optional()
   })).optional(),

   service_ids: z.array(z.number().int().positive()).optional(),
   brand_ids: z.array(z.number().int().positive()).optional(),
   specialization_ids: z.array(z.number().int().positive()).optional()
});

// Business update schema
export const businessUpdateSchema = businessCreateSchema.partial();

// Business search schema
export const businessSearchSchema = z.object({
   page: z.coerce.number().int().positive().optional().default(1),
   limit: z.coerce.number().int().positive().optional().default(10),
   name: z.string().optional(),
   status: z.enum(['pending_approval', 'approved', 'rejected']).optional(),
   city_id: z.coerce.number().int().positive().optional(),
   service_id: z.coerce.number().int().positive().optional(),
   brand_id: z.coerce.number().int().positive().optional(),
   specialization_id: z.coerce.number().int().positive().optional()
}); 