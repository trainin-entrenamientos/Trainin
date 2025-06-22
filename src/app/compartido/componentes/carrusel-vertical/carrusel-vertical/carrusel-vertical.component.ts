import {
  Component,
  AfterViewInit,
  Input,
} from '@angular/core';

interface CarruselItem {
  tipo: 'texto' | 'imagen';
  contenido: string;
}

@Component({
  selector: 'app-carrusel-vertical',
  templateUrl: './carrusel-vertical.component.html',
  styleUrls: ['./carrusel-vertical.component.css'],
  standalone:false
})
export class CarruselVerticalComponent implements AfterViewInit {
  ngAfterViewInit() {
}

@Input() mostrarComoVertical = true;
@Input() hastaUnPlan = true;
@Input() variosPlanes =true;

}



