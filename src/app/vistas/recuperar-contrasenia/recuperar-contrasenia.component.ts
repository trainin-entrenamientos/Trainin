import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { RespuestaApi } from '../../core/modelos/RespuestaApiDTO';
import { ToastrService } from 'ngx-toastr';
import { manejarErrorSimple, manejarErrorYRedirigir } from '../../compartido/utilidades/errores-toastr';

interface ReestablecerContraseniaDTO {
  email: string;
  token: string;
  nuevaContrasenia: string;
}

@Component({
  selector: 'app-recuperar-contrasenia',
  standalone: false,
  templateUrl: './recuperar-contrasenia.component.html',
  styleUrls: ['./recuperar-contrasenia.component.css']
})
export class RecuperarContraseniaComponent implements OnInit {
  form!: FormGroup;
  token = '';
  email = '';
  cargando = false;
  mensaje: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    const qp = this.route.snapshot.queryParamMap;
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.email = this.route.snapshot.paramMap.get('email')!;

    this.form = this.fb.group({
      nuevaContrasenia: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*\W).{6,}$/)
      ]],
      repetirContrasenia: ['', Validators.required]
    }, {
      validators: group =>
        group.get('nuevaContrasenia')!.value === group.get('repetirContrasenia')!.value
          ? null
          : { contrasenasNoCoinciden: true }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: ReestablecerContraseniaDTO = {
      email: this.email,
      token: this.token,
      nuevaContrasenia: this.form.value.nuevaContrasenia
    };

    this.cargando = true;
    this.mensaje = this.error = null;

    this.usuarioService.reestablecerContrasenia(dto).subscribe({
      next: (res: RespuestaApi<string>) => {
        this.cargando = false;
        if (res.exito) {
          this.toastr.success(
            'Contraseña actualizada. Ya podés iniciar sesión'
          );
          setTimeout(() => this.router.navigate(['/iniciar-sesion']), 3000);
        } else {
          manejarErrorSimple(this.toastr, `Error no se pudo actualizar la contraseña`);
        }
      },
      error: () => {
        this.cargando = false;
        manejarErrorYRedirigir(this.toastr, this.router, `Ocurrió un error reestableciendo la contraseña`, '/iniciar-sesion');
      }
    });
  }
}