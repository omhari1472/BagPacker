import jwt from 'jsonwebtoken';

export interface JWTPayload {
	userId: number;
	email: string;
}

/**
 * Generate JWT token for authenticated user
 * @param payload - User data to encode in token
 * @param secret - JWT secret key
 * @param expiresIn - Token expiration time (default: 1 hour)
 * @returns JWT token string
 */
export function generateToken(
	payload: JWTPayload,
	secret: string,
	expiresIn: string | number = '1h'
): string {
	if (!secret) {
		throw new Error('JWT secret is required');
	}

	return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @param secret - JWT secret key
 * @returns Decoded JWT payload
 */
export function verifyToken(token: string, secret: string): JWTPayload {
	if (!token) {
		throw new Error('Token is required');
	}

	if (!secret) {
		throw new Error('JWT secret is required');
	}

	try {
		const decoded = jwt.verify(token, secret) as JWTPayload;
		return decoded;
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new Error('Token has expired');
		}
		if (error instanceof jwt.JsonWebTokenError) {
			throw new Error('Invalid token');
		}
		throw new Error('Token verification failed');
	}
}
