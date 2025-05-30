import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  datos: any = {
    idUsuario: 44,
    idPremium: 1
  }

  constructor(private http: HttpClient) { }

  pagarConMercadoPago(): Observable<any> {
    return this.http.post<any>('http://localhost:5010/api/premium/pagar', this.datos);
  }
}