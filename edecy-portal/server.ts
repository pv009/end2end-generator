/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import 'zone.js/dist/zone-node';
import 'localstorage-polyfill';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import * as promBundle from 'express-prom-bundle';
import * as metric from './metric/setup.js';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

const domino = require('domino');
const fs = require('fs');
const File = require('file-class');
const path = require('path');
const Element = domino.impl.Element;



// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/edecy-portal');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

metric.insertMiddleware(app(), {normalizePath: false});

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/edecy-portal');

const template = fs.readFileSync(join(DIST_FOLDER, '/index.html')).toString();
const win = domino.createWindow(template);
Object.assign(global, domino.impl);
const windowVar = 'window';
const docVar = 'document';
const fileVar = 'File';
const domTokenListVar = 'DOMTokenList';
const nodeVar = 'Node';
const textVar = 'Text';
const htmlElementVar = 'HTMLElement';
const navigatorVar = 'navigator';
const localStorageVar = 'localStorage';
const sessionStorageVar = 'sessionStorage';
const branchVar = 'branch';
global[windowVar] = win;
global[docVar] = win.document;
global[domTokenListVar] = win.DOMTokenList;
global[nodeVar] = win.Node;
global[textVar] = win.Text;
global[htmlElementVar] = win.HTMLElement;
global[navigatorVar] = win.navigator;
global[localStorageVar] = localStorage;
global[sessionStorageVar] = localStorage;
global[branchVar] = null;
global[fileVar] = win.File;

// tslint:disable-next-line:no-string-literal
/* global['getComputedStyle'] = () => {
  return {
    getPropertyValue() {
      return '';
    }
  };
}; */

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';

metric.captureAllRoutes(app());
metric.setupMetricService();
