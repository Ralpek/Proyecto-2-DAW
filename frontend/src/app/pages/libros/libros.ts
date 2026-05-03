import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NotificacionService } from '../../services/notificacion';

// Definimos las estructuras que vamos a usar
export interface Libro {
  isbn: string;
  titulo: string;
  autor: string;
  numero_ejemplares: number;
  id_materia: number;
  id_curso: number;
}

export interface Materia {
  id: number;
  nombre: string;
  departamento: string;
}

export interface Curso {
  id: number;
  curso: string;
  nivel: string;
}

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libros.html',
  styleUrl: './libros.css'
})
export class Libros implements OnInit {
  private http = inject(HttpClient);
  private notificacion = inject(NotificacionService);
  
  // URLs de nuestras APIs
  private apiUrlLibros = 'http://localhost:8002/api/libros';
  private apiUrlMaterias = 'http://localhost:8002/api/materias';
  private apiUrlCursos = 'http://localhost:8002/api/cursos';

  // Listas para almacenar los datos
  libros: Libro[] = [];
  materias: Materia[] = [];
  cursos: Curso[] = [];

  mostrarModal: boolean = false;
  
  // El ID de materia y curso empieza a 0 para obligar a seleccionarlo
  nuevoLibro: Libro = { isbn: '', titulo: '', autor: '', numero_ejemplares: 1, id_materia: 0, id_curso: 0 };

  ngOnInit(): void {
    // Al cargar la página, traemos todo de la base de datos
    this.cargarLibros();
    this.cargarMaterias();
    this.cargarCursos();
  }

  cargarLibros(): void {
    this.http.get<Libro[]>(this.apiUrlLibros).subscribe((datos: Libro[]) => {
      this.libros = datos;
    });
  }

  cargarMaterias(): void {
    this.http.get<Materia[]>(this.apiUrlMaterias).subscribe((datos: Materia[]) => {
      this.materias = datos;
    });
  }

  cargarCursos(): void {
    this.http.get<Curso[]>(this.apiUrlCursos).subscribe((datos: Curso[]) => {
      this.cursos = datos;
    });
  }

  // Funciones de ayuda para mostrar el nombre en lugar del ID numérico en la tabla
  getNombreMateria(id_materia: number): string {
    const materia = this.materias.find(m => m.id == id_materia);
    return materia ? materia.nombre : 'Desconocida';
  }

  getNombreCurso(id_curso: number): string {
    const curso = this.cursos.find(c => c.id == id_curso);
    return curso ? `${curso.nivel} (${curso.curso})` : 'Desconocido';
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.nuevoLibro = { isbn: '', titulo: '', autor: '', numero_ejemplares: 1, id_materia: 0, id_curso: 0 };
  }

  guardarLibro(): void {
    this.http.post<Libro>(this.apiUrlLibros, this.nuevoLibro).subscribe({
      next: (libroGuardado: Libro) => {
        this.libros.unshift(libroGuardado);
        this.cerrarModal();
        this.notificacion.mostrar('Libro añadido correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al guardar el libro', error.message);
        alert('Error: Asegúrate de que el ISBN no esté repetido y de haber seleccionado Materia y Curso.');
      }
    });
  }

  eliminarLibro(isbn: string): void {
    if (confirm('¿Eliminar este libro del catálogo?')) {
      this.http.delete(`${this.apiUrlLibros}/${isbn}`).subscribe({
        next: () => {
          this.libros = this.libros.filter(l => l.isbn !== isbn);
          this.notificacion.mostrar('Libro elimninado correctamente.');
        },
        error: () => alert('Error al eliminar el libro.')
      });
    }
  }
}