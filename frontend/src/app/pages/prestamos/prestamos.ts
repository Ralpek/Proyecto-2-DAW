import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NotificacionService } from '../../services/notificacion';

// Definimos las estructuras
export interface Prestamo {
  id?: number; // Es opcional porque al crearlo aún no tiene ID
  isbn: string;
  id_alumno: number;
  id_curso: number;
  fecha_entrega: string;
  fecha_devolucion: string | null;
  estado: 'entregado' | 'por_devolver';
}

export interface Libro { isbn: string; titulo: string; }
export interface Alumno { id: number; nombre: string; apellidos: string; }
export interface Curso { id: number; curso: string; nivel: string; }

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.css'
})
export class Prestamos implements OnInit {
  private http = inject(HttpClient);
  private notificacion = inject(NotificacionService);

  // URLs de nuestras APIs
  private apiUrlPrestamos = 'http://localhost:8002/api/prestamos';
  private apiUrlLibros = 'http://localhost:8002/api/libros';
  private apiUrlAlumnos = 'http://localhost:8002/api/alumnos';
  private apiUrlCursos = 'http://localhost:8002/api/cursos';

  prestamos: Prestamo[] = [];
  libros: Libro[] = [];
  alumnos: Alumno[] = [];
  cursos: Curso[] = [];

  mostrarModal: boolean = false;
  
  nuevoPrestamo: Prestamo = { 
    isbn: '', 
    id_alumno: 0, 
    id_curso: 0, 
    fecha_entrega: '', 
    fecha_devolucion: null, 
    estado: 'por_devolver' 
  };

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Cargamos todo de golpe
    this.http.get<Prestamo[]>(this.apiUrlPrestamos).subscribe(datos => this.prestamos = datos);
    this.http.get<Libro[]>(this.apiUrlLibros).subscribe(datos => this.libros = datos);
    this.http.get<Alumno[]>(this.apiUrlAlumnos).subscribe(datos => this.alumnos = datos);
    this.http.get<Curso[]>(this.apiUrlCursos).subscribe(datos => this.cursos = datos);
  }

  // Funciones para mostrar los nombres en la tabla en lugar de los IDs
  getTituloLibro(isbn: string): string {
    const libro = this.libros.find(l => l.isbn === isbn);
    return libro ? libro.titulo : 'Desconocido';
  }

  getNombreAlumno(id_alumno: number): string {
    const alumno = this.alumnos.find(a => a.id == id_alumno);
    return alumno ? `${alumno.nombre} ${alumno.apellidos}` : 'Desconocido';
  }

  getNombreCurso(id_curso: number): string {
    const curso = this.cursos.find(c => c.id == id_curso);
    return curso ? `${curso.nivel} (${curso.curso})` : 'Desconocido';
  }

  abrirModal(): void {
    this.mostrarModal = true;
    // Rellenamos la fecha de entrega con el día de hoy por defecto (formato YYYY-MM-DD)
    const hoy = new Date().toISOString().split('T')[0];
    this.nuevoPrestamo = { 
      isbn: '', 
      id_alumno: 0, 
      id_curso: 0, 
      fecha_entrega: hoy, 
      fecha_devolucion: null, 
      estado: 'por_devolver' 
    };
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarPrestamo(): void {
    this.http.post<Prestamo>(this.apiUrlPrestamos, this.nuevoPrestamo).subscribe({
      next: (prestamoGuardado: Prestamo) => {
        this.prestamos.unshift(prestamoGuardado);
        this.cerrarModal();
        this.notificacion.mostrar('Registro añadido correctamente.');
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al guardar', error);
        alert('Error al guardar. Revisa que has seleccionado libro, alumno y curso.');
      }
    });
  }

  eliminarPrestamo(id: number | undefined): void {
    if (id && confirm('¿Borrar este registro de préstamo?')) {
      this.http.delete(`${this.apiUrlPrestamos}/${id}`).subscribe({
        next: () => {
          this.prestamos = this.prestamos.filter(p => p.id !== id);
          this.notificacion.mostrar('Registro eliminado correctamente.');
        },
        error: () => alert('Error al eliminar el registro.')
      });
    }
  }

  exportarJSON() {
      const data = JSON.stringify(this.prestamos, null, 2); 
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prestamos.json'; 
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
        let importados = 0;

        arrayJSON.forEach((item: Prestamo) => {
          // Comprobamos si el préstamo ya existe por su ID
          const yaExiste = this.prestamos.some(p => p.id === item.id);

          if (!yaExiste) {
            this.http.post<Prestamo>(this.apiUrlPrestamos, item).subscribe(guardado => {
              this.prestamos.unshift(guardado);
            });
            importados++;
          }
        });
        
        this.notificacion.mostrar(`Importación completada. Se han añadido ${importados} préstamos nuevos.`);
      } catch (err) {
        alert('El archivo no es un JSON válido.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }
}