import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { IconServiceService } from 'src/app/icon-service/icon-service.service';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { ExclusiveOfferComponent } from './exclusive-offer/exclusive-offer.component';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {
  currentPage = 'Preise';
  desktopDialog = false;

  categoryShown = 'Basic';

  faqTitle = 'register';

  constructor(
    private dialog: MatDialog,
    private matomoHelper: MatomoHelperService,
    private iconService: IconServiceService,
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) { }

  ngOnInit() {
    // setTimeout(() => this.openExclusiveOffer(), 2000);
    // TODO: Re-Activate with new special offer
    this.matomoHelper.trackPageView('Prices');

    this.iconService.registerIcons();

    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.desktopDialog = true;
    }
  }

  private openExclusiveOffer() {
    this.dialog.open(ExclusiveOfferComponent, {
      maxWidth: '450px',
      minHeight: '500px'
    });
  }

  matomoTrack() {
    this.matomoHelper.trackEvent('Navigation', 'Booking');
  }

  showTab(tab: string) {
    this.categoryShown = tab;
  }

  navigateToRegister() {
    if (this.desktopDialog) {
      this.dialog.open(RegisterComponent, {
        minHeight: '800px',
        minWidth: '600px',
        disableClose: true,
        data: { desktopDialog: true }
      });
    } else {
      this.router.navigate(['/register']);
    }
  }

}
