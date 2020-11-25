import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Select } from '@ngxs/store';
import { LightboxConfig } from 'ngx-lightbox';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthState } from './auth/state/auth.state';

declare var window: {
  [key: string]: any;
  prototype: Window;
  new(): Window;
};

declare const loadBitrix: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @Select(AuthState.getUser) currentUser$: Observable<User>;

  constructor(
    private matomoInjector: MatomoInjector,
    private matomoTracker: MatomoTracker,
    private lightboxConfig: LightboxConfig,
    private swPush: SwPush,
  ) {
    if (environment.matomo.tracking) {
      this.matomoInjector.init('https://matomo.edecy.de/', environment.matomo.sideId);
      console.log('MATOMO INITIALIZED WITH SIDE_ID: ', environment.matomo.sideId);
      /* if (!environment.production && !environment.staging) {
        this.matomoTracker.setUserId('TestUser');
        this.matomoTracker.setDocumentTitle('TestDocument');
        console.log('MATOMO ON LOCALHOST');
      } */
    }
    lightboxConfig.centerVertically = true;

  }

  ngOnInit() {
    const paq = window._paq || [];
    paq.push(['requireConsent']);
    loadBitrix();

  }
}
