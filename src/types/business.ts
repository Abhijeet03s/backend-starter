// Core business entity
export interface Business {
   id: number;
   name: string;
   description_short?: string;
   description_long?: string;
   is_featured: boolean;
   price_range_indicator?: string;
   status: 'pending_approval' | 'approved' | 'rejected';
   created_at: Date;
   updated_at: Date;
   created_by?: number;
   updated_by?: number;
}

// Contact information for business
export interface ContactInfo {
   id: number;
   business_id: number;
   phone_primary: string;
   phone_secondary?: string;
   email_primary?: string;
   website_url?: string;
   social_media_links?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
   };
   created_at: Date;
   updated_at: Date;
   created_by?: number;
   updated_by?: number;
}

// Business location information
export interface Location {
   id: number;
   business_id: number;
   address_line1: string;
   address_line2?: string;
   area_locality?: string;
   city_id: number;
   pincode: string;
   latitude?: number | string;
   longitude?: number | string;
   is_primary: boolean;
   created_at: Date;
   updated_at: Date;
   created_by?: number;
   updated_by?: number;
}

// Business operating hours
export interface OperatingHours {
   id: number;
   business_id: number;
   location_id?: number;
   day_of_week: string;
   open_time?: Date;
   close_time?: Date;
   is_closed: boolean;
   created_at: Date;
   updated_at: Date;
   created_by?: number;
   updated_by?: number;
}

// Business with all its related entities
export interface BusinessWithRelations extends Business {
   m_contact_info?: ContactInfo;
   m_locations?: Location[];
   m_operating_hours?: OperatingHours[];
   m_business_services?: Array<{
      id: number;
      business_id: number;
      service_id: number;
      m_services: {
         id: number;
         name: string;
      };
   }>;
   m_business_brands?: Array<{
      id: number;
      business_id: number;
      brand_id: number;
      m_brands: {
         id: number;
         name: string;
         logo_url?: string;
      };
   }>;
   m_business_specializations?: Array<{
      id: number;
      business_id: number;
      specialization_id: number;
      m_specializations: {
         id: number;
         name: string;
      };
   }>;
   m_business_owners?: Array<{
      id: number;
      business_id: number;
      user_id: number;
      role?: string;
      m_users_m_business_owners_user_idTom_users: {
         id: number;
         email: string;
      };
   }>;
}

// Business creation input type
export interface BusinessCreateInput {
   name: string;
   description_short?: string;
   description_long?: string;
   is_featured?: boolean;
   price_range_indicator?: string;
   status?: 'pending_approval' | 'approved' | 'rejected';

   // Contact information
   contact: {
      phone_primary: string;
      phone_secondary?: string;
      email_primary?: string;
      website_url?: string;
      social_media_links?: {
         facebook?: string;
         instagram?: string;
         twitter?: string;
         linkedin?: string;
      };
   };

   // Location information
   location: {
      address_line1: string;
      address_line2?: string;
      area_locality?: string;
      city_id: number;
      pincode: string;
      latitude?: number;
      longitude?: number;
      is_primary?: boolean;
   };

   // Operating hours
   operating_hours?: Array<{
      day_of_week: string;
      open_time?: string;
      close_time?: string;
      is_closed?: boolean;
      location_id?: number;
   }>;

   // Service IDs
   service_ids?: number[];

   // Brand IDs
   brand_ids?: number[];

   // Specialization IDs
   specialization_ids?: number[];
} 