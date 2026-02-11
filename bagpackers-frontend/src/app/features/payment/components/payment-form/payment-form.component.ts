import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentApiService } from '../../services/payment-api.service';
import { Booking } from '../../../../core/models/booking.model';
import { environment } from '../../../../../environments/environment';

declare var Razorpay: any;

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  paymentForm: FormGroup;
  booking = signal<Booking | null>(null);
  isProcessing = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private paymentApiService: PaymentApiService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;
    
    if (state && state['booking']) {
      this.booking.set(state['booking']);
    }

    this.paymentForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const currentBooking = this.booking();
    
    if (!currentBooking) {
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.markFormGroupTouched(this.paymentForm);
      return;
    }

    const currentBooking = this.booking();
    if (!currentBooking) {
      this.errorMessage.set('Booking information not found');
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set(null);

    // Create payment order
    this.paymentApiService.createPaymentOrder({ bookingId: currentBooking.id }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.openRazorpayCheckout(response.data);
        } else {
          this.isProcessing.set(false);
          this.errorMessage.set('Failed to create payment order');
        }
      },
      error: (error) => {
        this.isProcessing.set(false);
        this.errorMessage.set(
          error.error?.error?.message || 'Failed to create payment order'
        );
      }
    });
  }

  private openRazorpayCheckout(orderData: { orderId: string; amount: number; currency: string }): void {
    const formValues = this.paymentForm.value;
    const currentBooking = this.booking();

    const options = {
      key: environment.razorpayKey,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'BagPackers',
      description: `Luggage Storage - ${currentBooking?.region}`,
      order_id: orderData.orderId,
      prefill: {
        name: formValues.fullName,
        email: formValues.email,
        contact: formValues.mobile
      },
      notes: {
        address: formValues.address,
        bookingId: currentBooking?.id
      },
      theme: {
        color: '#3399cc'
      },
      handler: (response: any) => {
        this.handlePaymentSuccess(response);
      },
      modal: {
        ondismiss: () => {
          this.handlePaymentFailure('Payment cancelled by user');
        }
      }
    };

    const razorpay = new Razorpay(options);
    
    razorpay.on('payment.failed', (response: any) => {
      this.handlePaymentFailure(response.error.description);
    });

    razorpay.open();
  }

  private handlePaymentSuccess(response: any): void {
    const currentBooking = this.booking();
    
    if (!currentBooking) {
      this.isProcessing.set(false);
      this.errorMessage.set('Booking information not found');
      return;
    }

    // Verify payment with backend
    this.paymentApiService.verifyPayment({
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
      bookingId: currentBooking.id
    }).subscribe({
      next: (verifyResponse) => {
        this.isProcessing.set(false);
        if (verifyResponse.success && verifyResponse.data?.success) {
          // Payment successful, navigate to success page or dashboard
          alert('Payment successful! Your booking is confirmed.');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set('Payment verification failed');
        }
      },
      error: (error) => {
        this.isProcessing.set(false);
        this.errorMessage.set(
          error.error?.error?.message || 'Payment verification failed'
        );
      }
    });
  }

  private handlePaymentFailure(errorMessage: string): void {
    this.isProcessing.set(false);
    this.errorMessage.set(errorMessage || 'Payment failed. Please try again.');
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    const currentBooking = this.booking();
    if (currentBooking) {
      this.router.navigate(['/map'], {
        state: { booking: currentBooking }
      });
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  get totalCost(): number {
    const currentBooking = this.booking();
    return currentBooking ? currentBooking.totalCost : 0;
  }

  get numberOfBags(): number {
    const currentBooking = this.booking();
    return currentBooking ? currentBooking.numberOfBags : 0;
  }

  get region(): string {
    const currentBooking = this.booking();
    return currentBooking ? currentBooking.region : '';
  }

  get city(): string {
    const currentBooking = this.booking();
    return currentBooking ? currentBooking.city : '';
  }

  // Form field getters for validation
  get fullName() {
    return this.paymentForm.get('fullName');
  }

  get email() {
    return this.paymentForm.get('email');
  }

  get mobile() {
    return this.paymentForm.get('mobile');
  }

  get address() {
    return this.paymentForm.get('address');
  }
}
