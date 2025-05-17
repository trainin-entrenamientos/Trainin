import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { RegistroDTO } from '../../core/modelos/RegistroDTO';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[\W_]).{6,}$/)]],
      repetirContrasenia: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      aceptarTerminos: [false, Validators.requiredTrue] 

    }, { validators: this.verificarContraseniasIguales });
  }

  verificarContraseniasIguales(form: FormGroup) {
    const pass = form.get('contrasenia')?.value;
    const repeat = form.get('repetirContrasenia')?.value;
    return pass === repeat ? null : { contrasenasNoCoinciden: true };
  }

  onSubmit() {
  if (this.registroForm.invalid) {
    this.marcarCamposComoTocados();
    this.toastr.error('Por favor, completá todos los campos correctamente.', 'Formulario inválido');
    return;
  }

  const formValues = this.registroForm.value;

  const datos: RegistroDTO = {
    ...formValues,
    fechaNacimiento: this.formatearFecha(formValues.fechaNacimiento)
  };

      console.log(JSON.stringify(datos));

  this.authService.registrarUsuario(datos).subscribe({
    next: (mensaje: string) => {
      this.toastr.success(mensaje);
    },
    error: (err) => {
      const errorMsg = err.error || 'Error al registrar';
      this.toastr.error(errorMsg);
    }
  });
}


  private formatearFecha(fecha: Date | string): string {
  return new Date(fecha).toISOString(); // Ejemplo: "2002-05-16T00:00:00.000Z"
}

marcarCamposComoTocados(): void {
    Object.keys(this.registroForm.controls).forEach(control => {
      this.registroForm.get(control)?.markAsTouched();
    });
  }

  esFormularioValido(): boolean {
    return this.registroForm.valid;
  }
}
