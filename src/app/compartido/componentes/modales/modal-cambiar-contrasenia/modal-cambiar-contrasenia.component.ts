import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfilService } from '../../../../core/servicios/perfilServicio/perfil.service';
import { ToastrService } from 'ngx-toastr';
import { RespuestaApi } from '../../../../core/modelos/RespuestaApiDTO';
import { CambiarContraseniaDTO } from '../../../../core/modelos/CambiarContraseniaDTO';

@Component({
  selector: 'app-modal-cambiar-contrasenia',
  standalone: false,
  templateUrl: './modal-cambiar-contrasenia.component.html',
  styleUrl: './modal-cambiar-contrasenia.component.css'
})
export class ModalCambiarContraseniaComponent {

  @Input() idUsuario!: number;
  form!: FormGroup;
  cargando = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private perfilServicio: PerfilService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      contraseniaActual: ['', Validators.required],
      nuevaContrasenia: ['', [Validators.required, Validators.minLength(6)]],
      confirmarNuevaContrasenia: ['', Validators.required]
    }, { validators: this.contraseniasCoinciden });
  }

  contraseniasCoinciden(group: AbstractControl): ValidationErrors | null {
    const nc = group.get('nuevaContrasenia')?.value;
    const cnc = group.get('confirmarNuevaContrasenia')?.value;
    return nc && cnc && nc !== cnc ? { noCoincide: true } : null;
  }

  cancelar(): void {
    this.activeModal.dismiss();
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.cargando = true;

    const dto: CambiarContraseniaDTO = {
      idUsuario: this.idUsuario,
      contraseniaVieja: this.form.value.contraseniaActual,
      contraseniaNueva: this.form.value.nuevaContrasenia
    };

    this.perfilServicio.cambiarContrasenia(dto)
      .subscribe({
        next: (res: RespuestaApi<string>) => {
          if (res.exito) {
            this.toastr.success(res.mensaje);
            this.activeModal.close();
          } else {
            this.toastr.error(res.mensaje);
            this.cargando = false;
          }
        },
        error: () => {
          this.toastr.error('Error al cambiar la contraseña');
          this.cargando = false;
        }
      });
  }

}