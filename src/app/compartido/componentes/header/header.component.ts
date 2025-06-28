import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/servicios/authServicio/auth.service';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../../core/modelos/Usuario';

declare const bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  enRutina: boolean = false;
  mostrarModalSalirRutina: boolean = false;
  mostrarSpotify: boolean = false;
  email: string | null = null;
  usuario: Usuario | null = null;
  esAdministrador: boolean = false;

  constructor(
    public authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;

        this.enRutina = [
          'informacion-ejercicio',
          'calibracion-camara',
          'correccion-postura',
          'realizar-ejercicio',
          'finalizacion-rutina',
        ].some((ruta) => url.includes(ruta));
      });
  }

  ngOnInit() {
    this.authService.rol$.subscribe((rol) => {
      this.esAdministrador = rol === 'Administrador';
    });
  }

  obtenerRolUsuario() {
    const rol = this.authService.getRol();
    if (rol === 'Administrador') {
      this.esAdministrador = true;
    }
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
    this.mostrarSpotify = localStorage.getItem('spotify_token') !== null && this.authService.estaAutenticado();
    return this.authService.estaAutenticado();
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.esAdministrador = false;
  }

  onClickCerrarSesion(event: MouseEvent) {
    event.preventDefault();

    const dropdownToggleEl =
      document.getElementById('userDropdown') ||
      document.getElementById('userDropdownAdmin');
    if (dropdownToggleEl) {
      const dropdownInstance =
        bootstrap.Dropdown.getOrCreateInstance(dropdownToggleEl);
      dropdownInstance.hide();
    }
    this.authService.cerrarSesion();
    this.toastr.info('Has cerrado sesión correctamente.', '', {
      timeOut: 5000,
      closeButton: true,
      tapToDismiss: true,
    });
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
