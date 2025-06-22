import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/servicios/authServicio/auth.service';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

declare const bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  enRutina: boolean = false;
  mostrarModalSalirRutina: boolean = false;

  constructor(
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        this.enRutina = [
          'informacion-ejercicio',
          'calibracion-camara',
          'correccion-postura',
          'realizar-ejercicio',
          'finalizacion-rutina'
        ].some(ruta => url.includes(ruta));
      });
  }
obtenerRutaLogo(): string | null {
  if (this.enRutina) {
    return null; 
  }

  return this.estaLogueado() ? '/planes' : '/inicio';
}

navegarSiCorresponde(event: MouseEvent): void {
  if (this.enRutina) {
    event.preventDefault();
  }
}

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
    this.toastr.info('Has cerrado sesión correctamente.', '',
      {
        timeOut: 5000,
        closeButton: true,
        tapToDismiss: true
      }
    );
    this.router.navigate(['/iniciar-sesion']);
  }

  finalizarRutina() {
    this.router.navigate(['/planes']);
  }

  
  abrirModalFinalizarRutina() {
    this.mostrarModalSalirRutina = true;
  }

  cancelarSalidaRutina() {
    this.mostrarModalSalirRutina = false;
  }

  confirmarSalidaRutina() {
    this.mostrarModalSalirRutina = false;
    this.router.navigate(['/planes']);
  }
}