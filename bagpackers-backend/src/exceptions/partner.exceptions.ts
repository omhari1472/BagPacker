import { BaseException } from './core.exceptions';

export class PartnerValidationException extends BaseException {
	constructor(
		message: string = 'Partner validation failed',
		errorCode: string = 'PARTNER_VALIDATION_ERROR'
	) {
		super(message, errorCode, 400);
	}
}

export class PartnerRegistrationException extends BaseException {
	constructor(
		message: string = 'Failed to register partner',
		errorCode: string = 'PARTNER_REGISTRATION_ERROR'
	) {
		super(message, errorCode, 500);
	}
}

export class InvalidMobileNumberException extends BaseException {
	constructor(
		message: string = 'Invalid mobile number format',
		errorCode: string = 'INVALID_MOBILE_NUMBER'
	) {
		super(message, errorCode, 400);
	}
}
