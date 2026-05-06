import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificacionService } from '../../services/notificacion';

export interface Curso {
  id?: number;
  curso: string;
  nivel: string;
}

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.html'
})
export class Cursos implements OnInit {
  private http = inject(HttpClient);
  private notificacion = inject(NotificacionService);
  apiUrl = 'http://localhost:8002/api/cursos';

  cursos: Curso[] = [];
  mostrarModal = false;
  nuevoCurso: Curso = { curso: '', nivel: '' };

  ngOnInit(): void {
    this.http.get<Curso[]>(this.apiUrl).subscribe(datos => this.cursos = datos);
  }

  abrirModal() { this.mostrarModal = true; }
  cerrarModal() { this.mostrarModal = false; this.nuevoCurso = { curso: '', nivel: '' }; }

  guardarCurso() {
    this.http.post<Curso>(this.apiUrl, this.nuevoCurso).subscribe({
      next: (guardado) => {
        this.cursos.unshift(guardado);
        this.cerrarModal();
        this.notificacion.mostrar('Curso añadido.');
      }
    });
  }

  eliminarCurso(id: number | undefined) {
    if (id && confirm('¿Borrar curso?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.cursos = this.cursos.filter(c => c.id !== id);
        this.notificacion.mostrar('Curso eliminado.');
      });
    }
  }

  exportarJSON() {
    const data = JSON.stringify(this.cursos, null, 2); 
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cursos.json'; 
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
        arrayJSON.forEach((item: Curso) => {
          this.http.post<Curso>(this.apiUrl, item).subscribe(guardado => this.cursos.unshift(guardado));
        });
        this.notificacion.mostrar('Importación completada.');
      } catch (err) { alert('JSON no válido.'); }
    };
    reader.readAsText(file);
    event.target.value = '';
  }
}