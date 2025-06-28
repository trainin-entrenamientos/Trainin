/*import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } 
  from '@angular/common/http/testing';
import { VerificacionCorreoService } from './verificacion-correo.service';
import { environment } from '../../../../environments/environment';

describe('VerificacionCorreoService', () => {
  let service: VerificacionCorreoService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.URL_BASE}/usuario/confirmarEmail/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VerificacionCorreoService]
    });
    service = TestBed.inject(VerificacionCorreoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debería crearse correctamente el servicio de verificación de correo', () => {
    expect(service).toBeTruthy();
  });

  it('Debería confirmar la cuenta de correo de un usuario con el token proporcionado', () => {
    const fakeToken = 'abc123';
    const mockResponse = { success: true };

    service.confirmarEmail(fakeToken).subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(baseUrl + fakeToken);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});*/
