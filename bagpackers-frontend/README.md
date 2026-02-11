# BagPackers Frontend

Angular 20+ frontend application for the BagPackers luggage storage platform.

## Project Structure

```
src/
├── app/
│   ├── core/                 # Core functionality (guards, interceptors, services)
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── services/        # Core services (auth, storage)
│   │   └── models/          # Core data models
│   ├── features/            # Feature modules
│   │   ├── auth/           # Authentication (login, signup)
│   │   ├── booking/        # Booking management
│   │   ├── payment/        # Payment processing
│   │   ├── partner/        # Partner registration
│   │   └── landing/        # Landing page
│   ├── shared/             # Shared components, directives, pipes
│   ├── app.config.ts       # Application configuration
│   └── app.routes.ts       # Route definitions
├── environments/           # Environment configurations
└── assets/                # Static assets
```

## Prerequisites

- Node.js (v20.19.0 or v22.12.0 or >=24.0.0)
- npm (>=8.0.0)
- Angular CLI (v20.3.9)

## Installation

```bash
npm install
```

## Environment Configuration

The application uses environment-specific configuration files for different deployment scenarios.

### Quick Setup

1. Update `src/environments/environment.ts` for development:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8787/api',
     razorpayKey: 'rzp_test_YOUR_KEY_HERE',
     googleClientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
     appName: 'BagPackers',
     appVersion: '1.0.0'
   };
   ```

2. Update `src/environments/environment.prod.ts` for production:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-api.workers.dev/api',
     razorpayKey: 'rzp_live_YOUR_KEY_HERE',
     googleClientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
     appName: 'BagPackers',
     appVersion: '1.0.0'
   };
   ```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `apiUrl` | Backend API base URL | `http://localhost:8787/api` |
| `razorpayKey` | Razorpay Key ID (test/live) | `rzp_test_1234567890abcd` |
| `googleClientId` | Google OAuth Client ID | `123-abc.apps.googleusercontent.com` |

📖 **For detailed setup instructions**, see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md)

## Development Server

To start a local development server:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

## Building

### Development Build
```bash
ng build
```

### Production Build
```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

## Running Tests

### Unit Tests
```bash
ng test
```

### End-to-End Tests
```bash
ng e2e
```

## Code Scaffolding

Generate new components, services, etc.:

```bash
# Generate a component
ng generate component features/auth/components/login

# Generate a service
ng generate service core/services/auth

# Generate a guard
ng generate guard core/guards/auth
```

## Key Features

- **Standalone Components**: Uses Angular's standalone component architecture
- **Zoneless**: Configured without zone.js for better performance
- **TypeScript Strict Mode**: Enabled for type safety
- **Server-Side Rendering**: SSR enabled for better SEO and performance
- **Path Aliases**: Configured for cleaner imports (@app, @core, @features, @shared, @environments)
- **Angular Material**: UI component library
- **RxJS**: Reactive programming
- **date-fns**: Date manipulation library

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [Angular Material](https://material.angular.io)
