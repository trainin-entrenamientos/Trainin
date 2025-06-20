/*import { TestBed } from '@angular/core/testing';

import { UsuarioService } from './usuario.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { LoginResponseDTO } from '../../modelos/LoginResponseDTO';

describe('UsuarioService', () => {

  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });

    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('Obtener usuario por ID', () => {
    const mockEmail = 'test@correo.com';
    const mockResponse = { id: 33, email: 'Test@correo.com' };

    service.obtenerUsuarioPorEmail(mockEmail).subscribe(usuario => {
      expect(usuario).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.URL_BASE}/usuario/obtenerUsuario/${mockEmail}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('Debería de iniciarse la sesión de un usuario', () => {
    const dto: LoginResponseDTO = { token: '12348765', email: 'trainin@trainin.com', exito: true, requiereActivacion: true };
    service.iniciarSesion(dto).subscribe(resp => expect(resp).toEqual({ success: true }));

    const req = httpMock.expectOne(`${environment.URL_BASE}/usuario/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({ success: true });
  });

});*/
