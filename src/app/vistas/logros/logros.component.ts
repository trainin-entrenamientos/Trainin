import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LogroDTO } from '../../core/modelos/LogroDTO';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import {
  manejarErrorSimple,
  manejarErrorYRedirigir,
} from '../../compartido/utilidades/errores-toastr';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-logros',
  standalone: false,
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.css'],
})
export class LogrosComponent implements OnInit {
  todosLosLogros: LogroDTO[] = [];
  logrosObtenidos: LogroDTO[] = [];
  logrosFiltrados: LogroDTO[] = [];
  filtroActivo: 'todos' | 'obtenidos' | 'faltantes' = 'todos';
  filtroForm: FormGroup;
  email: string | null = null;
  cargando: boolean = false;
  logrosTotales: number = 0;
  logrosObtenidosTotales: number = 0;
  tiposLogro = ['Bronce', 'Plata', 'Oro', 'Platino'] as const;

  logrosPorTipo: Record<
    (typeof this.tiposLogro)[number],
    { total: number; obtenidos: number }
  > = {
    Bronce: { total: 0, obtenidos: 0 },
    Plata: { total: 0, obtenidos: 0 },
    Oro: { total: 0, obtenidos: 0 },
    Platino: { total: 0, obtenidos: 0 },
  };

  constructor(
    private fb: FormBuilder,
    private logroService: LogroService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.filtroForm = this.fb.group({
      filtroSeleccionado: ['todos'],
    });
  }

  ngOnInit(): void {
    this.cargando = true;
    this.email = this.authService.getEmail();

    if (!this.email) {
      manejarErrorYRedirigir(
        this.toastr,
        this.router,
        'No se pudo obtener el email del usuario',
        '/planes'
      );
      return;
    }

    this.logroService.obtenerLogrosPorUsuario(this.email).subscribe({
      next: (respUser) => {
        console.log(respUser.objeto)
        this.logrosObtenidos = respUser.objeto || [];

        this.logroService.obtenerTodosLosLogros().subscribe({
          next: (respAll) => {
            const todos: LogroDTO[] = respAll.objeto || [];

            this.todosLosLogros = todos.map((l) => ({
              ...l,
              obtenido: this.logrosObtenidos.some((u) => u.id === l.id),
              fechaObtencion: this.parsearFecha(
                this.logrosObtenidos.find((u) => u.id === l.id)?.fechaObtencion
              ),
            }));
            this.logrosTotales = todos.length;
            this.logrosObtenidosTotales = this.logrosObtenidos.length;

            todos.forEach((logro) => {
              const tipo = this.obtenerTipoDeImagen(logro.imagen);

              if (this.logrosPorTipo[tipo]) {
                this.logrosPorTipo[tipo].total++;
                if (this.logrosObtenidos.some((l) => l.id === logro.id)) {
                  this.logrosPorTipo[tipo].obtenidos++;
                }
              }
            });

            this.cargando = false;
            this.aplicarFiltro();
          },
          error: () =>
            manejarErrorYRedirigir(
              this.toastr,
              this.router,
              'Error al obtener todos los logros',
              '/planes'
            ),
        });
      },
      error: () => {
        manejarErrorSimple(this.toastr, 'Error al obtener tus logros');
        this.cargando = false;
      },
    });

    this.filtroForm.get('filtroSeleccionado')?.valueChanges.subscribe((v) => {
      this.filtroActivo = v;
      this.aplicarFiltro();
    });
  }

  obtenerTipoDeImagen(url: string): 'Bronce' | 'Plata' | 'Oro' | 'Platino' {
    if (url.includes('bronce')) return 'Bronce';
    if (url.includes('plata')) return 'Plata';
    if (url.includes('oro')) return 'Oro';
    if (url.includes('platino')) return 'Platino';
    return 'Bronce';
  }

  logrosImagenes: Record<typeof this.tiposLogro[number], string> = {
  Bronce: 'https://oljazaeheifqqzqlajwk.supabase.co/storage/v1/object/sign/imagenes/medalla-bronce.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzExNTA4NjU1LWIzMDMtNGQyYy05NzUxLTQ0MDI0NzRmNmExNiJ9.eyJ1cmwiOiJpbWFnZW5lcy9tZWRhbGxhLWJyb25jZS5wbmciLCJpYXQiOjE3NDg4MzU4NDEsImV4cCI6MTc4MDM3MTg0MX0.T6xMpSOBGUkyQRzc5Sf8ikzuySqaZabEhQJlPXq_47I',
  Plata: 'https://oljazaeheifqqzqlajwk.supabase.co/storage/v1/object/sign/imagenes/medalla-plata.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzExNTA4NjU1LWIzMDMtNGQyYy05NzUxLTQ0MDI0NzRmNmExNiJ9.eyJ1cmwiOiJpbWFnZW5lcy9tZWRhbGxhLXBsYXRhLnBuZyIsImlhdCI6MTc0ODgzNTgyMywiZXhwIjoxNzgwMzcxODIzfQ.Td_Ee01KMa__uNFIUjKvMLhLVh9uvcTxhSCRqu4nTFM',
  Oro: 'https://oljazaeheifqqzqlajwk.supabase.co/storage/v1/object/sign/imagenes/medalla-oro.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzExNTA4NjU1LWIzMDMtNGQyYy05NzUxLTQ0MDI0NzRmNmExNiJ9.eyJ1cmwiOiJpbWFnZW5lcy9tZWRhbGxhLW9yby5wbmciLCJpYXQiOjE3NDg4MzU4MDIsImV4cCI6MTc4MDM3MTgwMn0.qhu_fH-Y4C4PlUJZEcHSQlibhhDxdXcJa0cTSCWnK6k',
  Platino: 'https://oljazaeheifqqzqlajwk.supabase.co/storage/v1/object/sign/imagenes/medalla-platino.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzExNTA4NjU1LWIzMDMtNGQyYy05NzUxLTQ0MDI0NzRmNmExNiJ9.eyJ1cmwiOiJpbWFnZW5lcy9tZWRhbGxhLXBsYXRpbm8ucG5nIiwiaWF0IjoxNzQ4ODM1Nzc1LCJleHAiOjE3ODAzNzE3NzV9.K1-12N87G86mmFutOCZyoGSSadpql2WNq9vfCEZLdwE',
};


  private parsearFecha(fecha: string | Date | undefined): Date {
    if (!fecha) return new Date();

    if (fecha instanceof Date) return fecha;

    const partes = fecha.split('/');
    if (partes.length === 3) {
      const [dia, mes, anio] = partes.map(Number);
      return new Date(anio, mes - 1, dia);
    }

    const parsed = new Date(fecha);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  aplicarFiltro(): void {
    switch (this.filtroActivo) {
      case 'obtenidos':
        this.logrosFiltrados = this.todosLosLogros.filter(
          (logro) => logro.obtenido
        );
        break;
      case 'faltantes':
        this.logrosFiltrados = this.todosLosLogros.filter(
          (logro) => !logro.obtenido
        );
        break;
      default:
        this.logrosFiltrados = [...this.todosLosLogros].sort(
          (a, b) => Number(b.obtenido) - Number(a.obtenido)
        );
        break;
    }
  }

  cambiarFiltro(valor: string): void {
    this.filtroActivo = valor as 'todos' | 'obtenidos' | 'faltantes';
    this.aplicarFiltro();
  }
}
