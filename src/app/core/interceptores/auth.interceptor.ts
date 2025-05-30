import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/authServicio/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const token = authService.getToken();

  const clonedReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req;

  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.cerrarSesion();
        toastr.error('Por favor, inicie sesión nuevamente', 'Su sesión ha expirado');

        router.navigate(['/iniciar-sesion'], {
          queryParams: { sessionExpired: 'true' }
        });
      }

      return throwError(() => error);
    })
  );
};
