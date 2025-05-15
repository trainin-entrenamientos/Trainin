import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CrearPlanEntrenamientoComponent } from './crear-plan-entrenamiento/crear-plan-entrenamiento.component';
import { PoliticasPrivacidadComponent } from './politicas-privacidad/politicas-privacidad.component';
import { PreguntasFrecuentesComponent } from './preguntas-frecuentes/preguntas-frecuentes.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { FormularioCrearPlanDeEntrenamientoComponent } from './formulario-crear-plan-de-entrenamiento/formulario-crear-plan-de-entrenamiento.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { CrearEjercicioComponent } from './crear-ejercicio/crear-ejercicio.component';
import { EditarEjercicioComponent } from './editar-ejercicio/editar-ejercicio.component';
import { CompartidoModule } from '../compartido/compartido.module';
import { CalibracionCamaraComponent } from './calibracion-camara/calibracion-camara.component';

@NgModule({
  declarations: [
    CrearPlanEntrenamientoComponent,
    PoliticasPrivacidadComponent,
    PreguntasFrecuentesComponent,
    TerminosCondicionesComponent,
    FormularioCrearPlanDeEntrenamientoComponent,
    HomeAdminComponent,
    CrearEjercicioComponent,
    EditarEjercicioComponent,
    CalibracionCamaraComponent,
  ],
  

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CompartidoModule
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
