import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, switchMap, debounceTime, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';
import { APIService } from '../../API/apiservice';
import { AuthService } from '../../auth/auth.service';
import { Header } from '../../header/header';

export interface Category {
  id: number | string;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  rate: number;
  price: number;
  spicy?: boolean;
}

export interface Filters {
  vegetarian: boolean;
  spiciness: number;
  minRating: number;
  minPrice: number;
  maxPrice: number;
  search: string;
  categoryId: string | number;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Header],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Menu implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly api = inject(APIService);
  private readonly auth = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly PAGE_SIZE = 12;
  readonly MAX_PRICE = 500;

  searchQuery = '';
  filters: Filters = this.getDefaultFilters();
  categories: Category[] = [];
  products: Product[] = [];
  isLoading = true;
  hasError = false;
  currentPage = 1;
  hasNextPage = false;

  get maxPricePct(): string {
    return ((this.filters.maxPrice / this.MAX_PRICE) * 100).toFixed(1) + '%';
  }

  private readonly filterChange$ = new Subject<void>();
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadCategories();
    this.setupFilterStream();
    this.triggerFilter();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterChange(): void {
    this.filters.search = this.searchQuery;
    this.currentPage = 1;
    this.triggerFilter();
  }

  clearAll(): void {
    this.filters = this.getDefaultFilters();
    this.searchQuery = '';
    this.currentPage = 1;
    this.triggerFilter();
  }

  goToPage(page: number): void {
    if (page < 1) return;
    this.currentPage = page;
    this.triggerFilter();
  }

  addToCart(product: Product): void {
    const headers = this.api.getHeaders(this.auth.getToken());
    this.http.post(this.api.addToCartUrl, { productId: product.id, quantity: 1 }, { headers }).subscribe({
      next: () => {
        this.auth.cartCount.update(c => c + 1);
        this.auth.showCartToast();
        this.cdr.detectChanges();
      }
    });
  }

  private getDefaultFilters(): Filters {
    return { vegetarian: false, spiciness: 0, minRating: 0, minPrice: 0, maxPrice: this.MAX_PRICE, search: '', categoryId: '' };
  }

  private triggerFilter(): void {
    this.filterChange$.next();
  }

  private setupFilterStream(): void {
    this.filterChange$.pipe(
      debounceTime(300),
      switchMap(() => {
        this.isLoading = true;
        this.hasError = false;
        this.cdr.detectChanges();
        this.filters.search = this.searchQuery;
        const url = this.api.filterProductsUrl(this.currentPage, this.PAGE_SIZE, this.filters);
        return this.http.get<any>(url, { headers: this.api.getHeaders() });
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        this.products = response?.products ?? response?.data?.products ?? [];
        this.hasNextPage = this.products.length >= this.PAGE_SIZE;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
        this.products = [];
        this.cdr.detectChanges();
      }
    });
  }

  private loadCategories(): void {
    this.http.get<any>(this.api.categoriesUrl, { headers: this.api.getHeaders() }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: any) => {
        this.categories = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.categories = [];
        this.cdr.detectChanges();
      }
    });
  }
}
