import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CrearPlanEntrenamientoComponent } from './crear-plan-entrenamiento/crear-plan-entrenamiento.component';
import { PoliticasPrivacidadComponent } from './politicas-privacidad/politicas-privacidad.component';
import { PreguntasFrecuentesComponent } from './preguntas-frecuentes/preguntas-frecuentes.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { FormularioCrearPlanDeEntrenamientoComponent } from './formulario-crear-plan-de-entrenamiento/formulario-crear-plan-de-entrenamiento.component';
import { HomeAdminComponent } from './inicio-admin/inicio-admin.component';
import { CrearEjercicioComponent } from './crear-ejercicio/crear-ejercicio.component';
import { EditarEjercicioComponent } from './editar-ejercicio/editar-ejercicio.component';
import { CompartidoModule } from '../compartido/compartido.module';
import { FinalizacionRutinaComponent } from './finalizacion-rutina/finalizacion-rutina.component';
import { RegistroComponent } from './registro/registro.component';
import { HomeLandingPageComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { DetallePlanComponent } from './detalle-plan/detalle-plan.component';
import { RealizarEjercicioPorTiempoComponent } from './realizar-ejercicio-por-tiempo/realizar-ejercicio-por-tiempo.component';
import { PlanPremiumComponent } from './plan-premium/plan-premium.component';
import { InformacionEjercicioComponent } from './informacion-ejercicio/informacion-ejercicio.component';

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
    FinalizacionRutinaComponent,
    RegistroComponent,
    HomeLandingPageComponent,
    LoginComponent,
    DetallePlanComponent,
    RealizarEjercicioPorTiempoComponent,
    PlanPremiumComponent,
    InformacionEjercicioComponent
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
    FormularioCrearPlanDeEntrenamientoComponent,
    FinalizacionRutinaComponent
  ]
})
export class VistasModule { }
