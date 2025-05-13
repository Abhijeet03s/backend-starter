import { pool, executeTransaction } from '@/config/database';

export class BusinessRepository {
   async createBusiness(data: {
      name: string;
      description_short: string;
      description_long: string;
      is_featured: boolean;
      price_range_indicator: string;
      status: string;
      created_by?: number;
      updated_by?: number;
   }) {
      const query = `
         INSERT INTO bestinciti_prod.m_businesses (
            name, 
            description_short, 
            description_long,
            is_featured,
            price_range_indicator,
            status,
            created_by,
            updated_by,
            created_at,
            updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         RETURNING *
      `;

      const values = [
         data.name,
         data.description_short,
         data.description_long,
         data.is_featured,
         data.price_range_indicator,
         data.status,
         data.created_by,
         data.updated_by
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
   }

   async createContactInfo(data: {
      business_id: number;
      phone_primary: string;
      phone_secondary?: string;
      email_primary: string;
      website_url?: string;
      social_media_links?: any;
      created_by?: number;
      updated_by?: number;
   }) {
      const query = `
         INSERT INTO bestinciti_prod.m_contact_info (
            business_id,
            phone_primary,
            phone_secondary,
            email_primary,
            website_url,
            social_media_links,
            created_by,
            updated_by,
            created_at,
            updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         RETURNING *
      `;

      const values = [
         data.business_id,
         data.phone_primary,
         data.phone_secondary,
         data.email_primary,
         data.website_url,
         data.social_media_links ? JSON.stringify(data.social_media_links) : null,
         data.created_by,
         data.updated_by
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
   }

   async createLocation(data: {
      business_id: number;
      address_line1: string;
      address_line2?: string;
      area_locality: string;
      city_id: number;
      pincode: string;
      latitude?: number;
      longitude?: number;
      is_primary?: boolean;
      created_by?: number;
      updated_by?: number;
   }) {
      const query = `
         INSERT INTO bestinciti_prod.m_locations (
            business_id,
            address_line1,
            address_line2,
            area_locality,
            city_id,
            pincode,
            latitude,
            longitude,
            is_primary,
            created_by,
            updated_by,
            created_at,
            updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
         RETURNING *
      `;

      const values = [
         data.business_id,
         data.address_line1,
         data.address_line2,
         data.area_locality,
         data.city_id,
         data.pincode,
         data.latitude,
         data.longitude,
         data.is_primary || false,
         data.created_by,
         data.updated_by
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
   }

   async createBusinessOwner(data: {
      business_id: number;
      user_id: number;
      role: string;
      created_by?: number;
      updated_by?: number;
   }) {
      const query = `
         INSERT INTO bestinciti_prod.m_business_owners (
            business_id,
            user_id,
            role,
            created_by,
            updated_by,
            created_at,
            updated_at,
            added_at
         ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW())
         RETURNING *
      `;

      const values = [
         data.business_id,
         data.user_id,
         data.role,
         data.created_by,
         data.updated_by
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
   }

   async createBusinessService(data: {
      business_id: number;
      service_id: number;
      created_by?: number;
      updated_by?: number;
   }) {
      const query = `
         INSERT INTO bestinciti_prod.m_business_services (
            business_id,
            service_id,
            created_by,
            updated_by,
            created_at,
            updated_at
         ) VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *
      `;

      const values = [
         data.business_id,
         data.service_id,
         data.created_by,
         data.updated_by
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
   }

   async createBusinessBrand(data: {
      business_id: number;
      brand_id: number;
      created_by?: number;
      updated_by?: number;
   }) {
      const query = `
         INSERT INTO bestinciti_prod.m_business_brands (
            business_id,
            brand_id,
            created_by,
            updated_by,
            created_at,
            updated_at
         ) VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *
      `;

      const values = [
         data.business_id,
         data.brand_id,
         data.created_by,
         data.updated_by
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
   }

   async createBusinessSpecialization(data: {
      business_id: number;
      specialization_id: number;
      created_by?: number;
      updated_by?: number;
   }) {
      const query = `
         INSERT INTO bestinciti_prod.m_business_specializations (
            business_id,
            specialization_id,
            created_by,
            updated_by,
            created_at,
            updated_at
         ) VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING *
      `;

      const values = [
         data.business_id,
         data.specialization_id,
         data.created_by,
         data.updated_by
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
   }

   async createOperatingHours(data: {
      business_id: number;
      day_of_week: string;
      open_time: string;
      close_time: string;
      is_closed?: boolean;
      location_id?: number;
      created_by?: number;
      updated_by?: number;
   }) {
      // Convert string times to proper format
      const openTimeParts = data.open_time.split(':');
      const closeTimeParts = data.close_time.split(':');

      // Format time as HH:MM:00
      const openTimeFormatted = `${openTimeParts[0]}:${openTimeParts[1]}:00`;
      const closeTimeFormatted = `${closeTimeParts[0]}:${closeTimeParts[1]}:00`;

      const query = `
         INSERT INTO bestinciti_prod.m_operating_hours (
            business_id,
            day_of_week,
            open_time,
            close_time,
            is_closed,
            location_id,
            created_by,
            updated_by,
            created_at,
            updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
         RETURNING *
      `;

      const values = [
         data.business_id,
         data.day_of_week,
         openTimeFormatted,
         closeTimeFormatted,
         data.is_closed || false,
         data.location_id,
         data.created_by,
         data.updated_by
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
   }

   async findBusinesses(where: any, skip: number, take: number) {
      // Build where clause dynamically based on the where object
      let whereClause = '';
      const values: any[] = [];
      let paramCount = 1;

      if (where && Object.keys(where).length > 0) {
         const conditions = [];
         for (const [key, value] of Object.entries(where)) {
            conditions.push(`b.${key} = $${paramCount}`);
            values.push(value);
            paramCount++;
         }
         if (conditions.length > 0) {
            whereClause = `WHERE ${conditions.join(' AND ')}`;
         }
      }

      // Main query to get businesses with join data
      const query = `
         SELECT 
            b.*,
            json_build_object(
               'contact_info', (
                  SELECT row_to_json(ci) 
                  FROM bestinciti_prod.m_contact_info ci 
                  WHERE ci.business_id = b.id
               ),
               'locations', (
                  SELECT json_agg(loc) 
                  FROM bestinciti_prod.m_locations loc 
                  WHERE loc.business_id = b.id
               ),
               'operating_hours', (
                  SELECT json_agg(oh) 
                  FROM bestinciti_prod.m_operating_hours oh 
                  WHERE oh.business_id = b.id
               ),
               'business_services', (
                  SELECT json_agg(
                     json_build_object(
                        'id', bs.id,
                        'business_id', bs.business_id,
                        'service_id', bs.service_id,
                        'service', (
                           SELECT row_to_json(s) 
                           FROM bestinciti_prod.l_services s 
                           WHERE s.id = bs.service_id
                        )
                     )
                  ) 
                  FROM bestinciti_prod.m_business_services bs 
                  WHERE bs.business_id = b.id
               ),
               'business_brands', (
                  SELECT json_agg(
                     json_build_object(
                        'id', bb.id,
                        'business_id', bb.business_id,
                        'brand_id', bb.brand_id,
                        'brand', (
                           SELECT row_to_json(br) 
                           FROM bestinciti_prod.l_brands br 
                           WHERE br.id = bb.brand_id
                        )
                     )
                  ) 
                  FROM bestinciti_prod.m_business_brands bb 
                  WHERE bb.business_id = b.id
               ),
               'business_specializations', (
                  SELECT json_agg(
                     json_build_object(
                        'id', bsp.id,
                        'business_id', bsp.business_id,
                        'specialization_id', bsp.specialization_id,
                        'specialization', (
                           SELECT row_to_json(sp) 
                           FROM bestinciti_prod.l_specializations sp 
                           WHERE sp.id = bsp.specialization_id
                        )
                     )
                  ) 
                  FROM bestinciti_prod.m_business_specializations bsp 
                  WHERE bsp.business_id = b.id
               )
            ) AS related_data
         FROM bestinciti_prod.m_businesses b
         ${whereClause}
         ORDER BY b.id
         LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;

      // Add pagination parameters
      values.push(take, skip);

      // Count query for pagination
      const countQuery = `
         SELECT COUNT(*) 
         FROM bestinciti_prod.m_businesses b
         ${whereClause}
      `;

      try {
         // Execute both queries in parallel
         const [businessesResult, countResult] = await Promise.all([
            pool.query(query, values),
            pool.query(countQuery, values.slice(0, -2)) // Remove pagination params
         ]);

         const businesses = businessesResult.rows.map((row: any) => {
            const relatedData = row.related_data;
            delete row.related_data;

            return {
               ...row,
               m_contact_info: relatedData.contact_info,
               m_locations: relatedData.locations || [],
               m_operating_hours: relatedData.operating_hours || [],
               m_business_services: relatedData.business_services || [],
               m_business_brands: relatedData.business_brands || [],
               m_business_specializations: relatedData.business_specializations || []
            };
         });

         return businesses;
      } catch (error) {
         console.error('Error finding businesses:', error);
         throw error;
      }
   }

   async countBusinesses(where: any) {
      // Build where clause dynamically based on the where object
      let whereClause = '';
      const values: any[] = [];
      let paramCount = 1;

      if (where && Object.keys(where).length > 0) {
         const conditions = [];
         for (const [key, value] of Object.entries(where)) {
            conditions.push(`${key} = $${paramCount}`);
            values.push(value);
            paramCount++;
         }
         if (conditions.length > 0) {
            whereClause = `WHERE ${conditions.join(' AND ')}`;
         }
      }

      const query = `
         SELECT COUNT(*) 
         FROM bestinciti_prod.m_businesses 
         ${whereClause}
      `;

      const result = await pool.query(query, values);
      return parseInt(result.rows[0].count);
   }

   async findBusinessById(id: number) {
      const query = `
         SELECT 
            b.*,
            json_build_object(
               'contact_info', (
                  SELECT row_to_json(ci) 
                  FROM bestinciti_prod.m_contact_info ci 
                  WHERE ci.business_id = b.id
               ),
               'locations', (
                  SELECT json_agg(loc) 
                  FROM bestinciti_prod.m_locations loc 
                  WHERE loc.business_id = b.id
               ),
               'operating_hours', (
                  SELECT json_agg(oh) 
                  FROM bestinciti_prod.m_operating_hours oh 
                  WHERE oh.business_id = b.id
               ),
               'business_services', (
                  SELECT json_agg(
                     json_build_object(
                        'id', bs.id,
                        'business_id', bs.business_id,
                        'service_id', bs.service_id,
                        'service', (
                           SELECT row_to_json(s) 
                           FROM bestinciti_prod.l_services s 
                           WHERE s.id = bs.service_id
                        )
                     )
                  ) 
                  FROM bestinciti_prod.m_business_services bs 
                  WHERE bs.business_id = b.id
               ),
               'business_brands', (
                  SELECT json_agg(
                     json_build_object(
                        'id', bb.id,
                        'business_id', bb.business_id,
                        'brand_id', bb.brand_id,
                        'brand', (
                           SELECT row_to_json(br) 
                           FROM bestinciti_prod.l_brands br 
                           WHERE br.id = bb.brand_id
                        )
                     )
                  ) 
                  FROM bestinciti_prod.m_business_brands bb 
                  WHERE bb.business_id = b.id
               ),
               'business_specializations', (
                  SELECT json_agg(
                     json_build_object(
                        'id', bsp.id,
                        'business_id', bsp.business_id,
                        'specialization_id', bsp.specialization_id,
                        'specialization', (
                           SELECT row_to_json(sp) 
                           FROM bestinciti_prod.l_specializations sp 
                           WHERE sp.id = bsp.specialization_id
                        )
                     )
                  ) 
                  FROM bestinciti_prod.m_business_specializations bsp 
                  WHERE bsp.business_id = b.id
               ),
               'portfolio_images', (
                  SELECT json_agg(pi) 
                  FROM bestinciti_prod.m_portfolio_images pi 
                  WHERE pi.business_id = b.id
               )
            ) AS related_data
         FROM bestinciti_prod.m_businesses b
         WHERE b.id = $1
      `;

      try {
         const result = await pool.query(query, [id]);

         if (result.rows.length === 0) {
            return null;
         }

         const business = result.rows[0];
         const relatedData = business.related_data;
         delete business.related_data;

         return {
            ...business,
            m_contact_info: relatedData.contact_info,
            m_locations: relatedData.locations || [],
            m_operating_hours: relatedData.operating_hours || [],
            m_business_services: relatedData.business_services || [],
            m_business_brands: relatedData.business_brands || [],
            m_business_specializations: relatedData.business_specializations || [],
            m_portfolio_images: relatedData.portfolio_images || []
         };
      } catch (error) {
         console.error('Error finding business by ID:', error);
         throw error;
      }
   }

   async updateBusiness(id: number, data: any) {
      // Build SET clause dynamically based on the data object
      const setClause = [];
      const values: any[] = [];
      let paramCount = 1;

      for (const [key, value] of Object.entries(data)) {
         setClause.push(`${key} = $${paramCount}`);
         values.push(value);
         paramCount++;
      }

      // Always update the updated_at timestamp
      setClause.push(`updated_at = NOW()`);

      // Add the id to the values array
      values.push(id);

      const query = `
         UPDATE bestinciti_prod.m_businesses 
         SET ${setClause.join(', ')} 
         WHERE id = $${paramCount}
         RETURNING *
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
   }

   async deleteBusiness(id: number) {
      const query = `
         DELETE FROM bestinciti_prod.m_businesses 
         WHERE id = $1
         RETURNING *
      `;

      const result = await pool.query(query, [id]);
      return result.rows[0];
   }

   async businessExists(id: number) {
      const query = `
         SELECT COUNT(*) 
         FROM bestinciti_prod.m_businesses 
         WHERE id = $1
      `;

      const result = await pool.query(query, [id]);
      return parseInt(result.rows[0].count) > 0;
   }

   async isBusinessOwner(businessId: number, userId: number) {
      const query = `
         SELECT COUNT(*) 
         FROM bestinciti_prod.m_business_owners 
         WHERE business_id = $1 AND user_id = $2
      `;

      const result = await pool.query(query, [businessId, userId]);
      return parseInt(result.rows[0].count) > 0;
   }

   /**
    * Check if a business with the same name, city and address already exists
    */
   async findDuplicateBusiness(name: string, cityId: number, addressLine1: string) {
      const query = `
         SELECT b.* 
         FROM bestinciti_prod.m_businesses b
         JOIN bestinciti_prod.m_locations l ON b.id = l.business_id
         WHERE 
            b.name = $1 AND 
            l.city_id = $2 AND 
            l.address_line1 = $3
         LIMIT 1
      `;

      const result = await pool.query(query, [name, cityId, addressLine1]);
      return result.rows[0] || null;
   }

   async deleteBusinessServices(businessId: number) {
      const query = `
         DELETE FROM bestinciti_prod.m_business_services 
         WHERE business_id = $1
         RETURNING *
      `;

      const result = await pool.query(query, [businessId]);
      return result.rowCount;
   }

   async deleteBusinessBrands(businessId: number) {
      const query = `
         DELETE FROM bestinciti_prod.m_business_brands 
         WHERE business_id = $1
         RETURNING *
      `;

      const result = await pool.query(query, [businessId]);
      return result.rowCount;
   }

   async deleteBusinessSpecializations(businessId: number) {
      const query = `
         DELETE FROM bestinciti_prod.m_business_specializations 
         WHERE business_id = $1
         RETURNING *
      `;

      const result = await pool.query(query, [businessId]);
      return result.rowCount;
   }

   async deleteOperatingHours(businessId: number) {
      const query = `
         DELETE FROM bestinciti_prod.m_operating_hours 
         WHERE business_id = $1
         RETURNING *
      `;

      const result = await pool.query(query, [businessId]);
      return result.rowCount;
   }

   async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
      return executeTransaction(callback);
   }

   /**
    * Find the primary location for a business
    */
   async findPrimaryLocationByBusinessId(businessId: number) {
      const query = `
         SELECT * 
         FROM bestinciti_prod.m_locations 
         WHERE business_id = $1 AND is_primary = true
         LIMIT 1
      `;

      const result = await pool.query(query, [businessId]);
      return result.rows[0] || null;
   }

   /**
    * Update an existing location
    */
   async updateLocation(id: number, data: {
      address_line1?: string;
      address_line2?: string | null;
      area_locality?: string;
      city_id?: number;
      pincode?: string;
      latitude?: number | null;
      longitude?: number | null;
      is_primary?: boolean;
      updated_by?: number;
   }) {
      // Build SET clause dynamically based on the data object
      const setClause = [];
      const values: any[] = [];
      let paramCount = 1;

      for (const [key, value] of Object.entries(data)) {
         setClause.push(`${key} = $${paramCount}`);
         values.push(value);
         paramCount++;
      }

      // Always update the updated_at timestamp
      setClause.push(`updated_at = NOW()`);

      // Add the id to the values array
      values.push(id);

      const query = `
         UPDATE bestinciti_prod.m_locations 
         SET ${setClause.join(', ')} 
         WHERE id = $${paramCount}
         RETURNING *
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
   }
} 