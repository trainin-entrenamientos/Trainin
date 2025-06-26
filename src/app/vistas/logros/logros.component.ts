import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logro } from '../../core/modelos/LogroDTO';
import { LogroService } from '../../core/servicios/logroServicio/logro.service';
import { AuthService } from '../../core/servicios/authServicio/auth.service';

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
    private authService: AuthService
  ) {
    this.filtroForm = this.fb.group({
      filtroSeleccionado: ['todos'],
    });
  }

  ngOnInit(): void {
    this.cargando = true;
    this.email = this.authService.getEmail();

    if (!this.email) {
      console.error('No se encontró el email del usuario');
      this.cargando = false;
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
            console.error('Error al obtener todos los logros:', err);
            this.cargando = false;
          },
        });
      },
      error: (err) => {
        console.error('Error al obtener los logros del usuario:', err);
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
