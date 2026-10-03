import { inject,Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model'
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = new BehaviorSubject<Cart>({items:[]});
  private _snackbar = inject(MatSnackBar)
  constructor() { }

  addToCart(item: CartItem): void{
    const items = this.cart.value.items;
    const inCart = items.some((_item) => _item.id === item.id);

    this.cart.next({
      items: inCart
        ? items.map((_item) => _item.id === item.id ? { ..._item, quantity: _item.quantity + 1 } : _item)
        : [...items, item],
    });
    this._snackbar.open('1 item added to the cart.','Ok',{duration: 3000});
  }

  /** Changes an item's quantity by `delta`; quantities never drop below 1 (use removeFromCart for that). */
  changeQuantity(item: CartItem, delta: number): void {
    const items = this.cart.value.items.map((_item) =>
      _item.id === item.id ? { ..._item, quantity: Math.max(1, _item.quantity + delta) } : _item
    );
    this.cart.next({ items });
  }

  getTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getItemCount(items: CartItem[]): number {
    return items.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart(): void {
    this.cart.next({items: []});
    this._snackbar.open('Cart is cleared.','Ok', {duration: 3000});
  }

  removeFromCart(item: CartItem): void {
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    this.cart.next({ items: filteredItems });
    this._snackbar.open('1 item removed from the cart.','Ok', {duration: 3000});
  }
}
