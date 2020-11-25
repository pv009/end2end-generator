import { Component, OnInit } from '@angular/core';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private matomoHelper: MatomoHelperService
  ) {}

  ngOnInit() {
    this.matomoHelper.trackPageView('LoggedOutPage');
  }
}
