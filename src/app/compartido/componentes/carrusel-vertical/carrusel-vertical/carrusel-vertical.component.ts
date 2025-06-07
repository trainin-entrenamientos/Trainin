import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  ChangeDetectorRef,
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
  items: CarruselItem[] = [
    { tipo: 'texto', contenido: 'Ejercicio del día: Plancha' }, //desharcodear
    { tipo: 'imagen', contenido: '/imagenes/motivacion.jpeg' },
    { tipo: 'texto', contenido: 'Racha: 0 semanas' }, //desharcodear
    { tipo: 'imagen', contenido: '/imagenes/TRAININ-ISO-FO.svg' },
    //{ tipo: 'texto', contenido: 'Última rutina: No realizada' }, //desharcodear
    //{ tipo: 'imagen', contenido: '/imagenes/seguridad.jpeg' },
  ];

  constructor(private detectorDeCambios: ChangeDetectorRef) {}

  @ViewChild('contenido') contenido!: ElementRef;
  posicionDeScroll = 0;
  velocidad = 0.2; 
  aceleracion = 0; 
  estaDeslizandose = false;
  ultimaCoordenadaY = 0;
  indiceSeleccionado: number | null = null;
  ultimaPosicionDelMouseCoordenadaY = 0;
  seDeslizo = false;
  estaPausado: boolean | undefined;
  esModoHorizontal = false;
  ultimaPosicion = 0;


ngAfterViewInit() {
    this.items = [...this.items, ...this.items, ...this.items];
    const contenidoEl = this.contenido.nativeElement;
    this.esModoHorizontal = window.innerWidth <= 1080;
    const total = this.esModoHorizontal ? contenidoEl.scrollWidth : contenidoEl.scrollHeight;
    this.posicionDeScroll = -total / 3; 
    this.animacion();
    this.estaPausado = false;
    this.detectorDeCambios.detectChanges();
}

@HostListener('window:resize')
ajustarTamanio() {
  this.esModoHorizontal = window.innerWidth <= 1080;
}

animacion() {
  if (this.estaPausado) {
    requestAnimationFrame(() => this.animacion());
    return;
  }

  this.posicionDeScroll += this.velocidad + this.aceleracion;
  this.aceleracion *= 0.95;

  const contenidoEl = this.contenido.nativeElement;
  const total = this.esModoHorizontal ? contenidoEl.scrollWidth : contenidoEl.scrollHeight;

  if (this.posicionDeScroll
 >= 0) {
    this.posicionDeScroll
 = -total / 3;
  }

  if (this.esModoHorizontal) {
    contenidoEl.style.transform = `translateX(${this.posicionDeScroll
  
    }px)`;
  } else {
    contenidoEl.style.transform = `translateY(${this.posicionDeScroll
  
    }px)`;
  }

  requestAnimationFrame(() => this.animacion());
}


cuandoBajoElMouse(event: MouseEvent) {
  this.estaDeslizandose = true;
  this.ultimaPosicion = this.esModoHorizontal ? event.clientX : event.clientY;
  this.ultimaPosicionDelMouseCoordenadaY = this.ultimaPosicion;
  this.seDeslizo = false;
}

cuandoMuevoElMouse(event: MouseEvent) {
  if (this.estaDeslizandose) {
    const current = this.esModoHorizontal ? event.clientX : event.clientY;
    const delta = current - this.ultimaPosicion;

    if (Math.abs(current - this.ultimaPosicionDelMouseCoordenadaY) > 5) {
      this.seDeslizo = true;
    }

    this.aceleracion = delta * 0.2;
    this.ultimaPosicion = current;
  }
}

cuandoSuboElMouse() {
  this.estaDeslizandose = false;
}

seleccionarItem(index: number) {
  if (this.seDeslizo) return; 
  const contenidoEl = this.contenido.nativeElement;
  const totalItems = this.items.length / 3;
  const realIndex = index % totalItems;

  if (this.indiceSeleccionado === realIndex) {
    this.indiceSeleccionado = null;
    this.estaPausado = false;
  } else {
    this.indiceSeleccionado = realIndex;
    this.estaPausado = true;
    this.aceleracion = 0;
  }
}

}
