import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Sidebar } from './components/sidebar/sidebar';
import { NotificacionService } from './services/notificacion';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Sidebar, NotificacionService],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'libreria-front';
  
  public notificacion = inject(NotificacionService);
}
