import { Component, OnInit } from '@angular/core';
import { Ejercicio, RutinaService} from '../../core/servicios/rutina/rutina.service';

@Component({
  selector: 'app-finalizacion-rutina',
  standalone: false,
  templateUrl: './finalizacion-rutina.component.html',
  styleUrl: './finalizacion-rutina.component.css'
})
export class FinalizacionRutinaComponent implements OnInit {
  opcionSeleccionada: string = '';
  ejercicios: Ejercicio[] = [];

  constructor(private rutinaService: RutinaService) {}

  ngOnInit(): void {
    const rutina = this.rutinaService.getRutina();
    if (rutina) {
      this.ejercicios = rutina.ejercicios;
    } else {
      console.error('No se encontró la rutina.');
    }
  }

  enviarFeedback() {
    if (!this.opcionSeleccionada) {
      alert('Por favor, selecciona una opción.');
      return;
    }

    console.log('Feedback seleccionado:', this.opcionSeleccionada);
  }


  estadisticas = [
    { label: 'Calorías Quemadas', valor: '120 cal' },
    { label: 'Duración Total', valor: '15 min' },
    { label: 'Estado Físico', valor: 'Excelente' },
    { label: 'Progreso Semanal', valor: '5/5 días' },
    { label: 'Logros Completados', valor: '2' },
  ];
}
