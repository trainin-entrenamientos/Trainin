import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone:false
})
export class LoginComponent {
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
  const credenciales = this.loginForm.value;

  this.authService.login(credenciales).subscribe({
    next: (data) => {
      console.log('Login exitoso:', data);

      if (data.exito && !data.requiereActivacion) {
        // Guardar token en localStorage si querés
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);

        // Redireccionar al dashboard
        console.log('Redirigiendo a crear-plan-entrenamiento...');
        this.router.navigate(['/crear-plan']);
      } else if (data.requiereActivacion) {
        alert('Debes activar tu cuenta antes de iniciar sesión.');
      }
    },
    error: (err) => {
      console.error('Error al iniciar sesión:', err);
      alert('Credenciales incorrectas o error de servidor.');
    }
  });
}
}

