import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from '../../compartido/enums/Categoria';
import { TipoEjercicio } from '../../compartido/enums/TipoEjercicio';
import { Ejercicio } from '../../core/modelos/Ejercicio';
import { AdminService } from '../../core/servicios/adminServicio/admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-ejercicio',
  standalone: false,
  templateUrl: './editar-ejercicio.component.html',
  styleUrls: ['./editar-ejercicio.component.css'],
})
export class EditarEjercicioComponent {
  categorias: string[] = Object.values(Categoria).filter(
    (value) => typeof value === 'string'
  ) as Categoria[];
  categoriaSeleccionada: Categoria = '' as Categoria;
  tipoEjercicios: string[] = Object.values(TipoEjercicio).filter(
    (value) => typeof value === 'string'
  ) as TipoEjercicio[];
  tipoEjercicioSeleccionado: TipoEjercicio = '' as TipoEjercicio;
  nombreEjercicio: string = '';
  ejercicioEditar?: Ejercicio;
  editarEjercicioForm: FormGroup;
  id?: number;

  constructor(
    private AdminService: AdminService,
    private formValidate: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.editarEjercicioForm = this.formValidate.group({
      nombreEjercicio: ['', [Validators.required]],
      categoriaSeleccionada: ['', [Validators.required]],
      tipoEjercicioSeleccionado: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.obtenerIdEjercicio();
  }

  obtenerIdEjercicio() {
    this.route.params.subscribe((params) => {
      if (!params['id']) {
        console.error('ID de ejercicio no proporcionado en la ruta.');
        return;
      }

      this.id = params['id'];
      if (this.id) {
        this.obtenerEjercicioPorId(this.id);
      }
    });
  }

  obtenerEjercicioPorId(id: number) {
    this.AdminService.obtenerEjercicioPorId(id).subscribe(
      (ejercicioObtenido: Ejercicio | null) => {
        if (!ejercicioObtenido) {
          this.router.navigate(['/home-admin']);
        }
        this.editarEjercicioForm.patchValue({
          id: ejercicioObtenido?.id,
          nombreEjercicio: ejercicioObtenido?.ejercicio || '',
          categoriaSeleccionada: ejercicioObtenido?.categoria || '',
          tipoEjercicioSeleccionado: ejercicioObtenido?.tipoEjercicio || ''
        });
      },
      (error: any) => {
        console.error('Error al obtener el ejercicio:', error);
      }
    );
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria as Categoria;
  }
  seleccionarTipoEjercicio(tipoEjercicio: string) {
    this.tipoEjercicioSeleccionado = tipoEjercicio as TipoEjercicio;
  }

  editarEjercicio() {
    if (this.editarEjercicioForm.invalid) {
      this.editarEjercicioForm.markAllAsTouched();
      console.log('Formulario inválido. Por favor, completa todos los campos.');
      return;
    }

    const {
      nombreEjercicio,
      categoriaSeleccionada,
      tipoEjercicioSeleccionado,
    } = this.editarEjercicioForm.value;

    this.ejercicioEditar = new Ejercicio(
      this.id!,
      nombreEjercicio,
      categoriaSeleccionada,
      tipoEjercicioSeleccionado
    );

    this.AdminService.editarEjercicio(this.ejercicioEditar).subscribe({
      next: () => {
        this.editarEjercicioForm.reset();
        this.editarEjercicioForm.patchValue({
          categoriaSeleccionada: '',
          tipoEjercicioSeleccionado: '',
        });
        this.router.navigate(['/home-admin']);
      },
      error: (error) => {
        console.error('Error al editar el ejercicio:', error);
      },
    });
  }
}
