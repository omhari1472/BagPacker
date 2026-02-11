import { json } from 'itty-router';
import type { BaseException } from '@exceptions/core.exceptions';

export function getSuccessApiResponse(data: any, message: string = 'Operation Successful') {
	return json({
		status: 'success',
		statusCode: 200,
		data,
		error: null,
		message,
	});
}

export function getErrorApiResponse(error: BaseException | Error) {
	if (error instanceof BaseException) {
		return json(
			{
				status: 'error',
				statusCode: error.statusCode,
				data: null,
				error: {
					message: error.message,
					errorCode: error.errorCode,
				},
				message: error.message,
			},
			{ status: error.statusCode },
		);
	}

	return json(
		{
			status: 'error',
			statusCode: 500,
			data: null,
			error: {
				message: error.message || 'Internal Server Error',
				errorCode: 'INTERNAL_SERVER_ERROR',
			},
			message: error.message || 'Internal Server Error',
		},
		{ status: 500 },
	);
}

