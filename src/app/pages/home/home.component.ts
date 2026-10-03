import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsHeaderComponent } from './components/products-header/products-header.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ProductBoxComponent } from './components/product-box/product-box.component';
import { CartService } from '../../services/cart.service';
import { SortOrder, StoreService } from '../../services/store.service';
import { Product } from '../../models/product.model';

// Columns on large screens; smaller screens step down automatically.
const GRID_CLASSES: { [cols: number]: string } = {
  1: 'grid-cols-1',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

@Component({
  selector: 'app-home',
  imports: [CommonModule, ProductsHeaderComponent, FiltersComponent, ProductBoxComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  cols = 3;
  category: string | undefined;
  sort: SortOrder = 'desc';
  count = 12;
  products: Product[] = [];
  categories: string[] = [];

  constructor(private cartService: CartService, private storeService: StoreService) {}

  get gridClass(): string {
    return GRID_CLASSES[this.cols];
  }

  ngOnInit(): void {
    this.storeService.getCategories().subscribe((categories) => (this.categories = categories));
    this.getProducts();
  }

  getProducts(): void {
    this.storeService
      .getProducts(this.count, this.sort, this.category)
      .subscribe((products) => (this.products = products));
  }

  onColumnsCountChange(colsNum: number): void {
    this.cols = colsNum;
  }

  onItemsCountChange(count: number): void {
    this.count = count;
    this.getProducts();
  }

  onSortChange(sort: SortOrder): void {
    this.sort = sort;
    this.getProducts();
  }

  onShowCategory(newCategory: string | undefined): void {
    this.category = newCategory;
    this.getProducts();
  }

  trackById(_index: number, product: Product): number {
    return product.id;
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id,
    });
  }
}
