import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanesComponent } from './vistas/planes/planes.component';
import { TerminosCondicionesComponent } from './vistas/terminos-condiciones/terminos-condiciones.component';
import { PoliticasPrivacidadComponent } from './vistas/politicas-privacidad/politicas-privacidad.component';
import { PreguntasFrecuentesComponent } from './vistas/preguntas-frecuentes/preguntas-frecuentes.component';
import { LayoutComponent } from './compartido/componentes/layout/layout.component';
import { NosotrosComponent } from './vistas/nosotros/nosotros.component';
import { CrearPlanEntrenamientoComponent } from './vistas/crear-plan-entrenamiento/crear-plan-entrenamiento.component';
import { InicioAdminComponent } from './vistas/inicio-admin/inicio-admin.component';
import { CrearEjercicioComponent } from './vistas/crear-ejercicio/crear-ejercicio.component';
import { EditarEjercicioComponent } from './vistas/editar-ejercicio/editar-ejercicio.component';
import { InicioRutinaComponent } from './vistas/inicio-rutina/inicio-rutina.component';
import { FinalizacionRutinaComponent } from './vistas/finalizacion-rutina/finalizacion-rutina.component';
import { RegistroComponent } from './vistas/registro/registro.component';
import { CalibracionCamaraComponent } from './vistas/calibracion-camara/calibracion-camara.component';
import { CorreccionPosturaComponent } from './vistas/correccion-postura/correccion-postura.component';
import { InicioComponent } from './vistas/inicio/inicio.component';
import { IniciarSesionComponent } from './vistas/iniciar-sesion/iniciar-sesion.component';
import { RealizarEjercicioComponent } from './vistas/realizar-ejercicio/realizar-ejercicio.component';
import { authGuard } from './core/guards/auth.guards';
import { DetallePlanComponent } from './vistas/detalle-plan/detalle-plan.component';
import { PlanPremiumComponent } from './vistas/plan-premium/plan-premium.component';
import { InformacionEjercicioComponent } from './vistas/informacion-ejercicio/informacion-ejercicio.component';
import { VerificarEmailComponent } from './vistas/verificar-email/verificar-email.component';
import { LogrosComponent } from './vistas/logros/logros.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: InicioComponent
      },
      {
        path: 'planes',
        component: PlanesComponent,
        canActivate: [authGuard]
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
        path: 'crear-ejercicio',
        component: CrearEjercicioComponent,
        canActivate: [authGuard]
      },
      {
        path: 'editar-ejercicio/:id',
        component: EditarEjercicioComponent,
        canActivate: [authGuard]
      },
      { path: 'inicio-rutina/:PlanId', 
        component: InicioRutinaComponent,
        canActivate: [authGuard]
      },
      {
        path: 'finalizacion-rutina',
        component: FinalizacionRutinaComponent,
        canActivate: [authGuard]
      },
       {
        path: 'registro',
        component: RegistroComponent
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
        path: 'calibracion-camara/:ejercicio',
        component: CalibracionCamaraComponent
      },
      /*{
        path: 'correccion-postura',
        component: CorreccionPosturaComponent
      },*/
      {
        path: 'iniciar-sesion',
        component: IniciarSesionComponent
      },
      {
        path: 'detalle-plan',
        component: DetallePlanComponent,
        canActivate: [authGuard]
      },
      {
        path:'realizar-ejercicio',
        component: RealizarEjercicioComponent,
        canActivate: [authGuard]
      },
      {
        path: 'premium',
        component: PlanPremiumComponent
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
        path: 'correccion-postura/:ejercicio',
        component: CorreccionPosturaComponent
      },
      {
        path: 'logros',
        component: LogrosComponent,
        canActivate: [authGuard]
      },

    ]
  },
    {  path: '**', redirectTo: 'inicio', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
