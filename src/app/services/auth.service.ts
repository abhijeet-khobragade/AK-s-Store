import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

interface UserResponse {
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private sessionChecked = false;

  /** Email of the logged-in user, or null. */
  user = new BehaviorSubject<string | null>(null);

  login(email: string, password: string): Observable<string> {
    return this.http.post<UserResponse>('/api/auth/login', { email, password }).pipe(
      map((res) => res.email),
      tap((userEmail) => {
        this.sessionChecked = true;
        this.user.next(userEmail);
      })
    );
  }

  /** Creates the account and logs the new user in. */
  register(email: string, password: string): Observable<string> {
    return this.http.post<UserResponse>('/api/auth/register', { email, password }).pipe(
      map((res) => res.email),
      tap((userEmail) => {
        this.sessionChecked = true;
        this.user.next(userEmail);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}).pipe(
      catchError(() => of(undefined)),
      // Clear the user before callers navigate, so the login page's guard sees them as logged out.
      tap(() => this.user.next(null))
    );
  }

  /** Asks the server whether the session cookie is still valid (only once per page load). */
  isLoggedIn(): Observable<boolean> {
    if (this.sessionChecked) {
      return of(!!this.user.value);
    }
    return this.http.get<UserResponse>('/api/auth/me').pipe(
      map((res) => {
        this.user.next(res.email);
        return true;
      }),
      catchError(() => {
        this.user.next(null);
        return of(false);
      }),
      tap(() => (this.sessionChecked = true))
    );
  }
}
