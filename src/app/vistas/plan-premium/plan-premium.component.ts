import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MercadoPagoService } from '../../core/servicios/mercadoPagoServicio/mercado-pago.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-plan-premium',
  standalone: false,
  templateUrl: './plan-premium.component.html',
  styleUrl: './plan-premium.component.css'
})
export class PlanPremiumComponent {
  datos: any = {
    idUsuario: 44,
    idPremium: 1
  }

  datosObtenidos: any = {}

  constructor(private mercadoPagoServicio: MercadoPagoService) {}

  pagarConMercadoPago(): void {
    this.mercadoPagoServicio.pagarConMercadoPago().subscribe({
      next: (response) => {
        if (response.url) {
          this.datosObtenidos = response;
          window.location.href = this.datosObtenidos.url;
        } else {
          console.error('No se recibió una URL de pago válida');
        }
      },
      error: (error) => {
        console.error('Error al pagar con mercado pago', error);
      }
    });
  }
}