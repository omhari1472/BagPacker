import { fromIttyRouter } from 'chanfana';
import { Router } from 'itty-router';
import { CustomOpenAPIRoute } from '@infrastructure/customAPIRoute';
import type { IAuthRequest } from '@infrastructure/core.model';
import { container } from '@infrastructure/di/container';
import { BookingController } from '@controllers/booking/booking.controller';
import { TOKENS } from '@infrastructure/types';
import { withAuth } from '@middlewares/auth.middleware';
import { getSuccessApiResponse, getErrorApiResponse } from '@utils/Response.utils';
import { BookingCreationException } from '@exceptions/booking.exceptions';
import { BadRequestError } from '@exceptions/core.exceptions';

const router = Router({
	base: '/bookings',
});

export const getBookingsRouter = fromIttyRouter(router, {
	base: '/bookings',
});

/**
 * @route   GET /bookings
 * @desc    Get all bookings for the authenticated user
 * @access  Protected
 */
export class GetUserBookings extends CustomOpenAPIRoute {
	schema = {
		tags: ['Bookings'],
		summary: 'Get user bookings',
		description: 'Retrieve all bookings for the currently authenticated user',
		security: [
			{
				BearerAuth: [],
			},
		],
		responses: {
			'200': {
				description: 'Bookings retrieved successfully',
				content: {
					'application/json': {
						schema: {
							status: 'success',
							statusCode: 200,
							data: {
								bookings: [
									{
										id: 1,
										userId: 1,
										region: 'Connaught Place',
										city: 'Delhi',
										numberOfBags: 2,
										dropOffDate: '2024-03-15',
										pickupDate: '2024-03-20',
										totalCost: '60.00',
										status: 'confirmed',
										createdAt: '2024-01-01T00:00:00.000Z',
									},
								],
							},
							error: null,
							message: 'Bookings retrieved successfully',
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
		try {
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

			const response = await bookingController.getUserBookings(userId);
			return getSuccessApiResponse(response, 'Bookings retrieved successfully');
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof BookingCreationException
			) {
				return getErrorApiResponse(error);
			}
			return getErrorApiResponse(error as Error);
		}
	}
}

getBookingsRouter.get('/', withAuth, GetUserBookings);
