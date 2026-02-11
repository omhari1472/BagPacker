import { fromIttyRouter } from 'chanfana';
import { Router } from 'itty-router';
import { z } from 'zod';
import { CustomOpenAPIRoute } from '@infrastructure/customAPIRoute';
import type { IAuthRequest } from '@infrastructure/core.model';
import { container } from '@infrastructure/di/container';
import { BookingController } from '@controllers/booking/booking.controller';
import { TOKENS } from '@infrastructure/types';
import { withAuth } from '@middlewares/auth.middleware';
import { getSuccessApiResponse, getErrorApiResponse } from '@utils/Response.utils';
import {
	BookingValidationException,
	BookingCreationException,
	InvalidDateException,
} from '@exceptions/booking.exceptions';
import { BadRequestError } from '@exceptions/core.exceptions';

const router = Router({
	base: '/bookings',
});

export const createBookingRouter = fromIttyRouter(router, {
	base: '/bookings',
});

// Create Booking Schema
const CreateBookingSchema = z.object({
	region: z.string().min(1).describe('Storage region/area'),
	city: z.string().min(1).describe('City name'),
	numberOfBags: z.number().int().positive().describe('Number of bags to store'),
	dropOffDate: z.string().describe('Drop-off date (YYYY-MM-DD format)'),
	pickupDate: z.string().describe('Pickup date (YYYY-MM-DD format)'),
});

export type ICreateBookingSchema = z.infer<typeof CreateBookingSchema>;

/**
 * @route   POST /bookings
 * @desc    Create a new booking
 * @access  Protected
 */
export class CreateBooking extends CustomOpenAPIRoute {
	schema = {
		tags: ['Bookings'],
		summary: 'Create a new booking',
		description: 'Create a luggage storage booking with dates and location',
		security: [
			{
				BearerAuth: [],
			},
		],
		request: {
			body: {
				content: {
					'application/json': {
						schema: CreateBookingSchema,
					},
				},
			},
		},
		responses: {
			'200': {
				description: 'Booking created successfully',
				content: {
					'application/json': {
						schema: {
							status: 'success',
							statusCode: 200,
							data: {
								booking: {
									id: 1,
									userId: 1,
									region: 'Connaught Place',
									city: 'Delhi',
									numberOfBags: 2,
									dropOffDate: '2024-03-15',
									pickupDate: '2024-03-20',
									totalCost: '60.00',
									status: 'pending',
									createdAt: '2024-01-01T00:00:00.000Z',
								},
							},
							error: null,
							message: 'Booking created successfully',
						},
					},
				},
			},
			'400': {
				description: 'Bad request - validation error',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 400,
							data: null,
							error: {
								message: 'Drop-off date cannot be in the past',
								errorCode: 'BOOKING_VALIDATION_ERROR',
							},
							message: 'Drop-off date cannot be in the past',
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

			// Get BookingController from DI container
			const bookingController = new BookingController(
				container.resolve(TOKENS.BOOKING_REPOSITORY),
				container.resolve(TOKENS.LOCATION_REPOSITORY)
			);

			const response = await bookingController.createBooking(userId, payload);
			return getSuccessApiResponse(response, 'Booking created successfully');
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof BookingValidationException ||
				error instanceof InvalidDateException ||
				error instanceof BookingCreationException
			) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error as Error);
		}
	}
}

createBookingRouter.post('/', withAuth, CreateBooking);
