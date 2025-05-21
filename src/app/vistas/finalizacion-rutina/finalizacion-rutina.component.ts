import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Ejercicio } from '../../core/modelos/RutinaDTO';
import { RutinaService } from '../../core/servicios/rutina/rutina.service';

declare var bootstrap: any;
@Component({
  selector: 'app-finalizacion-rutina',
  standalone: false,
  templateUrl: './finalizacion-rutina.component.html',
  styleUrl: './finalizacion-rutina.component.css'
})
export class FinalizacionRutinaComponent implements OnInit {
  opcionSeleccionada: string = '';
  ejercicios: Ejercicio[] = [];
  
  constructor(
    private rutinaService: RutinaService,
    private router: Router  
  ) {}
  ngOnInit(): void {
    const rutina = this.rutinaService.getRutina();
    if (rutina) {
      this.ejercicios = rutina.ejercicios;
    } else {
      console.error('No se encontró la rutina.');
    }
  }

  /*enviarFeedback() {
    if (!this.opcionSeleccionada) {
      alert('Por favor, selecciona una opción.');
      return;
    }
    this.router.navigate(['/planes']);
    console.log('Feedback seleccionado:', this.opcionSeleccionada);
  }*/

      enviarFeedback() {
    if (!this.opcionSeleccionada) {
      alert('Por favor, selecciona una opción.');
      return;
    }

    // Obtener el modal por id
    const modalElement = document.getElementById('feedbackModal');
    if (modalElement) {
      // Obtener instancia del modal con Bootstrap JS
      const modalInstance = bootstrap.Modal.getInstance(modalElement);

      if (modalInstance) {
        // Cerrar el modal
        modalInstance.hide();

        // Esperar un poco para que se cierre el modal (animación)
        setTimeout(() => {
          this.router.navigate(['/planes']);
        }, 300);
      } else {
        // Si no hay instancia (por si acaso), navegar directamente
        this.router.navigate(['/planes']);
      }
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
