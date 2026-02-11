import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse
} from '../../../core/models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentApiService {
  private readonly API_URL = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  createPaymentOrder(request: CreatePaymentOrderRequest): Observable<ApiResponse<CreatePaymentOrderResponse>> {
    return this.http.post<ApiResponse<CreatePaymentOrderResponse>>(
      `${this.API_URL}/create-order`,
      request
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  verifyPayment(request: VerifyPaymentRequest): Observable<ApiResponse<VerifyPaymentResponse>> {
    return this.http.post<ApiResponse<VerifyPaymentResponse>>(
      `${this.API_URL}/verify`,
      request
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {
    // Extract error message from API response
    const errorMessage = error.error?.error?.message || error.message || 'An error occurred';
    console.error('Payment API error:', errorMessage, error);
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }
}
