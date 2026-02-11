import { BaseException } from './core.exceptions';

export class PaymentCreationException extends BaseException {
	constructor(
		message: string = 'Failed to create payment',
		errorCode: string = 'PAYMENT_CREATION_ERROR'
	) {
		super(message, errorCode, 500);
	}
}

export class PaymentVerificationException extends BaseException {
	constructor(
		message: string = 'Payment verification failed',
		errorCode: string = 'PAYMENT_VERIFICATION_ERROR'
	) {
		super(message, errorCode, 400);
	}
}

export class PaymentNotFoundException extends BaseException {
	constructor(
		message: string = 'Payment not found',
		errorCode: string = 'PAYMENT_NOT_FOUND'
	) {
		super(message, errorCode, 404);
	}
}

export class InvalidPaymentSignatureException extends BaseException {
	constructor(
		message: string = 'Invalid payment signature',
		errorCode: string = 'INVALID_PAYMENT_SIGNATURE'
	) {
		super(message, errorCode, 400);
	}
}
