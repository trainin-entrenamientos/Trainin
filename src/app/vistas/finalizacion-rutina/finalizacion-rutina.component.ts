import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Ejercicio } from '../../core/modelos/RutinaDTO';
import { RutinaService } from '../../core/servicios/rutina/rutina.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';

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
  rutina: any;
  email: string | null = null;
  tiempoTotal: string = '';
  modalInstance: any;

  
  constructor(
    private rutinaService: RutinaService,
    private router: Router,
    private auth: AuthService,
    private temporizadorService: TemporizadorService
  ) {}
  ngOnInit(): void {
  const rutinaGuardada = localStorage.getItem('rutina');
  if (rutinaGuardada) {
    this.rutina = this.rutinaService.getRutina();
    this.ejercicios = this.rutina.ejercicios;
    this.email = this.auth.getEmail();
  } else {
    console.error('No se encontró la rutina en el localStorage.');
  }
// ⏱️ Detener el timer y obtener los segundos
  this.temporizadorService.pause();
  const segundosTotales = this.temporizadorService.getElapsedSeconds();

  // ⏳ Convertir a formato legible (por ejemplo: mm:ss)
  this.tiempoTotal = this.formatTiempo(segundosTotales);
}

formatTiempo(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  return `${minutos}m ${segundosRestantes}s`;
}
abrirModalFeedback() {
  const modalElement = document.getElementById('feedbackModal');
  if (modalElement) {
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
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
    alert('Por favor, seleccioná una opción.');
    return;
  }

  this.rutinaService.fueRealizada(this.rutina.id, this.email!).subscribe({
    next: (response) => console.log('Rutina marcada como realizada:', response),
    error: (error) => console.error('Error al marcar la rutina como realizada:', error)
  });

  if (this.modalInstance) {
    this.modalInstance.hide();

    setTimeout(() => {
      this.router.navigate(['/planes']);
    }, 300);
  } else {
    this.router.navigate(['/planes']);
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
