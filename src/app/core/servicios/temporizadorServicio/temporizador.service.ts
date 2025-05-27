import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TemporizadorService {
  private segundosTranscurridos = 0;
  private idIntervalo: any = null;
  private estaCorriendoElTiempo = false;

  iniciarTiempo() {
    if (this.estaCorriendoElTiempo) return;
    this.estaCorriendoElTiempo = true;
    this.idIntervalo = setInterval(() => {
      this.segundosTranscurridos++;
    }, 1000);
  }

  pausar() {
    if (!this.estaCorriendoElTiempo) return;
    clearInterval(this.idIntervalo);
    this.estaCorriendoElTiempo = false;
  }

  continuar() {
    if (this.estaCorriendoElTiempo) return;
    this.estaCorriendoElTiempo = true;
    this.idIntervalo = setInterval(() => {
      this.segundosTranscurridos++;
    }, 1000);
  }

  reiniciarTiempo() {
    this.pausar();
    this.segundosTranscurridos = 0;
  }

  obtenerSegundosTranscurridos(): number {
    return this.segundosTranscurridos;
  }

  estaCorriendoTiempo(): boolean {
    return this.estaCorriendoElTiempo;
  }
}