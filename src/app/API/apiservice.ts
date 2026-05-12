import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  public APIKEY = 'f119c869-2161-41e9-b12e-b26aa95f8127';
  public loginUrl = 'https://restaurantapi.stepacademy.ge/api/auth/login';
  public registerUrl = 'https://restaurantapi.stepacademy.ge/api/auth/register';
  
  getEmailVerifyUrl(email: string): string {
    return `https://restaurantapi.stepacademy.ge/api/auth/resend-email-verification/${email}`;
  }
  public verifyEmailUrl = 'https://restaurantapi.stepacademy.ge/api/auth/verify-email';

  resendEmailVerifyUrl(email: string): string {
    return `https://restaurantapi.stepacademy.ge/api/auth/resend-email-verification/${email}`;
  }

  forgetPasswordUrl(email: string): string {
    return `https://restaurantapi.stepacademy.ge/api/auth/forgot-password/${email}`;
  }

  getProductsUrl(page: number, take: number): string {
    return `https://restaurantapi.stepacademy.ge/api/products?Take=${take}&Page=${page}`;
  }

  filterProductsUrl(page: number, take: number, filters: any): string {
    const categoryId = filters.categoryId ? filters.categoryId.toString() : '';
    const params = new URLSearchParams({
      Take: take.toString(),
      Page: page.toString(),
      Vegetarian: filters.vegetarian ? 'true' : 'false',
      Spiciness: filters.spiciness.toString(),
      Rate: filters.minRating.toString(),
      MinPrice: filters.minPrice.toString(),
      MaxPrice: filters.maxPrice.toString(),
      CategoryId: categoryId,
      Query: filters.search || ''
    });
    const url = `https://restaurantapi.stepacademy.ge/api/products/filter?${params.toString()}`;
    console.log('Filter URL:', url);
    return url;
  }

  public categoriesUrl = 'https://restaurantapi.stepacademy.ge/api/categories';
  
  public addToCartUrl = 'https://restaurantapi.stepacademy.ge/api/cart/add-to-cart';
  public getCartUrl = 'https://restaurantapi.stepacademy.ge/api/cart';
  public editCartQuantityUrl = 'https://restaurantapi.stepacademy.ge/api/cart/edit-quantity';
  
  removeFromCartUrl(itemId: number): string {
    return `https://restaurantapi.stepacademy.ge/api/cart/remove-from-cart/${itemId}`;
  }
  
  public checkoutUrl = 'https://restaurantapi.stepacademy.ge/api/cart/checkout';

  public profileUrl = 'https://restaurantapi.stepacademy.ge/api/users/profile';

  public editProfileUrl = 'https://restaurantapi.stepacademy.ge/api/users/edit';
  
  public changePasswordUrl = 'https://restaurantapi.stepacademy.ge/api/users/change-password';

  getHeaders(token = ''): { [key: string]: string } {
    const headers: { [key: string]: string } = {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      'X-API-KEY': this.APIKEY
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }
  detalsUrl(itemId: number){
    return `https://restaurantapi.stepacademy.ge/api/products/${itemId}`
  }
}
