import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { RespuestaApi } from '../../core/modelos/RespuestaApiDTO';
import { manejarErrorSimple } from '../../compartido/utilidades/errores-toastr';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-olvidaste-contrasenia',
  standalone: false,
  templateUrl: './olvidaste-tu-contrasenia.component.html',
  styleUrls: ['./olvidaste-tu-contrasenia.component.css']
})

export class OlvidasteContraseniaComponent implements OnInit {
  form!: FormGroup;
  cargando = false;
  mensaje: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensaje = this.error = null;

    this.usuarioService
      .olvidarContrasenia(this.form.value.email)
      .subscribe({
        next: (res: RespuestaApi<string>) => {
          this.cargando = false;
          if (res.exito) {
            this.toastr.success(
              'Se ha enviado un correo para recuperar tu contraseña.',
              'Correo enviado'
            );
          }
        },
        error: (err) => {
          this.cargando = false;
          manejarErrorSimple(this.toastr, 'No se encontró una cuenta para el correo electrónico proporcionado.');
        }
      });
  }
}