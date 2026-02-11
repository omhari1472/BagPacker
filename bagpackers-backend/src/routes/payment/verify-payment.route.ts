import { fromIttyRouter } from 'chanfana';
import { Router } from 'itty-router';
import { z } from 'zod';
import { CustomOpenAPIRoute } from '@infrastructure/customAPIRoute';
import type { IAuthRequest } from '@infrastructure/core.model';
import { container } from '@infrastructure/di/container';
import { PaymentController } from '@controllers/payment/payment.controller';
import { TOKENS } from '@infrastructure/types';
import { withAuth } from '@middlewares/auth.middleware';
import { getSuccessApiResponse, getErrorApiResponse } from '@utils/Response.utils';
import {
	PaymentVerificationException,
	PaymentNotFoundException,
	InvalidPaymentSignatureException,
} from '@exceptions/payment.exceptions';
import { BookingNotFoundException } from '@exceptions/booking.exceptions';
import { BadRequestError, ForbiddenError } from '@exceptions/core.exceptions';

const router = Router({
	base: '/payments',
});

export const verifyPaymentRouter = fromIttyRouter(router, {
	base: '/payments',
});

// Verify Payment Schema
const VerifyPaymentSchema = z.object({
	razorpayOrderId: z.string().min(1).describe('Razorpay order ID'),
	razorpayPaymentId: z.string().min(1).describe('Razorpay payment ID'),
	razorpaySignature: z.string().min(1).describe('Razorpay payment signature'),
	bookingId: z.number().int().positive().describe('Booking ID'),
});

export type IVerifyPaymentSchema = z.infer<typeof VerifyPaymentSchema>;

/**
 * @route   POST /payments/verify
 * @desc    Verify Razorpay payment signature and update payment status
 * @access  Protected
 */
export class VerifyPayment extends CustomOpenAPIRoute {
	schema = {
		tags: ['Payments'],
		summary: 'Verify payment',
		description: 'Verify Razorpay payment signature and update payment and booking status',
		security: [
			{
				BearerAuth: [],
			},
		],
		request: {
			body: {
				content: {
					'application/json': {
						schema: VerifyPaymentSchema,
					},
				},
			},
		},
		responses: {
			'200': {
				description: 'Payment verified successfully',
				content: {
					'application/json': {
						schema: {
							status: 'success',
							statusCode: 200,
							data: {
								success: true,
								payment: {
									id: 1,
									bookingId: 1,
									razorpayOrderId: 'order_MhVXXXXXXXXXXX',
									razorpayPaymentId: 'pay_MhVXXXXXXXXXXX',
									razorpaySignature: 'signature_here',
									amount: '60.00',
									currency: 'INR',
									status: 'success',
									createdAt: '2024-01-01T00:00:00.000Z',
									updatedAt: '2024-01-01T00:05:00.000Z',
								},
							},
							error: null,
							message: 'Payment verified successfully',
						},
					},
				},
			},
			'400': {
				description: 'Bad request - invalid payment signature or missing fields',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 400,
							data: null,
							error: {
								message: 'Invalid payment signature',
								errorCode: 'INVALID_PAYMENT_SIGNATURE',
							},
							message: 'Invalid payment signature',
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
			'403': {
				description: 'Forbidden - booking does not belong to user',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 403,
							data: null,
							error: {
								message: 'You do not have permission to verify payment for this booking',
								errorCode: 'FORBIDDEN',
							},
							message: 'You do not have permission to verify payment for this booking',
						},
					},
				},
			},
			'404': {
				description: 'Payment or booking not found',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 404,
							data: null,
							error: {
								message: 'Payment record not found',
								errorCode: 'PAYMENT_NOT_FOUND',
							},
							message: 'Payment record not found',
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

			// User ID is attached to request by auth middleware
			const userId = request.userId;

			if (!userId) {
				throw new BadRequestError('User ID not found in request');
			}

			// Get PaymentController from DI container
			const paymentController = new PaymentController(
				container.resolve(TOKENS.PAYMENT_REPOSITORY),
				container.resolve(TOKENS.BOOKING_REPOSITORY),
				container.resolve(TOKENS.RAZORPAY_SERVICE)
			);

			const response = await paymentController.verifyPayment(userId, payload);
			return getSuccessApiResponse(response, 'Payment verified successfully');
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof BookingNotFoundException ||
				error instanceof ForbiddenError ||
				error instanceof PaymentNotFoundException ||
				error instanceof InvalidPaymentSignatureException ||
				error instanceof PaymentVerificationException
			) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error as Error);
		}
	}
}

verifyPaymentRouter.post('/verify', withAuth, VerifyPayment);
