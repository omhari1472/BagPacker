import { injectable, inject } from 'tsyringe';
import type { BookingRepository, CreateBookingData, Booking } from '@repository/booking/booking.repository';
import type { LocationRepository, PartnerLocation } from '@repository/location/location.repository';
import { TOKENS } from '@infrastructure/types';
import {
	BookingValidationException,
	BookingCreationException,
	InvalidDateException,
} from '@exceptions/booking.exceptions';
import { BadRequestError } from '@exceptions/core.exceptions';

export interface CreateBookingRequest {
	region: string;
	city: string;
	numberOfBags: number;
	dropOffDate: string;
	pickupDate: string;
}

export interface BookingResponse {
	booking: Booking;
}

export interface BookingsListResponse {
	bookings: Booking[];
}

export interface LocationsResponse {
	locations: PartnerLocation[];
}

@injectable()
export class BookingController {
	constructor(
		@inject(TOKENS.BOOKING_REPOSITORY) private bookingRepository: BookingRepository,
		@inject(TOKENS.LOCATION_REPOSITORY) private locationRepository: LocationRepository
	) {}

	/**
	 * Create a new booking with validation
	 */
	async createBooking(userId: number, request: CreateBookingRequest): Promise<BookingResponse> {
		try {
			// Validate required fields
			if (!request.region || !request.city || !request.numberOfBags || !request.dropOffDate || !request.pickupDate) {
				throw new BadRequestError('All fields are required: region, city, numberOfBags, dropOffDate, pickupDate');
			}

			// Validate user ID
			if (!userId) {
				throw new BadRequestError('User ID is required');
			}

			// Validate number of bags is positive integer
			if (!Number.isInteger(request.numberOfBags) || request.numberOfBags <= 0) {
				throw new BookingValidationException('Number of bags must be a positive integer');
			}

			// Parse and validate dates
			const dropOffDate = new Date(request.dropOffDate);
			const pickupDate = new Date(request.pickupDate);
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			// Check if dates are valid
			if (isNaN(dropOffDate.getTime())) {
				throw new InvalidDateException('Invalid drop-off date format');
			}

			if (isNaN(pickupDate.getTime())) {
				throw new InvalidDateException('Invalid pickup date format');
			}

			// Validate drop-off date is not in the past
			dropOffDate.setHours(0, 0, 0, 0);
			if (dropOffDate < today) {
				throw new BookingValidationException('Drop-off date cannot be in the past');
			}

			// Validate pickup date is after drop-off date
			pickupDate.setHours(0, 0, 0, 0);
			if (pickupDate <= dropOffDate) {
				throw new BookingValidationException('Pickup date must be after drop-off date');
			}

			// Calculate total cost (numberOfBags * 30)
			const totalCost = (request.numberOfBags * 30).toFixed(2);

			// Create booking data
			const bookingData: CreateBookingData = {
				userId,
				region: request.region,
				city: request.city,
				numberOfBags: request.numberOfBags,
				dropOffDate: request.dropOffDate,
				pickupDate: request.pickupDate,
				totalCost,
			};

			// Create booking in repository
			const booking = await this.bookingRepository.createBooking(bookingData);

			return {
				booking,
			};
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof BookingValidationException ||
				error instanceof InvalidDateException
			) {
				throw error;
			}
			throw new BookingCreationException('Failed to create booking');
		}
	}

	/**
	 * Get all bookings for the authenticated user
	 */
	async getUserBookings(userId: number): Promise<BookingsListResponse> {
		try {
			// Validate user ID
			if (!userId) {
				throw new BadRequestError('User ID is required');
			}

			// Retrieve all bookings for the user
			const bookings = await this.bookingRepository.findBookingsByUserId(userId);

			return {
				bookings,
			};
		} catch (error) {
			if (error instanceof BadRequestError) {
				throw error;
			}
			throw new BookingCreationException('Failed to retrieve bookings');
		}
	}

	/**
	 * Get partner locations by region and city for map display
	 */
	async getLocationsByRegion(region: string, city?: string): Promise<LocationsResponse> {
		try {
			// Validate region
			if (!region) {
				throw new BadRequestError('Region is required');
			}

			// Fetch partner locations from repository
			const locations = await this.locationRepository.findLocationsByRegion(region, city);

			return {
				locations,
			};
		} catch (error) {
			if (error instanceof BadRequestError) {
				throw error;
			}
			throw new BookingCreationException('Failed to retrieve locations');
		}
	}
}
