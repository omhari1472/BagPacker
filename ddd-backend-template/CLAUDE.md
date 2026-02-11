# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `wrangler dev` - Start local development server with hot reload
- `wrangler deploy` - Deploy to production
- `tsc` - Build TypeScript (outputs to ./dist)
- `npx drizzle-kit generate` - Generate database schema migrations
- `npx @biomejs/biome check` - Run linter and formatter checks
- `npx @biomejs/biome format --write` - Format code
- `npx @biomejs/biome lint --write` - Lint and auto-fix code

## Architecture Overview

This is a **Domain-Driven Design (DDD) backend template** built with TypeScript and Cloudflare Workers, featuring a clean architecture pattern.

### Core Structure

- **Framework**: Cloudflare Workers with Itty Router and Chanfana (OpenAPI)
- **Database**: Drizzle ORM with MySQL dialect
- **DI Container**: TSyringe for dependency injection
- **Auth**: JWT-based authentication middleware
- **API Documentation**: OpenAPI/Swagger via Chanfana

### Directory Structure

```
src/
├── constants/          # Application constants
├── controllers/        # Request handlers by feature (domain logic orchestration)
├── exceptions/         # Custom exception classes
├── infrastructure/     # Core models, DI container, types, custom API routes
├── middlewares/        # Auth middleware and other cross-cutting concerns
├── models/            # Domain models and data transfer objects (DTOs)
├── repository/        # Data access layer with Drizzle ORM
├── routes/            # API route definitions with OpenAPI schemas
├── services/          # Business logic services
└── utils/             # Utility functions and helpers
```

### Path Aliases

The project uses TypeScript path aliases:
- `@constants/*` → `constants/*`
- `@controllers/*` → `controllers/*`
- `@exceptions/*` → `exceptions/*`
- `@models/*` → `models/*`
- `@repository/*` → `repository/*`
- `@routes/*` → `routes/*`
- `@utils/*` → `utils/*`
- `@services/*` → `services/*`
- `@middlewares/*` → `middlewares/*`

### DDD Architecture Principles

1. **Domain Layer (Models)**: Core business entities and value objects
2. **Application Layer (Controllers)**: Orchestrates domain logic and handles requests
3. **Infrastructure Layer (Repository, Services)**: Data persistence and external integrations
4. **Presentation Layer (Routes)**: API endpoints with OpenAPI documentation

### Key Features

- **Multi-domain CORS** support for various frontend applications
- **OpenAPI documentation** available at `/server/docs`
- **Database migrations** using Drizzle Kit
- **Dependency Injection** using TSyringe for loose coupling
- **Custom exception handling** with proper error codes
- **Type-safe API** with Zod validation schemas

### Development Notes

- Uses Biome for code formatting (tabs, single quotes, trailing commas)
- Database schema is in `src/repository/schema.ts`
- Main router configuration in `src/index.ts` with all route registrations
- Authentication handled via JWT tokens in Authorization header
- Hot reload enabled for `src/` folder changes during development
- All routes extend `CustomOpenAPIRoute` for OpenAPI documentation

### Code Quality Rules

1. **Always use path aliases** instead of relative imports
2. **Follow DDD principles**: Keep domain logic in controllers/services, not in routes
3. **Use custom exceptions** for error handling with proper error codes
4. **Validate all inputs** using Zod schemas in routes
5. **Document APIs** using OpenAPI schema in route classes
6. **Use dependency injection** for services through TSyringe container
7. **Keep repository layer** focused only on data access operations
8. **Use constants** for magic strings and configuration values
9. **Follow naming conventions**: Use PascalCase for classes, camelCase for functions
10. **Write type-safe code** - avoid `any` unless absolutely necessary

### Adding New Features

1. Create domain model in `src/models/[feature]/`
2. Create repository functions in `src/repository/[feature]/`
3. Create service interface and implementation in `src/services/[feature]/`
4. Create controller functions in `src/controllers/[feature]/`
5. Create route definitions with OpenAPI schema in `src/routes/[feature]/`
6. Create custom exceptions in `src/exceptions/[feature].exceptions.ts`
7. Register routes in `src/index.ts`
8. Register services in `src/infrastructure/di/container.ts` (if using DI)

