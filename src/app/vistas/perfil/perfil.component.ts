import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../../core/servicios/perfilServicio/perfil.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { PerfilDTO } from '../../core/modelos/PerfilDTO';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  email: string | null = null;
  perfil: PerfilDTO | null = null;

  fotoMostrar: string = 'imagenes/logo-trainin.svg';

  constructor(private perfilService: PerfilService,
    private authService: AuthService, 
    private toastr: ToastrService) { }

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
