# Node.js TypeScript Backend Starter Template

A robust starter template for Node.js backend applications with TypeScript, Express, PostgreSQL, and JWT authentication.

## Tech Stack

- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Validation:** Zod
- **Testing:** Jest & Supertest
- **API Documentation:** Swagger/OpenAPI

### Development & Utilities
- **Environment Variables:** dotenv
- **Auto-Reload (Dev):** nodemon

### Optional
- **CORS Handling:** cors (Express middleware)
- **Logging (Recommended):** winston
- **File Uploads (if needed):** multer

## Getting Started

```bash
# Install dependencies
npm install

# Create a .env file with the following variables
PORT=8080
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=app_db
FRONTEND_URL=http://localhost:3000

# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production mode
npm run start
```

## Database Setup

The application uses PostgreSQL with an `app_schema` namespace. To set up the database:

1. Install PostgreSQL on your system
2. Create a database named `app_db` (or as configured in your .env)
3. Run the SQL script in `tables/table_v1.sql` to create the schema and tables

```bash
# Example using psql
psql -U postgres -d app_db -f tables/table_v1.sql
```

## API Documentation

The API is documented using Swagger UI. After starting the server, you can access the API documentation at:

```
http://localhost:8080/api-docs
```

This interactive documentation allows you to:
- View all available API endpoints
- See detailed request and response structures
- Test API endpoints directly from the browser

## Authentication

The template includes a complete JWT authentication system with:

- User registration
- Login with JWT tokens
- Refresh token mechanism (with HTTP-only cookies)
- Role-based authorization middleware
- Token revocation

### Default Credentials

The template comes with a default admin user:
- **Email:** admin@example.com
- **Password:** Admin@123

*Note: Change these credentials immediately in a production environment.*

## Features

1. **Authentication System**
   - JWT-based authentication
   - Secure password hashing with bcrypt
   - Refresh token rotation
   - Role-based authorization

2. **User Management**
   - User registration
   - User profile management
   - Role assignment

3. **API Structure**
   - RESTful API design
   - Route middleware
   - Error handling
   - Input validation with Zod

4. **Development Environment**
   - Hot reloading with nodemon
   - TypeScript support
   - Proper project structure

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and receive JWT tokens
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/revoke-token` - Revoke refresh token (logout)

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

## Testing

You can run the automated test suite with:

```bash
npm test
```

## Project Structure

```
.
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Express middlewares
│   ├── repositories/     # Database interactions
│   ├── routes/           # API routes
│   ├── schemas/          # Validation schemas
│   ├── services/         # Business logic
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── tables/               # SQL scripts for database setup
├── tests/                # Test files
├── .env                  # Environment variables (create this)
├── .gitignore
├── index.ts              # Application entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Extending the Template

This template provides the basic structure to build any backend application. To extend it:

1. Add new routes in the `routes/` directory
2. Create corresponding controllers, services, and repositories
3. Define validation schemas with Zod
4. Update the database schema as needed

## Security Considerations

For production deployments:
- Replace the default admin user
- Use strong, unique secrets for JWT tokens
- Enable HTTPS
- Consider implementing rate limiting
- Set appropriate CORS settings based on your frontend domains

## License

This project is open source and available under the MIT License.