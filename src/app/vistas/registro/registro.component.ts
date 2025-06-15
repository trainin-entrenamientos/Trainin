import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { RegistroDTO } from '../../core/modelos/RegistroDTO';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  registroForm: FormGroup;
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registroForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
        apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$')]],
        email: ['', [Validators.required, Validators.email]],
        contrasenia: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*[0-9])(?=.*[\W_]).{6,}$/),
          ],
        ],
        repetirContrasenia: ['', Validators.required],
        fechaNacimiento: ['', [Validators.required, this.validarEdadMinima(16)]],
        aceptarTerminos: [false, Validators.requiredTrue],
      },
      { validators: this.verificarContraseniasIguales }
    );
  }

  validarEdadMinima(edadMinima: number) {
  return (control: any) => {
    const fechaNacimiento = new Date(control.value);
    if (isNaN(fechaNacimiento.getTime())) return null;

    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const cumpleEsteAnio =
      hoy.getMonth() > fechaNacimiento.getMonth() ||
      (hoy.getMonth() === fechaNacimiento.getMonth() &&
        hoy.getDate() >= fechaNacimiento.getDate());

    const edadFinal = cumpleEsteAnio ? edad : edad - 1;

    return edadFinal >= edadMinima ? null : { edadMinima: true };
  };
}

  verificarContraseniasIguales(form: FormGroup) {
    const pass = form.get('contrasenia')?.value;
    const repeat = form.get('repetirContrasenia')?.value;
    return pass === repeat ? null : { contrasenasNoCoinciden: true };
  }

  onSubmit() {
  if (this.registroForm.invalid) {
    this.marcarCamposComoTocados();
    this.toastr.error(
      'Por favor, completá todos los campos correctamente.',
      'Formulario inválido'
    );
    return;
  }

  const formValues = this.registroForm.value;

  const datos: RegistroDTO = {
    ...formValues,
    fechaNacimiento: this.formatearFecha(formValues.fechaNacimiento),
  };
  this.cargando=true;
  this.authService.registrarUsuario(datos).subscribe({
    next: (response: any) => {
      this.cargando=false;
      this.toastr.success(response.mensaje, 'Se ha registrado con éxito. Activá tu cuenta en tu Correo Electrónico para Ingresar al sitio.');
      this.router.navigate(['/iniciar-sesion']);
    },
    error: (err) => {
       this.cargando=false;
      const errorMsg =
        err.error?.mensaje ??
        (typeof err.error === 'string' ? err.error : 'Ocurrió un error inesperado al registrar el usuario.');
              this.cargando=false;

      this.toastr.error(errorMsg, 'Error de registro');
    }

  });
}


  private formatearFecha(fecha: Date | string): string {
    return new Date(fecha).toISOString(); 
  }

  marcarCamposComoTocados(): void {
    Object.keys(this.registroForm.controls).forEach((control) => {
      this.registroForm.get(control)?.markAsTouched();
    });
  }

  esFormularioValido(): boolean {
    return this.registroForm.valid;
  }
}
