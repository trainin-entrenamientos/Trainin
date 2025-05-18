import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rutina } from '../../core/modelos/RutinaDTO';
import { InicioRutinaService } from '../../core/servicios/inicioRutinaServicio/inicio-rutina.service';

@Component({
  selector: 'app-inicio-rutina',
  standalone: false,
  templateUrl: './inicio-rutina.component.html',
  styleUrls: ['./inicio-rutina.component.css']
})
export class InicioRutinaComponent implements OnInit {

  rutina: Rutina | null = null;

  constructor(
    private rutinaService: InicioRutinaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idPlan = +this.route.snapshot.paramMap.get('idPlan')!;
    this.obtenerRutina(40);
  }

  obtenerRutina(idPlan: number) {
    this.rutinaService.obtenerRutina(idPlan).subscribe(
      (rutina) => {
        console.log('Rutina recibida:', rutina);
        this.rutina = rutina;
      },
      (error) => {
        console.error('Error al obtener la rutina:', error);
      }
    );
  }
}
