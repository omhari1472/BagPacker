import type { IAuthRequest } from 'infrastructure/core.model';
import { json } from 'itty-router';

export async function withAuth(request: IAuthRequest): Promise<Response | void> {
	// Extract token from Authorization header
	const authHeader = request.headers.get('Authorization');
	
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return json({ error: 'Unauthorized', message: 'Missing or invalid authorization token' }, { status: 401 });
	}

	const token = authHeader.substring(7);
	
	// TODO: Implement JWT verification logic
	// For now, setting a mock userId
	// In production, verify the token and extract user information
	request.userId = 'mock-user-id';
	request.user = {
		id: 'mock-user-id',
		email: 'user@example.com',
	};

	// Continue to the next handler
}

