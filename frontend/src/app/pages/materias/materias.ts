import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificacionService } from '../../services/notificacion';

export interface Materia {
  id?: number;
  nombre: string;
  departamento: string;
}

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './materias.html'
})
export class Materias implements OnInit {
  private http = inject(HttpClient);
  private notificacion = inject(NotificacionService);
  apiUrl = 'http://localhost:8002/api/materias';

  materias: Materia[] = [];
  mostrarModal = false;
  nuevaMateria: Materia = { nombre: '', departamento: '' };

  ngOnInit(): void {
    this.http.get<Materia[]>(this.apiUrl).subscribe(datos => this.materias = datos);
  }

  abrirModal() { this.mostrarModal = true; }
  cerrarModal() { this.mostrarModal = false; this.nuevaMateria = { nombre: '', departamento: '' }; }

  guardarMateria() {
    this.http.post<Materia>(this.apiUrl, this.nuevaMateria).subscribe({
      next: (guardado) => {
        this.materias.unshift(guardado);
        this.cerrarModal();
        this.notificacion.mostrar('Materia añadida correctamente.');
      }
    });
  }

  eliminarMateria(id: number | undefined) {
    if (id && confirm('¿Borrar esta materia?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.materias = this.materias.filter(m => m.id !== id);
        this.notificacion.mostrar('Materia eliminada.');
      });
    }
  }

  // --- LÓGICA DE JSON ---
  exportarJSON() {
    const data = JSON.stringify(this.materias, null, 2); 
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'materias.json'; 
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
        arrayJSON.forEach((item: Materia) => {
          this.http.post<Materia>(this.apiUrl, item).subscribe(guardado => {
            this.materias.unshift(guardado);
          });
        });
        this.notificacion.mostrar('Importación de JSON completada.');
      } catch (err) {
        alert('El archivo no es un JSON válido.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Resetea el input
  }
}