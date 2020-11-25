import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

export interface DialogData {
  source: string;
  desktopDialog: boolean;
}

@Component({
  selector: 'app-function-teaser',
  templateUrl: './function-teaser.component.html',
  styleUrls: ['./function-teaser.component.scss']
})
export class FunctionTeaserComponent implements OnInit {
  desktopDialog = false;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<FunctionTeaserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.desktopDialog = true;
    }
  }

  closeTeaser() {
    this.dialogRef.close();
  }

  goToLogin() {
    if (this.desktopDialog) {
      this.dialog.open(LoginComponent, {
        minHeight: '600px',
        minWidth: '600px',
        data: { desktopDialog: true }
      });
    } else {
      this.router.navigate(['/login']);
    }
    this.closeTeaser();
  }

  goToRegister() {
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
    this.closeTeaser();
  }

}
