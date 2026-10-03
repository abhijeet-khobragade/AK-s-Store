import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-header',
  imports: [MatToolbarModule,MatButtonModule,MatIconModule,MatBadgeModule,MatMenuModule,CurrencyPipe,CommonModule,RouterLink],
  templateUrl:'./header.component.html',
})
export class HeaderComponent {
  private _cart: Cart = { items: [] };
  itemsQuantity = 0;

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;

    this.itemsQuantity = cart.items
    .map((item) => item.quantity)
    .reduce((prev, current) => prev + current , 0);

  }

  constructor(private cartService: CartService, private authService: AuthService, private router: Router){

  }

  onLogout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }


  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart() {
    this.cartService.clearCart();
  }

}
