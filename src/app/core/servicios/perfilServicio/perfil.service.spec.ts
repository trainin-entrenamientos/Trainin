import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PerfilService } from './perfil.service';
import { environment } from '../../../../environments/environment';

describe('PerfilService', () => {
  let service: PerfilService;
  let httpMock: HttpTestingController;
  const base = `${environment.URL_BASE}/usuario/`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ PerfilService ]
    });
    service = TestBed.inject(PerfilService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debería crearse correctamente el servicio de perfil', () => {
    expect(service).toBeTruthy();
  });

  it('Debería obtenerse el perfil del usuario por email', () => {
    const email = 'trainin@trainin.com';
    service.getPerfil(email).subscribe();
    const req = httpMock.expectOne(`${base}obtenerPerfil/${encodeURIComponent(email)}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('Debería de actualizarse la foto de perfil del usuario', () => {
    const email = 'trainin@trainin.com';
    const foto = 'data:image/png;base64,AAA...';
    service.actualizarFotoPerfil(email, foto).subscribe();
    const req = httpMock.expectOne(`${base}perfil/`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ email, fotoBase64: foto });
    req.flush({});
  });
});
