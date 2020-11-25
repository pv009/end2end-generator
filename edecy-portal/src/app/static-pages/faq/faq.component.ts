import { Component, OnInit } from '@angular/core';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  currentPage = 'FAQ';

  faqTitle = 'main';

  constructor(
    private matomoHelper: MatomoHelperService
  ) { }

  ngOnInit() {
    this.matomoHelper.trackPageView('FAQ');
  }

}
