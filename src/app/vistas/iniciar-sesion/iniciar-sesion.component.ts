import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NotificacionesService } from '../../core/servicios/notificacionesServicio/notificaciones.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.css',
  standalone: false
})
export class IniciarSesionComponent {
  loginForm: FormGroup;
  cargando: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificacionServicio: NotificacionesService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', Validators.required]
    });

  }
  
  iniciarSesion() {
    if (this.loginForm.invalid) return;
    this.cargando=true;
    const credenciales = this.loginForm.value;
    this.authService.login(credenciales).subscribe({
      next: (data) => {
        if (data.objeto.exito && !data.objeto.requiereActivacion) {
          this.notificacionServicio.pedirPermisoYRegistrar();
          this.router.navigate(['/planes']);
        } else {
          this.cargando=false;
          this.toastr.error('Debes activar tu cuenta antes de iniciar sesión.');
        }
      },
      error: () => {
        this.cargando=false;
        this.toastr.error('Credenciales incorrectas o error de servidor.');
      }
    });
  }


}

