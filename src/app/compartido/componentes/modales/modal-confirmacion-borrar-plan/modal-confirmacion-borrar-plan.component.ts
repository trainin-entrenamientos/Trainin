import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
 selector: 'app-modal-confirmacion-borrar-plan',
  standalone: false,
  templateUrl: './modal-confirmacion-borrar-plan.component.html',
  styleUrl: './modal-confirmacion-borrar-plan.component.css'
})
export class ModalConfirmacionBorrarPlanComponent {
  @Input() mensaje: string = '¿Estás segura/o que querés desactivar este plan?';
  @Input() visible: boolean = false;
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirmar() {
    this.onConfirm.emit();
  }

  cancelar() {
    this.onCancel.emit();
  }
}
