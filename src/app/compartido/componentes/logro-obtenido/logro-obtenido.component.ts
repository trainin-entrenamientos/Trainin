import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogroService } from '../../../core/servicios/logroServicio/logro.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-logro-obtenido',
  templateUrl: './logro-obtenido.component.html',
  styleUrls: ['./logro-obtenido.component.css'],
  standalone:false
})

export class LogroObtenidoComponent implements OnInit, OnDestroy {
logrosVisibles: { nombre: string; imagen: string; visible: boolean; nivel: string }[] = [];
  private subLogros!: Subscription;
  private sonidoLogro = new Audio('sfx/logro-desbloqueado.mp3'); 


  constructor(private logroService: LogroService) {}

  ngOnInit(): void {
    this.subLogros = this.logroService.logroNotificaciones$.subscribe(logro => {
      this.mostrarLogro(logro.nombre, logro.imagen);
    });
  }

  mostrarLogro(nombre: string, imagen: string) {
  const nivel = this.obtenerNivelDesdeImagen(imagen); 
  const nuevoLogro = { nombre, imagen, visible: true, nivel }; 

  this.logrosVisibles.push(nuevoLogro);

  this.sonidoLogro.currentTime = 0;
  this.sonidoLogro.play();

  setTimeout(() => {
    nuevoLogro.visible = false;
    setTimeout(() => {
      this.logrosVisibles = this.logrosVisibles.filter(l => l !== nuevoLogro);
    }, 500);
  }, 6000);
}

  obtenerNivelDesdeImagen(imagen: string): string {
  if (imagen.includes('medalla-bronce')) return 'bronce';
  if (imagen.includes('medalla-plata')) return 'plata';
  if (imagen.includes('medalla-oro')) return 'oro';
  if (imagen.includes('medalla-platino')) return 'platino';
  return 'default';
}

  ngOnDestroy(): void {
    this.subLogros.unsubscribe();
  }
}
