import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '../../../core/models/user.model';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.API_URL}/login`,
      credentials
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  register(userData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.API_URL}/register`,
      userData
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  googleOAuth(code: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.get<ApiResponse<AuthResponse>>(
      `${this.API_URL}/google`,
      { params: { code } }
    ).pipe(
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: any): Observable<never> {
    // Extract error message from API response
    const errorMessage = error.error?.error?.message || error.message || 'An error occurred';
    console.error('Auth API error:', errorMessage, error);
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }
}
