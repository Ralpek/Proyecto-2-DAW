import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Definimos la estructura exacta que tendrá un alumno
export interface Alumno {
  id: number;
  nombre: string;
  apellidos: string;
  tramo: 'I' | 'II' | 'Ninguno';
  bilingue: 'S' | 'N';
}

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.css'
})
export class Alumnos implements OnInit{
  // Inyectamos HttpClient para poder usarlo
  private http = inject(HttpClient); 
  // La URL de nuestra API de Laravel
  private apiUrl = 'http://localhost:8002/api/alumnos';

  //Lista de alumnos
  alumnos: Alumno[] = []
  /*
  // Lista de prueba para poder maquetar la tabla
  alumnos: Alumno[] = [
    { id: 1, nombre: 'Ana', apellidos: 'García López', tramo: 'I', bilingue: 'S' },
    { id: 2, nombre: 'Carlos', apellidos: 'Martínez Ruiz', tramo: 'II', bilingue: 'N' },
    { id: 3, nombre: 'Lucía', apellidos: 'Fernández Díaz', tramo: 'Ninguno', bilingue: 'S' }
  ];
  */

  // Controla si el modal se ve o no
  mostrarModal: boolean = false;

  // Objeto temporal para guardar los datos del formulario
  nuevoAlumno: Alumno = { id: 0, nombre: '', apellidos: '', tramo: 'Ninguno', bilingue: 'N' };

  
  // Esta función se ejecuta automáticamente al abrir la pantalla
  ngOnInit() {
    this.cargarAlumnos();
  }

  // Petición GET para traer los alumnos de Laravel
  cargarAlumnos() {
    this.http.get<Alumno[]>(this.apiUrl).subscribe(datos => {
      this.alumnos = datos;
    });
  }

  // --- LÓGICA DEL MODAL --- //

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    // Limpiamos el formulario para la próxima vez que se abra
    this.nuevoAlumno = { id: 0, nombre: '', apellidos: '', tramo: 'Ninguno', bilingue: 'N' };
  }

  guardarAlumno() {
    this.http.post<Alumno>(this.apiUrl, this.nuevoAlumno).subscribe({
      next: (alumnoGuardado) => {
        // Si Laravel responde que todo ha ido bien, lo añadimos a la tabla visualmente
        this.alumnos.unshift(alumnoGuardado); // unshift lo pone de los primeros
        this.cerrarModal();
      },
      error: (error) => {
        console.error('Error al guardar el alumno', error);
        alert('Hubo un error al guardar. Revisa la consola.');
      }
    });
  }

  /* Como funcionaba anterior mente sin Laravel guardar alumno
  guardarAlumno() {
    // Le asignamos un ID falso (el tamaño actual de la lista + 1)
    this.nuevoAlumno.id = this.alumnos.length + 1;

    // Metemos el nuevo alumno en la tabla
    this.alumnos.push({ ...this.nuevoAlumno });

    // Cerramos la ventana
    this.cerrarModal();
  }
    */
}