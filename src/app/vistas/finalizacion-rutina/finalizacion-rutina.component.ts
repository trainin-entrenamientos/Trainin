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
  modalInstance: any;
  selectedSidebarIndex: number | null = null;
  selectedEjercicioIndex: number = 0;
  opcionSeleccionadaEstadisticas: string | null = null;
  expandido:boolean=false;

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
    this.tiempoTotal = this.formatearTiempo(segundosTotales);
  }

  formatearTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}m ${segundosRestantes}s`;
  }

 opcionSeleccionadaSidebar(index: number) {
  if (this.selectedSidebarIndex === index) {
    this.selectedSidebarIndex = null; 
    this.expandido = false;          
  } else {
    this.selectedSidebarIndex = index;
    this.expandido = true;            
  }
}


selectEjercicio(index: number) {
  this.selectedEjercicioIndex = index;
}


  abrirModalFeedback() {
    const modalElement = document.getElementById('feedbackModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
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
    this.temporizadorService.reiniciarTiempo();
  }

  reiniciarRutina(): void {
    this.temporizadorService.reiniciarTiempo();
    this.rutina = null;
  }

indiceGrupoVisible: number = 0;

moverCarruselMuscular(direccion: number): void {
  const grupoActual = this.ejercicios[this.selectedEjercicioIndex].grupoMuscular;
  const totalGrupos = grupoActual.length;
  this.indiceGrupoVisible = (this.indiceGrupoVisible + direccion + totalGrupos) % totalGrupos;
}



opciones = [
  { id: 'estadisticas', icono: 'fa-solid fa-chart-simple' },
  { id: 'errores', icono: 'fa-solid fa-expand' },
  { id: 'musculos', icono: 'fa-solid fa-dumbbell' },
];

mostrarOpcion(opcionId: string) {
  this.opcionSeleccionadaEstadisticas = opcionId;
}

cerrarOpcion() {
  this.opcionSeleccionadaEstadisticas = null;
}



}