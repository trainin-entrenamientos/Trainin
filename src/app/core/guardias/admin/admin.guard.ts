import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../servicios/authServicio/auth.service';
import { Router } from '@angular/router';

export const adminGuard: CanActivateFn = (state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.estaAutenticado()) {
    router.navigate(['/iniciar-sesion'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  const rol = authService.getRol();
  if (rol === 'Administrador') {
    return true;
  }

  router.navigate(['/error'], {
    queryParams: { motivo: 'rol' },
  });
  return false;
};
