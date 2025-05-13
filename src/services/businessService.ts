import { BusinessCreateInput } from '@/types/business';
import { BusinessRepository } from '@/repositories/businessRepository';

export class BusinessService {
   private repository: BusinessRepository;

   constructor(repository: BusinessRepository) {
      this.repository = repository;
   }

   /**
    * Create a new business with all related data
    */
   async createBusiness(data: BusinessCreateInput, userId?: number) {
      // Check for duplicate business with same name, city and address
      const duplicate = await this.repository.findDuplicateBusiness(
         data.name,
         data.location.city_id,
         data.location.address_line1
      );

      if (duplicate) {
         throw new Error('A business with the same name at this location already exists');
      }

      return await this.repository.transaction(async (tx) => {
         // Create the business
         const business = await this.repository.createBusiness({
            name: data.name,
            description_short: data.description_short || '',
            description_long: data.description_long || '',
            is_featured: data.is_featured || false,
            price_range_indicator: data.price_range_indicator || '',
            status: data.status || 'draft',
            created_by: userId,
            updated_by: userId
         });

         // Create contact information
         await this.repository.createContactInfo({
            business_id: business.id,
            phone_primary: data.contact.phone_primary,
            phone_secondary: data.contact.phone_secondary,
            email_primary: data.contact.email_primary || '',
            website_url: data.contact.website_url,
            social_media_links: data.contact.social_media_links || {},
            created_by: userId,
            updated_by: userId
         });

         // Create location and store the location ID
         const location = await this.repository.createLocation({
            business_id: business.id,
            address_line1: data.location.address_line1 || '',
            address_line2: data.location.address_line2,
            area_locality: data.location.area_locality || '',
            city_id: data.location.city_id,
            pincode: data.location.pincode || '',
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            is_primary: data.location.is_primary || false,
            created_by: userId,
            updated_by: userId
         });

         // Create business owner relationship if userId provided
         if (userId) {
            await this.repository.createBusinessOwner({
               business_id: business.id,
               user_id: userId,
               role: 'Owner',
               created_by: userId,
               updated_by: userId
            });
         }

         // Add services if provided
         if (data.service_ids && data.service_ids.length > 0) {
            for (const serviceId of data.service_ids) {
               await this.repository.createBusinessService({
                  business_id: business.id,
                  service_id: serviceId,
                  created_by: userId,
                  updated_by: userId
               });
            }
         }

         // Add brands if provided
         if (data.brand_ids && data.brand_ids.length > 0) {
            for (const brandId of data.brand_ids) {
               await this.repository.createBusinessBrand({
                  business_id: business.id,
                  brand_id: brandId,
                  created_by: userId,
                  updated_by: userId
               });
            }
         }

         // Add specializations if provided
         if (data.specialization_ids && data.specialization_ids.length > 0) {
            for (const specializationId of data.specialization_ids) {
               await this.repository.createBusinessSpecialization({
                  business_id: business.id,
                  specialization_id: specializationId,
                  created_by: userId,
                  updated_by: userId
               });
            }
         }

         // Add operating hours if provided
         if (data.operating_hours && data.operating_hours.length > 0) {
            for (const hours of data.operating_hours) {
               // Use the location ID from the created location if not explicitly provided
               const locationId = hours.location_id || location.id;

               await this.repository.createOperatingHours({
                  business_id: business.id,
                  day_of_week: String(hours.day_of_week),
                  open_time: hours.open_time || '00:00',
                  close_time: hours.close_time || '00:00',
                  is_closed: hours.is_closed || false,
                  location_id: locationId,  // Always set the location ID
                  created_by: userId,
                  updated_by: userId
               });
            }
         }

         return business;
      });
   }

   /**
    * Get all businesses with pagination and filters
    */
   async getAllBusinesses(page: number = 1, limit: number = 10, filters: any = {}) {
      const skip = (page - 1) * limit;

      // Build where clause based on filters
      const where: any = {};

      if (filters.name) {
         where.name = { contains: filters.name, mode: 'insensitive' };
      }

      if (filters.status) {
         where.status = filters.status;
      }

      if (filters.city_id) {
         where.locations = {
            some: {
               city_id: filters.city_id
            }
         };
      }

      if (filters.service_id) {
         where.business_services = {
            some: {
               service_id: filters.service_id
            }
         };
      }

      if (filters.brand_id) {
         where.business_brands = {
            some: {
               brand_id: filters.brand_id
            }
         };
      }

      if (filters.specialization_id) {
         where.business_specializations = {
            some: {
               specialization_id: filters.specialization_id
            }
         };
      }

      const businesses = await this.repository.findBusinesses(where, skip, limit);
      const totalCount = await this.repository.countBusinesses(where);

      return {
         businesses,
         pagination: {
            total: totalCount,
            page,
            limit,
            pages: Math.ceil(totalCount / limit)
         }
      };
   }

