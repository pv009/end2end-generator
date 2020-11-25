import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss']
})
export class ImprintComponent implements OnInit {
  currentPage = 'Impressum';

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private matomoHelper: MatomoHelperService
  ) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.router.navigate(['/legal/imprint']);
    }
    this.matomoHelper.trackPageView('ImprintPage');
  }

}
