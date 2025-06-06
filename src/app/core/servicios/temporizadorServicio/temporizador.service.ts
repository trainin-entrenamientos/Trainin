import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class TemporizadorService {
  private segundosTranscurridos = 0;
  private idIntervalo: any = null;
  private estaCorriendoElTiempo = false;

  constructor() {
    this.restaurarEstado();
    if (this.estaCorriendoElTiempo) {
      this.continuar();
    }
  }

  private guardarEstado() {
    sessionStorage.setItem('tiempo_global', this.segundosTranscurridos.toString());
    sessionStorage.setItem('tiempo_en_ejecucion', this.estaCorriendoElTiempo.toString());
  }

  private restaurarEstado() {
    const tiempo = sessionStorage.getItem('tiempo_global');
    const corriendo = sessionStorage.getItem('tiempo_en_ejecucion');

    this.segundosTranscurridos = tiempo ? parseInt(tiempo, 10) : 0;
    this.estaCorriendoElTiempo = corriendo === 'true';
  }

  iniciarTiempo() {
    if (this.estaCorriendoElTiempo) return;
    this.estaCorriendoElTiempo = true;
    this.idIntervalo = setInterval(() => {
      this.segundosTranscurridos++;
      this.guardarEstado();
    }, 1000);
  }

accionesDePausa(estaPausado: boolean) {
  if (estaPausado) {
    this.pausar();
  } else {
    this.continuar();
  }

}

 pausar() {
  if (!this.estaCorriendoElTiempo) return;
  clearInterval(this.idIntervalo);
  this.idIntervalo = null;
  this.estaCorriendoElTiempo = false;
  this.guardarEstado();
}
  continuar() {
  if (this.estaCorriendoElTiempo && this.idIntervalo !== null) return;

  this.estaCorriendoElTiempo = true;
  this.idIntervalo = setInterval(() => {
    this.segundosTranscurridos++;
    this.guardarEstado();
  }, 1000);
}


  reiniciarTiempo() {
    this.pausar();
    this.segundosTranscurridos = 0;
    this.guardarEstado();
  }

  obtenerSegundosTranscurridos(): number {
    return this.segundosTranscurridos;
  }

  estaCorriendoTiempo(): boolean {
    return this.estaCorriendoElTiempo;
  }

  formatearTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60).toString().padStart(2, '0');
    const segundosRestantes = (segundos % 60).toString().padStart(2, '0');
    return `${minutos}:${segundosRestantes}`;
  }
}
