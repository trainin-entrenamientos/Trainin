import { TestBed } from '@angular/core/testing';
import { LogroService } from './logro.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LogroDTO } from '../../modelos/LogroDTO';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';
import { environment } from '../../../../environments/environment';

describe('LogroService', () => {
  let service: LogroService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.URL_BASE}`;

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

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('mostrarLogro', () => {
    it('debería emitir un logro a los observadores', (done) => {
      const logro: LogroDTO = {
        id: 1,
        nombre: 'Logro 1',
        descripcion: 'Descripción del logro 1',
        imagen: 'imagen1.jpg',
        obtenido: true,
        tipo: 'Tipo 1',
        fechaObtencion: new Date('2025-06-27')
      };

      service.logroNotificaciones$.subscribe(data => {
        expect(data.nombre).toBe('Logro 1');
        expect(data.imagen).toBe('imagen1.jpg');
        done();
      });

      service.mostrarLogro(logro);
    });
  });

  describe('obtenerLogrosPorUsuario', () => {
    it('debería devolver los logros de un usuario', () => {
      const email = 'test@example.com';
      const respuestaMock: RespuestaApi<LogroDTO[]> = {
        exito: true,
        mensaje: 'Éxito',
        objeto: [
          { id: 1, nombre: 'Logro 1', descripcion: 'Descripción del logro 1', imagen: 'imagen1.jpg', obtenido: true, tipo: 'Tipo 1', fechaObtencion: new Date('2025-06-27') },
          { id: 2, nombre: 'Logro 2', descripcion: 'Descripción del logro 2', imagen: 'imagen2.jpg', obtenido: false, tipo: 'Tipo 2', fechaObtencion: new Date('2025-06-28') }
        ]
      };

      service.obtenerLogrosPorUsuario(email).subscribe(response => {
        expect(response.objeto.length).toBe(2);
        expect(response.objeto[0].nombre).toBe('Logro 1');
        expect(response.objeto[1].obtenido).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/usuario/obtenerLogros/${email}`);
      expect(req.request.method).toBe('GET');
      req.flush(respuestaMock);
    });
  });

  describe('obtenerTodosLosLogros', () => {
    it('debería devolver todos los logros', () => {
      const respuestaMock: RespuestaApi<LogroDTO[]> = {
        exito: true,
        mensaje: 'Éxito',
        objeto: [
          { id: 1, nombre: 'Logro 1', descripcion: 'Descripción del logro 1', imagen: 'imagen1.jpg', obtenido: true, tipo: 'Tipo 1', fechaObtencion: new Date('2025-06-27') },
          { id: 2, nombre: 'Logro 2', descripcion: 'Descripción del logro 2', imagen: 'imagen2.jpg', obtenido: false, tipo: 'Tipo 2', fechaObtencion: new Date('2025-06-28') }
        ]
      };

      service.obtenerTodosLosLogros().subscribe(response => {
        expect(response.objeto.length).toBe(2);
        expect(response.objeto[0].nombre).toBe('Logro 1');
        expect(response.objeto[1].obtenido).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/logro/obtener`);
      expect(req.request.method).toBe('GET');
      req.flush(respuestaMock);
    });
  });
});
