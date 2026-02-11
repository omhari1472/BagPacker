# Environment Configuration Checklist

Use this checklist to verify your environment is properly configured.

## ✅ Pre-Development Checklist

### 1. Files Created
- [ ] `.dev.vars` file exists (copied from `.dev.vars.example`)
- [ ] `.dev.vars` is listed in `.gitignore`
- [ ] All placeholder values in `.dev.vars` have been replaced with actual values

### 2. Database Configuration
- [ ] MySQL server is running
- [ ] Database `bagpackers_db` has been created
- [ ] `DATABASE_URL` is set in `.dev.vars`
- [ ] Database connection string format is correct: `mysql://user:password@host:port/database`
- [ ] Database user has proper permissions (CREATE, SELECT, INSERT, UPDATE, DELETE)

### 3. JWT Configuration
- [ ] `JWT_SECRET` is set in `.dev.vars`
- [ ] JWT secret is at least 32 characters long
- [ ] JWT secret is randomly generated (not using default value)
- [ ] JWT secret is different between development and production

### 4. Razorpay Configuration
- [ ] Razorpay account created at https://razorpay.com
- [ ] Test API keys generated from dashboard
- [ ] `RAZORPAY_KEY_ID` is set in `.dev.vars` (starts with `rzp_test_`)
- [ ] `RAZORPAY_KEY_SECRET` is set in `.dev.vars`
- [ ] Razorpay webhook URL configured (if using webhooks)

### 5. Google OAuth Configuration
- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Authorized redirect URI added: `http://localhost:8787/api/auth/google/callback`
- [ ] `GOOGLE_CLIENT_ID` is set in `.dev.vars`
- [ ] `GOOGLE_CLIENT_SECRET` is set in `.dev.vars`
- [ ] `GOOGLE_REDIRECT_URI` is set in `.dev.vars`
- [ ] OAuth consent screen configured

### 6. Frontend Configuration
- [ ] `FRONTEND_URL` is set in `.dev.vars`
- [ ] Frontend URL matches your Angular dev server (default: `http://localhost:4200`)

### 7. Dependencies
- [ ] Node.js 18+ installed
- [ ] npm packages installed (`npm install`)
- [ ] Wrangler CLI available (`npx wrangler --version`)

## ✅ Post-Setup Verification

### 8. Database Migrations
- [ ] Migrations generated successfully (`npm run migrate`)
- [ ] Migrations applied to database (`npm run migrate:push`)
- [ ] All tables created in database
- [ ] No migration errors in console

### 9. Development Server
- [ ] Server starts without errors (`npm run dev`)
- [ ] Server running on `http://localhost:8787`
- [ ] Health endpoint responds: `curl http://localhost:8787/health`
- [ ] Health check shows `database: "connected"`
- [ ] Health check shows `dependencyInjection: "initialized"`

### 10. API Documentation
- [ ] OpenAPI docs accessible at `http://localhost:8787/server/docs`
- [ ] All endpoints visible in documentation
- [ ] Authentication endpoints listed
- [ ] Booking endpoints listed
- [ ] Payment endpoints listed
- [ ] Partner endpoints listed

### 11. Environment Variables Loaded
- [ ] No "environment variable not configured" errors in console
- [ ] Database connection successful
- [ ] JWT middleware working
- [ ] External services initialized

## ✅ Production Deployment Checklist

### 12. Production Environment
- [ ] Production database created
- [ ] Production database URL different from development
- [ ] Secrets set using Wrangler CLI (not in wrangler.toml)
- [ ] `wrangler secret put DATABASE_URL` executed
- [ ] `wrangler secret put JWT_SECRET` executed
- [ ] `wrangler secret put RAZORPAY_KEY_SECRET` executed
- [ ] `wrangler secret put GOOGLE_CLIENT_SECRET` executed

### 13. Razorpay Production
- [ ] Razorpay account activated for live mode
- [ ] Live API keys generated (start with `rzp_live_`)
- [ ] `RAZORPAY_KEY_ID` updated to live key
- [ ] `RAZORPAY_KEY_SECRET` updated to live secret
- [ ] Webhook signature verification enabled

### 14. Google OAuth Production
- [ ] Production redirect URI added to Google Console
- [ ] Production redirect URI uses HTTPS
- [ ] OAuth consent screen published
- [ ] Scopes verified and approved

### 15. Security
- [ ] All secrets are unique and randomly generated
- [ ] No secrets committed to version control
- [ ] `.dev.vars` is in `.gitignore`
- [ ] Production secrets different from development
- [ ] Database uses SSL/TLS connection (if remote)
- [ ] CORS configured to allow only frontend domain

### 16. Deployment
- [ ] Build successful (`npm run build`)
- [ ] Deployment successful (`npm run deploy`)
- [ ] Production health check passes
- [ ] Production API documentation accessible
- [ ] Test authentication flow in production
- [ ] Test payment flow in production (with test mode first)

## 🔍 Troubleshooting

If any checklist item fails, refer to:
- [QUICKSTART.md](./QUICKSTART.md) - Quick setup guide
- [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) - Detailed configuration guide
- [README.md](./README.md) - Full documentation

## 📝 Notes

- Keep this checklist updated as you add new environment variables
- Review this checklist before each deployment
- Share this checklist with new team members

## ✨ All Done?

If all items are checked, you're ready to start developing! 🚀

Run the development server:
```bash
npm run dev
```

Access the API:
```
http://localhost:8787
```

View API docs:
```
http://localhost:8787/server/docs
```
