import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  currentPage = 'Datenschutzerklärung';
  @Input() isDialog = false;
  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private matomoHelper: MatomoHelperService
  ) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.router.navigate(['/legal/privacy-policy']);
    }
    this.matomoHelper.trackPageView('PrivacyPolicyPage');
  }

}
