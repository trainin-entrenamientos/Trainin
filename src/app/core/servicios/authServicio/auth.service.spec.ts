import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';
import { TokenUtils } from '../../utilidades/token-utils';
import { LoginData } from '../../modelos/LoginResponseDTO';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockToken = 'header.payload.signature';  // Simulación de un JWT válido
  const mockEmail = 'test@example.com';
  const mockRole = 'admin';
  const mockLoginResponse: RespuestaApi<LoginData> = {
    exito: true,
    mensaje: 'Ok',
    objeto: {
      token: mockToken,
      email: mockEmail,
      exito: true,
      requiereActivacion: false,
    },
  };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    spyOn(window, 'atob').and.callFake(() => {
      return JSON.stringify({
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': mockEmail,
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': mockRole,
      });
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    spyOn(TokenUtils, 'tokenExpirado').and.returnValue(false);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debe ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('debe llamar a http post y almacenar sesión si el login es exitoso', () => {
      const credenciales = { email: 'test@example.com', contrasenia: '1234' };

      service.login(credenciales).subscribe((res) => {
        expect(res).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${environment.URL_BASE}/usuario/iniciarSesion`);
      expect(req.request.method).toBe('POST');
      req.flush(mockLoginResponse);

      expect(localStorage.getItem('token')).toBe(mockToken);
    });

    it('no debe almacenar sesión si requiereActivacion es verdadero', () => {
      const response: RespuestaApi<LoginData> = {
        exito: true,
        mensaje: 'Ok',
        objeto: {
          token: mockToken,
          email: mockEmail,
          exito: true,
          requiereActivacion: true,
        },
      };

      const credenciales = { email: 'test@example.com', contrasenia: '1234' };

      service.login(credenciales).subscribe((res) => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${environment.URL_BASE}/usuario/iniciarSesion`);
      expect(req.request.method).toBe('POST');
      req.flush(response);

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('rol')).toBeNull();
    });
  });

  describe('estaAutenticado', () => {
    it('debe devolver true cuando el token existe y no está expirado', () => {
      spyOn(service, 'getToken').and.returnValue(mockToken);
      expect(service.estaAutenticado()).toBeTrue();
    });

    it('debe devolver false cuando el token falta o está expirado', () => {
      spyOn(service, 'getToken').and.returnValue(null);
      expect(service.estaAutenticado()).toBeFalse();
    });
  });

  describe('cerrarSesion', () => {
    it('debe eliminar el token y rol de localStorage', () => {
      localStorage.setItem('token', mockToken);
      localStorage.setItem('rol', mockRole);

      service.cerrarSesion();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('rol')).toBeNull();
    });
  });

  describe('getEmail', () => {
    it('debe devolver el email del token', () => {
      spyOn(service, 'getToken').and.returnValue(mockToken);
      const payload = { 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': mockEmail };
      expect(service.getEmail()).toBe(mockEmail);
    });

    it('debe devolver null cuando falta el token', () => {
      spyOn(service, 'getToken').and.returnValue(null);
      expect(service.getEmail()).toBeNull();
    });
  });

  describe('getRol', () => {
    it('debe devolver el rol del token', () => {
      spyOn(service, 'getToken').and.returnValue(mockToken);
      const payload = { 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': mockRole };
      expect(service.getRol()).toBe(mockRole);
    });

    it('debe devolver null cuando falta el token', () => {
      spyOn(service, 'getToken').and.returnValue(null);
      expect(service.getRol()).toBeNull();
    });
  });

  describe('registrarUsuario', () => {
    it('debe llamar a http post para registrar al usuario', () => {
      const dto = {
        nombre: 'John',
        apellido: 'Doe',
        email: 'john@example.com',
        contrasenia: '1234',
        repetirContrasenia: '1234',
        fechaNacimiento: new Date(),
      };
      const apiResponse: RespuestaApi<string> = { exito: true, mensaje: 'Ok', objeto: 'UserId' };

      service.registrarUsuario(dto).subscribe((res) => {
        expect(res).toEqual(apiResponse);
      });

      const req = httpMock.expectOne(`${environment.URL_BASE}/usuario/registro`);
      expect(req.request.method).toBe('POST');
      req.flush(apiResponse);
    });
  });
});
