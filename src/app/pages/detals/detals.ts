import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Header } from '../../header/header';
import { APIService } from '../../API/apiservice';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-detals',
  standalone: true,
  imports: [CommonModule, Header],
  templateUrl: './detals.html',
  styleUrl: './detals.scss',
})
export class Detals implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private api = inject(APIService);
  private auth = inject(AuthService);

  // signal() tells Angular to update the page automatically when the value changes
  product = signal<any>(null);
  isLoading = signal(true);
  quantity = signal(1);
  added = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.http.get(this.api.detalsUrl(Number(id)), { headers: this.api.getHeaders() }).subscribe({
      next: (res: any) => {
        this.product.set(res.product ?? res.data ?? res);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  stars(): string[] {
    const rate = Math.round(this.product()?.rate ?? 0);
    const result = [];
    for (let i = 0; i < 5; i++) {
      result.push(i < rate ? 'full' : 'empty');
    }
    return result; 
  }

  decrease() {
    if (this.quantity() > 1) this.quantity.update(q => q - 1);
  }

  increase() {
    this.quantity.update(q => q + 1);
  }

  addToCart() {
    const headers = this.api.getHeaders(this.auth.getToken());
    this.http.post(this.api.addToCartUrl, { productId: this.product().id, quantity: this.quantity() }, { headers }).subscribe({
      next: () => {
        this.added.set(true);
        setTimeout(() => this.added.set(false), 1500);
      }
    });
  }
}
