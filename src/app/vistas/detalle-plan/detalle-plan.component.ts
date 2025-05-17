import { Component } from '@angular/core';

@Component({
  selector: 'app-detalle-plan',
  standalone: false,
  templateUrl: './detalle-plan.component.html',
  styleUrl: './detalle-plan.component.css'
})
export class DetallePlanComponent {
  semanas: any[] = [];
  semanaActual = 0;
  diaActivo = 0;

  constructor(){
    this.mockearDatos();
  }

  mockearDatos(){
    this.semanas = [
      {
        numero: 1,
        dias: ['Día 1', 'Día 2', 'Día 3']
      },
      {
        numero: 2,
        dias: ['Día 1', 'Día 2', 'Día 3']
      },
      {
        numero: 3,
        dias: ['Día 1', 'Día 2', 'Día 3']
      }
    ];
  }

  cambiarSemana(offset: number){
    const nuevaSemana = this.semanaActual + offset;
    if (nuevaSemana >= 0 && nuevaSemana < this.semanas.length) {
      this.semanaActual = nuevaSemana;
      this.diaActivo = 0;
    }
  }

  seleccionarDia(index: number){
    this.diaActivo = index;
  }

  get semanaSeleccionada(){
    return this.semanas[this.semanaActual];
  }
}
