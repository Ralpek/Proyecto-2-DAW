import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);

  // Variables para guardar los totales
  totalAlumnos: number = 0;
  totalLibros: number = 0;
  prestamosTotales: number = 0;
  prestamosPendientes: number = 0;

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    // 1. Contar Alumnos
    this.http.get<any[]>('http://localhost:8002/api/alumnos').subscribe(datos => {
      this.totalAlumnos = datos.length;
    });

    // 2. Contar Libros (Títulos distintos en el catálogo)
    this.http.get<any[]>('http://localhost:8002/api/libros').subscribe(datos => {
      this.totalLibros = datos.length;
    });

    // 3. Contar Préstamos y filtrar los que están "por_devolver"
    this.http.get<any[]>('http://localhost:8002/api/prestamos').subscribe(datos => {
      this.prestamosTotales = datos.length;
      this.prestamosPendientes = datos.filter(p => p.estado === 'por_devolver').length;
    });
  }
}