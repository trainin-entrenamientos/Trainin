import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PerfilService } from '../../../../core/servicios/perfilServicio/perfil.service';
import { UsuarioEditado } from '../../../../core/modelos/UsuarioEditadoDTO';
import { convertirFechaYYYYMMDD } from '../../../utilidades/fecha.utils';

@Component({
  selector: 'app-modal-editar-perfil',
  templateUrl: './modal-editar-perfil.component.html',
  styleUrl: './modal-editar-perfil.component.css',
  standalone: false,
})
export class ModalEditarPerfilComponent implements OnInit {
  @Input() usuario!: UsuarioEditado;
  form!: FormGroup;
  cargando = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [
        this.usuario.nombre,
        [Validators.required, Validators.minLength(2)],
      ],
      apellido: [
        this.usuario.apellido,
        [Validators.required, Validators.minLength(2)],
      ],
      fechaNacimiento: [
        convertirFechaYYYYMMDD(this.usuario.fechaNacimiento),
        Validators.required,
      ],
      altura: [
        this.usuario.altura,
        [Validators.required, Validators.min(50), Validators.max(300)],
      ],
    });
  }

  cancelar(): void {
    this.activeModal.dismiss();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const usuarioActualizado: UsuarioEditado = {
      ...this.usuario,
      ...this.form.value,
    };

    this.perfilService.editarPerfil(usuarioActualizado).subscribe({
      next: () => {
        this.toastr.success('Perfil actualizado correctamente');
        this.activeModal.close();
      },
      error: () => {
        this.toastr.error('Error al actualizar perfil');
        this.cargando = false;
      },
    });
  }
}
