# Frontend Environment Configuration Guide

This guide explains how to configure environment variables for the BagPackers Angular frontend application.

## Table of Contents
- [Overview](#overview)
- [Environment Files](#environment-files)
- [Configuration Steps](#configuration-steps)
- [Environment Variables Reference](#environment-variables-reference)
- [Building for Different Environments](#building-for-different-environments)
- [Security Best Practices](#security-best-practices)

## Overview

The BagPackers frontend uses Angular's environment configuration system to manage different settings for development and production environments. This allows you to:

- Use different API endpoints for local development vs production
- Use test payment keys in development and live keys in production
- Configure OAuth credentials per environment
- Manage feature flags and app metadata

## Environment Files

The project includes the following environment files in `src/environments/`:

| File | Purpose | Committed to Git |
|------|---------|------------------|
| `environment.example.ts` | Template with placeholder values | ✅ Yes |
| `environment.ts` | Development configuration | ✅ Yes (with placeholders) |
| `environment.prod.ts` | Production configuration | ✅ Yes (with placeholders) |

**Note**: While these files are committed, they should only contain placeholder values. Actual credentials should be managed through CI/CD secrets or build-time environment variable replacement.

## Configuration Steps

### Step 1: Update Development Environment

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8787/api',
  razorpayKey: 'rzp_test_YOUR_ACTUAL_TEST_KEY',
  googleClientId: 'YOUR_ACTUAL_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  appName: 'BagPackers',
  appVersion: '1.0.0'
};
```

### Step 2: Update Production Environment

Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://bagpackers-backend.your-domain.workers.dev/api',
  razorpayKey: 'rzp_live_YOUR_ACTUAL_LIVE_KEY',
  googleClientId: 'YOUR_ACTUAL_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  appName: 'BagPackers',
  appVersion: '1.0.0'
};
```

### Step 3: Get Razorpay Keys

1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to [Dashboard → Settings → API Keys](https://dashboard.razorpay.com/app/keys)
3. For development:
   - Generate **Test Keys** (starts with `rzp_test_`)
   - Add to `environment.ts`
4. For production:
   - Generate **Live Keys** (starts with `rzp_live_`)
   - Add to `environment.prod.ts` or CI/CD secrets

### Step 4: Get Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized JavaScript origins:
   - `http://localhost:4200` (development)
   - `https://yourdomain.com` (production)
7. Add authorized redirect URIs:
   - `http://localhost:4200/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
8. Copy the Client ID
9. Add to both environment files

### Step 5: Configure Backend API URL

**Development**:
- Default: `http://localhost:8787/api`
- This assumes your backend is running locally on port 8787

**Production**:
- Update with your actual Cloudflare Workers URL
- Format: `https://your-worker-name.your-subdomain.workers.dev/api`
- Or use your custom domain: `https://api.yourdomain.com/api`

## Environment Variables Reference

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `production` | boolean | Yes | Indicates if running in production mode | `false` (dev), `true` (prod) |
| `apiUrl` | string | Yes | Backend API base URL | `http://localhost:8787/api` |
| `razorpayKey` | string | Yes | Razorpay Key ID for payment processing | `rzp_test_1234567890abcd` |
| `googleClientId` | string | Yes | Google OAuth 2.0 Client ID | `123-abc.apps.googleusercontent.com` |
| `appName` | string | No | Application name | `BagPackers` |
| `appVersion` | string | No | Application version | `1.0.0` |

## Building for Different Environments

### Development Build

```bash
# Build with development configuration
ng build

# Or explicitly specify
ng build --configuration development
```

This uses `environment.ts` and creates a development build in `dist/`.

### Production Build

```bash
# Build with production configuration
ng build --configuration production

# Or use the shorthand
ng build --prod
```

This uses `environment.prod.ts` and creates an optimized production build with:
- AOT (Ahead-of-Time) compilation
- Minification and tree-shaking
- Source map generation (optional)
- Service worker (if configured)

### Serving Locally

```bash
# Development server (uses environment.ts)
ng serve

# Production mode locally (uses environment.prod.ts)
ng serve --configuration production
```

## Using Environment Variables in Code

Import and use environment variables in your components and services:

```typescript
import { environment } from '../environments/environment';

export class MyService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}
  
  getData() {
    return this.http.get(`${this.apiUrl}/data`);
  }
}
```

### Example: Payment Service

```typescript
import { environment } from '../../../environments/environment';

export class PaymentService {
  initiatePayment(amount: number, orderId: string) {
    const options = {
      key: environment.razorpayKey,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      order_id: orderId,
      // ... other options
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
  }
}
```

## Security Best Practices

### 1. Never Commit Actual Credentials

❌ **Don't do this**:
```typescript
razorpayKey: 'rzp_live_actual_secret_key_12345'
```

✅ **Do this instead**:
```typescript
razorpayKey: 'rzp_live_YOUR_KEY_HERE' // Placeholder
```

Then use CI/CD to replace at build time.

### 2. Use Environment Variable Replacement in CI/CD

For production deployments, use your CI/CD pipeline to replace placeholders:

**GitHub Actions Example**:
```yaml
- name: Replace environment variables
  run: |
    sed -i "s|rzp_live_YOUR_KEY_HERE|${{ secrets.RAZORPAY_LIVE_KEY }}|g" src/environments/environment.prod.ts
    sed -i "s|YOUR_ACTUAL_GOOGLE_CLIENT_ID|${{ secrets.GOOGLE_CLIENT_ID }}|g" src/environments/environment.prod.ts
```

**Cloudflare Pages Example**:
Use environment variables in the Pages dashboard and a build script to inject them.

### 3. Separate Test and Live Keys

- **Development**: Always use Razorpay test keys (`rzp_test_`)
- **Production**: Only use Razorpay live keys (`rzp_live_`)
- Never mix test and live keys

### 4. Restrict OAuth Origins

In Google Cloud Console:
- Only add necessary authorized origins
- Use HTTPS for production origins
- Regularly review and remove unused origins

### 5. API URL Security

- Always use HTTPS for production API URLs
- Verify SSL certificates
- Use CORS properly configured on the backend

### 6. Client-Side Security Considerations

⚠️ **Important**: All values in environment files are bundled into the client-side JavaScript and are visible to users. Never store:
- API secrets or private keys
- Database credentials
- Backend authentication tokens
- Any sensitive server-side configuration

Only store:
- Public API endpoints
- Public API keys (like Razorpay Key ID, which is meant to be public)
- OAuth Client IDs (which are public)
- Feature flags
- App metadata

## Deployment Configurations

### Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set build output directory: `dist/bagpackers-frontend/browser`
4. Add environment variables in Pages dashboard:
   - `RAZORPAY_KEY`
   - `GOOGLE_CLIENT_ID`
   - `API_URL`

### Vercel

1. Import your repository
2. Framework preset: Angular
3. Build command: `npm run build`
4. Output directory: `dist/bagpackers-frontend/browser`
5. Add environment variables in project settings

### Netlify

1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist/bagpackers-frontend/browser`
4. Add environment variables in site settings

## Troubleshooting

### Issue: API calls failing with CORS errors

**Solution**: 
- Verify `apiUrl` matches your backend URL exactly
- Check backend CORS configuration includes your frontend domain
- Ensure backend is running and accessible

### Issue: Razorpay not loading

**Solution**:
- Verify `razorpayKey` is correct and matches the environment (test vs live)
- Check that Razorpay script is loaded in `index.html`
- Open browser console for specific error messages

### Issue: Google OAuth not working

**Solution**:
- Verify `googleClientId` is correct
- Check authorized JavaScript origins in Google Cloud Console
- Ensure redirect URIs are properly configured
- Check browser console for OAuth errors

### Issue: Wrong environment being used

**Solution**:
```bash
# Clear Angular cache
rm -rf .angular/cache

# Rebuild
ng build --configuration production
```

## Testing Environment Configuration

Verify your configuration is correct:

```bash
# Start development server
ng serve

# Check console output for environment info
# Navigate to http://localhost:4200
# Open browser DevTools → Console
# Type: window.environment (if exposed for debugging)
```

## Additional Resources

- [Angular Environments Documentation](https://angular.io/guide/build#configuring-application-environments)
- [Razorpay Integration Guide](https://razorpay.com/docs/payments/payment-gateway/web-integration/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)

## Quick Reference

### Development Setup Checklist

- [ ] Copy `environment.example.ts` values to `environment.ts`
- [ ] Update `apiUrl` to match local backend (default: `http://localhost:8787/api`)
- [ ] Add Razorpay test key (`rzp_test_...`)
- [ ] Add Google OAuth Client ID
- [ ] Start backend: `cd bagpackers-backend && npm run dev`
- [ ] Start frontend: `cd bagpackers-frontend && ng serve`
- [ ] Test at `http://localhost:4200`

### Production Deployment Checklist

- [ ] Update `environment.prod.ts` with production API URL
- [ ] Add Razorpay live key via CI/CD secrets
- [ ] Add Google OAuth Client ID via CI/CD secrets
- [ ] Configure authorized origins in Google Cloud Console
- [ ] Build: `ng build --configuration production`
- [ ] Deploy `dist/` folder to hosting provider
- [ ] Verify HTTPS is enabled
- [ ] Test all features in production
