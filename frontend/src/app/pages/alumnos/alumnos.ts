import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule], // Importamos CommonModule para poder usar directivas visuales
  templateUrl: './alumnos.html',
  styleUrl: './alumnos.css'
})
export class Alumnos {
  // Lista de prueba para poder maquetar la tabla
  alumnos: Alumno[] = [
    { id: 1, nombre: 'Ana', apellidos: 'García López', tramo: 'I', bilingue: 'S' },
    { id: 2, nombre: 'Carlos', apellidos: 'Martínez Ruiz', tramo: 'II', bilingue: 'N' },
    { id: 3, nombre: 'Lucía', apellidos: 'Fernández Díaz', tramo: 'Ninguno', bilingue: 'S' }
  ];
  // --- LÓGICA DEL MODAL ---

  // Controla si el modal se ve o no
  mostrarModal: boolean = false;

  // Objeto temporal para guardar los datos del formulario
  nuevoAlumno: Alumno = { id: 0, nombre: '', apellidos: '', tramo: 'Ninguno', bilingue: 'N' };

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    // Limpiamos el formulario para la próxima vez que se abra
    this.nuevoAlumno = { id: 0, nombre: '', apellidos: '', tramo: 'Ninguno', bilingue: 'N' };
  }

  guardarAlumno() {
    // Le asignamos un ID falso (el tamaño actual de la lista + 1)
    this.nuevoAlumno.id = this.alumnos.length + 1;

    // Metemos el nuevo alumno en la tabla
    this.alumnos.push({ ...this.nuevoAlumno });

    // Cerramos la ventana
    this.cerrarModal();
  }
}