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
import { CorreccionPosturaComponent } from './vistas/correccion-postura/correccion-postura.component';
import { PlanesComponent } from './vistas/planes/planes.component';
import { CrearPlanEntrenamientoComponent } from './vistas/crear-plan-entrenamiento/crear-plan-entrenamiento.component';
import { InicioRutinaComponent } from './vistas/inicio-rutina/inicio-rutina.component';
import { FinalizacionRutinaComponent } from './vistas/finalizacion-rutina/finalizacion-rutina.component';
import { DetallePlanComponent } from './vistas/detalle-plan/detalle-plan.component';
import { RealizarEjercicioComponent } from './vistas/realizar-ejercicio/realizar-ejercicio.component';
import { InformacionEjercicioComponent } from './vistas/informacion-ejercicio/informacion-ejercicio.component';
import { PerfilComponent } from './vistas/perfil/perfil.component';
import { VerificarEmailComponent } from './vistas/verificar-email/verificar-email.component';
import { LogrosComponent } from './vistas/logros/logros.component';
import { authGuard } from './core/guardias/auth/auth.guard';
import { PagoExitosoComponent } from './vistas/pago-exitoso/pago-exitoso.component';
import { ErrorComponent } from './vistas/error/error.component';
import { FormAdminComponent } from './vistas/form-admin/form-admin.component';
import { ListadoDeEjerciciosComponent } from './vistas/listado-de-ejercicios/listado-de-ejercicios.component';
import { adminGuard } from './core/guardias/admin/admin.guard';
import { EjercicioDiarioComponent } from './vistas/ejercicio-diario/ejercicio-diario.component';
import { HistorialPlanesComponent } from './vistas/historial-planes/historial-planes.component';
import { CallbackComponent } from './compartido/componentes/callback/callback.component';
import { OlvidasteContraseniaComponent } from './vistas/olvidaste-tu-contrasenia/olvidaste-tu-contrasenia.component';
import { RecuperarContraseniaComponent } from './vistas/recuperar-contrasenia/recuperar-contrasenia.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },

      {
        path: 'inicio',
        component: InicioComponent,
      },
      {
        path: 'iniciar-sesion',
        component: IniciarSesionComponent,
      },
      {
        path: 'registro',
        component: RegistroComponent,
      },
      {
        path: 'terminos-condiciones',
        component: TerminosCondicionesComponent,
      },
      {
        path: 'politicas-privacidad',
        component: PoliticasPrivacidadComponent,
      },
      {
        path: 'preguntas-frecuentes',
        component: PreguntasFrecuentesComponent,
      },
      {
        path: 'nosotros',
        component: NosotrosComponent,
      },
      {
        path: 'premium',
        component: PlanPremiumComponent,
      },
      {
        path: 'planes',
        component: PlanesComponent,
        canActivate: [authGuard],
      },
      {
        path: 'formulario-crear-plan',
        component: CrearPlanEntrenamientoComponent,
        canActivate: [authGuard],
      },
      {
        path: 'inicio-rutina/:PlanId',
        component: InicioRutinaComponent,
        canActivate: [authGuard],
      },
      {
        path: 'finalizacion-rutina',
        component: FinalizacionRutinaComponent,
        canActivate: [authGuard],
      },
      {
        path: 'calibracion-camara/:ejercicio',
        component: CalibracionCamaraComponent,
        canActivate: [authGuard],
      },
      {
        path: 'detalle-plan/:PlanId',
        component: DetallePlanComponent,
        canActivate: [authGuard],
      },
      {
        path: 'realizar-ejercicio',
        component: RealizarEjercicioComponent,
        canActivate: [authGuard],
      },
      {
        path: 'informacion-ejercicio',
        component: InformacionEjercicioComponent,
        canActivate: [authGuard],
      },
      {
        path: 'verificar-email/:token',
        component: VerificarEmailComponent,
      },
      {
        path: 'correccion-postura/:ejercicio',
        component: CorreccionPosturaComponent,
        canActivate: [authGuard],
      },
      {
        path: 'logros',
        component: LogrosComponent,
        canActivate: [authGuard],
      },
      {
        path: 'perfil',
        component: PerfilComponent,
        canActivate: [authGuard],
      },
      {
        path: 'pago-exitoso',
        component: PagoExitosoComponent,
        canActivate: [authGuard],
      },
      {
        path: 'error',
        component: ErrorComponent,
      },
      {
        path: 'listarEjercicios',
        component: ListadoDeEjerciciosComponent,
        canActivate: [adminGuard],
      },
      {
        path: 'crear',
        component: FormAdminComponent,
      },
      {
        path: 'editar/:id',
        component: FormAdminComponent,
      },
      {
        path: 'eliminar/:id',
        component: FormAdminComponent,
      },
      {
        path: 'ejercicio-diario',
        component: EjercicioDiarioComponent,
      },
      {
        path: 'historial-planes',
        component: HistorialPlanesComponent
      },
      {
       path: 'callback',
       component: CallbackComponent 
      },
      {
        path: 'olvidaste-tu-contrasenia',
        component: OlvidasteContraseniaComponent,
      },
      { 
        path: 'recuperar-contrasenia/:token/:email',
        component: RecuperarContraseniaComponent 
      }
    ],
  },
  {
    path: '**',
    redirectTo: '/error',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }