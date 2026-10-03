import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Requires a logged-in user; otherwise sends them to the login page.
export const authGuard: CanActivateFn = () => {
  // The session cookie is only checked in the browser.
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }
  const router = inject(Router);
  return inject(AuthService).isLoggedIn().pipe(
    map((loggedIn) => (loggedIn ? true : router.createUrlTree(['/login'])))
  );
};

// Keeps logged-in users away from the login page.
export const guestGuard: CanActivateFn = () => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }
  const router = inject(Router);
  return inject(AuthService).isLoggedIn().pipe(
    map((loggedIn) => (loggedIn ? router.createUrlTree(['/home']) : true))
  );
};
