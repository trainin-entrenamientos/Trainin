import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CrearPlanEntrenamientoComponent } from './crear-plan-entrenamiento/crear-plan-entrenamiento.component';
import { PoliticasPrivacidadComponent } from './politicas-privacidad/politicas-privacidad.component';
import { PreguntasFrecuentesComponent } from './preguntas-frecuentes/preguntas-frecuentes.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { CrearEjercicioComponent } from './crear-ejercicio/crear-ejercicio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditarEjercicioComponent } from './editar-ejercicio/editar-ejercicio.component';

@NgModule({
  declarations: [
    CrearPlanEntrenamientoComponent,
    PoliticasPrivacidadComponent,
    PreguntasFrecuentesComponent,
    TerminosCondicionesComponent,
    HomeAdminComponent,
    CrearEjercicioComponent,
    EditarEjercicioComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CrearPlanEntrenamientoComponent,
    PoliticasPrivacidadComponent,
    PreguntasFrecuentesComponent,
    TerminosCondicionesComponent
  ]
})
export class VistasModule { }
