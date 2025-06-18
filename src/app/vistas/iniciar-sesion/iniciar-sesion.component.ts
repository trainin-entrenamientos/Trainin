import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
        const datos = data.objeto;
        if (data.exito && datos && !datos.requiereActivacion) {
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

