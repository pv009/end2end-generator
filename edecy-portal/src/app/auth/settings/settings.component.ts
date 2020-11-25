import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwPush } from '@angular/service-worker';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { environment } from 'src/environments/environment';
import { NotificationSubscription } from '../model/notification-sub.model';
import * as fromAuth from '../state/auth.actions';
import { AuthState } from '../state/auth.state';

export interface DialogData {
  desktopDialog: boolean;
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(AuthState.getSubscription) userSubscription$: Observable<NotificationSubscription>;

  currentPage = 'Benachrichtigungen';
  readonly VAPID_PUBLIC_KEY = environment.webPush.publicKey;
  tE = new TextEncoder();
  vapidBuffer = this.tE.encode(this.VAPID_PUBLIC_KEY).buffer;
  currentPlattform = '';

  desktopAccess = false;

  currentUid = '';

  chatNewsletteractive = false;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private swPush: SwPush,
    private store: Store,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private matomoHelper: MatomoHelperService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit() {
    this.checkPlattform();
    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.currentUid = user.id;
      this.chatNewsletteractive = user.attributes.receiveChatNewsletter;

      console.log('User has changed');
    });

    this.desktopAccess = this.data.desktopDialog;
    this.matomoHelper.trackPageView('SettingsPage');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  checkPlattform() {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
    ) {
      this.currentPlattform = 'mobile';
    } else {
      this.currentPlattform = 'desktop';
    }
    console.log('User is browsing on ', this.currentPlattform);
  }

  enableNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(sub => {
        console.log('Subscription object: ', JSON.stringify(sub));
        const subObj = JSON.parse(JSON.stringify(sub));
        const newSubscription: NotificationSubscription = {
          uid: this.currentUid,
          subscription: {
            endpoint: sub.endpoint,
            expirationTime: null,
            keys: {
              p256dh: sub.toJSON().keys.p256dh,
              auth: sub.toJSON().keys.auth
            }
          },
          platform: this.currentPlattform,
          active: true
        };
        console.log('Try to save sub: ', newSubscription);
        this.store.dispatch(new fromAuth.CreateNotificationSubscription(newSubscription));
      })
      .catch(err => {
        console.error('Could not subscribe to notifications', err);
        this.snackBar.open('Wir konnten Ihre Einstellung nicht speichern. Bitte probieren Sie es erneut.' +
          'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
          duration: 5000
        });
      });
  }

  disableNotifications() {
    this.userSubscription$.pipe(take(1)).subscribe(sub => {
      this.store.dispatch(new fromAuth.DisableNotificationSubscription(sub.objectId));
    });
  }

  reEnableNotifications() {
    this.userSubscription$.pipe(take(1)).subscribe(sub => {
      this.store.dispatch(new fromAuth.ReEnableNotificationSubscription(sub.objectId));
    });
  }

  enableMailService() {
    this.store.dispatch(new fromAuth.EnableChatNewsletter(this.currentUid));
    this.chatNewsletteractive = true;
  }

  disableMailService() {
    this.store.dispatch(new fromAuth.DisableChatNewsletter(this.currentUid));
    this.chatNewsletteractive = false;
  }
}
