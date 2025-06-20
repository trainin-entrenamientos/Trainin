import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-crear-plan-modal',
  standalone: false,
  templateUrl: './crear-plan-modal.component.html',
  styleUrl: './crear-plan-modal.component.css'
})
export class CrearPlanModalComponent {

  @Output() cerrar = new EventEmitter<void>();

  cerrarModal() {
    this.cerrar.emit();
  }

}


