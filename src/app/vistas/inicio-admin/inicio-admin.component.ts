import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EjercicioService } from '../../core/servicios/ejercicioServicio/ejercicio-servicio.service';
import { EjercicioIncorporadoDTO } from '../../core/modelos/EjercicioIncorporadoDTO'; 
import { CompartidoModule } from "../../compartido/compartido.module"; 

@Component({
  selector: 'app-administracion-ejercicios',
  standalone: false,
  templateUrl: './inicio-admin.component.html',
  styleUrls: ['./inicio-admin.component.css']
})

export class InicioAdminComponent implements OnInit {
[x: string]: any;
  selectedEjercicioIndex!: number;

  ejercicios: EjercicioIncorporadoDTO[] = [];
  ejercicioParaEliminar: number | null = null;

  constructor(
    private ejercicioService: EjercicioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEjercicios();
  }

  cargarEjercicios(): void {
      this.ejercicioService.obtenerTodosLosEjercicios().subscribe({
        next: (data) => (this.ejercicios = data),
      error: (err) => console.error(err)
    });
  }

  editarEjercicio(id: number): void {
    this.router.navigate(['/admin/ejercicios/editar', id]);
  }

  abrirModalEliminarEjercicio(id: number): void {
    this.ejercicioParaEliminar = id;
  }

  eliminarEjercicio(id: number): void {
    this.ejercicioService.eliminarEjercicio(id).subscribe({
      next: () => {
        this.ejercicioParaEliminar = null;
        this.cargarEjercicios();
      },
      error: (err) => console.error(err)
    });
  }
}
