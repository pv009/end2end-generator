import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { CookieBannerComponent } from '../cookie-banner/cookie-banner.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  desktopAccess = false;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private cookieBanner: MatBottomSheet
  ) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.desktopAccess = true;
    }
  }

  openImprint() {
    if (this.desktopAccess) {
      this.router.navigate(['/legal/imprint']);
    } else {
      this.router.navigate(['/imprint']);
    }
  }

  openPrivacy() {
    if (this.desktopAccess) {
      this.router.navigate(['/legal/privacy-policy']);
    } else {
      this.router.navigate(['/privacy-policy']);
    }
  }

  openTOS() {
    if (this.desktopAccess) {
      this.router.navigate(['/legal/terms-of-use']);
    } else {
      this.router.navigate(['/terms-of-use']);
    }
  }

  openCookieSettings() {
    this.cookieBanner.open(CookieBannerComponent, {
      data: { openedByUser: true }
    });
  }
}
