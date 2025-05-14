import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CrearPlanEntrenamientoComponent } from './crear-plan-entrenamiento/crear-plan-entrenamiento.component';
import { PoliticasPrivacidadComponent } from './politicas-privacidad/politicas-privacidad.component';
import { PreguntasFrecuentesComponent } from './preguntas-frecuentes/preguntas-frecuentes.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { FormularioCrearPlanDeEntrenamientoComponent } from './formulario-crear-plan-de-entrenamiento/formulario-crear-plan-de-entrenamiento.component';

@NgModule({
  declarations: [
    CrearPlanEntrenamientoComponent,
    PoliticasPrivacidadComponent,
    PreguntasFrecuentesComponent,
    TerminosCondicionesComponent,
    FormularioCrearPlanDeEntrenamientoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CrearPlanEntrenamientoComponent,
    PoliticasPrivacidadComponent,
    PreguntasFrecuentesComponent,
    TerminosCondicionesComponent,
    FormularioCrearPlanDeEntrenamientoComponent
  ]
})
export class VistasModule { }
