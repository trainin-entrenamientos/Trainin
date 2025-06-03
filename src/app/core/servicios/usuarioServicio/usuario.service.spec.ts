import { TestBed } from '@angular/core/testing';

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

  it('Obtener usuario por ID', ()=> {
    const mockEmail = 'test@correo.com';
    const mockResponse = {id: 33, email: 'Test@correo.com'};
  
    service.obtenerUsuarioPorId(mockEmail).subscribe(usuario => {
      expect(usuario).toEqual(mockResponse);
    });

  const req = httpMock.expectOne(`${environment.URL_BASE}/usuario/obtenerUsuario/${mockEmail}`);
  expect (req.request.method).toBe('GET');
  req.flush(mockResponse);
  });

});
