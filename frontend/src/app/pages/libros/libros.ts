import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);
  
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
    this.cdr.detectChanges();
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
        this.cdr.detectChanges();
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
          this.cdr.detectChanges();
        },
        error: () => alert('Error al eliminar el libro.')
      });
    }
  }

  exportarJSON() {
      const data = JSON.stringify(this.libros, null, 2); 
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'libros.json'; 
      a.click();
      window.URL.revokeObjectURL(url);
    }
  
    importarJSON(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      try {
        const arrayJSON = JSON.parse(e.target.result);
        let importados = 0; // Contador para saber cuántos se añaden

        arrayJSON.forEach((item: Libro) => {
          // 1. Comprobamos si el ISBN ya existe en nuestra lista actual
          const yaExiste = this.libros.some(l => l.isbn === item.isbn);

          // 2. Si NO existe, entonces lo enviamos a la base de datos
          if (!yaExiste) {
            this.http.post<Libro>(this.apiUrlLibros, item).subscribe(guardado => {
              this.libros.unshift(guardado);
            });
            importados++; // Sumamos uno al contador
          }
        });
        
        this.notificacion.mostrar(`Importación completada. Se han añadido ${importados} libros nuevos.`);
        this.cdr.detectChanges();
      } catch (err) {
        alert('El archivo no es un JSON válido.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }
}