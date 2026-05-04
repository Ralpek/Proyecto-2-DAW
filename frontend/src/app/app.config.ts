/*// @ts-ignore
import 'zone.js';
*/
import { ApplicationConfig, /*provideZoneChangeDetection*/ } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
// herramienta para hacer peticiones HTTP
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    /*provideZoneChangeDetection({ eventCoalescing: true }),*/
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      })
    ),
    provideHttpClient(),
  ]
};
