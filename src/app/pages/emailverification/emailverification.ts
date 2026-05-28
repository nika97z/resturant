

import { Component, inject, OnInit } from '@angular/core';
import { APIService } from '../../API/apiservice';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-emailverification',
  imports: [FormsModule],
  templateUrl: './emailverification.html',
  styleUrls: ['./emailverification.scss'],
})
export class Emailverification implements OnInit {
  private http = inject(HttpClient);
  private api = inject(APIService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = '';
  code = '';
  isLoading = false;
  isResending = false;
  resendMessage = '';

  ngOnInit() {
    // Read email from query params
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  sendVerificationEmail() {
    if (!this.email) {
      alert('Please enter your email address.');
      return;
    }

    this.http.post(this.api.getEmailVerifyUrl(this.email), {}, {
      headers: {
        'accept': 'application/json',
        'X-API-KEY': this.api.APIKEY
      }
    })
      .subscribe({
        next: (response: any) => {
          alert('Verification email sent! Check your inbox.');
        },
        error: (error) => {
          console.error('Failed to send verification email:', error);
          alert('Failed to send verification email. Please try again.');
        }
      });
  }

  verifyEmail() {
    if (!this.code) {
      alert('Please enter the verification code.');
      return;
    }

    // Use PUT request with JSON body
    this.http.put(this.api.verifyEmailUrl, { email: this.email, code: this.code }, {
      headers: {
        'accept': 'application/json',
        'X-API-KEY': this.api.APIKEY
      }
    })
      .subscribe({
        next: (response: any) => {
          alert('Email verified successfully! Please login.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Failed to verify email:', error);
          alert('Failed to verify email. Please try again.');
        }
      });
  }

  resendVerification() {
    if (!this.email) {
      alert('No email address found.');
      return;
    }

    this.isResending = true;
    this.resendMessage = '';

    this.http.post(this.api.resendEmailVerifyUrl(this.email), {}, {
      headers: {
        'accept': 'application/json',
        'X-API-KEY': this.api.APIKEY
      }
    })
      .subscribe({
        next: (response: any) => {
          this.resendMessage = 'Verification code sent again! Check your inbox.';
          this.isResending = false;
        },
        error: (error) => {
          console.error('Failed to resend verification code:', error);
          this.resendMessage = 'Failed to resend code. Please try again.';
          this.isResending = false;
        }
      });
  }
}