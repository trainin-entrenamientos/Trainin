import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  ChangeDetectorRef,
  input,
  Input,
} from '@angular/core';
import { PerfilDTO } from '../../../../core/modelos/PerfilDTO';

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
@Input() sinPlanes = true;

}



