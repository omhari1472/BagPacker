# BagPackers Backend

Backend API for the BagPackers luggage storage platform, built with Cloudflare Workers and following Domain-Driven Design principles.

## Architecture

This backend follows a modified DDD architecture with the flow:
**Router → Controller → Repository**

- **Routes**: Define API endpoints with OpenAPI documentation using Chanfana
- **Controllers**: Handle business logic and orchestrate operations
- **Repositories**: Manage data access using Drizzle ORM
- **Services**: External service integrations (Razorpay, Google OAuth)

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **ORM**: Drizzle ORM
- **Routing**: itty-router + Chanfana (OpenAPI)
- **Validation**: Zod
- **DI**: TSyringe
- **Authentication**: JWT + bcrypt
- **Code Quality**: Biome

## Project Structure

```
src/
├── constants/          # Application constants
├── controllers/        # Business logic layer
├── exceptions/         # Custom error classes
├── infrastructure/     # DI container, types, core models
├── middlewares/        # Authentication middleware
├── models/            # Domain models
├── repository/        # Data access layer
├── routes/            # API route definitions
├── services/          # External service integrations
├── utils/             # Utility functions
└── index.ts           # Main entry point
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account
- MySQL database

### Installation

```bash
npm install
```

### Environment Variables

Copy the example file and configure your environment:

```bash
cp .dev.vars.example .dev.vars
```

Then edit `.dev.vars` with your actual credentials:

#### Database Configuration
```
DATABASE_URL=mysql://username:password@localhost:3306/bagpackers_db
```

#### JWT Configuration
Generate a secure secret for JWT tokens:
```bash
# Generate a random secret
openssl rand -base64 32
```
```
JWT_SECRET=your-generated-secret-here
```

#### Razorpay Configuration
Get your API keys from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys):
```
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

#### Google OAuth Configuration
Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8787/api/auth/google/callback
```

#### Frontend URL
```
FRONTEND_URL=http://localhost:4200
```

**Production Deployment**: For production, set sensitive values as secrets using Wrangler:
```bash
wrangler secret put DATABASE_URL
wrangler secret put JWT_SECRET
wrangler secret put RAZORPAY_KEY_SECRET
wrangler secret put GOOGLE_CLIENT_SECRET
```

### Database Setup

Generate and run migrations:

```bash
npm run migrate
npm run migrate:push
```

### Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

### Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## API Documentation

Once running, access the OpenAPI documentation at:
`http://localhost:8787/server/docs`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run migrate` - Generate database migrations
- `npm run migrate:push` - Apply migrations to database
- `npm run lint` - Check code with Biome
- `npm run format` - Format code with Biome
- `npm run lint:fix` - Fix linting issues

## License

Private
