// Environment variables interface
export interface Env {
	DATABASE_URL: string;
	JWT_SECRET: string;
	RAZORPAY_KEY_ID: string;
	RAZORPAY_KEY_SECRET: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_REDIRECT_URI: string;
	FRONTEND_URL: string;
}

// Dependency injection tokens
export const TOKENS = {
	// Repositories
	USER_REPOSITORY: Symbol('UserRepository'),
	BOOKING_REPOSITORY: Symbol('BookingRepository'),
	PAYMENT_REPOSITORY: Symbol('PaymentRepository'),
	PARTNER_REPOSITORY: Symbol('PartnerRepository'),
	LOCATION_REPOSITORY: Symbol('LocationRepository'),

	// Services
	RAZORPAY_SERVICE: Symbol('RazorpayService'),
	GOOGLE_OAUTH_SERVICE: Symbol('GoogleOAuthService'),

	// Controllers
	AUTH_CONTROLLER: Symbol('AuthController'),
	BOOKING_CONTROLLER: Symbol('BookingController'),
	PAYMENT_CONTROLLER: Symbol('PaymentController'),
	PARTNER_CONTROLLER: Symbol('PartnerController'),
};
