import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { BaseRepository } from '../repository';
import { payments } from '../schema';

export interface CreatePaymentData {
	bookingId: number;
	amount: string;
	currency?: string;
	razorpayOrderId?: string;
}

export interface UpdatePaymentStatusData {
	razorpayPaymentId?: string;
	razorpaySignature?: string;
	status: 'pending' | 'success' | 'failed';
}

export interface Payment {
	id: number;
	bookingId: number;
	razorpayOrderId: string | null;
	razorpayPaymentId: string | null;
	razorpaySignature: string | null;
	amount: string;
	currency: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
}

@injectable()
export class PaymentRepository extends BaseRepository {
	/**
	 * Create a new payment record
	 */
	async createPayment(data: CreatePaymentData): Promise<Payment> {
		const result = await this.db.insert(payments).values({
			bookingId: data.bookingId,
			amount: data.amount,
			currency: data.currency || 'INR',
			razorpayOrderId: data.razorpayOrderId || null,
			status: 'pending',
		});

		const insertId = Number(result[0].insertId);
		const payment = await this.findPaymentById(insertId);

		if (!payment) {
			throw new Error('Failed to create payment');
		}

		return payment;
	}

	/**
	 * Update payment status with Razorpay details
	 */
	async updatePaymentStatus(
		id: number,
		data: UpdatePaymentStatusData
	): Promise<Payment | null> {
		const updateData: any = {
			status: data.status,
		};

		if (data.razorpayPaymentId) {
			updateData.razorpayPaymentId = data.razorpayPaymentId;
		}

		if (data.razorpaySignature) {
			updateData.razorpaySignature = data.razorpaySignature;
		}

		await this.db
			.update(payments)
			.set(updateData)
			.where(eq(payments.id, id));

		return this.findPaymentById(id);
	}

	/**
	 * Find payment by booking ID
	 */
	async findPaymentByBookingId(bookingId: number): Promise<Payment | null> {
		const result = await this.db
			.select()
			.from(payments)
			.where(eq(payments.bookingId, bookingId))
			.limit(1);

		return result[0] ? this.mapToPayment(result[0]) : null;
	}

	/**
	 * Find payment by ID
	 */
	async findPaymentById(id: number): Promise<Payment | null> {
		const result = await this.db
			.select()
			.from(payments)
			.where(eq(payments.id, id))
			.limit(1);

		return result[0] ? this.mapToPayment(result[0]) : null;
	}

	/**
	 * Map database result to Payment interface
	 */
	private mapToPayment(row: any): Payment {
		return {
			id: row.id,
			bookingId: row.bookingId,
			razorpayOrderId: row.razorpayOrderId,
			razorpayPaymentId: row.razorpayPaymentId,
			razorpaySignature: row.razorpaySignature,
			amount: row.amount,
			currency: row.currency || 'INR',
			status: row.status || 'pending',
			createdAt: row.createdAt!,
			updatedAt: row.updatedAt!,
		};
	}
}
