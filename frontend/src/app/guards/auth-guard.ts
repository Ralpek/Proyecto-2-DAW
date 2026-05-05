import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si está logueado, le dejamos pasar (return true)
  if (authService.estaLogueado()) {
    return true;
  } 
  
  // Si NO está logueado, lo mandamos al login y le bloqueamos el paso (return false)
  router.navigate(['/login']);
  return false;
};