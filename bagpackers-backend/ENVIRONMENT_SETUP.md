# Environment Configuration Guide

This guide explains how to set up environment variables for the BagPackers backend in different environments.

## Table of Contents
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Environment Variables Reference](#environment-variables-reference)
- [Security Best Practices](#security-best-practices)

## Local Development

### Step 1: Create .dev.vars File

Copy the example file:
```bash
cp .dev.vars.example .dev.vars
```

### Step 2: Configure Database

Set up your MySQL database connection string:
```
DATABASE_URL=mysql://username:password@localhost:3306/bagpackers_db
```

**Format**: `mysql://[user]:[password]@[host]:[port]/[database]`

**Example with local MySQL**:
```
DATABASE_URL=mysql://root:mypassword@localhost:3306/bagpackers_db
```

**Example with remote database**:
```
DATABASE_URL=mysql://user:pass@db.example.com:3306/bagpackers_db
```

### Step 3: Generate JWT Secret

Generate a secure random string for JWT token signing:

```bash
# Using OpenSSL (recommended)
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and set it in `.dev.vars`:
```
JWT_SECRET=your-generated-secret-here
```

### Step 4: Configure Razorpay

1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to [Dashboard → Settings → API Keys](https://dashboard.razorpay.com/app/keys)
3. Generate test keys for development
4. Add to `.dev.vars`:

```
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

**Note**: Use test keys (starting with `rzp_test_`) for development.

### Step 5: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:8787/api/auth/google/callback` (development)
   - `https://your-domain.com/api/auth/google/callback` (production)
7. Copy the Client ID and Client Secret
8. Add to `.dev.vars`:

```
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8787/api/auth/google/callback
```

### Step 6: Set Frontend URL

Configure the frontend URL for CORS:
```
FRONTEND_URL=http://localhost:4200
```

### Complete .dev.vars Example

```bash
# Database
DATABASE_URL=mysql://root:password@localhost:3306/bagpackers_db

# JWT
JWT_SECRET=xK8vN2mP9qR4sT7wY1zA3bC5dE6fG8hJ0kL2mN4oP6qR8sT0uV2wX4yZ6aB8cD0e

# Razorpay
RAZORPAY_KEY_ID=rzp_test_1234567890abcd
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8787/api/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:4200
```

## Production Deployment

### Using Cloudflare Dashboard

1. Go to your Worker in Cloudflare Dashboard
2. Navigate to **Settings** → **Variables**
3. Add environment variables:
   - For non-sensitive values: Use **Environment Variables**
   - For sensitive values: Use **Secrets** (encrypted)

### Using Wrangler CLI

Set secrets using the Wrangler CLI (recommended for sensitive data):

```bash
# Set database URL
wrangler secret put DATABASE_URL
# Enter: mysql://user:pass@host:port/database

# Set JWT secret
wrangler secret put JWT_SECRET
# Enter: your-production-jwt-secret

# Set Razorpay credentials
wrangler secret put RAZORPAY_KEY_ID
# Enter: rzp_live_your_key_id

wrangler secret put RAZORPAY_KEY_SECRET
# Enter: your_razorpay_key_secret

# Set Google OAuth credentials
wrangler secret put GOOGLE_CLIENT_ID
# Enter: your-client-id.apps.googleusercontent.com

wrangler secret put GOOGLE_CLIENT_SECRET
# Enter: your-client-secret

wrangler secret put GOOGLE_REDIRECT_URI
# Enter: https://api.yourdomain.com/api/auth/google/callback

# Set frontend URL
wrangler secret put FRONTEND_URL
# Enter: https://yourdomain.com
```

### Using wrangler.toml (Non-Sensitive Only)

For non-sensitive configuration, you can add to `wrangler.toml`:

```toml
[vars]
FRONTEND_URL = "https://yourdomain.com"
```

**⚠️ Warning**: Never commit sensitive values to `wrangler.toml` or version control!

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | MySQL database connection string | `mysql://user:pass@host:3306/db` |
| `JWT_SECRET` | Yes | Secret key for JWT token signing | `random-32-byte-base64-string` |
| `RAZORPAY_KEY_ID` | Yes | Razorpay API Key ID | `rzp_test_1234567890abcd` |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay API Key Secret | `your_secret_key` |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth Client ID | `123-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth Client Secret | `GOCSPX-your_secret` |
| `GOOGLE_REDIRECT_URI` | Yes | OAuth callback URL | `http://localhost:8787/api/auth/google/callback` |
| `FRONTEND_URL` | Yes | Frontend application URL for CORS | `http://localhost:4200` |

## Security Best Practices

### 1. Never Commit Secrets
- ✅ `.dev.vars` is in `.gitignore`
- ✅ `.env` is in `.gitignore`
- ❌ Never commit actual credentials to version control
- ✅ Only commit `.dev.vars.example` with placeholder values

### 2. Use Strong Secrets
- Generate JWT secrets with at least 32 bytes of entropy
- Use cryptographically secure random generators
- Rotate secrets periodically

### 3. Separate Environments
- Use different credentials for development, staging, and production
- Use Razorpay test keys (`rzp_test_`) in development
- Use Razorpay live keys (`rzp_live_`) only in production

### 4. Restrict Database Access
- Use database users with minimal required permissions
- Restrict database access by IP address when possible
- Use SSL/TLS for database connections in production

### 5. OAuth Configuration
- Add only necessary redirect URIs
- Use HTTPS for production redirect URIs
- Regularly review OAuth consent screen settings

### 6. Monitor and Audit
- Enable Cloudflare Workers analytics
- Monitor for unusual API usage patterns
- Set up alerts for failed authentication attempts

## Troubleshooting

### Database Connection Issues
```
Error: connect ECONNREFUSED
```
**Solution**: Check that MySQL is running and the connection string is correct.

### JWT Token Errors
```
Error: jwt malformed
```
**Solution**: Ensure JWT_SECRET is set and matches between environments.

### Razorpay Integration Issues
```
Error: Invalid API key
```
**Solution**: Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correct.

### Google OAuth Errors
```
Error: redirect_uri_mismatch
```
**Solution**: Ensure GOOGLE_REDIRECT_URI matches the authorized redirect URI in Google Cloud Console.

### CORS Issues
```
Error: CORS policy blocked
```
**Solution**: Verify FRONTEND_URL is set correctly and matches your frontend domain.

## Testing Environment Configuration

To verify your environment is configured correctly:

```bash
# Start the development server
npm run dev

# Check the logs for any environment variable errors
# The server should start without errors on http://localhost:8787

# Test the API documentation endpoint
curl http://localhost:8787/server/docs
```

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Razorpay API Documentation](https://razorpay.com/docs/api/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
