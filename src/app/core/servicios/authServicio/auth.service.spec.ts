/*import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } 
        from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from './auth.service';
import { tokenExpirado } from '../../utilidades/token-utils';
import { environment } from '../../../../environments/environment';
import * as tokenUtils from '../../utilidades/token-utils';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const fakeToken = 'header.' + btoa(JSON.stringify({
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'test@ejemplo.com'
  })) + '.signature';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [ AuthService ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // Limpieza de localStorage para cada spec
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify(); // se asegure de que no quedan peticiones pendientes
  });

    it('debería hacer POST a /usuario/login y guardar token si exito', () => {
    const cred = { email: 'a@b.com', contrasenia: '1234' };
    const mockResp = { exito: true, requiereActivacion: false, token: fakeToken };

    service.login(cred).subscribe(resp => {
      expect(resp).toEqual(mockResp);
      // token debe haberse guardado
      expect(localStorage.getItem(service['TOKEN_KEY']!)).toBe(fakeToken);
    });

    // Interceptar la petición
    const req = httpMock.expectOne(
      `${environment.URL_BASE}/usuario/login`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(cred);

    req.flush(mockResp);
  });

  it('no debería guardar token si requiereActivacion=true', () => {
    const cred = { email: 'a@b.com', contrasenia: '1234' };
    const mockResp = { exito: true, requiereActivacion: true, token: fakeToken };

    service.login(cred).subscribe(resp => {
      expect(localStorage.getItem(service['TOKEN_KEY']!)).toBeNull();
    });
    httpMock.expectOne(`${environment.URL_BASE}/usuario/login`)
            .flush(mockResp);
  });

    it('getEmail devuelve el email del payload', () => {
    localStorage.setItem(service['TOKEN_KEY'], fakeToken);
    const email = service.getEmail();
    expect(email).toBe('test@ejemplo.com');
  });

  it('estaAutenticado devuelve false si no hay token', () => {
spyOn(tokenUtils, 'tokenExpirado').and.returnValue(true);
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('estaAutenticado devuelve false si tokenExpirado', () => {
    localStorage.setItem(service['TOKEN_KEY'], fakeToken);
spyOn(tokenUtils, 'tokenExpirado').and.returnValue(true);
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('estaAutenticado devuelve true si token válido', () => {
    localStorage.setItem(service['TOKEN_KEY'], fakeToken);
spyOn(tokenUtils, 'tokenExpirado').and.returnValue(true);
    expect(service.estaAutenticado()).toBeTrue();
  });

    it('cerrarSesion limpia token y navega a /iniciar-sesion', () => {
    const navSpy = spyOn(router, 'navigate');
    localStorage.setItem(service['TOKEN_KEY'], fakeToken);

    service.cerrarSesion();

    expect(localStorage.getItem(service['TOKEN_KEY']!)).toBeNull();
    expect(navSpy).toHaveBeenCalledWith(['/iniciar-sesion']);
  });

    it('registrarUsuario hace POST a /api/Usuario/registro', () => {
    const dto = { email: 'x@y.com', contrasenia: 'pw', nombre: 'X' };
    service.registrarUsuario(dto).subscribe();

    const req = httpMock.expectOne(`${service['API_URL']}/registro`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({});  // simula respuesta vacía
  });
});
*/

