import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../core/servicios/perfilServicio/perfil.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { PerfilDTO } from '../../core/modelos/PerfilDTO';
import { ToastrService } from 'ngx-toastr';
import { LogroDTO } from '../../core/modelos/LogroDTO';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditarPerfilComponent } from '../../compartido/componentes/modales/modal-editar-perfil/modal-editar-perfil.component';
import { UsuarioEditado } from '../../core/modelos/UsuarioEditadoDTO';
import { ModalCambiarContraseniaComponent } from '../../compartido/componentes/modales/modal-cambiar-contrasenia/modal-cambiar-contrasenia.component';
import { Router } from '@angular/router';
import { HistorialPlanDTO } from '../../core/modelos/HistorialPlanDTO';
import { manejarErrorSimple, manejarErrorYRedirigir } from '../../compartido/utilidades/errores-toastr';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  email: string | null = null;
  perfil: PerfilDTO | null = null;
  logros: LogroDTO[] | undefined = [];
  fotoMostrar: string = 'imagenes/logo-trainin.svg';
  cargando: boolean = true;
  ultimosPlanesRealizados: HistorialPlanDTO[] = [];
  ejerciciosDiariosCompletados: number = 0;

  constructor(
    private perfilService: PerfilService,
    private authService: AuthService,
    private toastr: ToastrService,
    private logroService: LogroService,
    private modalServicio: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarPerfil();
  }

  private cargarPerfil(): void {
    this.email = this.authService.getEmail();
    if (!this.email) {
      manejarErrorYRedirigir(this.toastr, this.router, `No se pudo obtener el email del usuario`, '/planes');
      return;
    }

    this.cargando = true;
    this.perfilService.getPerfil(this.email).subscribe({
      next: ({objeto}) => {
        this.perfil = objeto;
        this.fotoMostrar = objeto.fotoDePerfil ?? this.fotoMostrar;
        this.logros = objeto.logros ?? [];
        this.cargando = false;
        this.ultimosPlanesRealizados = objeto.planesCompletados ?? [];
        this.ejerciciosDiariosCompletados = objeto.ejerciciosDiariosCompletados ?? 0;
      },
      error: (err) => {
        manejarErrorYRedirigir(this.toastr, this.router, `No se pudo obtener el perfil del usuario`, '/planes');      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64data = reader.result as string;
      this.fotoMostrar = base64data;

      if (this.email) {
        this.perfilService
          .actualizarFotoPerfil(this.email, base64data)
          .subscribe({
            next: (response) => {
              this.toastr.success(
                response.mensaje,
                'Foto actualizada correctamente'
              );
            },
            error: (err) => {
              manejarErrorSimple(this.toastr, `Error al actualizar la foto de perfil`);
            },
          });
      }
    };
    reader.readAsDataURL(file);
  }

  abrirEditarPerfilModal(): void {
    if (!this.perfil) return;

    const usuario: UsuarioEditado = {
      id: this.perfil.id!,
      nombre: this.perfil.nombre,
      apellido: this.perfil.apellido,
      fechaNacimiento: this.perfil.fechaNacimiento,
      altura: this.perfil.altura!,
    };

    const modalRef = this.modalServicio.open(ModalEditarPerfilComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalRef.componentInstance.usuario = usuario;

    modalRef.closed.subscribe(() => this.cargarPerfil());
  }

  abrirCambioContraseniaModal(): void {
    if (!this.perfil) return;
    const modalRef = this.modalServicio.open(ModalCambiarContraseniaComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalRef.componentInstance.idUsuario = this.perfil.id!;
  }

  formatearTiempo(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    return horas > 0
      ? `${pad(horas)}:${pad(minutos)}:${pad(segundosRestantes)}`
      : `${pad(minutos)}:${pad(segundosRestantes)}`;
  }

  irAlDetalle(idPlan: number) {
    this.router.navigate(['/detalle-plan', idPlan]);
  }
}
