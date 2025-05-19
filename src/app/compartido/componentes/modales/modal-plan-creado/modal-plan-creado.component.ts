import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-plan-creado',
  standalone: false,
  templateUrl: './modal-plan-creado.component.html',
  styleUrl: './modal-plan-creado.component.css'
})
export class ModalPlanCreadoComponent {
 @Output() aceptar = new EventEmitter<void>();

  onAceptar() {
    this.aceptar.emit();
  }
}
