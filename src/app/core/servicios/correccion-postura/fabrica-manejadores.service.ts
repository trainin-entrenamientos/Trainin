import { Injectable } from '@angular/core';
import { NombreEjercicio } from '../../../compartido/enums/nombre-ejercicio.enum';
import { ManejadorCorreccion } from '../../../compartido/interfaces/manejador-correccion.interface';
import { PressMilitarHandler } from '../../../vistas/correccion-postura/manejadores/press-militar.handler';
import { VuelosLateralesHandler } from '../../../vistas/correccion-postura/manejadores/vuelos-laterales.handler';
import { CurlBicepsHandler } from '../../../vistas/correccion-postura/manejadores/curl-biceps.handler';
import { SentadillaHandler } from '../../../vistas/correccion-postura/manejadores/sentadilla.handler';
import { EstocadaHandler } from '../../../vistas/correccion-postura/manejadores/estocada.handler';
import { SentadillaBulgaraHandler } from '../../../vistas/correccion-postura/manejadores/sentadilla-bulgara.handler';
import { FondosTricepsHandler } from '../../../vistas/correccion-postura/manejadores/fondos-triceps.handler';
import { SentadillaLateralHandler } from '../../../vistas/correccion-postura/manejadores/sentadilla-lateral.handler';
import { AbduccionCaderaHandler } from '../../../vistas/correccion-postura/manejadores/abduccion-cadera.handler';

@Injectable({ providedIn: 'root' })
export class FabricaManejadoresService {
  obtenerManejador(ej: NombreEjercicio): ManejadorCorreccion {
    switch (ej) {
      case NombreEjercicio.PRESS_MILITAR:
        return new PressMilitarHandler();
      case NombreEjercicio.VUELOS_LATERALES:
        return new VuelosLateralesHandler();
      case NombreEjercicio.CURL_BICEPS:
        return new CurlBicepsHandler();
      case NombreEjercicio.SENTADILLA:
        return new SentadillaHandler();
      case NombreEjercicio.ESTOCADA:
        return new EstocadaHandler()
      case NombreEjercicio.SENTADILLA_BULGARA:
        return new SentadillaBulgaraHandler();  
      case NombreEjercicio.FONDOS_TRICEPS:
        return new FondosTricepsHandler();  
      case NombreEjercicio.SENTADILLA_LATERAL:
        return new SentadillaLateralHandler();  
      case NombreEjercicio.ABDUCCION_CADERA:
        return new AbduccionCaderaHandler();  
      case NombreEjercicio.SALTOS_TIJERA:
        return new AbduccionCaderaHandler();  
      default:
        throw new Error(`No existe manejador para ${ej}`);
    }
  }
}
