import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { APIService } from '../../API/apiservice';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private http = inject(HttpClient);
  private api = inject(APIService);
  private auth = inject(AuthService);
  private router = inject(Router);

  credentials = { email: '', password: '' };
  showPassword = signal(false);
  errorMessage = signal('');

  login() {
    this.errorMessage.set('');
    this.http.post(this.api.loginUrl, this.credentials, {
      headers: { 'accept': 'application/json', 'X-API-KEY': this.api.APIKEY }
    }).subscribe({
      next: (response: any) => {
        this.auth.login(response);
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage.set('Invalid email or password. Please try again.');
      }
    });
  }
}
