import { fromIttyRouter } from 'chanfana';
import { Router } from 'itty-router';
import { z } from 'zod';
import { CustomOpenAPIRoute } from '@infrastructure/customAPIRoute';
import type { IAuthRequest } from '@infrastructure/core.model';
import { container } from '@infrastructure/di/container';
import { BookingController } from '@controllers/booking/booking.controller';
import { TOKENS } from '@infrastructure/types';
import { getSuccessApiResponse, getErrorApiResponse } from '@utils/Response.utils';
import { BookingCreationException } from '@exceptions/booking.exceptions';
import { BadRequestError } from '@exceptions/core.exceptions';

const router = Router({
	base: '/locations',
});

export const getLocationsRouter = fromIttyRouter(router, {
	base: '/locations',
});

// Get Locations Query Schema
const GetLocationsQuerySchema = z.object({
	region: z.string().min(1).describe('Region to search for locations'),
	city: z.string().optional().describe('Optional city filter'),
});

export type IGetLocationsQuerySchema = z.infer<typeof GetLocationsQuerySchema>;

/**
 * @route   GET /locations
 * @desc    Get partner locations by region and city
 * @access  Public
 */
export class GetLocationsByRegion extends CustomOpenAPIRoute {
	schema = {
		tags: ['Bookings'],
		summary: 'Get partner locations',
		description: 'Retrieve partner storage locations by region and optional city for map display',
		request: {
			query: GetLocationsQuerySchema,
		},
		responses: {
			'200': {
				description: 'Locations retrieved successfully',
				content: {
					'application/json': {
						schema: {
							status: 'success',
							statusCode: 200,
							data: {
								locations: [
									{
										id: 1,
										partnerId: 1,
										region: 'Connaught Place',
										city: 'Delhi',
										latitude: '28.6315',
										longitude: '77.2167',
										availableSpaces: 10,
										pricePerBag: '30.00',
										createdAt: '2024-01-01T00:00:00.000Z',
									},
								],
							},
							error: null,
							message: 'Locations retrieved successfully',
						},
					},
				},
			},
			'400': {
				description: 'Bad request - missing region parameter',
				content: {
					'application/json': {
						schema: {
							status: 'error',
							statusCode: 400,
							data: null,
							error: {
								message: 'Region is required',
								errorCode: 'BAD_REQUEST',
							},
							message: 'Region is required',
						},
					},
				},
			},
		},
	};

	async handle(request: IAuthRequest, env: any, context: ExecutionContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		try {
			const query = data.query;

			// Get BookingController from DI container
			const bookingController = new BookingController(
				container.resolve(TOKENS.BOOKING_REPOSITORY),
				container.resolve(TOKENS.LOCATION_REPOSITORY)
			);

			const response = await bookingController.getLocationsByRegion(
				query.region,
				query.city
			);
			return getSuccessApiResponse(response, 'Locations retrieved successfully');
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

getLocationsRouter.get('/', GetLocationsByRegion);
