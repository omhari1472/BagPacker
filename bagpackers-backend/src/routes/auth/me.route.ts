import { fromIttyRouter } from 'chanfana';
import { Router } from 'itty-router';
import { CustomOpenAPIRoute } from '@infrastructure/customAPIRoute';
import type { IAuthRequest } from '@infrastructure/core.model';
import { container } from '@infrastructure/di/container';
import { AuthController } from '@controllers/auth/auth.controller';
import { TOKENS } from '@infrastructure/types';
import { withAuth } from '@middlewares/auth.middleware';
import { getSuccessApiResponse, getErrorApiResponse } from '@utils/Response.utils';
import {
	AuthenticationException,
	UserNotFoundException,
} from '@exceptions/auth.exceptions';
import { BadRequestError } from '@exceptions/core.exceptions';

const router = Router({
	base: '/auth',
});

export const meRouter = fromIttyRouter(router, {
	base: '/auth',
});

/**
 * @route   GET /auth/me
 * @desc    Get current authenticated user
 * @access  Protected
 */
export class GetCurrentUser extends CustomOpenAPIRoute {
	schema = {
		tags: ['Authentication'],
		summary: 'Get current user',
		description: 'Retrieve the currently authenticated user information',
		security: [
			{
				BearerAuth: [],
			},
		],
		responses: {
			'200': {
				description: 'Current user retrieved successfully',
				content: {
					'application/json': {
						schema: {
							status: 'success',
							statusCode: 200,
							data: {
								id: 1,
								firstName: 'John',
								lastName: 'Doe',
								email: 'john@example.com',
								authProvider: 'local',
								createdAt: '2024-01-01T00:00:00.000Z',
							},
							error: null,
							message: 'Current user retrieved successfully',
						},
					},
				},
			},
			'401': {
				description: 'Unauthorized - invalid or missing token',
				content: {
					'application/json': {
						schema: {
							success: false,
							error: {
								code: 'MISSING_TOKEN',
								message: 'Authorization header is required',
							},
						},
					},
				},
			},
			'404': {
				description: 'User not found',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 404,
							data: null,
							error: {
								message: 'User not found',
								errorCode: 'USER_NOT_FOUND',
							},
							message: 'User not found',
						},
					},
				},
			},
		},
	};

	async handle(request: IAuthRequest, env: any, context: ExecutionContext) {
		try {
			// User ID is attached to request by auth middleware
			const userId = request.userId;

			if (!userId) {
				throw new BadRequestError('User ID not found in request');
			}

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

			const response = await authController.getCurrentUser(userId);
			return getSuccessApiResponse(response, 'Current user retrieved successfully');
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof UserNotFoundException ||
				error instanceof AuthenticationException
			) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error as Error);
		}
	}
}

meRouter.get('/me', withAuth, GetCurrentUser);
