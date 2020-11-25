import { Component, OnInit } from '@angular/core';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {

  constructor(
    private matomoHelper: MatomoHelperService
  ) { }

    ngOnInit() {
      this.matomoHelper.trackPageView('DeleteAccountPage');
    }
}
