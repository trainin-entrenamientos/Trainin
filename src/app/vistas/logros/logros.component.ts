import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logro } from '../../core/modelos/LogroDTO';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';
import { manejarErrorSimple, manejarErrorYRedirigir } from '../../compartido/utilidades/errores-toastr';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logros',
  standalone: false,
  templateUrl: './logros.component.html',
  styleUrls: ['./logros.component.css'],
})
export class LogrosComponent implements OnInit {
  todosLosLogros: Logro[] = [];
  logrosObtenidos: Logro[] = [];
  logrosFiltrados: Logro[] = [];
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
      manejarErrorYRedirigir(this.toastr, this.router, `No se pudo obtener el email del usuario`, '/planes');
      return;
    }

    const logrosObtenidos$ = this.logroService.obtenerLogrosPorUsuario(
      this.email
    );
    const todosLosLogros$ = this.logroService.obtenerTodosLosLogros();

    logrosObtenidos$.subscribe({
      next: (logrosObtenidos) => {
        const logrosUsuario = logrosObtenidos?.objeto ?? [];
        this.logrosObtenidos = logrosUsuario;

        todosLosLogros$.subscribe({
          next: (todosLosLogros) => {
            const todos = todosLosLogros?.objeto ?? [];
            const idsObtenidos = logrosUsuario.map((l: { id: any }) => l.id);

            this.todosLosLogros = todos.map((logro: { id: number }) => {
              const obtenido = logrosUsuario.find(
                (l: { id: number }) => l.id === logro.id
              );
              return {
                ...logro,
                obtenido: !!obtenido,
                fechaObtencion: obtenido?.fechaObtencion ?? null,
              };
            });
            this.cargando = false;
            this.aplicarFiltro();
          },
          error: (err) => {
            manejarErrorYRedirigir(this.toastr, this.router, `Error al obtener todos los logros`, '/planes');
          },
        });
      },
      error: (err) => {
        manejarErrorSimple(this.toastr, `Error al obtener tus logros`);
        this.cargando = false;
      },
    });

    this.filtroForm
      .get('filtroSeleccionado')
      ?.valueChanges.subscribe((valor) => {
        this.cambiarFiltro(valor);
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
