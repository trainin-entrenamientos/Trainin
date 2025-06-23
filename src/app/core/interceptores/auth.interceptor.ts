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

  const url = req.url.toLowerCase();

  if (url.endsWith('/usuario/iniciarsesion')
    || url.endsWith('/usuario/registro')) {
    return next(req);
  }

  const token = authService.getToken();
  const cloned = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(cloned).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.cerrarSesion();
        router.navigate(['/iniciar-sesion']);
      }
      return throwError(() => error);
    })
  );
};
