import { Component } from '@angular/core';
import { Categoria } from '../../compartido/enums/Categoria';
import { TipoEjercicio } from '../../compartido/enums/TipoEjercicio';
import { Ejercicio } from '../../core/modelos/Ejercicio';
import { AdminService } from '../../core/servicios/adminServicio/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-ejercicio',
  standalone: false,
  templateUrl: './crear-ejercicio.component.html',
  styleUrl: './crear-ejercicio.component.css',
})
export class CrearEjercicioComponent {
  categorias: string[] = Object.values(Categoria).filter(
    (value) => typeof value === 'string'
  ) as Categoria[];
  categoriaSeleccionada: Categoria = '' as Categoria;
  tipoEjercicios: string[] = Object.values(TipoEjercicio).filter(
    (value) => typeof value === 'string'
  ) as TipoEjercicio[];
  tipoEjercicioSeleccionado: TipoEjercicio = '' as TipoEjercicio;
  nombreEjercicio: string = '';
  descripcionEjercicio: string = '';
  id: number = 0;
  crearEjercicioForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private formValidate: FormBuilder
  ) {
    this.crearEjercicioForm = this.formValidate.group({
      nombreEjercicio: ['', [Validators.required]],
      categoriaSeleccionada: ['', [Validators.required]],
      tipoEjercicioSeleccionado: ['', [Validators.required]],
    });
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria as Categoria;
  }

  seleccionarTipoEjercicio(tipoEjercicio: string) {
    this.tipoEjercicioSeleccionado = tipoEjercicio as TipoEjercicio;
  }

  crearEjercicio() {
    if (this.crearEjercicioForm.invalid) {
      this.crearEjercicioForm.markAllAsTouched();
      console.log('Formulario inválido. Por favor, completa todos los campos.');
      return;
    }

    const {
      nombreEjercicio,
      categoriaSeleccionada,
      tipoEjercicioSeleccionado,
    } = this.crearEjercicioForm.value;

    const ejercicioCreado = new Ejercicio(
      this.id++,
      nombreEjercicio,
      categoriaSeleccionada,
      tipoEjercicioSeleccionado
    );

    this.adminService.crearEjercicio(ejercicioCreado).subscribe({
      next: (ejercicioCreado) => {
        console.log('Ejercicio creado:', ejercicioCreado);
        this.crearEjercicioForm.reset();
        this.crearEjercicioForm.patchValue({
        categoriaSeleccionada: '',
        tipoEjercicioSeleccionado: ''
      });
      },
      error: (error) => {
        console.error('Error al crear el ejercicio:', error);
      },
      complete: () => {
        console.log('Proceso de creación de ejercicio completado.');
      },
    });
  }
}