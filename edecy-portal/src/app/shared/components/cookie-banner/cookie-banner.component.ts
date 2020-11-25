import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatomoTracker } from 'ngx-matomo';
import { AuthService } from 'src/app/auth/service/auth.service';
import { WindowrefService } from '../../services/windowref.service';

declare var window: {
  [key: string]: any;
  prototype: Window;
  new(): Window;
};

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent implements OnInit {

  constructor(
    private cookieBannerRef: MatBottomSheetRef<CookieBannerComponent>,
    private matomoTracker: MatomoTracker,
    private winref: WindowrefService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private auth: AuthService
  ) { }

  ngOnInit() {
    console.log(this.data);
    if (localStorage.getItem('allowTracking') !== null && !this.data.openedByUser) {
      this.cookieBannerRef.dismiss();
    }
  }

  closeBanner(accepted: boolean) {

    const paq = window._paq || [];
    if (localStorage) {
      if (accepted) {
        paq.push(['rememberConsentGiven']);
        paq.push(['forgetUserOptOut']);
        localStorage.setItem('allowTracking', 'true');
      } else {
        paq.push(['forgetConsentGiven']);
        paq.push(['optUserOut']);
        localStorage.setItem('allowTracking', 'false');
      }
    }
    this.cookieBannerRef.dismiss();
    this.auth.saveTrackingDecision(accepted);
  }

}
