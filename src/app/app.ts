import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Footer } from './footer/footer';
import { createChat } from '@n8n/chat';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {

  ngOnInit(){
    createChat({
      webhookUrl: 'https://zirakishvili3.app.n8n.cloud/webhook/165546a8-ea4b-4e8e-a2f4-28f5c5c96f98/chat'
    })
  }

  protected readonly title = signal('resturant');

  constructor() {
    inject(AuthService).checkAuth();
  }

  
}
