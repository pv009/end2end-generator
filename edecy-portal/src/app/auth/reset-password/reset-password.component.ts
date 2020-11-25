import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { compareValidator } from 'src/app/libs/directives/compare-validator.directive';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { AuthService } from '../service/auth.service';



@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  currentPage = 'Neues Passwort festlegen';

  hide = true;

  passwordForm: FormGroup;

  userMail: string;
  token: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private matomoHelper: MatomoHelperService
  ) { }

  ngOnInit() {
    this.buildPasswordForm();
    this.matomoHelper.trackPageView('ResetPasswordPage');
    this.route.queryParams.subscribe(params => {
      this.userMail = params.username;
      this.token = params.token;
      console.log('set username: ', this.userMail, 'set token:', this.token);
    });
  }

  buildPasswordForm() {
    this.passwordForm = this.fb.group({
      password: ['', [
          Validators.required,
          Validators.minLength(6)
        ]
      ],
      confirmPassword: ['', [
          Validators.required,
          compareValidator('password')
        ]
      ],
    });
  }

  setPassword() {
    if (this.userMail && this.token) {
      this.auth.setPassword(this.userMail, this.passwordForm.value.password);
    }
  }

}
