import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { PRODUCTS } from '../data/products';

export type SortOrder = 'asc' | 'desc';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // Returns Observables so this can later be swapped for HTTP calls to a real products API.

  getProducts(limit: number, sort: SortOrder, category?: string): Observable<Product[]> {
    const products = PRODUCTS
      .filter((product) => !category || product.category === category)
      .sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price))
      .slice(0, limit);
    return of(products);
  }

  getCategories(): Observable<string[]> {
    return of([...new Set(PRODUCTS.map((product) => product.category))]);
  }
}
