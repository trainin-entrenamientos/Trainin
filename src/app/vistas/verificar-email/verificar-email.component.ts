import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VerificacionCorreoService } from '../../core/servicios/verificacionCorreoServicio/verificacion-correo.service';
import { manejarErrorSimple } from '../../compartido/utilidades/errores-toastr';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verificar-email',
  standalone: false,
  templateUrl: './verificar-email.component.html',
  styleUrls: ['./verificar-email.component.css'],
})
export class VerificarEmailComponent implements OnInit {
  token: string = '';
  usuarioActivo: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private verificacionService: VerificacionCorreoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.validarToken(this.token);
  }

  validarToken(token: string) {
    this.verificacionService.confirmarEmail(token).subscribe(
      (respuestaActivarUsuario) => {
        if (respuestaActivarUsuario.activo) {
          this.usuarioActivo = respuestaActivarUsuario.activo;
        }
      },
      (error) => {
        manejarErrorSimple(this.toastr, `No se pudo obtener el mail del usuario. ${error.mensaje}`);
      }
    );
  }
}
