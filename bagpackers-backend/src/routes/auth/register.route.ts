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
	DuplicateEmailException,
	RegistrationException,
} from '@exceptions/auth.exceptions';
import { BadRequestError } from '@exceptions/core.exceptions';

const router = Router({
	base: '/auth',
});

export const registerRouter = fromIttyRouter(router, {
	base: '/auth',
});

// Register User Schema
const RegisterUserSchema = z.object({
	firstName: z.string().min(1).describe('User first name'),
	lastName: z.string().min(1).describe('User last name'),
	email: z.string().email().describe('User email address'),
	password: z.string().min(6).describe('User password (minimum 6 characters)'),
	confirmPassword: z.string().min(6).describe('Password confirmation'),
});

export type IRegisterUserSchema = z.infer<typeof RegisterUserSchema>;

/**
 * @route   POST /auth/register
 * @desc    Register a new user with email and password
 * @access  Public
 */
export class RegisterUser extends CustomOpenAPIRoute {
	schema = {
		tags: ['Authentication'],
		summary: 'Register a new user',
		description: 'Create a new user account with email and password authentication',
		request: {
			body: {
				content: {
					'application/json': {
						schema: RegisterUserSchema,
					},
				},
			},
		},
		responses: {
			'200': {
				description: 'User registered successfully',
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
							message: 'User registered successfully',
						},
					},
				},
			},
			'400': {
				description: 'Bad request - validation error or duplicate email',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 400,
							data: null,
							error: {
								message: 'Email already registered',
								errorCode: 'DUPLICATE_EMAIL',
							},
							message: 'Email already registered',
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

			const response = await authController.registerUser(payload);
			return getSuccessApiResponse(response, 'User registered successfully');
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof DuplicateEmailException ||
				error instanceof RegistrationException ||
				error instanceof AuthenticationException
			) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error as Error);
		}
	}
}

registerRouter.post('/register', RegisterUser);
