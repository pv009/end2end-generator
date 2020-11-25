import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  Action, Selector, State,

  StateContext,

  Store
} from '@ngxs/store';
import { MatomoTracker } from 'ngx-matomo';
import { User } from 'parse';
import { from } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import * as fromProfile from '../../profile/state/profile.actions';
import { AuthStateModel } from '../model/auth.model';
import { NotificationSubscription } from '../model/notification-sub.model';
import { AuthService } from '../service/auth.service';
import * as authActions from './auth.actions';


const authStateDefaults: AuthStateModel = {
  loaded: false,
  loading: false,
  user: null,
  error: null,
  subscription: null
};
@Injectable({
  providedIn: 'root'
})
@State<AuthStateModel>({
  name: 'auth',
  defaults: authStateDefaults
})
export class AuthState {

  constructor(
    private authService: AuthService,
    private router: Router,
    private zone: NgZone,
    private snackBar: MatSnackBar,
    private store: Store,
    private matomoTracker: MatomoTracker,
    private matomoHelper: MatomoHelperService,
  ) { }

  @Selector()
  static getUser(state: AuthStateModel): User {
    return state.user;
  }

  @Selector()
  static loggedIn(state: AuthStateModel): boolean {
    if (state.user) {
      return true;
    } else {
      return false;
    }
  }

  @Selector()
  static getErrorMessage(state: AuthStateModel): string {
    return state.error;
  }

  @Selector()
  static isLoading(state: AuthStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static isLoaded(state: AuthStateModel): boolean {
    return state.loaded;
  }

  @Selector()
  static getSubscription(state: AuthStateModel): NotificationSubscription {
    return state.subscription;
  }

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    ctx.dispatch(new authActions.CheckSession());
    if (this.authService.getUser()) {
      this.matomoHelper.setUserId(this.authService.getUser().id),
        ctx.dispatch(new authActions.LoadNotificationSubscription(
          this.authService.getUser().id,
          this.checkPlattform()
        ));
    }

  }

  checkPlattform(): string {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  }

  // ACTIONS
  @Action(authActions.CheckSession)
  checkSession(
    ctx: StateContext<AuthStateModel>
  ) {
    const currentUser = this.authService.getUser();
    if (currentUser) {
      ctx.patchState({
        loaded: true,
        loading: false,
        user: currentUser
      });
      console.log('UID: ', currentUser.id);
      this.matomoHelper.setUserId(currentUser.id);
    } else {
      console.log('No user was found.');
    }
  }

  @Action(authActions.LoginUser)
  loginUser(
    ctx: StateContext<AuthStateModel>,
    action: authActions.LoginUser) {
    ctx.patchState({ loading: true });

    this.authService
      .loginUser(action.email, action.password)
      .then(result => {
        if (result.attributes.emailVerified) {
          ctx.dispatch(new authActions.LoginSuccess(result));
        } else {
          const err = 'It seems the user is not verified yet. Please check your emails.';
          ctx.dispatch(new authActions.LoginFailed(err));
        }
      })
      .catch(err => {
        ctx.dispatch(new authActions.LoginFailed(err.message));
      }
      );
  }

  @Action(authActions.LoginSuccess)
  loginSuccess(
    ctx: StateContext<AuthStateModel>,
    { loggedInUser }: authActions.LoginSuccess) {
    ctx.patchState({
      loading: false,
      loaded: true,
      user: loggedInUser,
    });
    console.log('UID: ', loggedInUser.id);
    this.matomoHelper.setUserId(loggedInUser.id);
  }

  @Action(authActions.LoginFailed)
  loginFailed(
    ctx: StateContext<AuthStateModel>,
    { errorMessage }: authActions.LoginFailed) {
    console.log(errorMessage);

    ctx.patchState({
      loading: false,
      loaded: false,
      error: errorMessage
    });
  }

