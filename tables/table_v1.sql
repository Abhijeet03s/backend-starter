-- BestinCiti Complete Database Schema

-- Drop sequences if they exist
DROP SEQUENCE IF EXISTS m_users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_roles_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_refresh_tokens_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_businesses_id_seq CASCADE;
DROP SEQUENCE IF EXISTS l_brands_id_seq CASCADE;
DROP SEQUENCE IF EXISTS l_services_id_seq CASCADE;
DROP SEQUENCE IF EXISTS l_specializations_id_seq CASCADE;
DROP SEQUENCE IF EXISTS l_categories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS l_subcategories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS l_cities_id_seq CASCADE;
DROP SEQUENCE IF EXISTS l_countries_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_locations_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_contact_info_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_business_services_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_brands_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_business_brands_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_specializations_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_business_specializations_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_operating_hours_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_service_areas_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_portfolio_images_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_business_owners_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_cities_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_countries_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_city_categories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_city_subcategories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_city_services_id_seq CASCADE;
DROP SEQUENCE IF EXISTS t_reviews_id_seq CASCADE;
DROP SEQUENCE IF EXISTS t_user_favorites_id_seq CASCADE;
DROP SEQUENCE IF EXISTS t_enquiries_id_seq CASCADE;

-- Create sequences
CREATE SEQUENCE m_users_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_roles_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_refresh_tokens_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_businesses_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE l_brands_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE l_services_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE l_specializations_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE l_categories_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE l_subcategories_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE l_cities_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE l_countries_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_locations_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_contact_info_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_business_services_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_brands_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_business_brands_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_specializations_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_business_specializations_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_operating_hours_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_service_areas_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_portfolio_images_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_business_owners_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_cities_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_countries_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_city_categories_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_city_subcategories_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_city_services_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE t_reviews_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE t_user_favorites_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE t_enquiries_id_seq START WITH 1 INCREMENT BY 1;

-- Master Table: User Management and Interactions
CREATE TABLE m_users (
    id INT PRIMARY KEY DEFAULT nextval('m_users_id_seq'),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_by INT NULL
);

-- Add self-referential foreign keys after table creation to avoid circular dependency
ALTER TABLE m_users ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES m_users(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE m_users ADD CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by) REFERENCES m_users(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;

-- Master Table: Core Business Information
CREATE TABLE m_businesses (
    id INT PRIMARY KEY DEFAULT nextval('m_businesses_id_seq'),
    name VARCHAR(255) NOT NULL,
    description_short VARCHAR(500),
    description_long TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    price_range_indicator VARCHAR(10), 
    status VARCHAR(20) NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'active', 'inactive', 'rejected', 'requires_update')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL
);

-- Master Table: Categories and Subcategories
CREATE TABLE l_categories (
    id INT PRIMARY KEY DEFAULT nextval('l_categories_id_seq'),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE, -- For URL-friendly names
    description TEXT,
    icon VARCHAR(255), -- Path or class name for an icon
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL
);

-- Master Table: Subcategories within Categories
CREATE TABLE l_subcategories (
    id INT PRIMARY KEY DEFAULT nextval('l_subcategories_id_seq'),
    category_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    UNIQUE (category_id, slug),
    CONSTRAINT fk_subcategories_category FOREIGN KEY (category_id) REFERENCES l_categories(id) ON DELETE CASCADE
);

-- Master Table: Countries
CREATE TABLE l_countries (
    id INT PRIMARY KEY DEFAULT nextval('l_countries_id_seq'),
    name VARCHAR(100) NOT NULL UNIQUE,
    country_code VARCHAR(10) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL
);

-- Master Table: Cities
CREATE TABLE l_cities (
    id INT PRIMARY KEY DEFAULT nextval('l_cities_id_seq'),
    country_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_cities_country FOREIGN KEY (country_id) REFERENCES l_countries(id) ON DELETE CASCADE,
    UNIQUE (country_id, name, state_province)
);

