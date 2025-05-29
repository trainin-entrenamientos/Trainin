import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.css',
  standalone: false
})
export class IniciarSesionComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', Validators.required]
    });

  }

  iniciarSesion() {
    if (this.loginForm.invalid) return;

    const credenciales = this.loginForm.value;
    this.authService.login(credenciales).subscribe({
      next: (data) => {
        if (data.exito && !data.requiereActivacion) {
          this.router.navigate(['/planes']);
        } else {
          alert('Debes activar tu cuenta antes de iniciar sesión.');
        }
      },
      error: () => {
        alert('Credenciales incorrectas o error de servidor.');
      }
    });
  }


}

