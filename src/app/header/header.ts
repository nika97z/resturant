import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  private auth = inject(AuthService);

  isLoggedIn = this.auth.isLoggedIn;
  userName = this.auth.userName;
  cartCount = this.auth.cartCount;
  toast = this.auth.toast;
  showDropdown = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.user-menu')) {
      this.showDropdown.set(false);
    }
  }

  hideToast() { this.auth.hideToast(); }

  toggleDropdown() {
    this.showDropdown.set(!this.showDropdown());
  }

  logout() {
    this.auth.logout();
    this.showDropdown.set(false);
  }
}
