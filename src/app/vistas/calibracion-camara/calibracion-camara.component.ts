import { Component } from '@angular/core';

@Component({
  selector: 'app-calibracion-camara',
  standalone: false,
  templateUrl: './calibracion-camara.component.html',
  styleUrl: './calibracion-camara.component.css'
})
export class CalibracionCamaraComponent {



  practicarEjercicio() {
    console.log('Ejercicio iniciado');
    // Acá podés redirigir o iniciar la lógica
  }

  cerrar() {
    console.log('Modal cerrado');
    // Podés ocultar el componente con un *ngIf si lo usás como modal
  }
  
}


