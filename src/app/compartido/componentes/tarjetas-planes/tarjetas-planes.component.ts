import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../core/servicios/authServicio/auth.service';
import { RutinaService } from '../../../core/servicios/rutinaServicio/rutina.service';
import { UltimaRutina } from '../../../core/modelos/UltimaRutinaDTO';

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

  ultimaRutina: UltimaRutina | null = null;

  constructor(
    private authService: AuthService,
    private rutinaServicio: RutinaService
  ) {}

  ngOnInit(): void {
    const email = this.authService.getEmail();
    if (email) {
      this.obtenerUltimaRutina(email);
    }
  }

  obtenerUltimaRutina(email: string): void {
    this.rutinaServicio.obtenerUltimaRutina(email).subscribe({
      next: (rutina: any) => {
        this.ultimaRutina = rutina.objeto;
      },
      error: (err: any) => {
        console.error('No existe una última rutina de entrenamiento', err);
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
