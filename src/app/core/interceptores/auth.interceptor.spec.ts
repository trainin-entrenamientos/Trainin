import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../servicios/authServicio/auth.service';
import { Router } from '@angular/router';

describe('authInterceptor', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let handler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getToken', 'cerrarSesion']);
    router      = jasmine.createSpyObj('Router', ['navigate']);
    handler     = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router,      useValue: router }
      ]
    });
  });

  it('debería omitir el interceptor para /usuario/iniciarsesion', () => {
    const req = new HttpRequest('GET', '/api/usuario/iniciarsesion');
    handler.handle.and.returnValue(of('ok' as any));
    const nextFn = (r: HttpRequest<any>) => handler.handle(r);

    let result: any;
    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextFn).subscribe(r => result = r);
    });

    expect(handler.handle).toHaveBeenCalledWith(req);
    expect(result).toBe('ok');
  });

  it('debería omitir el interceptor para /usuario/registro', () => {
    const req = new HttpRequest('GET', '/api/usuario/registro');
    handler.handle.and.returnValue(of('ok' as any));
    const nextFn = (r: HttpRequest<any>) => handler.handle(r);

    let result: any;
    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextFn).subscribe(r => result = r);
    });

    expect(handler.handle).toHaveBeenCalledWith(req);
    expect(result).toBe('ok');
  });

  it('debería añadir Authorization header cuando hay token', () => {
    authService.getToken.and.returnValue('abc123');
    handler.handle.and.returnValue(of(null as any));

    const req = new HttpRequest('GET', '/datos');
    const nextFn = (r: HttpRequest<any>) => handler.handle(r);

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextFn).subscribe();
    });

    const handledReq = handler.handle.calls.mostRecent().args[0] as HttpRequest<any>;
    expect(handledReq.headers.get('Authorization')).toBe('Bearer abc123');
  });

  it('no debería añadir header cuando no hay token', () => {
    authService.getToken.and.returnValue(null);
    handler.handle.and.returnValue(of(null as any));

    const req = new HttpRequest('GET', '/datos');
    const nextFn = (r: HttpRequest<any>) => handler.handle(r);

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextFn).subscribe();
    });

    const handledReq = handler.handle.calls.mostRecent().args[0] as HttpRequest<any>;
    expect(handledReq.headers.has('Authorization')).toBeFalse();
  });

  it('al 401: cierra sesión, redirige y re-lanza el error', fakeAsync(() => {
    authService.getToken.and.returnValue(null);
    const error401 = { status: 401 };
    handler.handle.and.returnValue(throwError(() => error401));

    let caught: any;
    const req = new HttpRequest('GET', '/datos');
    const nextFn = (r: HttpRequest<any>) => handler.handle(r);

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, nextFn)
        .subscribe({ error: (err: any) => caught = err });
    });
    flush();

    expect(authService.cerrarSesion).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/iniciar-sesion']);
    expect(caught).toBe(error401);
  }));
});
