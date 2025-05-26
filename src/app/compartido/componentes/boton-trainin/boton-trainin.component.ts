import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-boton-trainin',
  standalone: false,
  templateUrl: './boton-trainin.component.html',
  styleUrl: './boton-trainin.component.css'
})
export class BotonTraininComponent {
  @Input() tipo: string = 'button';
  @Input() clase: string = 'btn-trainin';
  @Input() ruta: string | null = null;
  @Input() disabled = false;
  @Output() clickBoton = new EventEmitter<void>();
}
