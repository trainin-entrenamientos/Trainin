import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export function manejarErrorSimple(toastr: ToastrService, mensaje: string = 'Ocurrió un error inesperado.') {
  toastr.error(mensaje);
}

export function manejarErrorYRedirigir(
  toastr: ToastrService,
  router: Router,
  mensaje: string = 'Ocurrió un error inesperado.',
  url: string = '/'
) {
  toastr.error(mensaje);
  router.navigate([url]);
}
