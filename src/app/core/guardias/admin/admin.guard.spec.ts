import { TestBed } from '@angular/core/testing';
import { adminGuard } from './admin.guard';
import { AuthService } from '../../servicios/authServicio/auth.service';
import { Router } from '@angular/router';

describe('adminGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['estaAutenticado', 'getRol']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('debe permitir acceso si está autenticado y es Administrador', () => {
    authServiceMock.estaAutenticado.and.returnValue(true);
    authServiceMock.getRol.and.returnValue('Administrador');

    const mockState = { url: '/admin' } as any;
    const mockNext = {} as any;

    const result = TestBed.runInInjectionContext(() => adminGuard(mockState, mockNext));

    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('debe redirigir a /iniciar-sesion si no está autenticado', () => {
    authServiceMock.estaAutenticado.and.returnValue(false);

    const mockState = { url: '/admin' } as any;
    const mockNext = {} as any;

    const result = TestBed.runInInjectionContext(() => adminGuard(mockState, mockNext));

    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/iniciar-sesion'], {
      queryParams: { returnUrl: '/admin' }
    });
  });

  it('debe redirigir a /error si está autenticado pero no es Administrador', () => {
    authServiceMock.estaAutenticado.and.returnValue(true);
    authServiceMock.getRol.and.returnValue('Usuario');

    const mockState = { url: '/admin' } as any;
    const mockNext = {} as any;

    const result = TestBed.runInInjectionContext(() => adminGuard(mockState, mockNext));

    expect(result).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/error'], {
      queryParams: { motivo: 'rol' }
    });
  });
});
