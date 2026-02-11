export interface IRazorpayOrderResponse {
	id: string;
	entity: string;
	amount: number;
	amount_paid: number;
	amount_due: number;
	currency: string;
	receipt: string;
	status: string;
	attempts: number;
	created_at: number;
}

export interface ICreateOrderInput {
	amount: number; // Amount in smallest currency unit (paise for INR)
	currency: string;
	receipt: string;
}

export interface IVerifyPaymentInput {
	razorpayOrderId: string;
	razorpayPaymentId: string;
	razorpaySignature: string;
}

export interface IRazorpayService {
	createOrder(input: ICreateOrderInput): Promise<IRazorpayOrderResponse>;
	verifyPaymentSignature(input: IVerifyPaymentInput): Promise<boolean>;
}
