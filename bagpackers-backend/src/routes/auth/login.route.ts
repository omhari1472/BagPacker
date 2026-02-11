import { fromIttyRouter } from 'chanfana';
import { Router } from 'itty-router';
import { z } from 'zod';
import { CustomOpenAPIRoute } from '@infrastructure/customAPIRoute';
import type { IAuthRequest } from '@infrastructure/core.model';
import { container } from '@infrastructure/di/container';
import { AuthController } from '@controllers/auth/auth.controller';
import { TOKENS } from '@infrastructure/types';
import { getSuccessApiResponse, getErrorApiResponse } from '@utils/Response.utils';
import {
	AuthenticationException,
	InvalidCredentialsException,
} from '@exceptions/auth.exceptions';
import { BadRequestError } from '@exceptions/core.exceptions';

const router = Router({
	base: '/auth',
});

export const loginRouter = fromIttyRouter(router, {
	base: '/auth',
});

// Login User Schema
const LoginUserSchema = z.object({
	email: z.string().email().describe('User email address'),
	password: z.string().min(1).describe('User password'),
});

export type ILoginUserSchema = z.infer<typeof LoginUserSchema>;

/**
 * @route   POST /auth/login
 * @desc    Login user with email and password
 * @access  Public
 */
export class LoginUser extends CustomOpenAPIRoute {
	schema = {
		tags: ['Authentication'],
		summary: 'Login user',
		description: 'Authenticate user with email and password credentials',
		request: {
			body: {
				content: {
					'application/json': {
						schema: LoginUserSchema,
					},
				},
			},
		},
		responses: {
			'200': {
				description: 'User logged in successfully',
				content: {
					'application/json': {
						schema: {
							status: 'success',
							statusCode: 200,
							data: {
								token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
								user: {
									id: 1,
									firstName: 'John',
									lastName: 'Doe',
									email: 'john@example.com',
									authProvider: 'local',
								},
							},
							error: null,
							message: 'User logged in successfully',
						},
					},
				},
			},
			'401': {
				description: 'Unauthorized - invalid credentials',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 401,
							data: null,
							error: {
								message: 'Invalid email or password',
								errorCode: 'INVALID_CREDENTIALS',
							},
							message: 'Invalid email or password',
						},
					},
				},
			},
		},
	};

	async handle(request: IAuthRequest, env: any, context: ExecutionContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		try {
			const payload = data.body;

			// Get JWT secret from environment
			const jwtSecret = env.JWT_SECRET;
			if (!jwtSecret) {
				throw new BadRequestError('JWT_SECRET is not configured');
			}

			// Get AuthController from DI container
			const authController = new AuthController(
				container.resolve(TOKENS.USER_REPOSITORY),
				container.resolve(TOKENS.GOOGLE_OAUTH_SERVICE),
				jwtSecret
			);

			const response = await authController.loginUser(payload);
			return getSuccessApiResponse(response, 'User logged in successfully');
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof InvalidCredentialsException ||
				error instanceof AuthenticationException
			) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error as Error);
		}
	}
}

loginRouter.post('/login', LoginUser);
