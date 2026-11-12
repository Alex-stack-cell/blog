import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import localeFr from '@angular/common/locales/fr';

import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import { BlogTitleStrategy } from './core/blog-title.strategy';
import { provideHttpClient } from '@angular/common/http';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: TitleStrategy, useClass: BlogTitleStrategy },
    provideHttpClient(),
  ],
};
