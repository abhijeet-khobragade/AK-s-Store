import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Cart, CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  cart: Cart = { items: [] };

  ngOnInit(): void {
    this.cartService.cart
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_cart: Cart) => (this.cart = _cart));
  }

  getTotal(items: CartItem[]): number {
    return this.cartService.getTotal(items);
  }

  getItemCount(items: CartItem[]): number {
    return this.cartService.getItemCount(items);
  }

  onIncreaseQuantity(item: CartItem): void {
    this.cartService.changeQuantity(item, 1);
  }

  onDecreaseQuantity(item: CartItem): void {
    this.cartService.changeQuantity(item, -1);
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  trackById(_index: number, item: CartItem): number {
    return item.id;
  }
}
