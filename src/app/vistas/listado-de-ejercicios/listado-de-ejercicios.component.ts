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
  sortDirection: 'asc' | 'desc' = 'asc';

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
        },
        error: err => {
          console.error(err);
          this.cargando = false;
        }
      });
  }

  crear(): void { this.router.navigate(['/crear']); }

  editar(e: any): void { this.router.navigate(['/editar', e.id]); }

  eliminar(e: any): void {
    this.svc.eliminarEjercicio(e.id).subscribe({
      next: (msg: any) => {
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

  toggleSort(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.ordenarEjercicios();
  }

  private ordenarEjercicios(): void {
    this.ejercicios.sort((a, b) => {
      const diff = a.id - b.id;
      return this.sortDirection === 'asc' ? diff : -diff;
    });
  }

}