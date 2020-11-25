import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';


export interface DialogData {
  source: string;
  desktopDialog: boolean;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  currentPage = 'Wilkommen';
  desktopDialog = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<LandingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private breakpointObserver: BreakpointObserver,
    private matomoHelper: MatomoHelperService
  ) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.desktopDialog = true;
    }
    this.matomoHelper.trackPageView('LandingPage');
  }

  navigateToLogin() {
    if (this.desktopDialog) {
      this.dialog.open(LoginComponent, {
        minHeight: '500px',
        minWidth: '500px',
        data: { desktopDialog: true }
      });
    } else {
      this.router.navigate(['/login']);
    }
    this.dialogRef.close();
  }

}
