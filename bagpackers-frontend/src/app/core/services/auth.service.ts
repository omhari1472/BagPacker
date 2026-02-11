import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signal for reactive state management
  public isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.storageService.getToken();
    if (token) {
      this.isAuthenticated.set(true);
      this.loadCurrentUser();
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.API_URL}/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.handleAuthSuccess(response.data);
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  register(userData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.API_URL}/auth/register`,
      userData
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.handleAuthSuccess(response.data);
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  googleLogin(code: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.get<ApiResponse<AuthResponse>>(
      `${this.API_URL}/auth/google`,
      { params: { code } }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.handleAuthSuccess(response.data);
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      `${this.API_URL}/auth/me`
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.currentUserSubject.next(response.data);
        }
      }),
      catchError(error => this.handleError(error))
    );
  }

  logout(): void {
    this.storageService.removeToken();
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.storageService.getToken();
  }

  isLoggedIn(): boolean {
    return this.storageService.hasToken();
  }

  private handleAuthSuccess(authData: AuthResponse): void {
    this.storageService.setToken(authData.token);
    this.currentUserSubject.next(authData.user);
    this.isAuthenticated.set(true);
  }

  private loadCurrentUser(): void {
    this.getCurrentUser().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentUserSubject.next(response.data);
        }
      },
      error: () => {
        // Token might be invalid, clear it
        this.logout();
      }
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('Auth error:', error);
    return throwError(() => error);
  }
}
