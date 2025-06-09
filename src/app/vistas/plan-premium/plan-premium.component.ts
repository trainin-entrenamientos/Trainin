import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
  NgModule,
} from '@angular/core';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { MercadoPagoService } from '../../core/servicios/mercadoPagoServicio/mercado-pago.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
 
@Component({
  selector: 'app-premium',
  standalone: false,
  templateUrl: './plan-premium.component.html',
  styleUrls: ['./plan-premium.component.css'],
})
export class PlanPremiumComponent implements AfterViewInit {
  @ViewChildren('cardFeature') cardFeatures!: QueryList<
    ElementRef<HTMLDivElement>
  >;
  rutaSuscripcion: string = '';
  email: string | null = '';
  usuario: any = {};
 
  constructor(
    public authService: AuthService,
    private mercadoPagoServicio: MercadoPagoService,
    private usuarioServicio: UsuarioService
  ) {}
 
  ngOnInit() {
    this.email = this.authService.getEmail();
    if (this.email) {
      this.obtenerUsuarioPorEmail();
    }
  }
 
  ngAfterViewInit() {
    const options = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, options);
 
    this.cardFeatures.forEach((cardEl) => {
      observer.observe(cardEl.nativeElement);
    });
  }
 
  estaLogueado(): boolean {
    return this.authService.estaAutenticado();
  }
 
  redirigir(url: string) {
  window.location.assign(url);
}

  pagarPremium() {
    this.mercadoPagoServicio
      .pagarSuscripcionPremium(this.usuario.idUsuario, 1)
      .subscribe({
        next: (response: any) => {
          if (response && response.url) {
        this.redirigir(response.url); 
          } else {
            console.error(
              'Error al obtener el punto de inicio de pago:',
              response
            );
          }
        },
        error: (error: any) => {
          console.error('Error al procesar el pago:', error);
        },
      });
  }
 
  obtenerUsuarioPorEmail() {
    this.usuarioServicio.obtenerUsuarioPorId(this.email).subscribe({
      next: (response: any) => {
        console.log('Usuario obtenido:', response);
        if (response && response.id) {
          this.usuario.idUsuario = response.id;
          this.usuario.esPremium = response.esPremium || false;
          console.log('Usuario:', this.usuario);
        } else {
          console.error('Error al obtener el ID del usuario:', response);
        }
      },
      error: (error: any) => {
        console.error('Error al obtener el usuario:', error);
      },
    });
  }
}