import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-reintento-correccion',
  templateUrl: './modal-reintento-correccion.component.html',
  styleUrls: ['./modal-reintento-correccion.component.css'],
})
export class ModalReintentoCorreccionComponent {
  constructor(public activeModal: NgbActiveModal) {}

  continuar() {
    this.activeModal.close('continuar');
  }
}
