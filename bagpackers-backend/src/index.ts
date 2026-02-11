import 'reflect-metadata';
import { fromHono } from 'chanfana';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { initializeDatabase, isDatabaseInitialized } from './repository/repository';
import { setupDependencyInjection } from './infrastructure/di/container';
import type { Env } from './infrastructure/types';
import { BaseException } from './exceptions/core.exceptions';

// Create Hono app with environment bindings
const app = new Hono<{
	Bindings: Env;
}>();

// Global flag to track if DI has been initialized
let isDIInitialized = false;

// Middleware to initialize database connection and dependency injection
app.use('*', async (c, next) => {
	// Initialize database if not already initialized
	if (!isDatabaseInitialized()) {
		const databaseUrl = c.env.DATABASE_URL;
		if (!databaseUrl) {
			return c.json(
				{
					success: false,
					error: {
						code: 'CONFIG_ERROR',
						message: 'DATABASE_URL environment variable is not configured',
					},
				},
				500
			);
		}
		try {
			initializeDatabase(databaseUrl);
		} catch (error) {
			return c.json(
				{
					success: false,
					error: {
						code: 'DB_CONNECTION_ERROR',
						message: 'Failed to initialize database connection',
						details: error instanceof Error ? error.message : 'Unknown error',
					},
				},
				500
			);
		}
	}

	// Initialize dependency injection container
	if (!isDIInitialized) {
		try {
			setupDependencyInjection(c.env);
			isDIInitialized = true;
		} catch (error) {
			return c.json(
				{
					success: false,
					error: {
						code: 'DI_INITIALIZATION_ERROR',
						message: 'Failed to initialize dependency injection',
						details: error instanceof Error ? error.message : 'Unknown error',
					},
				},
				500
			);
		}
	}

	await next();
});

// Configure CORS
app.use(
	'/*',
	cors({
		origin: (origin, c) => {
			// Allow requests from configured frontend URL or any origin in development
			const frontendUrl = c.env.FRONTEND_URL;
			if (frontendUrl && origin === frontendUrl) {
				return frontendUrl;
			}
			// Allow localhost for development
			if (origin?.includes('localhost') || origin?.includes('127.0.0.1')) {
				return origin;
			}
			// Default to allowing the origin (can be restricted in production)
			return origin || '*';
		},
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		exposeHeaders: ['Content-Type'],
		credentials: true,
		maxAge: 86400, // 24 hours
	})
);

// Create OpenAPI router
const openapi = fromHono(app, {
	docs_url: '/server/docs',
	schema: {
		info: {
			title: 'BagPackers API',
			version: '1.0.0',
			description:
				'API for BagPackers luggage storage platform. This API provides endpoints for user authentication, booking management, payment processing, and partner registration.',
		},
		servers: [
			{
				url: 'http://localhost:8787',
				description: 'Development server',
			},
		],
		tags: [
			{
				name: 'Authentication',
				description: 'User authentication and registration endpoints',
			},
			{
				name: 'Bookings',
				description: 'Luggage storage booking management endpoints',
			},
			{
				name: 'Payments',
				description: 'Payment processing endpoints using Razorpay',
			},
			{
				name: 'Partners',
				description: 'Partner registration and management endpoints',
			},
		],
		security: [
			{
				BearerAuth: [],
			},
		],
	},
});

// Register security scheme for JWT authentication
openapi.registry.registerComponent('securitySchemes', 'BearerAuth', {
	type: 'http',
	scheme: 'bearer',
	bearerFormat: 'JWT',
	description: 'JWT token obtained from login or registration endpoints',
});

// Health check endpoint
app.get('/health', (c) => {
	return c.json({
		status: 'ok',
		message: 'BagPackers API is running',
		timestamp: new Date().toISOString(),
		database: isDatabaseInitialized() ? 'connected' : 'not connected',
		dependencyInjection: isDIInitialized ? 'initialized' : 'not initialized',
	});
});

// Import and register routes
import { registerRouter } from './routes/auth/register.route';
import { loginRouter } from './routes/auth/login.route';
import { oauthRouter } from './routes/auth/oauth.route';
import { meRouter } from './routes/auth/me.route';
import { createBookingRouter } from './routes/booking/create-booking.route';
import { getBookingsRouter } from './routes/booking/get-bookings.route';
import { getLocationsRouter } from './routes/booking/get-locations.route';
import { createOrderRouter } from './routes/payment/create-order.route';
import { verifyPaymentRouter } from './routes/payment/verify-payment.route';
import { registerPartnerRouter } from './routes/partner/register-partner.route';

// Register authentication routes
openapi.route('/api/auth', registerRouter);
openapi.route('/api/auth', loginRouter);
openapi.route('/api/auth', oauthRouter);
openapi.route('/api/auth', meRouter);

// Register booking routes
openapi.route('/api/bookings', createBookingRouter);
openapi.route('/api/bookings', getBookingsRouter);
openapi.route('/api', getLocationsRouter);

// Register payment routes
openapi.route('/api/payments', createOrderRouter);
openapi.route('/api/payments', verifyPaymentRouter);

// Register partner routes
openapi.route('/api/partners', registerPartnerRouter);

// Global error handler - must be registered after all routes
app.onError((err, c) => {
	console.error('Error occurred:', err);

	// Handle custom exceptions
	if (err instanceof BaseException) {
		return c.json(
			{
				success: false,
				error: {
					code: err.errorCode,
					message: err.message,
				},
			},
			err.statusCode as any
		);
	}

	// Handle validation errors from Zod
	if (err.name === 'ZodError') {
		return c.json(
			{
				success: false,
				error: {
					code: 'VALIDATION_ERROR',
					message: 'Request validation failed',
					details: err.message,
				},
			},
			400 as any
		);
	}

	// Handle generic errors
	return c.json(
		{
			success: false,
			error: {
				code: 'INTERNAL_SERVER_ERROR',
				message: err.message || 'An unexpected error occurred',
			},
		},
		500 as any
	);
});

export default app;
