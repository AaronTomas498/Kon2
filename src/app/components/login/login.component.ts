import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  // Tipalo si puedes.
  user: any;

  async login() {
    try {
      const result = await this.authService.loginWithGoogle();
      if (result) {
        this.ngZone.run(() => {
          this.router.navigate(['/home']);
        });
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
    }
  }

  ngOnInit() {
    // se puede tipar el user dentro de la suscripcion?
    this.authService
      .getCurrentUser()
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        this.user = user;
        if (user) {
          this.router.navigate(['/home']);
        }
      });
  }
}
