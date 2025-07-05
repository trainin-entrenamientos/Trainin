import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RespuestaApi } from '../../modelos/RespuestaApiDTO';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  url = environment.URL_BASE;

  constructor(private http: HttpClient) { }

  pagarSuscripcionPremium(idUsuario: number, idPremium: number): Observable<RespuestaApi<string>> {
    return this.http.post<RespuestaApi<string>>(`${this.url}/mercadoPago/pagar`, {
        IdUsuario: idUsuario,
        IdPremium: idPremium
    });
  }
}
