import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';  
import { AppModule } from './app/app.module';


if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then()
    .catch(err => console.error('Error registrando SW de FCM:', err));
}

platformBrowserDynamic()  
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
