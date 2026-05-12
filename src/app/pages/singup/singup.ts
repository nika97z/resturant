import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { APIService } from '../../API/apiservice';

@Component({
  selector: 'app-singup',
  imports: [FormsModule, RouterLink],
  templateUrl: './singup.html',
  styleUrls: ['./singup.scss'],
})
export class Singup {
  private http = inject(HttpClient);
  private api = inject(APIService);
  private router = inject(Router);

  userData = { firstName: '', lastName: '', email: '', password: '' };
  showPassword = signal(false);
  errorMessage = signal('');

  register() {
    this.errorMessage.set('');
    this.http.post(this.api.registerUrl, this.userData, {
      headers: { 'accept': 'application/json', 'X-API-KEY': this.api.APIKEY }
    }).subscribe({
      next: (response: any) => {
        this.router.navigate(['/verification'], { queryParams: { email: this.userData.email } });
      },
      error: (error) => {
        this.errorMessage.set(error.error?.detail || 'Registration failed. Please try again.');
      }
    });
  }
}
