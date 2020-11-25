import { Component, OnInit } from '@angular/core';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  currentPage = 'Über uns';

  constructor(
    private matomoHelper: MatomoHelperService
  ) {
  }

  ngOnInit() {
    this.matomoHelper.trackPageView('AboutUsPage');
  }

}