   /**
    * Get a business by ID with all related data
    */
   async getBusinessById(id: number) {
      return await this.repository.findBusinessById(id);
   }

   /**
    * Update a business with all related data
    */
   async updateBusiness(id: number, data: Partial<BusinessCreateInput>, userId?: number) {
      return await this.repository.transaction(async (tx) => {
         // Update basic business information
         const businessData: any = {};

         if (data.name) businessData.name = data.name;
         if (data.description_short) businessData.description_short = data.description_short;
         if (data.description_long) businessData.description_long = data.description_long;
         if (data.is_featured !== undefined) businessData.is_featured = data.is_featured;
         if (data.price_range_indicator) businessData.price_range_indicator = data.price_range_indicator;
         if (data.status) businessData.status = data.status;
         if (userId) businessData.updated_by = userId;

         const business = await this.repository.updateBusiness(id, businessData);

         // Update location if provided
         let locationId;
         if (data.location) {
            // Check if primary location exists
            const existingLocation = await this.repository.findPrimaryLocationByBusinessId(id);

            if (existingLocation) {
               // Update existing location
               await this.repository.updateLocation(existingLocation.id, {
                  address_line1: data.location.address_line1 || existingLocation.address_line1,
                  address_line2: data.location.address_line2,
                  area_locality: data.location.area_locality || existingLocation.area_locality || '',
                  city_id: data.location.city_id || existingLocation.city_id,
                  pincode: data.location.pincode || existingLocation.pincode,
                  latitude: data.location.latitude,
                  longitude: data.location.longitude,
                  is_primary: true,
                  updated_by: userId
               });
               locationId = existingLocation.id;
            } else {
               // Create new location
               const newLocation = await this.repository.createLocation({
                  business_id: id,
                  address_line1: data.location.address_line1 || '',
                  address_line2: data.location.address_line2,
                  area_locality: data.location.area_locality || '',
                  city_id: data.location.city_id,
                  pincode: data.location.pincode || '',
                  latitude: data.location.latitude,
                  longitude: data.location.longitude,
                  is_primary: true,
                  created_by: userId,
                  updated_by: userId
               });
               locationId = newLocation.id;
            }
         } else {
            // Try to get existing primary location
            const existingLocation = await this.repository.findPrimaryLocationByBusinessId(id);
            if (existingLocation) {
               locationId = existingLocation.id;
            }
         }

         // Update services if provided - remove all existing and add new ones
         if (data.service_ids) {
            await this.repository.deleteBusinessServices(id);

            for (const serviceId of data.service_ids) {
               await this.repository.createBusinessService({
                  business_id: id,
                  service_id: serviceId,
                  created_by: userId,
                  updated_by: userId
               });
            }
         }

         // Update brands if provided - remove all existing and add new ones
         if (data.brand_ids) {
            await this.repository.deleteBusinessBrands(id);

            for (const brandId of data.brand_ids) {
               await this.repository.createBusinessBrand({
                  business_id: id,
                  brand_id: brandId,
                  created_by: userId,
                  updated_by: userId
               });
            }
         }

         // Update specializations if provided - remove all existing and add new ones
         if (data.specialization_ids) {
            await this.repository.deleteBusinessSpecializations(id);

            for (const specializationId of data.specialization_ids) {
               await this.repository.createBusinessSpecialization({
                  business_id: id,
                  specialization_id: specializationId,
                  created_by: userId,
                  updated_by: userId
               });
            }
         }

         // Update operating hours if provided - remove all existing and add new ones
         if (data.operating_hours) {
            await this.repository.deleteOperatingHours(id);

            for (const hours of data.operating_hours) {
               // Use the location ID from either the explicit value or the primary location
               const hourLocationId = hours.location_id || locationId;

               await this.repository.createOperatingHours({
                  business_id: id,
                  day_of_week: String(hours.day_of_week),
                  open_time: hours.open_time || '00:00',
                  close_time: hours.close_time || '00:00',
                  is_closed: hours.is_closed || false,
                  location_id: hourLocationId,
                  created_by: userId,
                  updated_by: userId
               });
            }
         }

         return this.getBusinessById(id);
      });
   }

   /**
    * Delete a business and all its related data
    */
   async deleteBusiness(id: number) {
      return await this.repository.deleteBusiness(id);
   }

   /**
    * Check if a business exists
    */
   async businessExists(id: number) {
      return await this.repository.businessExists(id);
   }

   /**
    * Check if a user is the owner of a business
    */
   async isBusinessOwner(businessId: number, userId: number) {
      return await this.repository.isBusinessOwner(businessId, userId);
   }
}

