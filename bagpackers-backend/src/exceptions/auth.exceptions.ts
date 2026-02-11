import { BaseException } from './core.exceptions';

export class AuthenticationException extends BaseException {
	constructor(
		message: string = 'Authentication failed',
		errorCode: string = 'AUTH_ERROR'
	) {
		super(message, errorCode, 401);
	}
}

export class DuplicateEmailException extends BaseException {
	constructor(
		message: string = 'Email already exists',
		errorCode: string = 'DUPLICATE_EMAIL'
	) {
		super(message, errorCode, 400);
	}
}

export class InvalidCredentialsException extends BaseException {
	constructor(
		message: string = 'Invalid email or password',
		errorCode: string = 'INVALID_CREDENTIALS'
	) {
		super(message, errorCode, 401);
	}
}

export class RegistrationException extends BaseException {
	constructor(
		message: string = 'Registration failed',
		errorCode: string = 'REGISTRATION_ERROR'
	) {
		super(message, errorCode, 500);
	}
}

export class UserNotFoundException extends BaseException {
	constructor(
		message: string = 'User not found',
		errorCode: string = 'USER_NOT_FOUND'
	) {
		super(message, errorCode, 404);
	}
}
