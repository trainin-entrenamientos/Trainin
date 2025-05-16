import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { RegistroUsuarioDTO } from '../../core/modelos/RegistroDTO';
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
      fechaNacimiento: ['', Validators.required]
    }, { validators: this.verificarContraseniasIguales });
  }

  verificarContraseniasIguales(form: FormGroup) {
    const pass = form.get('contrasenia')?.value;
    const repeat = form.get('repetirContrasenia')?.value;
    return pass === repeat ? null : { contrasenasNoCoinciden: true };
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.toastr.error('Por favor, complete todos los campos correctamente.', 'Formulario inválido');
      return;
    }

    const datos: RegistroUsuarioDTO = this.registroForm.value;

    this.authService.registrarUsuario(datos).subscribe({
      next: () => this.toastr.success('Registro enviado correctamente (¡aún sin guardar en DB!)'),
      error: err => this.toastr.error('Error al registrar: ' + err.message)
    });
  }
}
