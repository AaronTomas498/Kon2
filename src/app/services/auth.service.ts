import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData?: firebase.User | null; // Propiedad para almacenar los datos del usuario

  constructor(private afAuth: AngularFireAuth) {
    // Suscribirse al estado de autenticación para obtener los datos del usuario
    this.afAuth.authState.subscribe((user) => {
      this.userData = user || null;
      console.log('Datos del usuario capturados:', this.userData);
    });
  }

  // Método para iniciar sesión con Google usando un popup
  async loginWithGoogle(): Promise<any> {
    try {
      await this.logout(); // Cierra cualquier sesión anterior
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' }); // Fuerza la selección de cuenta
      const result = await this.afAuth.signInWithPopup(provider);
      return result.user;
    } catch (error) {
      console.error('Error en la autenticación con Google:', error);
      throw error;
    }
  }

  // Método para cerrar sesión y limpiar los datos del usuario
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut(); // Cierra la sesión actual
      this.userData = null; // Limpia los datos del usuario
      console.log('Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Método para obtener el estado del usuario como un Observable
  getCurrentUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }
}
