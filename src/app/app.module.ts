import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompartidoModule } from './compartido/shared.module';
import { CrearPlanEntrenamientoComponent } from './vistas/crear-plan-entrenamiento/crear-plan-entrenamiento.component';
import { provideHttpClient } from '@angular/common/http';
import { TerminosCondicionesComponent } from './vistas/terminos-condiciones/terminos-condiciones.component';
import { PoliticasPrivacidadComponent } from './vistas/politicas-privacidad/politicas-privacidad.component';
import { PreguntasFrecuentesComponent } from './vistas/preguntas-frecuentes/preguntas-frecuentes.component';
import { FinalizacionRutinaComponent } from './vistas/finalizacion-rutina/finalizacion-rutina.component';

@NgModule({
  declarations: [
    AppComponent,
    CrearPlanEntrenamientoComponent,
    TerminosCondicionesComponent,
    PoliticasPrivacidadComponent,
    PreguntasFrecuentesComponent,
    FinalizacionRutinaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CompartidoModule,
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
