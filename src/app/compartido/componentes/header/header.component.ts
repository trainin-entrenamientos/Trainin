import { Component } from '@angular/core';
import { AuthService } from '../../../core/servicios/authServicio/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}

  estaLogueado(): boolean {
    return this.authService.estaAutenticado();
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
  }
}
