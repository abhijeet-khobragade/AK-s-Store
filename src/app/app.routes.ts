import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'cart', component: CartComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
];
