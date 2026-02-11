import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

export interface Partner {
  id: number;
  fullName: string;
  region: string;
  mobileNumber: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface RegisterPartnerRequest {
  fullName: string;
  region: string;
  mobileNumber: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartnerApiService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registerPartner(partnerData: RegisterPartnerRequest): Observable<ApiResponse<Partner>> {
    return this.http.post<ApiResponse<Partner>>(
      `${this.API_URL}/partners/register`,
      partnerData
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {
    // Extract error message from API response
    const errorMessage = error.error?.error?.message || error.message || 'An error occurred';
    console.error('Partner API error:', errorMessage, error);
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }
}
