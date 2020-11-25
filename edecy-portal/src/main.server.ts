const File = require('file-class');
const domino = require('domino');
const path = require('path');
const Element = domino.impl.Element;
import { enableProdMode } from '@angular/core';
import { join } from 'path';
import { environment } from './environments/environment';
const fs = require('fs');

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/edecy-portal');

const template = fs.readFileSync(join(DIST_FOLDER, '/index.html')).toString();
const win = domino.createWindow(template);

Object.assign(global, domino.impl);
const windowVar = 'window';
const docVar = 'document';


global[windowVar] = win;
global[docVar] = win.document;




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

export { renderModule, renderModuleFactory } from '@angular/platform-server';
export { ngExpressEngine } from '@nguniversal/express-engine';
export { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
export { AppServerModule } from './app/app.server.module';



