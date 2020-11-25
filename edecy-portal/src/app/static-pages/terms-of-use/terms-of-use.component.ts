import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';

@Component({
  selector: 'app-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./terms-of-use.component.scss']
})
export class TermsOfUseComponent implements OnInit {
  currentPage = 'Nutzungsbedingungen';
  @Input() isDialog = false;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private matomoHelper: MatomoHelperService
  ) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.router.navigate(['/legal/terms-of-use']);
    }
    this.matomoHelper.trackPageView('TermsOfUsePage');

  }

  openDialog() {
  }

}
