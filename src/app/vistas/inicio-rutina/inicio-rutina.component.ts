import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Rutina } from '../../core/modelos/RutinaDTO';
import { RutinaService } from '../../core/servicios/rutina/rutina.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio-rutina',
  standalone: false,
  templateUrl: './inicio-rutina.component.html',
  styleUrls: ['./inicio-rutina.component.css']
})
export class InicioRutinaComponent implements OnInit {

  rutina: Rutina | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rutinaService: RutinaService 
   ) {}

  ngOnInit(): void {
    const idPlan = +this.route.snapshot.paramMap.get('PlanId')!;
    this.obtenerRutina(idPlan);
  }

    traducirDuracionEstimada(rutina: Rutina): void {
        if(rutina.duracionEstimada==1){
          rutina.duracionEstimada=15;
        }else if(rutina.duracionEstimada==2){
          rutina.duracionEstimada=30;
        }else{
          rutina.duracionEstimada=45;
        }
      }

  obtenerRutina(idPlan: number) {
    this.rutinaService.getDetalleEjercicios(idPlan).subscribe(
      (rutina) => {
        console.log('Rutina recibida:', rutina);
        this.traducirDuracionEstimada(rutina);
        this.rutina = rutina;
      },
      (error) => {
        console.error('Error al obtener la rutina:', error);
      }
    );
  }
  
  iniciarRutina() {
  if (this.rutina) {
    localStorage.setItem('rutina', JSON.stringify(this.rutina));
    this.rutinaService.setIndiceActual(0)
    this.router.navigate(['/informacion-ejercicio']);
  }
}


  
}
