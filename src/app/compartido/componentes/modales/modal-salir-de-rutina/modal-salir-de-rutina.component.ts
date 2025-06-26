import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-salir-de-rutina',
  standalone: false,
  templateUrl: './modal-salir-de-rutina.component.html',
  styleUrl: './modal-salir-de-rutina.component.css',
})
export class ModalSalirDeRutinaComponent {
  @Input() mensaje: string =
    '¿Estás segur@ que querés salir de la rutina? Se perderá todo el progreso';
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