  @Action(authActions.LogoutUser)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      loading: true
    });

    this.authService.logOutUser().then(() => {
      this.zone.run(() =>
        from(this.router.navigate(['logout']))
          .pipe(take(1))
          .subscribe(() =>
            ctx.dispatch(new authActions.LogoutUserSuccess())
          )
      );
    });
  }

  @Action(authActions.LogoutUserSuccess)
  logoutSuccess(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      loading: false,
      loaded: true,
      user: null
    });

    this.store.dispatch(new fromProfile.ResetCompleteState());
  }

  @Action(authActions.DeleteUser)
  deleteUser(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      loading: true
    });

    this.authService.deleteUser().then(() => {
      this.zone.run(() =>
        from(this.router.navigate(['delete-account']))
          .pipe(take(1))
          .subscribe(() =>
            ctx.dispatch(new authActions.DeleteUserSuccess())
          )
      );
    });
  }

  @Action(authActions.DeleteUserSuccess)
  deleteUserSuccess(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      loading: false,
      loaded: true,
      user: null
    });
  }

  @Action(authActions.LoadNotificationSubscription)
  loadNotificationSubscription(
    ctx: StateContext<AuthStateModel>,
    { uid, platform }: authActions.LoadNotificationSubscription
  ) {
    ctx.patchState({ loading: true });
    console.log('Looking for subscription on ', platform, 'with uid: ', uid);
    this.authService.loadNotificationSubscription(uid, platform)
      .then((result: any) => {
        console.log('Found subscription: ', result[0]);
        ctx.dispatch(
          new authActions.LoadNotificationSubscriptionSucessfull(result[0] && result[0].toJSON())
        );
      })
      .catch(error => {
        console.error('Couldnt load a notification subscription', error);
        ctx.dispatch(
          new authActions.LoadNotificationSubscriptionFailed()
        );
      });
  }

  @Action(authActions.FindNotifcationSubscription)
  findNotificationSubscription(
    ctx: StateContext<AuthStateModel>,
    { subId }: authActions.FindNotifcationSubscription
  ) {
    ctx.patchState({ loading: true });
    this.authService.findNotificationSubscription(subId)
      .then((result: any) => {
        console.log('Found subscription: ', result);
        ctx.dispatch(
          new authActions.LoadNotificationSubscriptionSucessfull(result.toJSON())
        );
      })
      .catch(error => {
        console.error('Couldnt find subscription', error);
        ctx.dispatch(
          new authActions.LoadNotificationSubscriptionFailed()
        );
      });
  }

  @Action(authActions.LoadNotificationSubscriptionSucessfull)
  loadNotificationSubscriptionSuccessfull(
    { patchState }: StateContext<AuthStateModel>,
    { sub }: authActions.LoadNotificationSubscriptionSucessfull
  ) {
    patchState({
      loading: false,
      loaded: true,
      subscription: sub
    });
  }

  @Action(authActions.LoadNotificationSubscriptionFailed)
  loadNotificationSubscriptionFailed(
    { patchState }: StateContext<AuthStateModel>,
  ) {
    patchState({
      loading: false,
      loaded: false,
      subscription: null
    });
  }

  @Action(authActions.CreateNotificationSubscription)
  createNotificationSubscription(
    ctx: StateContext<AuthStateModel>,
    { payload }: authActions.CreateNotificationSubscription
  ) {
    this.authService.enableNotifications(payload)
      .then((result: any) => {
        console.log('Created notification subscription: ', result.toJSON());
        ctx.dispatch(
          new authActions.LoadNotificationSubscriptionSucessfull(result.toJSON())
        );
      })
      .catch(error => {
        console.log('Error creating notification subscription: ', error.message);
        this.zone.run(() =>
          this.snackBar.open('Ihre Einstellung konnte nicht gespeichert werden.' +
            'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
            duration: 3000
          })
        );
        ctx.dispatch(
          new authActions.LoadNotificationSubscriptionFailed()
        );
      });
  }

  @Action(authActions.DisableNotificationSubscription)
  disableNotificationSubscription(
    ctx: StateContext<AuthStateModel>,
    { subId }: authActions.DisableNotificationSubscription
  ) {
    ctx.patchState({
      loading: true
    });
    this.authService.disableNotifications(subId)
      .then(result => {
        ctx.dispatch(new authActions.FindNotifcationSubscription(subId));
      })
      .catch(error => {
        console.error('Error disabling subscription: ', error);
      });
  }

  @Action(authActions.ReEnableNotificationSubscription)
  reEnableNotificationSubscription(
    ctx: StateContext<AuthStateModel>,
    { subId }: authActions.DisableNotificationSubscription
  ) {
    ctx.patchState({
      loading: true
    });
    this.authService.reEnableNotifications(subId)
      .then(result => {
        ctx.dispatch(new authActions.FindNotifcationSubscription(subId));
      })
      .catch(error => {
        console.error('Error enabling subscription: ', error);
      });
  }

  @Action(authActions.EnableChatNewsletter)
  enableChatNewsletter(
    ctx: StateContext<AuthStateModel>,
    { uid }: authActions.EnableChatNewsletter
  ) {
    this.authService.enableChatNewsletter(uid);
  }

  @Action(authActions.DisableChatNewsletter)
  disableChatNewsletter(
    ctx: StateContext<AuthStateModel>,
    { uid }: authActions.EnableChatNewsletter
  ) {
    this.authService.disableChatNewsletter(uid);
  }
}
