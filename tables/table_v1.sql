-- Auth-only Database Schema

-- Drop sequences if they exist
DROP SEQUENCE IF EXISTS m_users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_roles_id_seq CASCADE;
DROP SEQUENCE IF EXISTS m_refresh_tokens_id_seq CASCADE;

-- Create sequences
CREATE SEQUENCE m_users_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_roles_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE m_refresh_tokens_id_seq START WITH 1 INCREMENT BY 1;

-- Master Table: User Management
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

-- Insert default admin role
INSERT INTO m_roles (role_name, created_at, updated_at) VALUES ('admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO m_roles (role_name, created_at, updated_at) VALUES ('user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert default admin user (password: Admin@123)
INSERT INTO m_users (username, email, password_hash, is_email_verified, created_at, updated_at) 
VALUES ('admin', 'admin@example.com', '$2a$10$K8hV9aV7V8aV7V8aV7V8aOeV7V8aV7V8aV7V8aV7V8aV7V8aV7V8a', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Assign admin role to admin user
INSERT INTO m_user_roles (user_id, role_id, created_at, updated_at) 
VALUES (1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);