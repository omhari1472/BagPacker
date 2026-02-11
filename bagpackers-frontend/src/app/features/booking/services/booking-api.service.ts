import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Booking, CreateBookingRequest, PartnerLocation } from '../../../core/models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingApiService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createBooking(bookingData: CreateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(
      `${this.API_URL}/bookings`,
      bookingData
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(
      `${this.API_URL}/bookings`
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getLocations(region: string, city: string): Observable<ApiResponse<PartnerLocation[]>> {
    return this.http.get<ApiResponse<PartnerLocation[]>>(
      `${this.API_URL}/locations`,
      { params: { region, city } }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {
    // Extract error message from API response
    const errorMessage = error.error?.error?.message || error.message || 'An error occurred';
    console.error('Booking API error:', errorMessage, error);
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }
}
