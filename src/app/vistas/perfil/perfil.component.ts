import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../core/servicios/perfilServicio/perfil.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { PerfilDTO } from '../../core/modelos/PerfilDTO';
import { ToastrService } from 'ngx-toastr';
import { Logro } from '../../core/modelos/LogroDTO';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalEditarPerfilComponent } from '../../compartido/componentes/modales/modal-editar-perfil/modal-editar-perfil.component';
import { UsuarioEditado } from '../../core/modelos/UsuarioEditadoDTO';
import { ModalCambiarContraseniaComponent } from '../../compartido/componentes/modales/modal-cambiar-contrasenia/modal-cambiar-contrasenia.component';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  email: string | null = null;
  perfil: PerfilDTO | null = null;
  logros: Logro[] | undefined = [];
  fotoMostrar: string = 'imagenes/logo-trainin.svg';
  cargando: boolean = true;

  constructor(private perfilService: PerfilService,
    private authService: AuthService,
    private toastr: ToastrService,
    private logroService: LogroService,
    private modalServicio: NgbModal
  ) { }

  ngOnInit() {
    this.cargarPerfil();
  }

  private cargarPerfil(): void {
    this.email = this.authService.getEmail();
    if (!this.email) { this.cargando = false; return; }

    this.cargando = true;
    this.perfilService.getPerfil(this.email)
      .subscribe({
        next: ({ objeto }) => {
          this.perfil = objeto;
          this.fotoMostrar = objeto.fotoDePerfil ?? this.fotoMostrar;
          this.logros = objeto.logros ?? [];
          this.cargando = false;
        },
        error: err => {
          console.error('Error cargando perfil', err);
          this.cargando = false;
        }
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
        this.perfilService.actualizarFotoPerfil(this.email, base64data).subscribe({
          next: (response: any) => {
            this.toastr.success(response.message, 'Foto actualizada correctamente');
          },
          error: (err) => {
            this.toastr.error('Error al actualizar la foto');
          }
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
      altura: this.perfil.altura!
    };

    const modalRef = this.modalServicio.open(
      ModalEditarPerfilComponent,
      {
        centered: true,
        backdrop: 'static',
        size: 'lg'
      }
    );

    modalRef.componentInstance.usuario = usuario;

    modalRef.closed.subscribe(() => this.cargarPerfil());
  }

   abrirCambioContraseniaModal(): void {
    if (!this.perfil) return;
    const modalRef = this.modalServicio.open(
      ModalCambiarContraseniaComponent,
      { centered: true, backdrop: 'static', size: 'lg' }
    );

    modalRef.componentInstance.idUsuario = this.perfil.id!;
  }

}
