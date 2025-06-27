import { Component, EventEmitter, Output } from '@angular/core';
declare var bootstrap: any;

@Component({
  selector: 'app-modal-eliminar-ejercicio',
  standalone: false,
  templateUrl: './modal-eliminar-ejercicio.component.html',
  styleUrl: './modal-eliminar-ejercicio.component.css',
})
export class ModalEliminarEjercicioComponent {
  @Output() confirmarEliminar = new EventEmitter<void>();

  confirmarEliminacion() {
    this.confirmarEliminar.emit();
    const modal = bootstrap.Modal.getInstance(
      document.getElementById('bootstrapModal')
    );
    modal.hide();
  }
}
