import type { IRequest } from 'itty-router';

export interface IAuthRequest extends IRequest {
	userId?: number;
	user?: {
		id: number;
		email: string;
	};
	env?: any;
}
