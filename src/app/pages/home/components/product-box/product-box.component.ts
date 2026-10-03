import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-product-box',
  imports: [CommonModule, CurrencyPipe, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-box.component.html'
})
export class ProductBoxComponent {
  @Input() fullWidthMode = false;
  @Input({ required: true }) product!: Product;

  @Output() addToCart = new EventEmitter<Product>();

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
