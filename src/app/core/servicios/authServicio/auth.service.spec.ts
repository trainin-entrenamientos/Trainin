/* <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import { RegistroDTO } from '../../modelos/RegistroDTO';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  const KEY = 'token';

  const fakeToken = 'header.' + btoa(JSON.stringify({
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'trainin@trainin.com'
  })) + '.signature';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  function makeToken(payload: any) {
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const body = btoa(JSON.stringify(payload));
    return `${header}.${body}.`;
  }

  //Login
  it('Debería hacer POST a /usuario/login y guardar, luego de que el usuario inicia su sesión el token del usuario logueado exitosamente', () => {
    const cred = { email: 'trainin@trainin.com', contrasenia: '1234' };
    const mockResp = { exito: true, requiereActivacion: false, token: fakeToken, email: 'trainin@trainin.com' };

    service.login(cred).subscribe(resp => {
      expect(resp).toEqual(mockResp);
      expect(localStorage.getItem(service['TOKEN_KEY']!)).toBe(fakeToken);
    });

    const req = httpMock.expectOne(
      `${environment.URL_BASE}/usuario/login`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(cred);

    req.flush(mockResp);
  });

  //Login
  it('Debería no guardarse el token si el usuario requiere activación', () => {
    const cred = { email: 'trainin@trainin.com', contrasenia: '1234' };
    const mockResp = { exito: true, requiereActivacion: true, token: fakeToken };

    service.login(cred).subscribe(resp => {
      expect(localStorage.getItem(service['TOKEN_KEY']!)).toBe(null);
    });
    httpMock.expectOne(`${environment.URL_BASE}/usuario/login`)
      .flush(mockResp);
  });

  //GetEmail
  it('Debería retornar el email almacenado en localStorage', () => {
    localStorage.setItem(service['TOKEN_KEY'], fakeToken);
    const email = service.getEmail();
    expect(email).toBe('trainin@trainin.com');
  });

  //El usuario está autenticado
  it('Debería devolver false si no hay un token existente recibido con el usuario logueado', () => {
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('Debería devolver false si el token expiró por tiempo', () => {
    const past = Math.floor(Date.now() / 1000) - 60;
    localStorage.setItem(KEY, makeToken({ exp: past }));
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('Debería devolver true si el token sigue siendo válido (no ha expirado)', () => {
    const future = Math.floor(Date.now() / 1000) + 60;
    localStorage.setItem(KEY, makeToken({ exp: future }));
    expect(service.estaAutenticado()).toBeTrue();
  });

  //Cerrar Sesión 
  it('Debería cerrar la sesión, eliminar el token y enviar al usuario al inicio.', () => {
    const navSpy = spyOn(router, 'navigate');
    localStorage.setItem(service['TOKEN_KEY'], fakeToken);

    service.cerrarSesion();

    expect(localStorage.getItem(service['TOKEN_KEY']!)).toBe(null);
    expect(navSpy).toHaveBeenCalledWith(['/iniciar-sesion']);
  });

  //Registro
  it('Debería devolver un usuario ya registrado.', () => {
    const dto: RegistroDTO = {
      email: 'trainin@trainin.com',
      contrasenia: 'pw',
      nombre: 'X',
      apellido: 'Apellido',
      repetirContrasenia: 'pw',
      fechaNacimiento: new Date('1990-01-01')
    };
    service.registrarUsuario(dto).subscribe();

    const base = (service as any).baseUrl as string;
    const req = httpMock.expectOne(`${base}/usuario/registro`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({});
  });

  // Constructor
  it('Debería inicializar usuario con email si hay un token válido al crear el servicio', () => {
    const future = Math.floor(Date.now() / 1000) + 60;
    const CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
    const payload = { exp: future, [CLAIM]: 'trainin@trainin.com' };
    localStorage.setItem(KEY, `${btoa(JSON.stringify({ alg: 'none' }))}.${btoa(JSON.stringify(payload))}.`);

    // creamos **manualmente** la instancia para forzar ejecución del constructor
    const auth = new AuthService({} as HttpClient, {} as Router);
    auth.usuario.subscribe(email => expect(email).toBe('trainin@trainin.com'));
  });

  it('Debería eliminar el token y devolver null en usuario si el token está expirado al crear el servicio', () => {
    const past = Math.floor(Date.now() / 1000) - 60;
    const CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
    const payload = { exp: past, [CLAIM]: 'trainin@trainin.com' };
    localStorage.setItem(KEY, `${btoa('{}')}.${btoa(JSON.stringify(payload))}.`);

    const auth = new AuthService({} as HttpClient, {} as Router);
    auth.usuario.subscribe(email => expect(email).toBeNull());
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  //Token
  it('Debería devolver el token almacenado con getToken()', () => {
    localStorage.setItem(KEY, 'mi.jwt.token');
    service = TestBed.inject(AuthService);
    expect(service.getToken()).toBe('mi.jwt.token');
  });

});*/