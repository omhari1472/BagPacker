import { fromIttyRouter } from 'chanfana';
import { Router } from 'itty-router';
import { z } from 'zod';
import { CustomOpenAPIRoute } from '@infrastructure/customAPIRoute';
import type { IAuthRequest } from '@infrastructure/core.model';
import { container } from '@infrastructure/di/container';
import { AuthController } from '@controllers/auth/auth.controller';
import { TOKENS } from '@infrastructure/types';
import { getSuccessApiResponse, getErrorApiResponse } from '@utils/Response.utils';
import { AuthenticationException } from '@exceptions/auth.exceptions';
import { BadRequestError } from '@exceptions/core.exceptions';

const router = Router({
	base: '/auth',
});

export const oauthRouter = fromIttyRouter(router, {
	base: '/auth',
});

// Google OAuth Schema
const GoogleOAuthSchema = z.object({
	code: z.string().min(1).describe('Google OAuth authorization code'),
	redirectUri: z.string().url().describe('OAuth redirect URI'),
});

export type IGoogleOAuthSchema = z.infer<typeof GoogleOAuthSchema>;

/**
 * @route   POST /auth/google
 * @desc    Handle Google OAuth callback
 * @access  Public
 */
export class GoogleOAuthCallback extends CustomOpenAPIRoute {
	schema = {
		tags: ['Authentication'],
		summary: 'Google OAuth callback',
		description: 'Handle Google OAuth authentication callback and create or retrieve user account',
		request: {
			body: {
				content: {
					'application/json': {
						schema: GoogleOAuthSchema,
					},
				},
			},
		},
		responses: {
			'200': {
				description: 'Google OAuth authentication successful',
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
									authProvider: 'google',
								},
							},
							error: null,
							message: 'Google OAuth authentication successful',
						},
					},
				},
			},
			'400': {
				description: 'Bad request - invalid authorization code',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 400,
							data: null,
							error: {
								message: 'Authorization code and redirect URI are required',
								errorCode: 'BAD_REQUEST',
							},
							message: 'Authorization code and redirect URI are required',
						},
					},
				},
			},
			'401': {
				description: 'Unauthorized - OAuth authentication failed',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 401,
							data: null,
							error: {
								message: 'Google OAuth authentication failed',
								errorCode: 'AUTH_ERROR',
							},
							message: 'Google OAuth authentication failed',
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

			const response = await authController.googleOAuthCallback(payload);
			return getSuccessApiResponse(response, 'Google OAuth authentication successful');
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof AuthenticationException
			) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error as Error);
		}
	}
}

oauthRouter.post('/google', GoogleOAuthCallback);
