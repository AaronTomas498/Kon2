import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'; 
import { NgZone } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: any;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private ngZone: NgZone 
  ) {}

  async login() {
    try {
      const result = await this.authService.loginWithGoogle();
      if (result) {
        this.ngZone.run(() => {
          this.router.navigate(['/home']); // Redirige a 'home' para cargar el chat
        });
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
    }
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      if (user) {
        this.router.navigate(['/home']); // Redirige si ya está autenticado
      }
    });
  }
}
