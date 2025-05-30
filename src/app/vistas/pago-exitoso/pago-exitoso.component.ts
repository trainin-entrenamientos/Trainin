import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PremiumService } from '../../core/servicios/premiumServicio/premium.service';

@Component({
  selector: 'app-pago-exitoso',
  standalone: false,
  templateUrl: './pago-exitoso.component.html',
  styleUrl: './pago-exitoso.component.css'
})
export class PagoExitosoComponent {
  
  constructor(private router: Router, private premiumServicio: PremiumService) { }

  ngOnInit(): void {
    this.premiumServicio.activarPlanPremiun().subscribe({
      next: (response) => {
        console.log('Plan premium activado exitosamente', response);
        this.router.navigate(['/planes']);
      },
      error: (error) => {
        console.error('Error al activar el plan premium', error);
      }
    });
  }
}