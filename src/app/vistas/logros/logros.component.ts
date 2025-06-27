import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LogroDTO } from '../../core/modelos/LogroDTO';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { manejarErrorSimple, manejarErrorYRedirigir } from '../../compartido/utilidades/errores-toastr';
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
      manejarErrorYRedirigir(this.toastr, this.router,
        'No se pudo obtener el email del usuario', '/planes'
      );
      return;
    }

    this.logroService.obtenerLogrosPorUsuario(this.email)
      .subscribe({
        next: respUser => {
          this.logrosObtenidos = respUser.objeto || [];

          // 2) Traigo todos los logros y mapeo directamente
          this.logroService.obtenerTodosLosLogros()
            .subscribe({
              next: respAll => {
                const todos: LogroDTO[] = respAll.objeto || [];

                this.todosLosLogros = todos.map(l => ({
                  ...l,                                       // id, nombre, descripcion, imagen, tipo
                  obtenido: this.logrosObtenidos.some(u => u.id === l.id),
                  // si no lo encontró, pongo new Date() para cumplir con Date no-nullable
                  fechaObtencion: this.logrosObtenidos
                    .find(u => u.id === l.id)
                    ?.fechaObtencion
                    || new Date()
                }));

                this.cargando = false;
                this.aplicarFiltro();
              },
              error: () => manejarErrorYRedirigir(
                this.toastr, this.router,
                'Error al obtener todos los logros', '/planes'
              )
            });
        },
        error: () => {
          manejarErrorSimple(this.toastr, 'Error al obtener tus logros');
          this.cargando = false;
        }
      });

    this.filtroForm.get('filtroSeleccionado')?.valueChanges
      .subscribe(v => {
        this.filtroActivo = v;
        this.aplicarFiltro();
      });
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
