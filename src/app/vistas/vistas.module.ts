import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanesComponent } from './planes/planes.component';
import { PoliticasPrivacidadComponent } from './politicas-privacidad/politicas-privacidad.component';
import { PreguntasFrecuentesComponent } from './preguntas-frecuentes/preguntas-frecuentes.component';
import { TerminosCondicionesComponent } from './terminos-condiciones/terminos-condiciones.component';
import { CrearPlanEntrenamientoComponent } from './crear-plan-entrenamiento/crear-plan-entrenamiento.component';
import { InicioAdminComponent } from './inicio-admin/inicio-admin.component';
import { CrearEjercicioComponent } from './crear-ejercicio/crear-ejercicio.component';
import { EditarEjercicioComponent } from './editar-ejercicio/editar-ejercicio.component';
import { CompartidoModule } from '../compartido/compartido.module';

import { InicioRutinaComponent } from './inicio-rutina/inicio-rutina.component';
import { FinalizacionRutinaComponent } from './finalizacion-rutina/finalizacion-rutina.component';
import { RegistroComponent } from './registro/registro.component';
import { InicioComponent } from './inicio/inicio.component';
import { IniciarSesionComponent } from './iniciar-sesion/iniciar-sesion.component';
import { DetallePlanComponent } from './detalle-plan/detalle-plan.component';
import { RealizarEjercicioPorTiempoComponent } from './realizar-ejercicio-por-tiempo/realizar-ejercicio-por-tiempo.component';
import { PlanPremiumComponent } from './plan-premium/plan-premium.component';
import { InformacionEjercicioComponent } from './informacion-ejercicio/informacion-ejercicio.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CorreccionPosturaComponent } from './correccion-postura/correccion-postura.component';
import { CalibracionCamaraComponent } from './calibracion-camara/calibracion-camara.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VerificarEmailComponent } from './verificar-email/verificar-email.component';

@NgModule({

  declarations: [
    PlanesComponent,
    PoliticasPrivacidadComponent,
    PreguntasFrecuentesComponent,
    TerminosCondicionesComponent,
    CrearPlanEntrenamientoComponent,
    InicioAdminComponent,
    CrearEjercicioComponent,
    EditarEjercicioComponent,
    InicioRutinaComponent,
    FinalizacionRutinaComponent,
    RegistroComponent,
    InicioComponent,
    IniciarSesionComponent,
    DetallePlanComponent,
    RealizarEjercicioPorTiempoComponent,
    PlanPremiumComponent,
    InformacionEjercicioComponent,
    CorreccionPosturaComponent,
    CalibracionCamaraComponent,
    VerificarEmailComponent,
  ],

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CompartidoModule,
    NgbTooltipModule,
    BrowserAnimationsModule
  ],

  exports: [
    PlanesComponent,
    PoliticasPrivacidadComponent,
    PreguntasFrecuentesComponent,
    TerminosCondicionesComponent,
    CrearPlanEntrenamientoComponent,
    FinalizacionRutinaComponent,
  ]
})
export class VistasModule { }
