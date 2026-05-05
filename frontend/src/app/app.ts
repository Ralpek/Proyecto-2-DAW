import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Sidebar } from './components/sidebar/sidebar';
import { NotificacionService } from './services/notificacion';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'libreria-front';
  public router = inject(Router);
  public notificacion = inject(NotificacionService);
  
  // Esta función comprueba si estamos en la página de login
  esPaginaLogin(): boolean {
    return this.router.url === '/login';
  }
}
