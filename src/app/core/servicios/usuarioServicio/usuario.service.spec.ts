import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../modelos/Usuario';
import { ReestablecerContraseniaDTO } from '../../modelos/ReestablecerContraseniaDTO';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.URL_BASE;

  const mockUsuario = new Usuario(
    1, 'John', 'Doe', 'john@example.com', '1234', true, 5000, 180
  );

  const mockRespuestaUsuario: RespuestaApi<Usuario> = {
    exito: true,
    mensaje: 'OK',
    objeto: mockUsuario
  };

  const mockRespuestaString: RespuestaApi<string> = {
    exito: true,
    mensaje: 'Enviado',
    objeto: 'OK'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerUsuarioPorEmail debería hacer GET y devolver usuario', () => {
    service.obtenerUsuarioPorEmail('john@example.com').subscribe(res => {
      expect(res).toEqual(mockRespuestaUsuario);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuario/obtener/john@example.com`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRespuestaUsuario);
  });

  it('olvidarContrasenia debería hacer POST y devolver string', () => {
    service.olvidarContrasenia('john@example.com').subscribe(res => {
      expect(res).toEqual(mockRespuestaString);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuario/olvidasteContrasenia`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'john@example.com' });
    req.flush(mockRespuestaString);
  });

  it('reestablecerContrasenia debería hacer POST y devolver string', () => {
    const dto: ReestablecerContraseniaDTO = {
      email: 'john@example.com',
      token: 'token123',
      nuevaContrasenia: 'newpass'
    };

    service.reestablecerContrasenia(dto).subscribe(res => {
      expect(res).toEqual(mockRespuestaString);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuario/reestablecerContrasenia`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockRespuestaString);
  });
});