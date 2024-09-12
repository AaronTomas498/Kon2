import { Component, inject, NgZone, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from '../login/login.component';
import { ChatComponent } from '../chat/chat.component';
import { User } from '@firebase/auth-types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    LoginComponent,
    ChatComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;

  private authService = inject(AuthService);
  private router= inject(Router);
  private ngZine = inject(NgZone);

  async logout() {
    try {
      await this.authService.logout();
      this.user = null;
      console.log('Sesión cerrada');
      this.router.navigate(['/home']); // Redirige para cargar el login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  ngOnInit() {
    // Escuchar el estado de autenticación y actualizar `user`
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      if (!user) {
        this.router.navigate(['/home']); // Redirige si no hay usuario autenticado
      }
    });
  }
}
