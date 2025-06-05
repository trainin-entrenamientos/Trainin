import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './compartido/componentes/layout/layout.component';
import { InicioComponent } from './vistas/inicio/inicio.component';
import { IniciarSesionComponent } from './vistas/iniciar-sesion/iniciar-sesion.component';
import { RegistroComponent } from './vistas/registro/registro.component';
import { TerminosCondicionesComponent } from './vistas/terminos-condiciones/terminos-condiciones.component';
import { PoliticasPrivacidadComponent } from './vistas/politicas-privacidad/politicas-privacidad.component';
import { PreguntasFrecuentesComponent } from './vistas/preguntas-frecuentes/preguntas-frecuentes.component';
import { NosotrosComponent } from './vistas/nosotros/nosotros.component';
import { PlanPremiumComponent } from './vistas/plan-premium/plan-premium.component';
import { CalibracionCamaraComponent } from './vistas/calibracion-camara/calibracion-camara.component';
import { VerificarEmailComponent } from './vistas/verificar-email/verificar-email.component';
import { CorreccionPosturaComponent } from './vistas/correccion-postura/correccion-postura.component';

import { PlanesComponent } from './vistas/planes/planes.component';
import { CrearPlanEntrenamientoComponent } from './vistas/crear-plan-entrenamiento/crear-plan-entrenamiento.component';
import { InicioAdminComponent } from './vistas/inicio-admin/inicio-admin.component';
import { InicioRutinaComponent } from './vistas/inicio-rutina/inicio-rutina.component';
import { FinalizacionRutinaComponent } from './vistas/finalizacion-rutina/finalizacion-rutina.component';
import { DetallePlanComponent } from './vistas/detalle-plan/detalle-plan.component';
import { RealizarEjercicioComponent } from './vistas/realizar-ejercicio/realizar-ejercicio.component';
import { InformacionEjercicioComponent } from './vistas/informacion-ejercicio/informacion-ejercicio.component';
import { PerfilComponent } from './vistas/perfil/perfil.component';

import { authGuard } from './core/guards/auth.guards';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },

      {
        path: 'inicio',
        component: InicioComponent
      },
      {
        path: 'iniciar-sesion',
        component: IniciarSesionComponent
      },
      {
        path: 'registro',
        component: RegistroComponent
      },
      {
        path: 'terminos-condiciones',
        component: TerminosCondicionesComponent
      },
      {
        path: 'politicas-privacidad',
        component: PoliticasPrivacidadComponent
      },
      {
        path: 'preguntas-frecuentes',
        component: PreguntasFrecuentesComponent
      },
      {
        path: 'nosotros',
        component: NosotrosComponent
      },
      {
        path: 'premium',
        component: PlanPremiumComponent
      },
      {
        path: 'calibracion-camara/:ejercicio',
        component: CalibracionCamaraComponent
      },
      {
        path: 'verificar-email/:token',
        component: VerificarEmailComponent
      },
      {
        path: 'correccion-postura/:ejercicio',
        component: CorreccionPosturaComponent
      },

      {
        path: 'planes',
        component: PlanesComponent,
        canActivate: [authGuard]
      },
      {
        path: 'formulario-crear-plan',
        component: CrearPlanEntrenamientoComponent,
        canActivate: [authGuard]
      },
      {
        path: 'inicio-admin',
        component: InicioAdminComponent,
        canActivate: [authGuard]
      },
      {
        path: 'inicio-rutina/:PlanId',
        component: InicioRutinaComponent,
        canActivate: [authGuard]
      },
      {
        path: 'finalizacion-rutina',
        component: FinalizacionRutinaComponent,
        canActivate: [authGuard]
      },
      {
        path: 'detalle-plan',
        component: DetallePlanComponent,
        canActivate: [authGuard]
      },
      {
        path: 'realizar-ejercicio',
        component: RealizarEjercicioComponent,
        canActivate: [authGuard]
      },
      {
        path: 'informacion-ejercicio',
        component: InformacionEjercicioComponent,
        canActivate: [authGuard]
      },
      {
        path: 'verificar-email/:token',
        component: VerificarEmailComponent,
      },
      {
        path: 'perfil',
        component: PerfilComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/inicio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
