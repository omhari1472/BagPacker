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
	PaymentCreationException,
	PaymentNotFoundException,
} from '@exceptions/payment.exceptions';
import { BookingNotFoundException } from '@exceptions/booking.exceptions';
import { BadRequestError, ForbiddenError } from '@exceptions/core.exceptions';

const router = Router({
	base: '/payments',
});

export const createOrderRouter = fromIttyRouter(router, {
	base: '/payments',
});

// Create Payment Order Schema
const CreatePaymentOrderSchema = z.object({
	bookingId: z.number().int().positive().describe('Booking ID to create payment for'),
});

export type ICreatePaymentOrderSchema = z.infer<typeof CreatePaymentOrderSchema>;

/**
 * @route   POST /payments/create-order
 * @desc    Create a Razorpay payment order for a booking
 * @access  Protected
 */
export class CreatePaymentOrder extends CustomOpenAPIRoute {
	schema = {
		tags: ['Payments'],
		summary: 'Create payment order',
		description: 'Create a Razorpay payment order for a booking to initiate payment process',
		security: [
			{
				BearerAuth: [],
			},
		],
		request: {
			body: {
				content: {
					'application/json': {
						schema: CreatePaymentOrderSchema,
					},
				},
			},
		},
		responses: {
			'200': {
				description: 'Payment order created successfully',
				content: {
					'application/json': {
						schema: {
							status: 'success',
							statusCode: 200,
							data: {
								orderId: 'order_MhVXXXXXXXXXXX',
								amount: 6000,
								currency: 'INR',
								payment: {
									id: 1,
									bookingId: 1,
									razorpayOrderId: 'order_MhVXXXXXXXXXXX',
									amount: '60.00',
									currency: 'INR',
									status: 'pending',
									createdAt: '2024-01-01T00:00:00.000Z',
								},
							},
							error: null,
							message: 'Payment order created successfully',
						},
					},
				},
			},
			'400': {
				description: 'Bad request - invalid booking ID',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 400,
							data: null,
							error: {
								message: 'Booking ID is required',
								errorCode: 'BAD_REQUEST',
							},
							message: 'Booking ID is required',
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
								message: 'You do not have permission to create payment for this booking',
								errorCode: 'FORBIDDEN',
							},
							message: 'You do not have permission to create payment for this booking',
						},
					},
				},
			},
			'404': {
				description: 'Booking not found',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 404,
							data: null,
							error: {
								message: 'Booking not found',
								errorCode: 'BOOKING_NOT_FOUND',
							},
							message: 'Booking not found',
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

			const response = await paymentController.createPaymentOrder(userId, payload);
			return getSuccessApiResponse(response, 'Payment order created successfully');
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof BookingNotFoundException ||
				error instanceof ForbiddenError ||
				error instanceof PaymentCreationException
			) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error as Error);
		}
	}
}

createOrderRouter.post('/create-order', withAuth, CreatePaymentOrder);
