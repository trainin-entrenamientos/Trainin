import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Ejercicio } from '../../core/modelos/RutinaDTO';
import { RutinaService } from '../../core/servicios/rutinaServicio/rutina.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';
import { DatosEjercicio } from '../../compartido/interfaces/datos-ejercicio-correccion';
import { CorreccionDataService } from '../../core/servicios/correccionPosturaServicio/correccion-data.service';
import { PlanEntrenamientoService } from '../../core/servicios/planEntrenamientoServicio/plan-entrenamiento.service';
import { ActualizarNivelExigenciaDTO } from '../../core/modelos/ActualizarNivelExigenciaDTO';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';
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
  expandido: boolean = false;
  indiceGrupoVisible: number = 0;
  datosCorreccion: DatosEjercicio[] = [];
  caloriasQuemadas: number = 0;
  nivel: number = 0;

  constructor(
    private planService: PlanEntrenamientoService,
    private rutinaService: RutinaService,
    private router: Router,
    private auth: AuthService,
    private temporizadorService: TemporizadorService,
    private correccionData: CorreccionDataService,
    private logroService: LogroService
  ) { }

  ngOnInit(): void {
    this.rutina = this.rutinaService.cargarDesdeSession();
    const datos = this.rutinaService.getDatosIniciales();
    this.rutina = datos.rutina;
    this.caloriasQuemadas = datos.rutina?.caloriasQuemadas || 0;

    if (this.rutina != null) {
      this.ejercicios = this.rutina.ejercicios;
      this.email = this.auth.getEmail();
    } else {
      console.error('No existe la rutina.');
    }
    this.temporizadorService.pausar();
    const segundosTotales = this.temporizadorService.obtenerSegundosTranscurridos();
    this.tiempoTotal = this.temporizadorService.formatearTiempo(segundosTotales);

    this.datosCorreccion = this.correccionData.obtenerTodos();
  }

  selectEjercicio(index: number) {
    this.selectedEjercicioIndex = index;
    this.indiceGrupoVisible = 0;
  }

  anteriorEjercicio() {
  if (this.ejercicios.length === 0) return;
  this.selectedEjercicioIndex =
    (this.selectedEjercicioIndex - 1 + this.ejercicios.length) %
    this.ejercicios.length;
  this.indiceGrupoVisible = 0;
}

siguienteEjercicio() {
  if (this.ejercicios.length === 0) return;
  this.selectedEjercicioIndex =
    (this.selectedEjercicioIndex + 1) % this.ejercicios.length;
  this.indiceGrupoVisible = 0;
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

  moverCarruselMuscular(direccion: number): void {
    const grupoActual = this.ejercicios[this.selectedEjercicioIndex].grupoMuscular;
    const totalGrupos = grupoActual.length;
    this.indiceGrupoVisible = (this.indiceGrupoVisible + direccion + totalGrupos) % totalGrupos;
  }

  abrirModalFeedback() {
    const modalElement = document.getElementById('feedbackModal');
    if (!modalElement) return;

    const instanciaExistente = bootstrap.Modal.getInstance(modalElement);
    if (instanciaExistente) {
      instanciaExistente.dispose();
    }

    this.modalInstance = new bootstrap.Modal(modalElement, {
      backdrop: 'static',
      keyboard: false
    });

    this.modalInstance.show();
  }


  enviarFeedback() {
    if (!this.opcionSeleccionada) {
      alert('Por favor, selecciona una opción.');
      return;
    }

    switch (this.opcionSeleccionada) {
      case 'facil':
        this.nivel = 1;
        break;
      case 'dificil':
        this.nivel = 2;
        break;
      default:
        this.nivel = 0;
    }

    const dto: ActualizarNivelExigenciaDTO = {
      nivelExigencia: this.nivel,
      email: this.email!
    };
     const segundosTotales = this.temporizadorService.obtenerSegundosTranscurridos();
     
    this.planService.actualizarNivelExigencia(this.rutina.idPlan, dto).subscribe({
      next: (mensaje) => {
        const modalElement = document.getElementById('feedbackModal');
        if (modalElement) {
          const instancia = bootstrap.Modal.getInstance(modalElement);
          if (instancia) {
            instancia.hide();
          }
        }
        this.temporizadorService.reiniciarTiempo();
        this.reiniciarRutina();
        this.router.navigate(['/planes']);
      },
      error: (err) => {
        console.error('Error al actualizar nivel de exigencia:', err);
        alert('Ocurrió un error al guardar tu feedback. Intentá de nuevo.');
      }
    })
    if (this.rutina && this.email) {
      this.rutinaService.fueRealizada(this.rutina.id, this.email, segundosTotales).subscribe({
        next: (respuesta) => {
            if (respuesta.logro) {
              this.logroService.mostrarLogro(respuesta.logro);
            }
         },
        error: (err) => {
          console.error('Error al marcar la rutina como realizada en ngOnInit:', err);
        }
      });
    }
    ;
  }

  reiniciarRutina(): void {
    this.temporizadorService.reiniciarTiempo();
    this.rutina = null;
    this.rutinaService.limpiarRutina();
    this.correccionData.limpiarDatos();
  }

  getDatoEjercicio(nombreEjercicio: string): DatosEjercicio | undefined {
    const ejercicioEnum = this.rutinaService.buscarNombreEjercicio(nombreEjercicio);

    return this.datosCorreccion.find(d =>
      d.nombre === ejercicioEnum
    );
  }



}