import { BaseException } from './core.exceptions';

export class BookingValidationException extends BaseException {
	constructor(
		message: string = 'Booking validation failed',
		errorCode: string = 'BOOKING_VALIDATION_ERROR'
	) {
		super(message, errorCode, 400);
	}
}

export class BookingNotFoundException extends BaseException {
	constructor(
		message: string = 'Booking not found',
		errorCode: string = 'BOOKING_NOT_FOUND'
	) {
		super(message, errorCode, 404);
	}
}

export class BookingCreationException extends BaseException {
	constructor(
		message: string = 'Failed to create booking',
		errorCode: string = 'BOOKING_CREATION_ERROR'
	) {
		super(message, errorCode, 500);
	}
}

export class InvalidDateException extends BaseException {
	constructor(
		message: string = 'Invalid date provided',
		errorCode: string = 'INVALID_DATE'
	) {
		super(message, errorCode, 400);
	}
}
