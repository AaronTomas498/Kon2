import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'home',
    loadComponent:() =>
    import('./components/home/home.component').then((m) => m.HomeComponent)
  },
  { path: 'login',
    loadComponent:() =>
    import('./components/login/login.component').then((m) => m.LoginComponent)
  },
  { path: 'chat',
    loadComponent:() =>
    import('./components/chat/chat.component').then((m) => m.ChatComponent), canActivate: [AuthGuard]
  },
];
