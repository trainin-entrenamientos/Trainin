import { Component } from '@angular/core';
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
  styleUrl: './finalizacion-rutina.component.css',
})
export class FinalizacionRutinaComponent {
  opcionSeleccionada: string = '';
  ejercicios: Ejercicio[] = [];
  rutina: any;
  email: string | null = null;
  tiempoTotal: string = '';

  constructor(
    private rutinaService: RutinaService,
    private router: Router,
    private auth: AuthService,
    private temporizadorService: TemporizadorService
  ) {}

  ngOnInit(): void {
    this.rutina = this.rutinaService.getRutina();
    if (this.rutina != null) {
      this.ejercicios = this.rutina.ejercicios;
      this.email = this.auth.getEmail();
    } else {
      console.error('No existe la rutina.');
    }

    this.temporizadorService.pausar();
    const segundosTotales =
      this.temporizadorService.obtenerSegundosTranscurridos();
    this.tiempoTotal = this.formatTiempo(segundosTotales);
  }

  formatTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}min ${segundosRestantes}seg`;
  }

  enviarFeedback() {
    this.rutinaService.fueRealizada(this.rutina.id, this.email!).subscribe({
      next: () => {
        this.reiniciarRutina();
      },
      error: (error) => {
        console.error('Error al marcar la rutina como realizada:', error);
      },
    });
    if (!this.opcionSeleccionada) {
      alert('Por favor, selecciona una opción.');
      return;
    }

    const modalElement = document.getElementById('feedbackModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);

      if (modalInstance) {
        modalInstance.hide();
        setTimeout(() => {
          this.router.navigate(['/planes']);
        }, 300);
      } else {
        this.router.navigate(['/planes']);
      }
    }
  }

  reiniciarRutina(): void {
    this.temporizadorService.reiniciarTiempo();
    this.rutina = null;
  }

  estadisticas = [
    { label: 'Calorías Quemadas', valor: '120 cal' },
    { label: 'Duración Total', valor: '15 min' },
    { label: 'Estado Físico', valor: 'Excelente' },
    { label: 'Progreso Semanal', valor: '5/5 días' },
    { label: 'Logros Completados', valor: '2' },
  ];
}