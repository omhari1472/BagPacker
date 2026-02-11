import { Environment } from './environment.interface';

/**
 * Example Environment Configuration
 * 
 * Copy this file to create your environment files:
 * - environment.ts (for development)
 * - environment.prod.ts (for production)
 * 
 * Then update with your actual values.
 */
export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:8787/api',
  razorpayKey: 'rzp_test_YOUR_KEY_HERE', // Get from https://dashboard.razorpay.com/app/keys
  googleClientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com', // Get from Google Cloud Console
  appName: 'BagPackers',
  appVersion: '1.0.0'
};
