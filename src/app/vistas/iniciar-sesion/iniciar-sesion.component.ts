import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificacionesService } from '../../core/servicios/notificacionesServicio/notificaciones.service';
import { manejarErrorSimple } from '../../compartido/utilidades/errores-toastr';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.css',
  standalone: false,
})
export class IniciarSesionComponent {
  loginForm: FormGroup;
  cargando: boolean = false;
  esAdministrador: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificacionServicio: NotificacionesService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', Validators.required],
    });
  }

  iniciarSesion() {
    if (this.loginForm.invalid) return;
    this.cargando = true;
    const credenciales = this.loginForm.value;
    this.authService.login(credenciales).subscribe({
      next: (data) => {
        if (data.objeto.exito && !data.objeto.requiereActivacion) {
          this.notificacionServicio.pedirPermisoYRegistrar();
          this.obtenerRolUsuario();
          if (this.esAdministrador) {
            this.router.navigate(['/listarEjercicios']);
          } else {
            this.router.navigate(['/planes']);
          }
        } else {
          this.cargando = false;
          manejarErrorSimple(this.toastr,'Debes activar tu cuenta antes de iniciar sesión.');
        }
      },
      error: (err) => {
        this.cargando = false;
        manejarErrorSimple(this.toastr,'Credenciales incorrectas o error de servidor.');
      },
    });
  }

  obtenerRolUsuario() {
    const rol = this.authService.getRol();
    if (rol === 'Administrador') {
      this.esAdministrador = true;
    }
  }
}
