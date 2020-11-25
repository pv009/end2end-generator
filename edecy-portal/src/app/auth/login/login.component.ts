import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import * as fromAuth from '../state/auth.actions';
import { AuthState } from '../state/auth.state';


export interface DialogData {
  desktopDialog: boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Select(AuthState.getErrorMessage) error$: Observable<string>;
  @Select(AuthState.loggedIn) isLoggedIn$: Observable<boolean>;
  @Input() verifyPage = false;

  currentPage = 'Anmelden';
  loginForm: FormGroup;
  hide = true;

  desktopDialog = false;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private dialogRef: MatDialogRef<LoginComponent>,
    private matomoHelper: MatomoHelperService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.desktopDialog = this.data.desktopDialog;
    this.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loggedIn => {
        if (loggedIn) {
          this.router.navigate(['/cards']);
          if (this.desktopDialog) {
            this.dialogRef.close();
          }
        }
      });
    this.buildLoginForm();
    this.matomoHelper.trackPageView('LoginPage');
  }

  private buildLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', {
        validators: [Validators.required, Validators.email]
      }],
      password: ['', {
        validators: [Validators.required]
      }]
    });
  }

  loginUser() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.store.dispatch(new fromAuth.LoginUser(email, password));
    this.matomoHelper.trackEvent('Authentication', 'Login');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  closeDialog() {
    console.log('close');
    this.dialogRef.close();
  }
}
