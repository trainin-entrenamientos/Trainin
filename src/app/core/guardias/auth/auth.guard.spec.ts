/*import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../../servicios/authServicio/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastrService, TOAST_CONFIG } from 'ngx-toastr';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', [
      'estaAutenticado',
      'cerrarSesion',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);
    toastr = jasmine.createSpyObj('ToastrService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: ToastrService, useValue: toastr },
        { provide: TOAST_CONFIG, useValue: {} },
      ],
    });
  });

  it('devuelve true si está autenticado y no navega', () => {
    authService.estaAutenticado.and.returnValue(true);
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/protegido' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('devuelve false y redirige si no está autenticado', () => {
    authService.estaAutenticado.and.returnValue(false);
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/private' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBeFalse();
    expect(authService.cerrarSesion).toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith(
      'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
      '',
      {
        timeOut: 5000,
        extendedTimeOut: 0,
        closeButton: true,
        tapToDismiss: false,
      }
    );
    expect(router.navigate).toHaveBeenCalledWith(['/iniciar-sesion'], {
      queryParams: { returnUrl: state.url },
    });
  });
});*/
