import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface AuthResponse {
  success?: boolean;
  token?: string;
  user?: any;
  message?: string;
  errorType?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): AuthResponse | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    const user = this.currentUserValue;
    return !!user?.token;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            localStorage.setItem('currentUser', JSON.stringify(response));
            this.currentUserSubject.next(response);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(user: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred. Please try again.';
    
    if (error.error.message) {
      errorMessage = error.error.message;
    }

    switch (error.error.errorType) {
      case 'USER_NOT_FOUND':
        errorMessage = 'You are not registered. Please register first.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'USER_EXISTS':
        errorMessage = 'Email is already registered. Please login instead.';
        break;
      case 'WEAK_PASSWORD':
        errorMessage = error.error.errors ? error.error.errors.join(' ') : 'Password is not strong enough.';
        break;
    }

    return throwError(() => errorMessage);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): Observable<AuthResponse | null> {
    return this.currentUser;
  }
}