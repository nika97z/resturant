import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Header } from '../../header/header';
import { APIService } from '../../API/apiservice';
import { AuthService } from '../../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [Header, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  private http = inject(HttpClient);
  private api = inject(APIService);
  private auth = inject(AuthService);

  products = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.http.get(this.api.getProductsUrl(1, 6), { headers: this.api.getHeaders() }).subscribe({
      next: (res: any) => {
        this.products.set(res.products ?? res.data?.products ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  addToCart(product: any) {
    const headers = this.api.getHeaders(this.auth.getToken());
    this.http.post(this.api.addToCartUrl, { productId: product.id, quantity: 1 }, { headers }).subscribe({
      next: () => {
        this.auth.cartCount.update(c => c + 1);
        this.auth.showCartToast();
      }
    });
  }
}
