import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsHeaderComponent } from './pages/home/components/products-header/products-header.component';
import { Cart } from './models/cart.model';
import { CartService } from './services/cart.service';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  imports: [NgIf, RouterOutlet, HeaderComponent,HomeComponent,ProductsHeaderComponent],
  template: `
    <app-header *ngIf="isLoggedIn" [cart]="cart"></app-header>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit{
  cart: Cart = { items: []};
  isLoggedIn = false;

  constructor(private cartService: CartService, private authService: AuthService) {}

  ngOnInit(): void {
      this.authService.user.subscribe((user) => {
          this.isLoggedIn = !!user;
      });
      this.cartService.cart.subscribe((_cart) => {
          this.cart = _cart
      });
  }

}
