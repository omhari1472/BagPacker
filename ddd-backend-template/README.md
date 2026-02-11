# DDD Backend Template

Domain-Driven Design backend template with Cloudflare Workers, Drizzle ORM, and OpenAPI/Swagger.

## Quick Start

```bash
npm install
npm run dev
```

Visit `/server/docs` for API documentation.

## Tech Stack

- **Framework**: Cloudflare Workers
- **Database**: Drizzle ORM (MySQL)
- **API Docs**: OpenAPI/Swagger
- **DI**: TSyringe
- **Validation**: Zod
- **Code Quality**: Biome

## Project Structure

```
src/
├── controllers/        # Request handlers
├── models/            # Domain models
├── repository/        # Data access
├── routes/            # API routes
├── services/          # Business logic
└── infrastructure/    # DI, types
```

See `CLAUDE.md` for detailed architecture guidelines.

