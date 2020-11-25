import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatomoHelperService } from '../../services/matomo-helper.service';

@Component({
  selector: 'app-currentpage',
  templateUrl: './currentpage.component.html',
  styleUrls: ['./currentpage.component.scss']
})
export class CurrentpageComponent {
  @Input() currentPage = '';
  @Input() isChatPage = false;
  @Input() cardToDisplayId = '';
  @Input() showBackButton = true;

  constructor(
    private location: Location,
    private router: Router,
    private matomoHelper: MatomoHelperService
  ) { }

  openLastPage() {
    this.location.back();
    this.matomoHelper.trackEvent('Navigation', 'Return');
  }

  goToCard() {
    if (this.isChatPage) {
      this.router.navigate(['/cards/' + this.cardToDisplayId]);
    }
  }

}
