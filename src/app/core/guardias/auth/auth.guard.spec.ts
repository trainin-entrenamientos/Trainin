import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/authServicio/auth.service';
import { ToastrService } from 'ngx-toastr';
import { authGuard } from './auth.guard';
 
describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['estaAutenticado', 'cerrarSesion']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['error']) },
      ],
    });
 
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });
 
  it('debería permitir el acceso si el usuario está autenticado', () => {
    authServiceSpy.estaAutenticado.and.returnValue(true);
 
    const mockRoute = {} as any;
    const mockState = {
      url: '/ruta-protegida',
      root: {
        url: ['/ruta-protegida'],
        params: {},
        queryParams: {},
        fragment: null,
        data: {},
        outlet: '',
        component: null,
        routeConfig: null,
        root: null,
        parent: null,
        firstChild: null,
        children: [],
        pathFromRoot: []
      }
    } as any;
 
    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
 
    expect(result).toBeTrue();
    expect(authServiceSpy.estaAutenticado).toHaveBeenCalled();
    expect(authServiceSpy.cerrarSesion).not.toHaveBeenCalled();
    expect(toastrSpy.error).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
 
  it('debería denegar el acceso, cerrar sesión, mostrar error y redirigir si el usuario no está autenticado', () => {
  authServiceSpy.estaAutenticado.and.returnValue(false);
 
  const mockRoute = { url: '/ruta-protegida' } as any;
  const mockState = {} as any;
 
  const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
 
  expect(result).toBeFalse();
  expect(authServiceSpy.cerrarSesion).toHaveBeenCalled();
  expect(toastrSpy.error).toHaveBeenCalledWith(
    'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
    '',
    {
      timeOut: 5000,
      extendedTimeOut: 0,
      closeButton: true,
      tapToDismiss: false,
    }
  );
 
  expect(routerSpy.navigate).toHaveBeenCalledWith(['/iniciar-sesion'], {
    queryParams: { returnUrl: '/ruta-protegida' },
  });
});
 
});
 