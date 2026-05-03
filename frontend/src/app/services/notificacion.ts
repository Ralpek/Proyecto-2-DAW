import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root' // Esto significa que el servicio es global y único para toda la app
})
export class NotificacionService {
  // Creamos una "señal" global que guardará el texto del mensaje. Empieza vacía.
  mensaje = signal<string>('');

  // La función general que llamaremos desde cualquier página
  mostrar(texto: string) {
    this.mensaje.set(texto); // Ponemos el texto
    
    // A los 3 segundos, lo volvemos a vaciar
    setTimeout(() => {
      this.mensaje.set('');
    }, 3000);
  }

  // Por si el usuario le da a la 'X' para cerrarlo antes de tiempo
  cerrar() {
    this.mensaje.set('');
  }
}