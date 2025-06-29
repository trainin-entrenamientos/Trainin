import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VerificacionCorreoService } from './verificacion-correo.service';
import { environment } from '../../../../environments/environment';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';
 
describe('VerificacionCorreoService', () => {
  let service: VerificacionCorreoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.URL_BASE}/usuario/activar/`;
 
  const mockRespuesta: RespuestaApi<boolean> = {
    exito: true,
    mensaje: 'Activado correctamente',
    objeto: true
  };
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(VerificacionCorreoService);
    httpMock = TestBed.inject(HttpTestingController);
  });
 
  afterEach(() => {
    httpMock.verify();
  });
 
  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });
 
  it('confirmarEmail debería hacer GET y devolver RespuestaApi<boolean>', () => {
    const token = 'abc123';
 
    service.confirmarEmail(token).subscribe(res => {
      expect(res).toEqual(mockRespuesta);
    });
 
    const req = httpMock.expectOne(`${apiUrl}${token}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRespuesta);
  });
});
