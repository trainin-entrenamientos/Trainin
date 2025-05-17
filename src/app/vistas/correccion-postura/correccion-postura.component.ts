import { Component } from '@angular/core';

@Component({
  selector: 'app-correccion-postura',
  standalone: false,
  templateUrl: './correccion-postura.component.html',
  styleUrl: './correccion-postura.component.css'
})
export class CorreccionPosturaComponent {
  finalizarPractica() {
    console.log('Finalizar práctica');
  }

  cerrar() {
    console.log('Modal cerrado');
  }
}
