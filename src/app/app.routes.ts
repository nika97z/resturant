import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Singup } from './pages/singup/singup';
import { Emailverification } from './pages/emailverification/emailverification';
import { ResetPassword } from './pages/reset-password/reset-password';
import { Menu } from './pages/menu/menu';
import { Cart } from './pages/cart/cart';
import { Profile } from './pages/profile/profile';
import { Detals } from './pages/detals/detals';


export const routes: Routes = [
    { path: '', component: Home, pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'singup', component: Singup},
    { path: 'verification', component: Emailverification },
    { path: 'reset-password', component: ResetPassword },
    { path: 'menu', component: Menu },
    { path: 'cart', component: Cart },
    { path: 'profile', component: Profile },
    { path: 'detals/:id', component: Detals}
];
