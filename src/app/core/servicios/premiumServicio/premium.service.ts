import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PremiumService {
  idUsuario: number = 44;
  datos: any = {
    idUsuario: this.idUsuario,
    idPremium: 1
  }
  datosObtenidos: any = {}

  constructor(private http: HttpClient) { }

  activarPlanPremiun(): Observable<any> {
    return this.http.patch<any>(`http://localhost:5010/api/premium/activarUsuario/${this.idUsuario}`, {
      IdUsuario: this.datosObtenidos.idUsuario,
      FuePago: true,
      TotalAbonado: this.datosObtenidos.totalAPagar,
      IdPremium: this.datosObtenidos.idPremium,
      ComprobanteMercadoPago: 'comprobante-12345',
    });
  }
}
