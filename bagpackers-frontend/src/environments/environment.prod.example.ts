import { Environment } from './environment.interface';

/**
 * Production Environment Configuration Example
 * 
 * Copy this file to environment.prod.ts and update with your actual production values.
 * 
 * IMPORTANT: Never commit actual production credentials to version control.
 * Use environment variables or CI/CD secrets for sensitive values.
 */
export const environment: Environment = {
  production: true,
  apiUrl: 'https://bagpackers-backend.your-domain.workers.dev/api', // Replace with your production API URL
  razorpayKey: 'rzp_live_YOUR_KEY_HERE', // Replace with your Razorpay live key
  googleClientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com', // Replace with your Google OAuth Client ID
  appName: 'BagPackers',
  appVersion: '1.0.0'
};
