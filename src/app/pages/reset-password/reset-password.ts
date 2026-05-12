import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { APIService } from '../../API/apiservice';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],
})
export class ResetPassword implements OnInit {
  private http = inject(HttpClient);
  private api = inject(APIService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = '';
  isLoading = false;
  message = '';
  isSuccess = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  sendResetLink() {
    if (!this.email) {
      alert('Please enter your email address.');
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.http.post(this.api.forgetPasswordUrl(this.email), {}, {
      headers: {
        'accept': 'application/json',
        'X-API-KEY': this.api.APIKEY
      }
    })
      .subscribe({
        next: (response: any) => {
          console.log('Password reset email sent:', response);
          this.message = 'Password reset link sent! Check your email.';
          this.isSuccess = true;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to send reset email:', error);
          this.message = 'Failed to send reset link. Please try again.';
          this.isSuccess = false;
          this.isLoading = false;
        }
      });
  }
}
