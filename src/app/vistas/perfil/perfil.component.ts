import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../core/servicios/perfilServicio/perfil.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { PerfilDTO } from '../../core/modelos/PerfilDTO';
import { ToastrService } from 'ngx-toastr';
import { Logro } from '../../core/modelos/LogroDTO';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  email: string | null = null;
  perfil: PerfilDTO | null = null;
  logros: Logro[] = [];
  fotoMostrar: string = 'imagenes/logo-trainin.svg';
  cargando: boolean=true;

  constructor(private perfilService: PerfilService,
    private authService: AuthService, 
    private toastr: ToastrService,
    private logroService: LogroService) { }

  ngOnInit() {
    this.email = this.authService.getEmail();

    if (!this.email) {
      return;
    }

    this.perfilService.getPerfil(this.email).subscribe({
      next: (data) => {
        this.perfil = data.perfil;
        this.fotoMostrar = this.perfil?.fotoDePerfil ? this.perfil.fotoDePerfil : this.fotoMostrar;
      },
      error: (err) => {
        console.error('Error cargando perfil', err);
      }
    });

    this.logroService.obtenerLogrosPorUsuario(this.email).subscribe({
  next: (data: any) => {
    console.log('Logros obtenidos:', data.logros);

    this.logros = (data.logros || [])
      .sort((a: any, b: any) => new Date(b.fecha_obtencion).getTime() - new Date(a.fecha_obtencion).getTime())
      .slice(0, 3);
      this.cargando=false;
  },
  error: (err) => {
    console.error('Error al obtener logros', err);
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

}
