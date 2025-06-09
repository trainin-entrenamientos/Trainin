import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptores/auth.interceptor';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { environment } from '../environments/environment';
import { CompartidoModule } from './compartido/compartido.module';
import { VistasModule } from './vistas/vistas.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CompartidoModule,
    VistasModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
        easeTime: 300,
        extendedTimeOut: 15000,
        toastClass: 'ngx-toastr toast-custom',
        positionClass: 'toast-top-right',
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
