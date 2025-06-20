import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  url = environment.URL_BASE;

  constructor(private http: HttpClient) { }

  pagarSuscripcionPremium(idUsuario: number, idPremium: number): Observable<any> {
    return this.http.post<any>(`${this.url}/mercadoPago/pagar`, {
        IdUsuario: idUsuario,
        IdPremium: idPremium
    });
  }
}
