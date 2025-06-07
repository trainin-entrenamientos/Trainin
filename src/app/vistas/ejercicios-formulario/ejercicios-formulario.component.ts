import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EjercicioService } from '../../core/servicios/ejercicioServicio/ejercicio-servicio.service';
import { EjercicioIncorporadoDTO } from '../../core/modelos/EjercicioIncorporadoDTO'; 

@Component({
  selector: 'app-ejercicios-form',
  standalone: false,
  templateUrl: './ejercicios-formulario.component.html',
  styleUrls: ['./ejercicios-formulario.component.css']
})
export class EjerciciosFormComponent implements OnInit {
  formulario!: FormGroup;
  esEdicion = false;
  ejercicioId!: number;
  cargando = false;
  errorMensaje: string | null = null;
  ejercicioOriginal!: EjercicioIncorporadoDTO;
  gruposMusculares: Array<{ id: number; nombre: string }> = [];
  categoriasEjercicio: Array<{ id: number; nombre: string }> = [];

  constructor(
    private fb: FormBuilder,
    private ejercicioService: EjercicioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1) Cargar las “listas” que usarán los <select> (ejercicioService debe proveerlas)
    this.ejercicioService.listarGruposMusculares().subscribe(lista => {
      this.gruposMusculares = lista; // ej: [{ id: 1, nombre: 'Pecho' }, …]
    });
    this.ejercicioService.listarCategoriasEjercicio().subscribe(lista => {
      this.categoriasEjercicio = lista; // ej: [{ id: 5, nombre: 'Fuerza' }, …]
    });

    // 2) Armar el form con TODOS los campos que tiene la interfaz
    this.formulario = this.fb.group({
      nombre:             ['', [Validators.required]],
      descripcion:        ['', [Validators.required]],
      idGrupoMuscular:    [null, [Validators.required]],
      // En lugar de un solo "idCategoriaEjercicio", definimos un array de IDs
      // para manejar “muchas categorías”. Si tu caso sólo usa 1, podés dejarlo como número.
      categorias:         [[], [Validators.required]],
      video:              ['', [Validators.required]],
      valorMet:           [0, [Validators.required, Validators.min(0)]],
      landmark:           [''],                  // permitimos string vacío o null
      tieneCorreccion:    [false],
      correccionPremium:  [false],
      imagen:             ['', [Validators.required]]
    });

    // 3) Verificar si la ruta trae un 'id'; si es edición, cargamos el DTO
    this.route.paramMap.subscribe(params => {
      const paramId = params.get('id');
      if (paramId) {
        this.esEdicion = true;
        this.ejercicioId = +paramId;
        this.cargarEjercicioParaEdicion(this.ejercicioId);
      }
    });
  }

  private cargarEjercicioParaEdicion(id: number): void {
    this.cargando = true;
    this.ejercicioService.obtenerEjercicioPorId(id).subscribe({
      next: (dto: EjercicioIncorporadoDTO) => {
        this.ejercicioOriginal = dto;

        // 4) Para llenar el formulario, extraemos:
        //    - El campo idGrupoMuscular (número)
        //    - El array de categorías (si dto.ejercicioCategorias = [{ idCategoria: 5, … }, …])
        //    - Los demás campos directos
        const categoriasIds = dto.ejercicioCategorias
          ? dto.ejercicioCategorias.map((ec: any) => ec.idCategoriaEjercicio)
          : [];

        this.formulario.patchValue({
          nombre:            dto.nombre,
          descripcion:       dto.descripcion,
          idGrupoMuscular:   dto.idGrupoMuscular,
          categorias:        categoriasIds,
          video:             dto.video,
          valorMet:          dto.valorMet,
          landmark:          dto.landmark,
          tieneCorreccion:   dto.tieneCorreccion,
          correccionPremium: dto.correccionPremium,
          imagen:            dto.imagen
        });

        this.cargando = false;
      },
      error: (err: any) => {
        console.error(err);
        this.errorMensaje = 'No se pudo cargar el ejercicio.';
        this.cargando = false;
      }
    });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    // 5) Armar el objeto EXACTO según la interfaz EjercicioIncorporadoDTO:
    //    - id, nombre, descripcion, video, valorMet, landmark, tieneCorreccion, imagen, correccionPremium
    //    - A partir de `idGrupoMuscular` -> construir ejercicioGrupoMuscular: [{ idGrupoMuscular: … }]
    //    - A partir de `categorias: number[]` -> construir ejercicioCategorias: [{ idCategoriaEjercicio: … }, …]

    const idGM = this.formulario.value.idGrupoMuscular;
    const cats: number[] = this.formulario.value.categorias;

    // Armamos los arrays de relaciones
    const ejercicioGrupoMuscular = idGM
      ? [{ idGrupoMuscular: idGM }]
      : [];
    const ejercicioCategorias = Array.isArray(cats)
      ? cats.map((catId: number) => ({ idCategoriaEjercicio: catId }))
      : [];

    const dtoEnviar: EjercicioIncorporadoDTO = {
      id:                      this.esEdicion ? this.ejercicioId : 0,
      nombre:                  this.formulario.value.nombre,
      descripcion:             this.formulario.value.descripcion,
      video:                   this.formulario.value.video,
      valorMet:                this.formulario.value.valorMet,
      landmark:                this.formulario.value.landmark || null,
      tieneCorreccion:         this.formulario.value.tieneCorreccion,
      imagen:                  this.formulario.value.imagen,
      correccionPremium:       this.formulario.value.correccionPremium,
      idGrupoMuscular:         idGM,
      ejercicioGrupoMuscular:  ejercicioGrupoMuscular.length ? ejercicioGrupoMuscular : null,
      ejercicioCategorias:     ejercicioCategorias.length ? ejercicioCategorias : null
    };

    this.cargando = true;
    this.errorMensaje = null;

    if (this.esEdicion) {
      this.ejercicioService.editarEjercicio(this.ejercicioId, dtoEnviar).subscribe({
        next: () => this.router.navigate(['/admin/ejercicios']),
        error: (err: any) => {
          console.error(err);
          this.errorMensaje = 'Error al actualizar.';
          this.cargando = false;
        }
      });
    } else {
      this.ejercicioService.crearEjercicio(dtoEnviar).subscribe({
        next: () => this.router.navigate(['/admin/ejercicios']),
        error: (err: any) => {
          console.error(err);
          this.errorMensaje = 'Error al crear.';
          this.cargando = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/admin/ejercicios']);
  }
}