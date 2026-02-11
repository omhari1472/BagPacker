import { Environment } from './environment.interface';

/**
 * Development Environment Configuration
 * 
 * This file contains configuration for local development.
 * Update the values below with your actual development credentials.
 */
export const environment: Environment = {
  production: false,
  apiUrl: 'http://localhost:8787/api',
  razorpayKey: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay test key
  googleClientId: '123456789-abcdefghijklmnop.apps.googleusercontent.com', // Replace with your Google OAuth Client ID
  appName: 'BagPackers',
  appVersion: '1.0.0'
};
