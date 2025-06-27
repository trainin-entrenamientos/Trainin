import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { MercadoPagoService } from '../../core/servicios/mercadoPagoServicio/mercado-pago.service';
import { UsuarioService } from '../../core/servicios/usuarioServicio/usuario.service';
import { manejarErrorSimple } from '../../compartido/utilidades/errores-toastr';
import { ToastrService } from 'ngx-toastr';

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
    private usuarioServicio: UsuarioService,
    private toastr: ToastrService
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
        next: (response) => {
          if (response && response.objeto) {
            this.redirigir(response.objeto);
          } else {
            manejarErrorSimple(this.toastr, `Error al obtener el punto de inicio de pago`);
          }
        },
        error: (error: any) => {
          manejarErrorSimple(
            this.toastr,
            `Error al procesar el pago`
          );
        },
      });
  }

  obtenerUsuarioPorEmail() {
    this.usuarioServicio.obtenerUsuarioPorEmail(this.email).subscribe({
      next: (response: any) => {
        if (response) {
          this.usuario.idUsuario = response.objeto.id;
          this.usuario.esPremium = response.objeto.esPremium || false;
        } else {
          manejarErrorSimple(this.toastr, `No se pudo obtener al usuario`);
        }
      },
      error: (error: any) => {
        manejarErrorSimple(this.toastr, `Error al obtener el usuario`);
      },
    });
  }
}