-- Master Table: Location and Contact Information
CREATE TABLE m_locations (
    id INT PRIMARY KEY DEFAULT nextval('m_locations_id_seq'),
    business_id INT NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    area_locality VARCHAR(100), -- e.g., Napier Town, Sadar
    city_id INT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10,8), -- For mapping
    longitude DECIMAL(11,8), -- For mapping
    is_primary BOOLEAN NOT NULL DEFAULT FALSE, -- If a business has multiple locations
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_locations_business FOREIGN KEY (business_id) REFERENCES m_businesses(id) ON DELETE CASCADE,
    CONSTRAINT fk_locations_city FOREIGN KEY (city_id) REFERENCES l_cities(id) ON DELETE RESTRICT -- Ensures city exists
);

-- Master Table: Contact Details for Businesses
CREATE TABLE m_contact_info (
    id INT PRIMARY KEY DEFAULT nextval('m_contact_info_id_seq'),
    business_id INT NOT NULL UNIQUE,
    phone_primary VARCHAR(20) NOT NULL,
    phone_secondary VARCHAR(20),
    email_primary VARCHAR(255),
    website_url VARCHAR(255),
    social_media_links JSONB, -- Store links as JSON object e.g., {"facebook": "url", "instagram": "url"}
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_contactinfo_business FOREIGN KEY (business_id) REFERENCES m_businesses(id) ON DELETE CASCADE
);

-- Master Table: Services, Brands, Specializations Definitions
CREATE TABLE l_services (
    id INT PRIMARY KEY DEFAULT nextval('l_services_id_seq'),
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- Global active status
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL
);

-- Junction Table: Links Businesses to ServicesOffered (Many-to-Many)
CREATE TABLE m_business_services (
    id INT PRIMARY KEY DEFAULT nextval('m_business_services_id_seq'),
    business_id INT NOT NULL,
    service_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    UNIQUE (business_id, service_id),
    CONSTRAINT fk_bs_business FOREIGN KEY (business_id) REFERENCES m_businesses(id) ON DELETE CASCADE,
    CONSTRAINT fk_bs_service FOREIGN KEY (service_id) REFERENCES l_services(id) ON DELETE CASCADE
);

-- Master Table: Brand Definitions
CREATE TABLE l_brands (
    id INT PRIMARY KEY DEFAULT nextval('l_brands_id_seq'),
    name VARCHAR(150) NOT NULL UNIQUE,
    logo_url VARCHAR(255),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL
);

-- Junction Table: Links Businesses to BrandsCarried (Many-to-Many)
CREATE TABLE m_business_brands (
    id INT PRIMARY KEY DEFAULT nextval('m_business_brands_id_seq'),
    business_id INT NOT NULL,
    brand_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    UNIQUE (business_id, brand_id),
    CONSTRAINT fk_bb_business FOREIGN KEY (business_id) REFERENCES m_businesses(id) ON DELETE CASCADE,
    CONSTRAINT fk_bb_brand FOREIGN KEY (brand_id) REFERENCES l_brands(id) ON DELETE CASCADE
);

-- Master Table: Specialization Definitions
CREATE TABLE l_specializations (
    id INT PRIMARY KEY DEFAULT nextval('l_specializations_id_seq'),
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL
);

-- Junction Table: Links Businesses to Specializations (Many-to-Many)
CREATE TABLE m_business_specializations (
    id INT PRIMARY KEY DEFAULT nextval('m_business_specializations_id_seq'),
    business_id INT NOT NULL,
    specialization_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    UNIQUE (business_id, specialization_id),
    CONSTRAINT fk_bspec_business FOREIGN KEY (business_id) REFERENCES m_businesses(id) ON DELETE CASCADE,
    CONSTRAINT fk_bspec_specialization FOREIGN KEY (specialization_id) REFERENCES l_specializations(id) ON DELETE CASCADE
);

