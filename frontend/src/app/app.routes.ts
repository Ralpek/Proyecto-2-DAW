import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Alumnos } from './pages/alumnos/alumnos';
import { Libros } from './pages/libros/libros';
import { Prestamos } from './pages/prestamos/prestamos';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },

  // Requieren loguearse
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'alumnos', component: Alumnos, canActivate: [authGuard] },
  { path: 'libros', component: Libros, canActivate: [authGuard] },
  { path: 'prestamos', component: Prestamos, canActivate: [authGuard] },

  //otra cosa
  { path: '**', redirectTo: '/login' } 
];