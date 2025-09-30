# Node.js + Firestore Backend Template

A production-ready backend template built with Node.js, TypeScript, Express, Google Cloud Firestore, and JWT authentication. Perfect for building scalable backend applications with Google Cloud Platform.

## Tech Stack

- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** Google Cloud Firestore (NoSQL)
- **Authentication:** JWT with refresh tokens
- **Validation:** Zod
- **Testing:** Jest & Supertest
- **API Documentation:** Swagger/OpenAPI
- **Cloud Platform:** Google Cloud Platform (GCP)

### Development & Utilities
- **Environment Variables:** dotenv
- **Auto-Reload (Dev):** nodemon
- **CORS Handling:** cors
- **Logging:** winston
- **File Uploads:** multer

## Features

✅ **Authentication System**
- JWT-based authentication with access & refresh tokens
- Secure password hashing with bcrypt
- Refresh token rotation stored in Firestore
- Role-based authorization (user, admin)
- HTTP-only cookies for refresh tokens
- Token revocation support

✅ **Firestore Integration**
- Application Default Credentials (no keys needed on GCP)
- Automatic credential handling for local development
- Collections: `users`, `refresh_tokens`
- Transaction support

✅ **Production Ready**
- Clean architecture (Controllers → Services → Repositories)
- Input validation with Zod schemas
- TypeScript with strict typing
- Swagger API documentation
- Error handling
- CORS configuration

## Getting Started

### Prerequisites

1. **Google Cloud Account** - [Create one](https://console.cloud.google.com)
2. **Node.js** - v18 or higher
3. **gcloud CLI** - [Install](https://cloud.google.com/sdk/docs/install)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd backend-starter

# Install dependencies
npm install
```

### Step 2: Setup Google Cloud Firestore

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Firestore API**
4. Create a Firestore database:
   - Navigate to **Firestore Database**
   - Click **Create Database**
   - Choose **Native mode**
   - Select your preferred region
   - Start in **Production mode** or **Test mode**

### Step 3: Configure Local Development

```bash
# Authenticate with Google Cloud
gcloud auth application-default login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID
```

### Step 4: Environment Variables

```bash
# Copy example env file
cp .env.example .env
```

Update `.env` with your values:

```bash
# Firestore Configuration
GOOGLE_CLOUD_PROJECT=your-project-id

# Server Configuration
NODE_ENV=development
PORT=8080

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

### Step 5: Run the Application

```bash
# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

The API will be available at: `http://localhost:8080`

## API Documentation

Interactive Swagger documentation is available at:
```
http://localhost:8080/api-docs
```

This allows you to:
- View all API endpoints
- See request/response schemas
- Test endpoints directly from the browser

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login and get tokens | No |
| POST | `/api/auth/refresh-token` | Refresh access token | No (uses cookie) |
| POST | `/api/auth/revoke-token` | Logout/revoke token | Yes |

### Example Requests

**Sign Up:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "newuser",
    "password": "SecurePass123",
    "role": "user"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

## Project Structure

```
.
├── src/
│   ├── config/           # Configuration files
│   │   ├── firestore.ts  # Firestore initialization
│   │   └── cookies.ts    # Cookie configuration
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Express middlewares (auth, etc.)
│   ├── repositories/     # Firestore database operations
│   ├── routes/           # API route definitions
│   ├── schemas/          # Zod validation schemas
│   ├── services/         # Business logic layer
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions & Swagger docs
├── index.ts              # Application entry point
├── .env                  # Environment variables (create from .env.example)
├── .env.example          # Example environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Firestore Collections

### `users`
```typescript
{
  id: string;                    // Auto-generated document ID
  email: string;
  username: string;
  password_hash: string;
  is_active: boolean;
  is_email_verified: boolean;
  roles: string[];               // ['user'] or ['admin']
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### `refresh_tokens`
```typescript
{
  id: string;                    // Auto-generated document ID
  user_id: string;               // Reference to user document
  refresh_token: string;
  expires_at: Timestamp;
  is_revoked: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

## Deployment to Google Cloud Platform

### Deploy to Cloud Run (Recommended)

```bash
# Build and deploy
gcloud run deploy backend-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=your-project-id,JWT_SECRET=your-secret
```

### Deploy to App Engine

Create `app.yaml`:
```yaml
runtime: nodejs20
env: standard

env_variables:
  GOOGLE_CLOUD_PROJECT: "your-project-id"
  JWT_SECRET: "your-jwt-secret"
  NODE_ENV: "production"
```

Deploy:
```bash
gcloud app deploy
```

### Environment Variables for Production

Set these in your GCP service:
```bash
GOOGLE_CLOUD_PROJECT=your-project-id
JWT_SECRET=strong-secret-key
NODE_ENV=production
PORT=8080  # Cloud Run sets this automatically
```

## Extending the Template

This template provides a solid foundation. Here's how to extend it:

### 1. Add New Features

```typescript
// src/routes/yourFeatureRoutes.ts
import express from 'express';
import { isAuth } from '@/middlewares/authMiddleware';

const router = express.Router();

router.get('/items', isAuth, yourController.getItems);
router.post('/items', isAuth, yourController.createItem);

export default router;
```

### 2. Create Services & Repositories

```typescript
// src/repositories/yourRepository.ts
import { db } from '@/config/firestore';

export class YourRepository {
  async getItems() {
    const snapshot = await db.collection('items').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
```

### 3. Add Validation Schemas

```typescript
// src/schemas/yourSchema.ts
import { z } from 'zod';

export const createItemSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
});
```

## Security Considerations

### Production Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Enable HTTPS (automatic on Cloud Run/App Engine)
- [ ] Configure CORS for your frontend domain
- [ ] Set up rate limiting (use `express-rate-limit`)
- [ ] Enable Firestore security rules
- [ ] Set up monitoring and logging
- [ ] Review and limit IAM permissions
- [ ] Enable DDoS protection
- [ ] Set up Cloud Armor (optional)

### Firestore Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /refresh_tokens/{tokenId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Useful Commands

```bash
# Check TypeScript errors
npm run build

# Format code (if prettier is configured)
npm run format

# Lint code (if eslint is configured)
npm run lint

# View Firestore data
gcloud firestore databases list
```

## Troubleshooting

### Common Issues

**"Error: Could not load the default credentials"**
- Run: `gcloud auth application-default login`
- Make sure GOOGLE_CLOUD_PROJECT is set in .env

**"Permission denied" errors**
- Check Firestore security rules
- Verify your service account has proper IAM roles

**Build errors**
- Run: `npm install` to ensure all dependencies are installed
- Check TypeScript version compatibility

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Check the [documentation](https://cloud.google.com/firestore/docs)
- Review existing issues
- Create a new issue with detailed information

---

**Built with ❤️ for the Node.js and Google Cloud community**