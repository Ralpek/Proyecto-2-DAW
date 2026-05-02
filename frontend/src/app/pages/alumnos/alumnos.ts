import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule], // Importamos CommonModule para poder usar directivas visuales
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
}