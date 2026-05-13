import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificacionService } from '../../services/notificacion';

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
  private http = inject(HttpClient);
  private notificacion = inject(NotificacionService);
  private cdr = inject(ChangeDetectorRef);
  private apiUrl = 'http://localhost:8002/api/alumnos';

  mostrarModal: boolean = false;

  alumnos: Alumno[] = []
  /*
  // Lista de prueba para poder maquetar la tabla
  alumnos: Alumno[] = [
    { id: 1, nombre: 'Ana', apellidos: 'García López', tramo: 'I', bilingue: 'S' },
    { id: 2, nombre: 'Carlos', apellidos: 'Martínez Ruiz', tramo: 'II', bilingue: 'N' },
    { id: 3, nombre: 'Lucía', apellidos: 'Fernández Díaz', tramo: 'Ninguno', bilingue: 'S' }
  ];
  */

  // Objeto temporal para guardar los datos del formulario
  nuevoAlumno: Alumno = { id: 0, nombre: '', apellidos: '', tramo: 'Ninguno', bilingue: 'N' };

  
  // Esta función se ejecuta automáticamente al abrir la pantalla
  ngOnInit() {
    this.cargarAlumnos();
    this.cdr.detectChanges();
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
        this.notificacion.mostrar('Alumno añadido correctamente.');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al guardar el alumno', error);
        alert('Hubo un error al guardar. Revisa la consola.');
      }
    });
  }
  // función para eliminar
  eliminarAlumno(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          // Lo quitamos de la tabla visualmente sin recargar la página
          this.alumnos = this.alumnos.filter(a => a.id !== id);
          this.notificacion.mostrar('Alumno eliminado correctamente.');
          this.cdr.detectChanges();
        },
        error: () => alert('Error al eliminar el alumno.')
      });
    }
  }


  exportarJSON() {
      const data = JSON.stringify(this.alumnos, null, 2); 
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'alumnos.json'; 
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

        arrayJSON.forEach((item: Alumno) => {
          // 1. Comprobamos si el ID ya existe en nuestra lista actual
          const yaExiste = this.alumnos.some(a => a.id === item.id);

          // 2. Si NO existe, lo enviamos al backend
          if (!yaExiste) {
            this.http.post<Alumno>(this.apiUrl, item).subscribe(guardado => {
              this.alumnos.unshift(guardado);
            });
            importados++;
          }
        });
        
        this.notificacion.mostrar(`Importación completada. Se han añadido ${importados} alumnos nuevos.`);
        this.cdr.detectChanges();
      } catch (err) {
        alert('El archivo no es un JSON válido.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  }
}