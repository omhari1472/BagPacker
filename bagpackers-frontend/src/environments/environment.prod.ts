import { Environment } from './environment.interface';

/**
 * Production Environment Configuration
 * 
 * This file contains configuration for production deployment.
 * Update the values below with your actual production credentials.
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
