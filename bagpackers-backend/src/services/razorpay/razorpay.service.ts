import { injectable } from 'tsyringe';
import type {
	IRazorpayService,
	ICreateOrderInput,
	IRazorpayOrderResponse,
	IVerifyPaymentInput,
} from './razorpay.service.interface';
import type { Env } from '@infrastructure/types';

/**
 * Razorpay Payment Service
 * Handles payment order creation and signature verification
 */
@injectable()
export class RazorpayService implements IRazorpayService {
	private keyId: string;
	private keySecret: string;

	constructor(env: Env) {
		this.keyId = env.RAZORPAY_KEY_ID;
		this.keySecret = env.RAZORPAY_KEY_SECRET;

		if (!this.keyId || !this.keySecret) {
			throw new Error('Razorpay credentials are not configured');
		}
	}

	/**
	 * Create a Razorpay order
	 * @param input - Order creation parameters
	 * @returns Razorpay order response
	 */
	async createOrder(input: ICreateOrderInput): Promise<IRazorpayOrderResponse> {
		const { amount, currency, receipt } = input;

		// Validate input
		if (!amount || amount <= 0) {
			throw new Error('Invalid amount for order creation');
		}

		if (!currency) {
			throw new Error('Currency is required for order creation');
		}

		// Prepare request body
		const orderData = {
			amount: Math.round(amount), // Ensure amount is an integer
			currency: currency.toUpperCase(),
			receipt: receipt || `receipt_${Date.now()}`,
		};

		// Create Basic Auth header
		const authHeader = `Basic ${btoa(`${this.keyId}:${this.keySecret}`)}`;

		try {
			// Call Razorpay API to create order
			const response = await fetch('https://api.razorpay.com/v1/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: authHeader,
				},
				body: JSON.stringify(orderData),
			});

			if (!response.ok) {
				const errorData = await response.json() as any;
				throw new Error(
					`Razorpay order creation failed: ${errorData.error?.description || response.statusText}`
				);
			}

			const order = (await response.json()) as IRazorpayOrderResponse;
			return order;
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to create Razorpay order: ${error.message}`);
			}
			throw new Error('Failed to create Razorpay order: Unknown error');
		}
	}

	/**
	 * Verify Razorpay payment signature
	 * @param input - Payment verification parameters
	 * @returns true if signature is valid, false otherwise
	 */
	async verifyPaymentSignature(input: IVerifyPaymentInput): Promise<boolean> {
		const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = input;

		// Validate input
		if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
			throw new Error('Missing required parameters for signature verification');
		}

		try {
			// Create the expected signature
			const message = `${razorpayOrderId}|${razorpayPaymentId}`;
			const expectedSignature = await this.generateHmacSha256(message, this.keySecret);

			// Compare signatures
			return this.secureCompare(expectedSignature, razorpaySignature);
		} catch (error) {
			console.error('Error verifying payment signature:', error);
			return false;
		}
	}

	/**
	 * Generate HMAC SHA256 signature
	 * @param message - Message to sign
	 * @param secret - Secret key
	 * @returns Hex encoded signature
	 */
	private async generateHmacSha256(message: string, secret: string): Promise<string> {
		// Convert secret and message to Uint8Array
		const encoder = new TextEncoder();
		const keyData = encoder.encode(secret);
		const messageData = encoder.encode(message);

		// Import the key
		const cryptoKey = await crypto.subtle.importKey(
			'raw',
			keyData,
			{ name: 'HMAC', hash: 'SHA-256' },
			false,
			['sign']
		);

		// Sign the message
		const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);

		// Convert to hex string
		return Array.from(new Uint8Array(signature))
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
	}

	/**
	 * Secure string comparison to prevent timing attacks
	 * @param a - First string
	 * @param b - Second string
	 * @returns true if strings are equal, false otherwise
	 */
	private secureCompare(a: string, b: string): boolean {
		if (a.length !== b.length) {
			return false;
		}

		let result = 0;
		for (let i = 0; i < a.length; i++) {
			result |= a.charCodeAt(i) ^ b.charCodeAt(i);
		}

		return result === 0;
	}
}
