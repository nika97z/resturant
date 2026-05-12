import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  isLoggedIn = signal(false);
  isVerified = signal(false);
  userName = signal('');
  cartCount = signal(0);
  toast = signal<{ title: string; message: string } | null>(null);
  private toastTimer: any;

  showToast(title: string, message: string) {
    clearTimeout(this.toastTimer);
    this.toast.set({ title, message });
    this.toastTimer = setTimeout(() => this.toast.set(null), 3000);
  }

  hideToast() {
    clearTimeout(this.toastTimer);
    this.toast.set(null);
  }

  showCartToast() {
    this.showToast('Added to cart', 'Product has been added to your cart');
  }

  showCheckoutToast() {
    this.showToast('Thank you for your purchase!', 'Your order has been placed and is being processed.');
  }

  private accessToken = '';
  private refreshToken = '';

  private getNameFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const name = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      return Array.isArray(name) ? name[0] : name || '';
    } catch {
      return '';
    }
  }

  login(response: any) {
    const data = response.data || response;
    this.accessToken = data.accessToken || '';
    this.refreshToken = data.refreshToken || '';
    this.isVerified.set(data.isVerified || false);
    this.isLoggedIn.set(true);
    this.userName.set(this.getNameFromToken(this.accessToken));
    if (this.isBrowser) {
      localStorage.setItem('session', JSON.stringify({
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        isVerified: this.isVerified()
      }));
    }
  }

  logout() {
    this.accessToken = '';
    this.refreshToken = '';
    this.isVerified.set(false);
    this.isLoggedIn.set(false);
    this.userName.set('');
    this.cartCount.set(0);
    if (this.isBrowser) {
      localStorage.removeItem('session');
    }
  }

  getToken(): string {
    return this.accessToken || this.refreshToken;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  checkAuth() {
    if (!this.isBrowser) return;
    const raw = localStorage.getItem('session');
    if (!raw) return;
    try {
      const session = JSON.parse(raw);
      const token = session.accessToken || '';
      if (!token || this.isTokenExpired(token)) {
        localStorage.removeItem('session');
        return;
      }
      this.accessToken = token;
      this.refreshToken = session.refreshToken || '';
      this.isVerified.set(session.isVerified || false);
      this.isLoggedIn.set(true);
      this.userName.set(this.getNameFromToken(this.accessToken));
    } catch {
      localStorage.removeItem('session');
    }
  }
}
