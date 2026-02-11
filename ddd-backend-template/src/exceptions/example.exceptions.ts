import { BaseException } from './core.exceptions';

export class ExampleError extends BaseException {
	constructor(message: string, errorCode: string, statusCode: number = 500) {
		super(message, errorCode, statusCode);
	}
}

export class CreateExampleError extends ExampleError {
	constructor(message: string, errorCode: string, statusCode: number = 500) {
		super(message, errorCode, statusCode);
	}
}

export class FetchExampleError extends ExampleError {
	constructor(message: string, errorCode: string, statusCode: number = 500) {
		super(message, errorCode, statusCode);
	}
}

export class UpdateExampleError extends ExampleError {
	constructor(message: string, errorCode: string, statusCode: number = 500) {
		super(message, errorCode, statusCode);
	}
}

export class DeleteExampleError extends ExampleError {
	constructor(message: string, errorCode: string, statusCode: number = 500) {
		super(message, errorCode, statusCode);
	}
}

