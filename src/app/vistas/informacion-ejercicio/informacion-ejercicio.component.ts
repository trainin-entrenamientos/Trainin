import { Component } from '@angular/core';
import { Rutina } from '../../core/modelos/RutinaDTO';
import { RutinaService } from '../../core/servicios/rutinaServicio/rutina.service';
import { Router } from '@angular/router';
import { Ejercicio } from '../../core/modelos/RutinaDTO';
import { TemporizadorService } from '../../core/servicios/temporizadorServicio/temporizador.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { NombreEjercicio } from '../../compartido/enums/nombre-ejercicio.enum';
import { ToastrService } from 'ngx-toastr';
import { manejarErrorYRedirigir } from '../../compartido/utilidades/errores-toastr';

@Component({
  selector: 'app-informacion-ejercicio',
  standalone: false,
  templateUrl: './informacion-ejercicio.component.html',
  styleUrl: './informacion-ejercicio.component.css',
})
export class InformacionEjercicioComponent {
  rutina: Rutina | null = null;
  indiceActual: number = 0;
  ejercicio: Ejercicio | null = null;
  duracionDelEjercicio: string = '';
  repeticionesDelEjercicio: string = '';
  duracionDescanso = 10;
  esUsuarioPremium: boolean = false;
  tiempoTotal = 0;
  tiempoRestante = 0;
  estaPausado = false;
  idIntervalo: any;
  esPrimerEjercicio: boolean = true;
  mostrarDescripcion = false;
  esEjercicioDeTiempo: boolean = false;
  clave: string | null = null;
  usuario: any;

  constructor(
    private rutinaService: RutinaService,
    private router: Router,
    private temporizadorService: TemporizadorService,
    private usuarioServicio: UsuarioService,
    private authServicio: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.rutinaService.cargarDesdeSession();
    this.obtenerUsuario();
    const datos = this.rutinaService.getDatosIniciales();

    if (!datos.rutina) {
      manejarErrorYRedirigir(this.toastr, this.router, `No se pudo obtener la rutina`, '/planes');
      return;
    }
    this.rutina = datos.rutina;
    this.ejercicio = datos.ejercicio;
    if (this.ejercicio.tipoEjercicio === 'De tiempo') {
      this.esEjercicioDeTiempo = true;
    }
    this.indiceActual = datos.indiceActual;
    this.duracionDelEjercicio = datos.duracionDelEjercicio;
    this.repeticionesDelEjercicio = datos.repeticionesDelEjercicio;
    this.tiempoRestante = this.traducirDuracionEstimada(
    this.rutina.duracionEstimada
    );
    this.iniciarCuentaRegresiva();
    this.temporizadorService.estaCorriendoTiempo() &&
      this.temporizadorService.continuar();
  }

  obtenerUsuario() {
    this.usuarioServicio
      .obtenerUsuarioPorEmail(this.authServicio.getEmail())
      .subscribe({
        next: (usuario) => {
          this.esUsuarioPremium = usuario.objeto.esPremium;
        },
        error: (error) => {
            manejarErrorYRedirigir(this.toastr, this.router, "No se pudo obtener al usuario" , '/informacion-ejercicio');
        },
      });
  }

  claveEjercicioCorreccion(): NombreEjercicio {
    const clave = this.rutinaService.buscarNombreEjercicio(
      this.ejercicio?.nombre
    );
    if (clave === null) {
      return NombreEjercicio.ERROR;
    } else {
      return clave;
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.idIntervalo);
  }

  traducirDuracionEstimada(valor: number): number {
    switch (valor) {
      case 1:
        return 15;
      case 2:
        return 15;
      default:
        return 10;
    }
  }

  botonPausar(): void {
    this.estaPausado = !this.estaPausado;
    this.temporizadorService.accionesDePausa(this.estaPausado);
  }

  private iniciarCuentaRegresiva(): void {
    this.idIntervalo = setInterval(() => {
      if (!this.estaPausado && this.tiempoRestante > 0) {
        this.tiempoRestante--;
      }

      if (this.tiempoRestante <= 0) {
        clearInterval(this.idIntervalo);
        this.router.navigate(['/realizar-ejercicio']);
      }
    }, 1000);
  }

  get cuentaRegresiva(): string {
    return this.temporizadorService.formatearTiempo(this.tiempoRestante);
  }

  get mensajeCuentaRegresiva(): string {
    if (this.rutinaService.getIndiceActual() === 0) {
      return 'Comenzamos en ';
    } else {
      return `Descanso. Continuá con tu entrenamiento en:`;
    }
  }

  get esAdvertencia(): boolean {
    return this.tiempoRestante <= 5;
  }

  get porcentajeDelProgreso(): number {
    const tiempoTotal = this.traducirDuracionEstimada(
      this.rutina?.duracionEstimada ?? 1
    );
    return ((tiempoTotal - this.tiempoRestante) / tiempoTotal) * 100;
  }
}