-- Master Table: Operational Details (Business Hours)
CREATE TABLE m_operating_hours (
    id INT PRIMARY KEY DEFAULT nextval('m_operating_hours_id_seq'),
    business_id INT NOT NULL,
    location_id INT NULL,
    day_of_week VARCHAR(3) NOT NULL CHECK (day_of_week IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')),
    open_time TIME NULL,
    close_time TIME NULL,
    is_closed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_hours_business FOREIGN KEY (business_id) REFERENCES m_businesses(id) ON DELETE CASCADE,
    CONSTRAINT fk_hours_location FOREIGN KEY (location_id) REFERENCES m_locations(id) ON DELETE CASCADE
);

-- Master Table: Operational Details (Service Areas)
CREATE TABLE m_service_areas (
    id INT PRIMARY KEY DEFAULT nextval('m_service_areas_id_seq'),
    business_id INT NOT NULL,
    area_description TEXT NOT NULL, -- General description like "All of [City Name]", "Within 10km radius"
    specific_zones_json JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_serviceareas_business FOREIGN KEY (business_id) REFERENCES m_businesses(id) ON DELETE CASCADE
);

-- Master Table: Visual Assets (Portfolio Images)
CREATE TABLE m_portfolio_images (
    id INT PRIMARY KEY DEFAULT nextval('m_portfolio_images_id_seq'),
    business_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    alt_text VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_portfolio_business FOREIGN KEY (business_id) REFERENCES m_businesses(id) ON DELETE CASCADE
);

-- Junction Table: Links Users to Businesses for Management (B2B)
CREATE TABLE m_business_owners (
    id INT PRIMARY KEY DEFAULT nextval('m_business_owners_id_seq'),
    user_id INT NOT NULL,
    business_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'Owner',
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    UNIQUE (user_id, business_id),
    CONSTRAINT fk_bo_user FOREIGN KEY (user_id) REFERENCES m_users(id) ON DELETE CASCADE,
    CONSTRAINT fk_bo_business FOREIGN KEY (business_id) REFERENCES m_businesses(id) ON DELETE CASCADE
);

-- Master Table: Roles
CREATE TABLE m_roles (
    id INT PRIMARY KEY DEFAULT nextval('m_roles_id_seq'),
    role_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL
);

-- Junction Table: Links Users to Roles
CREATE TABLE m_user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES m_users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES m_roles(id) ON DELETE CASCADE
);

-- Master Table: Refresh Tokens
CREATE TABLE m_refresh_tokens (
    id INT PRIMARY KEY DEFAULT nextval('m_refresh_tokens_id_seq'),
    user_id INT NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES m_users(id) ON DELETE CASCADE
);

-- Master Table: City Categories
CREATE TABLE m_city_categories (
    id INT PRIMARY KEY DEFAULT nextval('m_city_categories_id_seq'),
    city_id INT NOT NULL,
    category_id INT NOT NULL,
    is_active_in_city BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_citycat_city FOREIGN KEY (city_id) REFERENCES m_cities(id) ON DELETE CASCADE,
    CONSTRAINT fk_citycat_category FOREIGN KEY (category_id) REFERENCES l_categories(id) ON DELETE CASCADE,
    UNIQUE (city_id, category_id)
);

-- Master Table: City Subcategories
CREATE TABLE m_city_subcategories (
    id INT PRIMARY KEY DEFAULT nextval('m_city_subcategories_id_seq'),
    city_id INT NOT NULL,
    subcategory_id INT NOT NULL,
    is_active_in_city BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_citysubcat_city FOREIGN KEY (city_id) REFERENCES m_cities(id) ON DELETE CASCADE,
    CONSTRAINT fk_citysubcat_subcategory FOREIGN KEY (subcategory_id) REFERENCES l_subcategories(id) ON DELETE CASCADE,
    UNIQUE (city_id, subcategory_id)
);

-- Master Table: City Services
CREATE TABLE m_city_services (
    id INT PRIMARY KEY DEFAULT nextval('m_city_services_id_seq'),
    city_id INT NOT NULL,
    service_id INT NOT NULL, -- Refers to the global m_services.id
    is_active_in_city BOOLEAN NOT NULL DEFAULT TRUE, -- Is this global service available/selectable in this city?
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_cityserv_city FOREIGN KEY (city_id) REFERENCES m_cities(id) ON DELETE CASCADE,
    CONSTRAINT fk_cityserv_service FOREIGN KEY (service_id) REFERENCES l_services(id) ON DELETE CASCADE,
    UNIQUE (city_id, service_id) -- A global service can only be linked once to a city
);

