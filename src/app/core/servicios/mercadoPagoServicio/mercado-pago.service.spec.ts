import { TestBed } from '@angular/core/testing';
import { MercadoPagoService } from './mercado-pago.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';
import { environment } from '../../../../environments/environment';

describe('MercadoPagoService', () => {
  let service: MercadoPagoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.URL_BASE}/mercadoPago/pagar`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MercadoPagoService]
    });

    service = TestBed.inject(MercadoPagoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  describe('pagarSuscripcionPremium', () => {
    it('debería realizar el pago de la suscripción premium correctamente', () => {
      const respuestaMock: RespuestaApi<string> = {
        exito: true,
        mensaje: 'Pago realizado con éxito',
        objeto: 'Success'
      };

      const idUsuario = 1;
      const idPremium = 101;

      service.pagarSuscripcionPremium(idUsuario, idPremium).subscribe(response => {
        expect(response.mensaje).toBe('Pago realizado con éxito');
        expect(response.objeto).toBe('Success');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ IdUsuario: idUsuario, IdPremium: idPremium });
      req.flush(respuestaMock);
    });

    it('debería manejar el error si el pago no es exitoso', () => {
      const respuestaMock: RespuestaApi<string> = {
        exito: false,
        mensaje: 'Error en el pago',
        objeto: 'Failure'
      };

      const idUsuario = 1;
      const idPremium = 101;

      service.pagarSuscripcionPremium(idUsuario, idPremium).subscribe(
        response => {
          fail('La solicitud no debería haber sido exitosa');
        },
        error => {
          expect(error.status).toBe(500);
          expect(error.error.mensaje).toBe('Error en el pago');
        }
      );

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(respuestaMock, { status: 500, statusText: 'Server Error' });
    });
  });
});
