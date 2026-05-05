import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Alumnos } from './pages/alumnos/alumnos';
import { Libros } from './pages/libros/libros';
import { Prestamos } from './pages/prestamos/prestamos';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'alumnos', component: Alumnos },
  { path: 'libros', component: Libros },
  { path: 'prestamos', component: Prestamos },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '/dashboard' } 
];