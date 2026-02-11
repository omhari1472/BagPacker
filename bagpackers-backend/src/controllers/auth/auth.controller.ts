import { injectable, inject } from 'tsyringe';
import type { UserRepository, CreateUserData, User } from '@repository/auth/user.repository';
import type { IGoogleOAuthService } from '@services/oauth/google-oauth.service.interface';
import { TOKENS } from '@infrastructure/types';
import { generateToken } from '@utils/jwt.utils';
import {
	AuthenticationException,
	DuplicateEmailException,
	InvalidCredentialsException,
	RegistrationException,
	UserNotFoundException,
} from '@exceptions/auth.exceptions';
import { BadRequestError } from '@exceptions/core.exceptions';

export interface RegisterUserRequest {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface LoginUserRequest {
	email: string;
	password: string;
}

export interface GoogleOAuthRequest {
	code: string;
	redirectUri: string;
}

export interface AuthResponse {
	token: string;
	user: {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
		authProvider: string;
	};
}

@injectable()
export class AuthController {
	constructor(
		@inject(TOKENS.USER_REPOSITORY) private userRepository: UserRepository,
		@inject(TOKENS.GOOGLE_OAUTH_SERVICE) private googleOAuthService: IGoogleOAuthService,
		private jwtSecret: string
	) {}

	/**
	 * Register a new user with email and password
	 */
	async registerUser(request: RegisterUserRequest): Promise<AuthResponse> {
		try {
			// Validate input
			if (!request.email || !request.password || !request.firstName || !request.lastName) {
				throw new BadRequestError('All fields are required');
			}

			// Validate email format
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(request.email)) {
				throw new BadRequestError('Invalid email format');
			}

			// Validate password length
			if (request.password.length < 6) {
				throw new BadRequestError('Password must be at least 6 characters long');
			}

			// Validate password confirmation
			if (request.password !== request.confirmPassword) {
				throw new BadRequestError('Passwords do not match');
			}

			// Check if user already exists
			const existingUser = await this.userRepository.findByEmail(request.email);
			if (existingUser) {
				throw new DuplicateEmailException('Email already registered');
			}

			// Create user
			const userData: CreateUserData = {
				firstName: request.firstName,
				lastName: request.lastName,
				email: request.email,
				password: request.password,
				authProvider: 'local',
			};

			const user = await this.userRepository.createUser(userData);

			// Generate JWT token
			const token = generateToken(
				{
					userId: user.id,
					email: user.email,
				},
				this.jwtSecret
			);

			return {
				token,
				user: {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					authProvider: user.authProvider,
				},
			};
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof DuplicateEmailException
			) {
				throw error;
			}
			throw new RegistrationException('Failed to register user');
		}
	}

	/**
	 * Login user with email and password
	 */
	async loginUser(request: LoginUserRequest): Promise<AuthResponse> {
		try {
			// Validate input
			if (!request.email || !request.password) {
				throw new BadRequestError('Email and password are required');
			}

			// Verify credentials
			const user = await this.userRepository.verifyPassword(
				request.email,
				request.password
			);

			if (!user) {
				throw new InvalidCredentialsException('Invalid email or password');
			}

			// Generate JWT token
			const token = generateToken(
				{
					userId: user.id,
					email: user.email,
				},
				this.jwtSecret
			);

			return {
				token,
				user: {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					authProvider: user.authProvider,
				},
			};
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof InvalidCredentialsException
			) {
				throw error;
			}
			throw new AuthenticationException('Login failed');
		}
	}

	/**
	 * Handle Google OAuth callback
	 */
	async googleOAuthCallback(request: GoogleOAuthRequest): Promise<AuthResponse> {
		try {
			// Validate input
			if (!request.code || !request.redirectUri) {
				throw new BadRequestError('Authorization code and redirect URI are required');
			}

			// Verify Google token and get access token
			const tokenResponse = await this.googleOAuthService.verifyGoogleToken(
				request.code,
				request.redirectUri
			);

			// Get user info from Google
			const googleUser = await this.googleOAuthService.getUserInfo(
				tokenResponse.access_token
			);

			// Check if user exists
			let user = await this.userRepository.findByEmail(googleUser.email);

			// Create user if doesn't exist
			if (!user) {
				const userData: CreateUserData = {
					firstName: googleUser.given_name,
					lastName: googleUser.family_name,
					email: googleUser.email,
					authProvider: 'google',
				};

				user = await this.userRepository.createUser(userData);
			}

			// Generate JWT token
			const token = generateToken(
				{
					userId: user.id,
					email: user.email,
				},
				this.jwtSecret
			);

			return {
				token,
				user: {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					authProvider: user.authProvider,
				},
			};
		} catch (error) {
			if (error instanceof BadRequestError) {
				throw error;
			}
			throw new AuthenticationException('Google OAuth authentication failed');
		}
	}

	/**
	 * Get current authenticated user
	 */
	async getCurrentUser(userId: number): Promise<User> {
		try {
			if (!userId) {
				throw new BadRequestError('User ID is required');
			}

			const user = await this.userRepository.findById(userId);

			if (!user) {
				throw new UserNotFoundException('User not found');
			}

			return user;
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof UserNotFoundException
			) {
				throw error;
			}
			throw new AuthenticationException('Failed to retrieve user');
		}
	}
}
