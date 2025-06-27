import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../servicios/authServicio/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (authService.estaAutenticado()) {
    return true;
  }

  authService.cerrarSesion();

  toastr.error(
    'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
    '',
    {
      timeOut: 5000,
      extendedTimeOut: 0,
      closeButton: true,
      tapToDismiss: false,
    }
  );

  router.navigate(['/iniciar-sesion'], {
    queryParams: { returnUrl: state.url },
  });

  return false;
};
