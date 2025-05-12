import { Component } from '@angular/core';

@Component({
  selector: 'app-preguntas-frecuentes',
  standalone: false,
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrl: './preguntas-frecuentes.component.css'
})
export class PreguntasFrecuentesComponent {
  desplegarInformacion(idInformacion: number): void {
    const informacion = document.querySelectorAll('.informacion')[idInformacion];
    const pregunta = document.querySelectorAll('.pregunta')[idInformacion];

    informacion?.classList.toggle('active');
    pregunta?.classList.toggle('active');
  }
}