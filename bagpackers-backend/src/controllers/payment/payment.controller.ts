import { injectable, inject } from 'tsyringe';
import type { PaymentRepository, Payment } from '@repository/payment/payment.repository';
import type { BookingRepository } from '@repository/booking/booking.repository';
import type { IRazorpayService } from '@services/razorpay/razorpay.service.interface';
import { TOKENS } from '@infrastructure/types';
import {
	PaymentCreationException,
	PaymentVerificationException,
	PaymentNotFoundException,
	InvalidPaymentSignatureException,
} from '@exceptions/payment.exceptions';
import { BookingNotFoundException } from '@exceptions/booking.exceptions';
import { BadRequestError, ForbiddenError } from '@exceptions/core.exceptions';

export interface CreatePaymentOrderRequest {
	bookingId: number;
}

export interface CreatePaymentOrderResponse {
	orderId: string;
	amount: number;
	currency: string;
	payment: Payment;
}

export interface VerifyPaymentRequest {
	razorpayOrderId: string;
	razorpayPaymentId: string;
	razorpaySignature: string;
	bookingId: number;
}

export interface VerifyPaymentResponse {
	success: boolean;
	payment: Payment;
}

@injectable()
export class PaymentController {
	constructor(
		@inject(TOKENS.PAYMENT_REPOSITORY) private paymentRepository: PaymentRepository,
		@inject(TOKENS.BOOKING_REPOSITORY) private bookingRepository: BookingRepository,
		@inject(TOKENS.RAZORPAY_SERVICE) private razorpayService: IRazorpayService
	) {}

	/**
	 * Create a payment order for a booking
	 */
	async createPaymentOrder(
		userId: number,
		request: CreatePaymentOrderRequest
	): Promise<CreatePaymentOrderResponse> {
		try {
			// Validate required fields
			if (!request.bookingId) {
				throw new BadRequestError('Booking ID is required');
			}

			// Validate user ID
			if (!userId) {
				throw new BadRequestError('User ID is required');
			}

			// Validate booking exists
			const booking = await this.bookingRepository.findBookingById(request.bookingId);
			if (!booking) {
				throw new BookingNotFoundException('Booking not found');
			}

			// Validate booking belongs to user
			if (booking.userId !== userId) {
				throw new ForbiddenError('You do not have permission to create payment for this booking');
			}

			// Calculate amount in smallest currency unit (paise for INR)
			const amountInPaise = Math.round(parseFloat(booking.totalCost) * 100);

			// Create Razorpay order
			const razorpayOrder = await this.razorpayService.createOrder({
				amount: amountInPaise,
				currency: 'INR',
				receipt: `booking_${booking.id}_${Date.now()}`,
			});

			// Create payment record in database
			const payment = await this.paymentRepository.createPayment({
				bookingId: booking.id,
				amount: booking.totalCost,
				currency: 'INR',
				razorpayOrderId: razorpayOrder.id,
			});

			return {
				orderId: razorpayOrder.id,
				amount: razorpayOrder.amount,
				currency: razorpayOrder.currency,
				payment,
			};
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof BookingNotFoundException ||
				error instanceof ForbiddenError
			) {
				throw error;
			}
			throw new PaymentCreationException('Failed to create payment order');
		}
	}

	/**
	 * Verify payment signature and update payment status
	 */
	async verifyPayment(
		userId: number,
		request: VerifyPaymentRequest
	): Promise<VerifyPaymentResponse> {
		try {
			// Validate required fields
			if (!request.razorpayOrderId || !request.razorpayPaymentId || !request.razorpaySignature) {
				throw new BadRequestError('Razorpay order ID, payment ID, and signature are required');
			}

			if (!request.bookingId) {
				throw new BadRequestError('Booking ID is required');
			}

			// Validate user ID
			if (!userId) {
				throw new BadRequestError('User ID is required');
			}

			// Validate booking exists and belongs to user
			const booking = await this.bookingRepository.findBookingById(request.bookingId);
			if (!booking) {
				throw new BookingNotFoundException('Booking not found');
			}

			if (booking.userId !== userId) {
				throw new ForbiddenError('You do not have permission to verify payment for this booking');
			}

			// Find payment record
			const payment = await this.paymentRepository.findPaymentByBookingId(request.bookingId);
			if (!payment) {
				throw new PaymentNotFoundException('Payment record not found');
			}

			// Verify payment signature with Razorpay
			const isValid = await this.razorpayService.verifyPaymentSignature({
				razorpayOrderId: request.razorpayOrderId,
				razorpayPaymentId: request.razorpayPaymentId,
				razorpaySignature: request.razorpaySignature,
			});

			if (!isValid) {
				// Update payment status to failed
				await this.paymentRepository.updatePaymentStatus(payment.id, {
					razorpayPaymentId: request.razorpayPaymentId,
					razorpaySignature: request.razorpaySignature,
					status: 'failed',
				});

				throw new InvalidPaymentSignatureException('Invalid payment signature');
			}

			// Update payment status to success
			const updatedPayment = await this.paymentRepository.updatePaymentStatus(payment.id, {
				razorpayPaymentId: request.razorpayPaymentId,
				razorpaySignature: request.razorpaySignature,
				status: 'success',
			});

			// Update booking status to confirmed
			await this.bookingRepository.updateBookingStatus(booking.id, 'confirmed');

			return {
				success: true,
				payment: updatedPayment!,
			};
		} catch (error) {
			if (
				error instanceof BadRequestError ||
				error instanceof BookingNotFoundException ||
				error instanceof ForbiddenError ||
				error instanceof PaymentNotFoundException ||
				error instanceof InvalidPaymentSignatureException
			) {
				throw error;
			}
			throw new PaymentVerificationException('Failed to verify payment');
		}
	}
}
