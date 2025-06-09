import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LogroService } from './logro.service';
import { environment } from '../../../../environments/environment';
import { Logro } from '../../modelos/LogroDTO';

describe('LogroService', () => {
  let service: LogroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LogroService]
    });
    service = TestBed.inject(LogroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debería crearse correctamente el servicio del logro', () => {
    expect(service).toBeTruthy();
  });

  it('Debería mostrarse el nombre y la imagen cuando existe un objeto logro completo con todos sus campos', (done) => {
    const fecha = new Date();
    const logro: Logro = {
      id: 350,
      nombre: 'Logro1',
      descripcion: 'Descripción de prueba',
      imagen: 'img1.png',
      obtenido: false,
      fecha_obtencion: fecha
    };

    service.logroNotificaciones$.subscribe(payload => {
      expect(payload).toEqual({ nombre: 'Logro1', imagen: 'img1.png' });
      done();
    });

    service.mostrarLogro(logro);
  });

  it('Debería mostrar los logros obtenidos por un usuario', () => {
    const email = 'trainin@trainin.com';
    service.obtenerLogrosPorUsuario(email).subscribe();

    const req = httpMock.expectOne(
      `${environment.URL_BASE}/usuario/obtenerLogros/${email}`
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('Debería mostrar la lista con todos los logros existentes', () => {
    service.obtenerTodosLosLogros().subscribe();

    const req = httpMock.expectOne(
      `${environment.URL_BASE}/logro/obtenerLogros`
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
