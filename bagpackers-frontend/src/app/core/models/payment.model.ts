export interface Payment {
  id: number;
  bookingId: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: string;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: string;
  updatedAt?: string;
}

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
