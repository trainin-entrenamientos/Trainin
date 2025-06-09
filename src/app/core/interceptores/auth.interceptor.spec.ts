import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../servicios/authServicio/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

describe('authInterceptor', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router:      jasmine.SpyObj<Router>;
  let toastr:      jasmine.SpyObj<ToastrService>;
  let handler:     jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getToken','cerrarSesion']);
    router      = jasmine.createSpyObj('Router',      ['navigate']);
    toastr      = jasmine.createSpyObj('ToastrService',['error']);
    handler     = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService,      useValue: authService },
        { provide: Router,           useValue: router },
        { provide: ToastrService,    useValue: toastr }
      ]
    });
  });

  it('añade Authorization header cuando hay token', () => {
    authService.getToken.and.returnValue('abc123');
    handler.handle.and.returnValue(of(null as any));

    const req = new HttpRequest('GET','/datos');
    const nextFn = (r: HttpRequest<any>) => handler.handle(r);

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextFn).subscribe();
    });

    const handledReq = handler.handle.calls.mostRecent().args[0] as HttpRequest<any>;
    expect(handledReq.headers.get('Authorization')).toBe('Bearer abc123');
  });

  it('no añade header cuando no hay token', () => {
    authService.getToken.and.returnValue(null);
    handler.handle.and.returnValue(of(null as any));

    const req = new HttpRequest('GET','/datos');
    const nextFn = (r: HttpRequest<any>) => handler.handle(r);

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextFn).subscribe();
    });

    const handledReq = handler.handle.calls.mostRecent().args[0] as HttpRequest<any>;
    expect(handledReq.headers.has('Authorization')).toBeFalse();
  });

  it('al 401: cierra sesión, muestra toast, redirige y re-lanza el error', fakeAsync(() => {
    authService.getToken.and.returnValue(null);
    const error401 = { status: 401 };
    handler.handle.and.returnValue(throwError(() => error401));

    let caught: any;
    const req = new HttpRequest('GET','/datos');
    const nextFn = (r: HttpRequest<any>) => handler.handle(r);

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextFn)
        .subscribe({ error: err => caught = err });
    });
    flush();

    expect(authService.cerrarSesion).toHaveBeenCalled();
    expect(toastr.error)
      .toHaveBeenCalledWith(
        'Por favor, inicie sesión nuevamente',
        'Su sesión ha expirado'
      );
    expect(router.navigate).toHaveBeenCalledWith(
      ['/iniciar-sesion'],
      { queryParams: { sessionExpired: 'true' } }
    );
    expect(caught).toBe(error401);
  }));
});
