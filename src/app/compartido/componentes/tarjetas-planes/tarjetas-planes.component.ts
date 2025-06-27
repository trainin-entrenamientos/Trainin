import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../core/servicios/authServicio/auth.service';
import { RutinaService } from '../../../core/servicios/rutinaServicio/rutina.service';
import { UltimaRutina } from '../../../core/modelos/UltimaRutinaDTO';
import { LogroService } from '../../../core/servicios/logroServicio/logro.service';
import { ToastrService } from 'ngx-toastr';
import { manejarErrorSimple } from '../../utilidades/errores-toastr';

@Component({
  selector: 'app-tarjetas-planes',
  templateUrl: './tarjetas-planes.component.html',
  styleUrls: ['./tarjetas-planes.component.css'],
  standalone: false,
})
export class TarjetasPlanesComponent implements OnInit {
  @Input() mostrarComoVertical = true;
  @Input() hastaUnPlan = true;
  @Input() variosPlanes = true;
  @Input() nombreEjercicioDiario: string = '';
  @Input() ejercicioDiarioDisponible: boolean = false;

  ultimaRutina: UltimaRutina | null = null;
  cantidadLogros: number = 0;
  tieneRutina: boolean = true;

  constructor(
    private authService: AuthService,
    private rutinaServicio: RutinaService,
    private logrosService: LogroService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const email = this.authService.getEmail();
    if (email) {
      this.obtenerUltimaRutina(email);
      this.obtenerLogros(email);
    }
  }

  obtenerLogros(emailUsuario: string) {
    this.logrosService.obtenerLogrosPorUsuario(emailUsuario).subscribe({
      next: (response: any) => {
        this.cantidadLogros = response.objeto?.length;
      },
      error: (err) => {
        manejarErrorSimple(
          this.toastr,
          `Error al obtener los logros del usuario. ${err.mensaje}`
        );
      },
    });
  }

  obtenerUltimaRutina(email: string): void {
    this.rutinaServicio.obtenerUltimaRutina(email).subscribe({
      next: (rutina: any) => {
        this.ultimaRutina = rutina.objeto;
        if(this.ultimaRutina== null) {
          this.tieneRutina=false;
        }     
      },
      error: (err: any) => {
         manejarErrorSimple(
          this.toastr,
          `No existe una última rutina de entrenamiento. ${err.mensaje}`
        );
      },
    });
  }

  formatearTiempo(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    return horas > 0
      ? `${pad(horas)}:${pad(minutos)}:${pad(segundosRestantes)}`
      : `${pad(minutos)}:${pad(segundosRestantes)}`;
  }
}







