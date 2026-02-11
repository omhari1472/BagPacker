import type { IRequest } from 'itty-router';

export interface IAuthRequest extends IRequest {
	userId?: string;
	user?: {
		id: string;
		email: string;
		role?: string;
	};
}

