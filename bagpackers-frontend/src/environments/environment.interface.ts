/**
 * Environment Configuration Interface
 * 
 * This interface defines the structure of environment configuration objects.
 * It ensures type safety across all environment files.
 */
export interface Environment {
  /**
   * Indicates whether the application is running in production mode
   */
  production: boolean;

  /**
   * Base URL for the backend API
   * @example 'http://localhost:8787/api' (development)
   * @example 'https://bagpackers-backend.workers.dev/api' (production)
   */
  apiUrl: string;

  /**
   * Razorpay Key ID for payment processing
   * Use test key (rzp_test_*) for development
   * Use live key (rzp_live_*) for production
   * @example 'rzp_test_1234567890abcd'
   */
  razorpayKey: string;

  /**
   * Google OAuth 2.0 Client ID
   * @example '123456789-abcdefghijklmnop.apps.googleusercontent.com'
   */
  googleClientId: string;

  /**
   * Application name
   */
  appName: string;

  /**
   * Application version
   */
  appVersion: string;
}
