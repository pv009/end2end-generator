import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  currentPage = 'Passwort vergessen';

  notRegistered = false;

  userMail = '';
  showSuccess = false;

  emailForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private matomoHelper: MatomoHelperService,
    private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.buildEmailForm();
    this.matomoHelper.trackEvent('Authentication', 'ForgotPassword');
    this.matomoHelper.trackPageView('ForgotPasswordPage');
  }

  buildEmailForm() {
    this.emailForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]
      ]
    });
  }

  sendPasswordMail() {
    this.userMail = this.emailForm.value.email;
    this.auth.checkMail(this.emailForm.value.email)
      .then(result => {
        if (result.length === 0) {
          this.notRegistered = true;
        } else {
          this.auth.changePassword(this.userMail)
            .then(() => {
              console.log('Sent password reset mail.');
              this.showSuccess = true;
              this.snackbar.open('Eine Mail zum Zurücksetzen des Passworts wurde an die angegebene Adresse versandt.', '', {
                duration: 5000
              });
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
      })
      .catch(error => {
        console.log(error);
      });
  }

}
