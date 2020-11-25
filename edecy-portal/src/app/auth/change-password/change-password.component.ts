import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Select } from '@ngxs/store';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { AuthService } from '../service/auth.service';
import { AuthState } from '../state/auth.state';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @Select(AuthState.getUser) currentUser$: Observable<User>;

  currentPage = 'Passwort ändern';

  userMail = '';

  emailForm: FormGroup;

  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private matomoHelper: MatomoHelperService
  ) { }

  ngOnInit() {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.userMail = user.attributes.email;

      }
    });
    this.buildEmailForm();
    this.matomoHelper.trackPageView('ChangePasswordPage');
  }

  buildEmailForm() {
    this.emailForm = this.fb.group({
      email: ['']
    });
  }

  sendPasswordMail() {
    this.authService.changePassword(this.userMail)
      .then(() => {
        this.emailSent = true;
        console.log('Sent password reset mail.');
      })
      .catch(error => {
        console.error('Error with password reset: ', error);
        this.snackbar.open('Beim Senden der E-Mail ist leider ein Fehler aufgetreten. Bitte probieren Sie es erneut.' +
          'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
          duration: 5000
        });
        this.emailForm.patchValue({
          email: ''
        });
      });
  }

}
