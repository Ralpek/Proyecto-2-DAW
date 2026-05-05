import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  private http = inject(HttpClient);
  private router = inject(Router);

  credenciales = { username: '', password: '' };
  mensajeError = '';

  hacerLogin() {
    this.http.post<any>('http://localhost:8002/api/login', this.credenciales).subscribe({
      next: (respuesta) => {
        // Guardamos el token y el usuario en el navegador
        localStorage.setItem('token', respuesta.token);
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
        
        // Navegamos al panel de inicio
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.mensajeError = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}