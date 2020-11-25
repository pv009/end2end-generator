import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { AuthState } from 'src/app/auth/state/auth.state';
import { CardsState } from 'src/app/cards/state/cards.state';
import * as fromAuth from '../../auth/state/auth.actions';
import { MatomoHelperService } from '../services/matomo-helper.service';

@Component({
  selector: 'app-auth-overlay',
  templateUrl: './auth-overlay.component.html',
  styleUrls: ['./auth-overlay.component.scss']
})
export class AuthOverlayComponent implements OnInit {
  @Select(CardsState.tabShown) tabShown$: Observable<string>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(AuthState.getErrorMessage) error$: Observable<string>;

  @Input() overlayPlacedAt: string;

  loginForm: FormGroup;
  hide = true;

  constructor(
    private store: Store,
    private matomoHelper: MatomoHelperService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildLoginForm();
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
}
