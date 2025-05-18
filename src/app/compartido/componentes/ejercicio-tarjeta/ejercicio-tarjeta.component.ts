import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-ejercicio-tarjeta',
  standalone: false,
  templateUrl: './ejercicio-tarjeta.component.html',
  styleUrl: './ejercicio-tarjeta.component.css'
})
export class EjercicioTarjetaComponent {
  @Input() nombre!: string;
  @Input() imagen!: string;
}
