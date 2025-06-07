import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  standalone: false,
  templateUrl: './pago-exitoso.component.html',
  styleUrl: './pago-exitoso.component.css'
})
export class PagoExitosoComponent {

  constructor(private router: Router) { }

  ngOnInit() {
      this.router.navigate(['/inicio']);
  }
}