-- Transaction Table: User Reviews for Businesses
CREATE TABLE t_reviews (
    id INT PRIMARY KEY DEFAULT nextval('t_reviews_id_seq'),
    business_id INT NOT NULL,
    user_id INT NULL,
    rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_reviews_business FOREIGN KEY (business_id) REFERENCES m_businesses(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES m_users(id) ON DELETE SET NULL
);

-- Transaction Table: User Favorites (Linking Users to Businesses)
CREATE TABLE t_user_favorites (
    id INT PRIMARY KEY DEFAULT nextval('t_user_favorites_id_seq'),
    user_id INT NOT NULL,
    business_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    UNIQUE (user_id, business_id),
    CONSTRAINT fk_fav_user FOREIGN KEY (user_id) REFERENCES m_users(id) ON DELETE CASCADE,
    CONSTRAINT fk_fav_business FOREIGN KEY (business_id) REFERENCES m_businesses(id) ON DELETE CASCADE
);

-- Transaction Table: Enquiries/Messages from Users to Businesses
CREATE TABLE t_enquiries (
    id INT PRIMARY KEY DEFAULT nextval('t_enquiries_id_seq'),
    business_id INT NOT NULL,
    user_id INT NULL,
    sender_name VARCHAR(150) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    sender_phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(10) NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived', 'replied')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES m_users(id) NULL,
    updated_by INT REFERENCES m_users(id) NULL,
    CONSTRAINT fk_enquiries_business FOREIGN KEY (business_id) REFERENCES m_businesses(id) ON DELETE CASCADE,
    CONSTRAINT fk_enquiries_user FOREIGN KEY (user_id) REFERENCES m_users(id) ON DELETE SET NULL
);

-- Update all foreign key references in other tables
ALTER TABLE m_locations DROP CONSTRAINT fk_locations_city;
ALTER TABLE m_locations ADD CONSTRAINT fk_locations_city FOREIGN KEY (city_id) REFERENCES l_cities(id) ON DELETE RESTRICT;

ALTER TABLE m_business_services DROP CONSTRAINT fk_bs_service;
ALTER TABLE m_business_services ADD CONSTRAINT fk_bs_service FOREIGN KEY (service_id) REFERENCES l_services(id) ON DELETE CASCADE;

ALTER TABLE m_business_brands DROP CONSTRAINT fk_bb_brand;
ALTER TABLE m_business_brands ADD CONSTRAINT fk_bb_brand FOREIGN KEY (brand_id) REFERENCES l_brands(id) ON DELETE CASCADE;

ALTER TABLE m_business_specializations DROP CONSTRAINT fk_bspec_specialization;
ALTER TABLE m_business_specializations ADD CONSTRAINT fk_bspec_specialization FOREIGN KEY (specialization_id) REFERENCES l_specializations(id) ON DELETE CASCADE;

ALTER TABLE m_city_categories DROP CONSTRAINT fk_citycat_category;
ALTER TABLE m_city_categories ADD CONSTRAINT fk_citycat_category FOREIGN KEY (category_id) REFERENCES l_categories(id) ON DELETE CASCADE;

ALTER TABLE m_city_subcategories DROP CONSTRAINT fk_citysubcat_subcategory;
ALTER TABLE m_city_subcategories ADD CONSTRAINT fk_citysubcat_subcategory FOREIGN KEY (subcategory_id) REFERENCES l_subcategories(id) ON DELETE CASCADE;

ALTER TABLE m_city_services DROP CONSTRAINT fk_cityserv_service;
ALTER TABLE m_city_services ADD CONSTRAINT fk_cityserv_service FOREIGN KEY (service_id) REFERENCES l_services(id) ON DELETE CASCADE;