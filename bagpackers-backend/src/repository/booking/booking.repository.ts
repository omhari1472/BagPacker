import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { BaseRepository } from '../repository';
import { bookings } from '../schema';

export interface CreateBookingData {
	userId: number;
	region: string;
	city: string;
	numberOfBags: number;
	dropOffDate: string;
	pickupDate: string;
	totalCost: string;
}

export interface Booking {
	id: number;
	userId: number;
	region: string;
	city: string;
	numberOfBags: number;
	dropOffDate: string;
	pickupDate: string;
	totalCost: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
}

@injectable()
export class BookingRepository extends BaseRepository {
	/**
	 * Create a new booking
	 */
	async createBooking(data: CreateBookingData): Promise<Booking> {
		const result = await this.db.insert(bookings).values({
			userId: data.userId,
			region: data.region,
			city: data.city,
			numberOfBags: data.numberOfBags,
			dropOffDate: data.dropOffDate,
			pickupDate: data.pickupDate,
			totalCost: data.totalCost,
			status: 'pending',
		} as any);

		const insertId = Number(result[0].insertId);
		const booking = await this.findBookingById(insertId);

		if (!booking) {
			throw new Error('Failed to create booking');
		}

		return booking;
	}

	/**
	 * Find all bookings for a specific user
	 */
	async findBookingsByUserId(userId: number): Promise<Booking[]> {
		const result = await this.db
			.select()
			.from(bookings)
			.where(eq(bookings.userId, userId));

		return result.map(row => this.mapToBooking(row));
	}

	/**
	 * Find a booking by ID
	 */
	async findBookingById(id: number): Promise<Booking | null> {
		const result = await this.db
			.select()
			.from(bookings)
			.where(eq(bookings.id, id))
			.limit(1);

		return result[0] ? this.mapToBooking(result[0]) : null;
	}

	/**
	 * Update booking status
	 */
	async updateBookingStatus(
		id: number,
		status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
	): Promise<Booking | null> {
		await this.db
			.update(bookings)
			.set({ status })
			.where(eq(bookings.id, id));

		return this.findBookingById(id);
	}

	/**
	 * Map database result to Booking interface
	 */
	private mapToBooking(row: any): Booking {
		return {
			id: row.id,
			userId: row.userId,
			region: row.region,
			city: row.city,
			numberOfBags: row.numberOfBags,
			dropOffDate: row.dropOffDate,
			pickupDate: row.pickupDate,
			totalCost: row.totalCost,
			status: row.status || 'pending',
			createdAt: row.createdAt!,
			updatedAt: row.updatedAt!,
		};
	}
}
