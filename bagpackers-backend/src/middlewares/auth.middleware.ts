import type { IAuthRequest } from '../infrastructure/core.model';
import { verifyToken } from '../utils/jwt.utils';
import { AuthenticationException } from '../exceptions/auth.exceptions';
import { json } from 'itty-router';

/**
 * Authentication middleware to validate JWT tokens
 * Extracts and verifies JWT token from Authorization header
 * Attaches user ID to request context for downstream handlers
 * 
 * @param request - The incoming request with Authorization header
 * @returns Response with error if authentication fails, void to continue
 */
export async function withAuth(request: IAuthRequest): Promise<Response | void> {
	try {
		// Extract token from Authorization header
		const authHeader = request.headers.get('Authorization');
		
		if (!authHeader) {
			return json(
				{ 
					success: false,
					error: {
						code: 'MISSING_TOKEN',
						message: 'Authorization header is required'
					}
				}, 
				{ status: 401 }
			);
		}

		if (!authHeader.startsWith('Bearer ')) {
			return json(
				{ 
					success: false,
					error: {
						code: 'INVALID_TOKEN_FORMAT',
						message: 'Authorization header must start with "Bearer "'
					}
				}, 
				{ status: 401 }
			);
		}

		// Extract token (remove "Bearer " prefix)
		const token = authHeader.substring(7);

		if (!token) {
			return json(
				{ 
					success: false,
					error: {
						code: 'MISSING_TOKEN',
						message: 'Token is required'
					}
				}, 
				{ status: 401 }
			);
		}

		// Get JWT secret from environment
		const jwtSecret = request.env?.JWT_SECRET;
		
		if (!jwtSecret) {
			console.error('JWT_SECRET is not configured in environment');
			return json(
				{ 
					success: false,
					error: {
						code: 'SERVER_ERROR',
						message: 'Authentication service is not properly configured'
					}
				}, 
				{ status: 500 }
			);
		}

		// Verify and decode JWT token
		try {
			const decoded = verifyToken(token, jwtSecret);
			
			// Attach user information to request context
			request.userId = decoded.userId;
			request.user = {
				id: decoded.userId,
				email: decoded.email,
			};

			// Continue to the next handler
			return;
		} catch (error) {
			// Handle token verification errors
			const errorMessage = error instanceof Error ? error.message : 'Token verification failed';
			
			// Handle expired token
			if (errorMessage.includes('expired')) {
				return json(
					{ 
						success: false,
						error: {
							code: 'TOKEN_EXPIRED',
							message: 'Token has expired. Please login again.'
						}
					}, 
					{ status: 401 }
				);
			}
			
			// Handle invalid token
			if (errorMessage.includes('Invalid token') || errorMessage.includes('invalid')) {
				return json(
					{ 
						success: false,
						error: {
							code: 'INVALID_TOKEN',
							message: 'Invalid token. Please login again.'
						}
					}, 
					{ status: 401 }
				);
			}
			
			// Handle other token errors
			return json(
				{ 
					success: false,
					error: {
						code: 'AUTH_ERROR',
						message: errorMessage
					}
				}, 
				{ status: 401 }
			);
		}
	} catch (error) {
		// Handle unexpected errors
		console.error('Authentication middleware error:', error);
		return json(
			{ 
				success: false,
				error: {
					code: 'AUTH_ERROR',
					message: 'Authentication failed'
				}
			}, 
			{ status: 401 }
		);
	}
}
