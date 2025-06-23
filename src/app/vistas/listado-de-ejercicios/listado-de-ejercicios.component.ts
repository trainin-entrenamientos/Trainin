import { Component, OnInit } from '@angular/core';
import { EjercicioService } from '../../core/servicios/EjercicioServicio/ejercicio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ejercicios-list',
  standalone: false,
  templateUrl: './listado-de-ejercicios.component.html',
  styleUrl: './listado-de-ejercicios.component.css'
})
export class ListadoDeEjerciciosComponent implements OnInit {
  ejercicios: any[] = [];
  mostrarModalDeConfirmacion = false;
  ejercicioSeleccionado: any = null;
  mensajeModal = '';
  cargando: boolean = true;

  constructor(
    private svc: EjercicioService,
    private router: Router
  ) { }

  ngOnInit() {
    this.listarEjercicios();
  }

  listarEjercicios(): void {
    this.cargando = true;

    this.svc.obtenerTodosLosEjercicios()
      .subscribe({
        next: res => {
          this.ejercicios = res;
          this.cargando = false;
          console.log('Data recibida:', res);
        },
        error: err => {
          console.error(err);
          this.cargando = false;
          console.log('error listado');
        }
      });
  }

  crear(): void { this.router.navigate(['/crear']); }

  editar(e: any): void { this.router.navigate(['/editar', e.id]); }

  eliminar(e: any): void {
    this.svc.eliminarEjercicio(e.id).subscribe({
      next: (msg: any) => {
        console.log('Borrado:', msg);
        this.ejercicios = this.ejercicios.filter(x => x.id !== e.id);
        this.cancelarEliminarEjercicio();
      },
      error: err => {
        console.error('Error al eliminar:', err);
        this.cancelarEliminarEjercicio();
      }
    });
  }

  abrirModal(e: any): void {
    this.ejercicioSeleccionado = e;
    this.mensajeModal = `¿Estás segur@ de eliminar el ejercicio “${e.nombre}”?`;
    this.mostrarModalDeConfirmacion = true;
  }

  cancelarEliminarEjercicio(): void {
    this.ejercicioSeleccionado = null;
    this.mostrarModalDeConfirmacion = false;
  }

}