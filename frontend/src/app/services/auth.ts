import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  // Comprueba si hay un token guardado
  estaLogueado(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // Devuelve los datos del usuario (nombre, email...)
  obtenerUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  // Borra los datos y te echa al login
  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}