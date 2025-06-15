import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-plan-creado',
  templateUrl: './modal-plan-creado.component.html',
  styleUrls: ['./modal-plan-creado.component.css'],
  standalone:false,
})
export class ModalPlanCreadoComponent {
  @Output() accionSeleccionada = new EventEmitter<'detalle' | 'iniciar'>();

  onAccion(tipo: 'detalle' | 'iniciar') {
    this.accionSeleccionada.emit(tipo);
  }
}
