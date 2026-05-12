import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Header } from '../../header/header';
import { APIService } from '../../API/apiservice';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [Header],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class Cart implements OnInit {
  private http = inject(HttpClient);
  private api = inject(APIService);
  private auth = inject(AuthService);
  private router = inject(Router);

  items = signal<any[]>([]);
  isLoading = signal(true);

  getPrice(item: any): number { return item.product?.price ?? item.price ?? 0; }
  getName(item: any): string { return item.product?.name ?? item.name ?? ''; }
  getImage(item: any): string { return item.product?.image ?? item.image ?? ''; }
  getDesc(item: any): string { return item.product?.description ?? item.description ?? ''; }

  subtotal = computed(() => this.items().reduce((sum, item) => sum + this.getPrice(item) * item.quantity, 0));
  tax = computed(() => this.subtotal() * 0.1);
  total = computed(() => this.subtotal() + this.tax());

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading.set(true);
    const headers = this.api.getHeaders(this.auth.getToken());
    this.http.get(this.api.getCartUrl, { headers }).subscribe({
      next: (res: any) => {
        const items = res.items ?? res.data?.items ?? [];
        this.items.set(items);
        this.auth.cartCount.set(items.length);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  updateQuantity(item: any, delta: number) {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    const headers = this.api.getHeaders(this.auth.getToken());
    this.http.put(this.api.editCartQuantityUrl, { itemId: item.id, quantity: newQty }, { headers }).subscribe({
      next: () => this.items.update(list =>
        list.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
      )
    });
  }

  removeItem(item: any) {
    const headers = this.api.getHeaders(this.auth.getToken());
    this.http.delete(this.api.removeFromCartUrl(item.id), { headers }).subscribe({
      next: () => {
        this.items.update(list => list.filter(i => i.id !== item.id));
        this.auth.cartCount.update(c => Math.max(0, c - 1));
      }
    });
  }

  checkout() {
    const headers = this.api.getHeaders(this.auth.getToken());
    this.http.post(this.api.checkoutUrl, {}, { headers }).subscribe({
      next: () => {
        this.items.set([]);
        this.auth.cartCount.set(0);
        this.auth.showCheckoutToast();
      }
    });
  }

  goToMenu() {
    this.router.navigate(['/menu']);
  }
}
