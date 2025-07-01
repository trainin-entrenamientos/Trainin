import { TestBed } from '@angular/core/testing';
import { FabricaManejadoresService } from './fabrica-manejadores.service';
import { NombreEjercicio } from '../../../compartido/enums/nombre-ejercicio.enum';
import { PressMilitarHandler } from '../../../vistas/correccion-postura/manejadores/press-militar.handler';
import { VuelosLateralesHandler } from '../../../vistas/correccion-postura/manejadores/vuelos-laterales.handler';
import { CurlBicepsHandler } from '../../../vistas/correccion-postura/manejadores/curl-biceps.handler';
import { SentadillaHandler } from '../../../vistas/correccion-postura/manejadores/sentadilla.handler';
import { EstocadaHandler } from '../../../vistas/correccion-postura/manejadores/estocada.handler';
import { SentadillaBulgaraHandler } from '../../../vistas/correccion-postura/manejadores/sentadilla-bulgara.handler';
import { FondosTricepsHandler } from '../../../vistas/correccion-postura/manejadores/fondos-triceps.handler';
import { SentadillaLateralHandler } from '../../../vistas/correccion-postura/manejadores/sentadilla-lateral.handler';
import { AbduccionCaderaHandler } from '../../../vistas/correccion-postura/manejadores/abduccion-cadera.handler';
import { SaltosTijeraHandler } from '../../../vistas/correccion-postura/manejadores/saltos-tijera.handler';

describe('FabricaManejadoresService', () => {
  let service: FabricaManejadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FabricaManejadoresService]
    });
    service = TestBed.inject(FabricaManejadoresService);
  });

  it('Debería devolver PressMilitarHandler para NombreEjercicio.PRESS_MILITAR', () => {
    const handler = service.obtenerManejador(NombreEjercicio.PRESS_MILITAR);
    expect(handler).toEqual(jasmine.any(PressMilitarHandler));
  });

  it('Debería devolver VuelosLateralesHandler para NombreEjercicio.VUELOS_LATERALES', () => {
    const handler = service.obtenerManejador(NombreEjercicio.VUELOS_LATERALES);
    expect(handler).toEqual(jasmine.any(VuelosLateralesHandler));
  });


  it('Debería devolver CurlBicepsHandler para NombreEjercicio.CURL_BICEPS', () => {
    const handler = service.obtenerManejador(NombreEjercicio.CURL_BICEPS);
    expect(handler).toEqual(jasmine.any(CurlBicepsHandler));
  });

  it('Debería devolver SentadillaHandler para NombreEjercicio.SENTADILLA', () => {
    const handler = service.obtenerManejador(NombreEjercicio.SENTADILLA);
    expect(handler).toEqual(jasmine.any(SentadillaHandler));
  });

  it('Debería devolver EstocadaHandler para NombreEjercicio.ESTOCADA', () => {
    const handler = service.obtenerManejador(NombreEjercicio.ESTOCADA);
    expect(handler).toEqual(jasmine.any(EstocadaHandler));
  });

  it('Debería devolver SentadillaBulgaraHandler para NombreEjercicio.SENTADILLA_BULGARA', () => {
    const handler = service.obtenerManejador(NombreEjercicio.SENTADILLA_BULGARA);
    expect(handler).toEqual(jasmine.any(SentadillaBulgaraHandler));
  });

  it('Debería devolver FondosTricepsHandler para NombreEjercicio.FONDOS_TRICEPS', () => {
    const handler = service.obtenerManejador(NombreEjercicio.FONDOS_TRICEPS);
    expect(handler).toEqual(jasmine.any(FondosTricepsHandler));
  });

  it('Debería devolver SentadillaLateralHandler para NombreEjercicio.SENTADILLA_LATERAL', () => {
    const handler = service.obtenerManejador(NombreEjercicio.SENTADILLA_LATERAL);
    expect(handler).toEqual(jasmine.any(SentadillaLateralHandler));
  });

  it('Debería devolver AbduccionCaderaHandler para NombreEjercicio.ABDUCCION_CADERA', () => {
    const handler = service.obtenerManejador(NombreEjercicio.ABDUCCION_CADERA);
    expect(handler).toEqual(jasmine.any(AbduccionCaderaHandler));

  });

  it('Debería devolver AbduccionCaderaHandler para NombreEjercicio.SALTOS_TIJERA', () => {
    const handler = service.obtenerManejador(NombreEjercicio.SALTOS_TIJERA);
    expect(handler).toEqual(jasmine.any(SaltosTijeraHandler));
  });

  it('Debería lanzar un error si el ejercicio no está mapeado', () => {
    const invalid = -1 as unknown as NombreEjercicio;
    expect(() => service.obtenerManejador(invalid))
      .toThrowError('No existe manejador para -1');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});