import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Header } from '../../header/header';
import { APIService } from '../../API/apiservice';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [Header, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private http = inject(HttpClient);
  private api = inject(APIService);
  private auth = inject(AuthService);

  isLoading = signal(true);
  isSaving = signal(false);
  showToast = signal(false);
  showError = signal(false);
  errorMessage = signal('');
  activeTab = signal<'personal' | 'password' | 'account'>('personal');

  showCurrentPwd = signal(false);
  showNewPwd = signal(false);
  isChangingPwd = signal(false);

  passwords = {
    current: '',
    newPwd: '',
    confirm: ''
  };

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    age: '' as any,
    picture: ''
  };

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading.set(true);
    const headers = this.api.getHeaders(this.auth.getToken());
    this.http.get(this.api.profileUrl, { headers }).subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.profile.firstName = data.firstName || '';
        this.profile.lastName = data.lastName || '';
        this.profile.email = data.email || '';
        this.profile.phoneNumber = data.phoneNumber || data.phone || '';
        this.profile.address = data.address || '';
        this.profile.age = data.age || '';
        this.profile.picture = data.picture || data.avatar || '';
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  saveChanges() {
    this.isSaving.set(true);
    const headers = this.api.getHeaders(this.auth.getToken());
    const age = Number(this.profile.age);
    this.http.put(this.api.editProfileUrl, {
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      phoneNumber: this.profile.phoneNumber || null,
      address: this.profile.address,
      age: age >= 1 && age <= 120 ? age : null,
      picture: this.profile.picture || null
    }, { headers }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.showToast.set(true);
        setTimeout(() => this.showToast.set(false), 3000);
      },
      error: (err) => {
        this.isSaving.set(false);
        const detail = err.error?.detail || 'Failed to save. Please try again.';
        this.errorMessage.set(detail);
        this.showError.set(true);
        setTimeout(() => this.showError.set(false), 5000);
      }
    });
  }

  closeToast() {
    this.showToast.set(false);
  }

  closeError() {
    this.showError.set(false);
  }

  deleteAccount() {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    const headers = this.api.getHeaders(this.auth.getToken());
    this.http.delete(this.api.profileUrl, { headers }).subscribe({
      next: () => {
        this.auth.logout();
      },
      error: (err) => {
        const detail = err.error?.detail || 'Failed to delete account.';
        this.errorMessage.set(detail);
        this.showError.set(true);
        setTimeout(() => this.showError.set(false), 5000);
      }
    });
  }

  changePassword() {
    if (this.passwords.newPwd !== this.passwords.confirm) {
      this.errorMessage.set('New passwords do not match.');
      this.showError.set(true);
      setTimeout(() => this.showError.set(false), 4000);
      return;
    }
    this.isChangingPwd.set(true);
    const headers = this.api.getHeaders(this.auth.getToken());
    this.http.put(this.api.changePasswordUrl, {
      oldPassword: this.passwords.current,
      newPassword: this.passwords.newPwd,
      confirmPassword: this.passwords.confirm
    }, { headers }).subscribe({
      next: () => {
        this.isChangingPwd.set(false);
        this.passwords = { current: '', newPwd: '', confirm: '' };
        this.showToast.set(true);
        setTimeout(() => this.showToast.set(false), 3000);
      },
      error: (err) => {
        this.isChangingPwd.set(false);
        const detail = err.error?.detail || 'Failed to change password.';
        this.errorMessage.set(detail);
        this.showError.set(true);
        setTimeout(() => this.showError.set(false), 5000);
      }
    });
  }
}
