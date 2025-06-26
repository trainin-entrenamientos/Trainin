import {
  Component,
  AfterViewInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-tarjetas-planes',
  templateUrl: './tarjetas-planes.component.html',
  styleUrls: ['./tarjetas-planes.component.css'],
  standalone:false
})
export class TarjetasPlanesComponent implements AfterViewInit {
  ngAfterViewInit() {
}

@Input() mostrarComoVertical = true;
@Input() hastaUnPlan = true;
@Input() variosPlanes =true;
@Input() nombreEjercicioDiario: string = '';
@Input() ejercicioDiarioDisponible: boolean = false;
}



