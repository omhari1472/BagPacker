# Quick Start Guide

Get the BagPackers backend up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- MySQL database running
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

Copy the environment template:

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your configuration:

```bash
# Minimum required configuration for local development
DATABASE_URL=mysql://root:password@localhost:3306/bagpackers_db
JWT_SECRET=$(openssl rand -base64 32)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8787/api/auth/google/callback
FRONTEND_URL=http://localhost:4200
```

### Quick JWT Secret Generation

```bash
# macOS/Linux
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Step 3: Set Up Database

Create the database:

```sql
CREATE DATABASE bagpackers_db;
```

Generate and apply migrations:

```bash
npm run migrate
npm run migrate:push
```

## Step 4: Start Development Server

```bash
npm run dev
```

The API will be available at: `http://localhost:8787`

## Step 5: Verify Installation

Test the health endpoint:

```bash
curl http://localhost:8787/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "BagPackers API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "dependencyInjection": "initialized"
}
```

View API documentation:
```
http://localhost:8787/server/docs
```

## Common Issues

### Database Connection Failed

**Error**: `Failed to initialize database connection`

**Solution**: 
- Verify MySQL is running: `mysql -u root -p`
- Check DATABASE_URL format: `mysql://user:password@host:port/database`
- Ensure database exists: `CREATE DATABASE bagpackers_db;`

### Missing Environment Variables

**Error**: `DATABASE_URL environment variable is not configured`

**Solution**: 
- Ensure `.dev.vars` file exists
- Verify all required variables are set
- Restart the development server

### Port Already in Use

**Error**: `Address already in use`

**Solution**:
- Stop other processes using port 8787
- Or change the port in wrangler.toml

## Next Steps

1. **Configure External Services**:
   - Set up Razorpay test account
   - Configure Google OAuth credentials
   - See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed instructions

2. **Test API Endpoints**:
   - Use the OpenAPI docs at `/server/docs`
   - Import the OpenAPI spec into Postman/Insomnia
   - Test authentication, booking, and payment flows

3. **Deploy to Production**:
   - See [README.md](./README.md) for deployment instructions
   - Configure production secrets using Wrangler CLI
   - Set up production database

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build TypeScript

# Database
npm run migrate          # Generate migrations
npm run migrate:push     # Apply migrations

# Code Quality
npm run lint             # Check code
npm run format           # Format code
npm run lint:fix         # Fix linting issues

# Deployment
npm run deploy           # Deploy to Cloudflare Workers
```

## Getting Help

- Check [README.md](./README.md) for full documentation
- See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed environment configuration
- Review API docs at `/server/docs` when server is running

## Development Workflow

1. Make code changes
2. Server auto-reloads (hot reload enabled)
3. Test endpoints using API docs or curl
4. Check logs in terminal
5. Commit changes

Happy coding! 🚀
