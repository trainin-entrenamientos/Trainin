import { Component } from '@angular/core';
import { AuthService } from '../../../core/servicios/authServicio/auth.service';

declare const bootstrap: any;

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

  onClickCerrarSesion(event: MouseEvent) {
    event.preventDefault();
  
    const dropdownToggleEl = document.getElementById('userDropdown');
    if (dropdownToggleEl) {
      const dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(dropdownToggleEl);
      dropdownInstance.hide();
    }

    this.authService.cerrarSesion();
  }
}
