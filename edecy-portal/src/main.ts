import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'froala-editor/js/languages/de.js';
import 'froala-editor/js/plugins.pkgd.min.js';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
  if (window) {
    window.console.log(() => { });
  }

  console.log = (() => {
    return false;
  });

  console.error = (() => {
    return false;
  });
}

if (environment.staging) {
  console.log = (() => {
    return false;
  });

  console.error = (() => {
    return false;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
