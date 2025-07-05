import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { EjercicioService } from '../../core/servicios/EjercicioServicio/ejercicio.service';
import { EjercicioIncorporadoDTO } from '../../core/modelos/EjercicioIncorporadoDTO';
import { manejarErrorSimple } from '../../compartido/utilidades/errores-toastr';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-admin',
  standalone: false,
  templateUrl: './form-admin.component.html',
  styleUrls: ['./form-admin.component.css'],
})
export class FormAdminComponent implements OnInit {
  form: FormGroup;
  categorias: any[] = [];
  grupos: any[] = [];
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private svc: EjercicioService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      video: [''],
      valorMet: [0, Validators.required],
      landmark: [''],
      tieneCorreccion: [false],
      imagen: [''],
      correccionPremium: [false],
      idTipoEjercicio: [0, Validators.required],
      idsGrupoMuscular: this.fb.array<number>([], Validators.required),
      idsCategorias: this.fb.array<number>([], Validators.required),
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : 0;
    this.isEdit = id > 0;

    forkJoin({
      cats: this.svc.obtenerCategorias(),
      grps: this.svc.obtenerGruposMusculares(),
    }).subscribe(({ cats, grps }) => {
      this.categorias = cats.objeto;
      this.grupos = grps.objeto;

      if (this.isEdit) {
        this.cargarEjercicio(id);
      }
    });
  }

  get idsGrupoMuscular(): FormArray {
    return this.form.get('idsGrupoMuscular') as FormArray;
  }

  get idsCategorias(): FormArray {
    return this.form.get('idsCategorias') as FormArray;
  }

  private cargarEjercicio(id: number) {
    this.svc.obtenerEjercicioPorId(id).subscribe({
      next: e => {
        this.form.patchValue({
          id: e.objeto.id,
          nombre: e.objeto.nombre,
          descripcion: e.objeto.descripcion,
          video: e.objeto.video,
          valorMet: e.objeto.valorMet,
          tieneCorreccion: e.objeto.tieneCorreccion,
          correccionPremium: e.objeto.correccionPremium,
          idTipoEjercicio: e.objeto.idTipoEjercicio,
          imagen: e.objeto.imagen
        });

        this.idsGrupoMuscular.clear();
        e.objeto.idsGrupoMuscular.forEach(i => this.idsGrupoMuscular.push(this.fb.control(i)));
        this.idsCategorias.clear();
        e.objeto.idsCategorias.forEach(i => this.idsCategorias.push(this.fb.control(i)));
      },
      error: err => {
        console.error('Error al cargar el ejercicio:', err);
      }
    });
  }

  onCheckboxChange(array: FormArray, checked: boolean, value: number): void {
    if (checked) {
      array.push(this.fb.control(value));
    } else {
      const idx = array.controls.findIndex((ctrl) => ctrl.value === value);
      if (idx >= 0) {
        array.removeAt(idx);
      }
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: EjercicioIncorporadoDTO = this.form.value;
    const request$ = this.isEdit
      ? this.svc.editarEjercicio(dto.id, dto)
      : this.svc.crearEjercicio(dto);

    request$.subscribe({
      next: () => this.router.navigate(['/listarEjercicios']),
      error: (err) =>
          manejarErrorSimple(this.toastr, `Error al guardar ejercicio.`),
    });
  }

  toggleSeleccion(array: FormArray, id: number) {
    const idx = array.value.indexOf(id);
    if (idx >= 0) {
      array.removeAt(idx);
    } else {
      array.push(this.fb.control(id));
    }
  }
}
