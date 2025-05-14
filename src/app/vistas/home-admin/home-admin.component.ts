import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Ejercicio } from '../../core/modelos/Ejercicio';
import { AdminService } from '../../core/servicios/adminServicio/admin.service';
declare var bootstrap: any;

@Component({
  selector: 'app-home-admin',
  standalone: false,
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css',
})
export class HomeAdminComponent {
  ejercicios: Ejercicio[] = [];

  constructor(private AdminService: AdminService, private router: Router) {
    this.AdminService = AdminService;
  }

  ngOnInit(): void {
    this.obtenerEjercicios();
  }

  obtenerEjercicios(): void {
    this.AdminService.obtenerEjercicios().subscribe({
      next: (ejerciciosObtenidos: Ejercicio[]) => {
        this.ejercicios = ejerciciosObtenidos;
      },
      error: (err: any) => {
        console.error('Error al obtener los ejercicios:', err);
      },
      complete: () => {
        console.log('Petición completada');
      },
    });
  }

  editarEjercicio(id: number): void {
    this.router.navigate(['/editar-ejercicio', id]);
  }

  abrirModalEliminarEjercicio() {
    const modal = new bootstrap.Modal(document.getElementById('bootstrapModal'));
    modal.show();
  }

  eliminarEjercicio(id: number): void {
    this.AdminService.eliminarEjercicio(id).subscribe({
      next: (fueEliminado: boolean) => {
        if (fueEliminado) {
          this.ejercicios =
            this.ejercicios?.filter((ejercicio) => ejercicio.id !== id) || [];
          console.log('✅ Ejercicio eliminado con éxito');
        } else {
          console.error('❌ No se pudo eliminar el ejercicio');
        }
      },
      error: (err: any) => {
        console.error('❌ Error al eliminar el ejercicio:', err);
      },
      complete: () => {
        console.log('ℹ️ Petición de eliminación completada');
      },
    });
  }
}
