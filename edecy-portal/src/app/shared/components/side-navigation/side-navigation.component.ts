import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { FunctionTeaserComponent } from 'src/app/auth/function-teaser/function-teaser.component';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { SettingsComponent } from 'src/app/auth/settings/settings.component';
import { AuthState } from 'src/app/auth/state/auth.state';
import { UpdateProfileComponent } from 'src/app/auth/update-profile/update-profile.component';
import { Card } from 'src/app/cards/model/card.model';
import { CardsState } from 'src/app/cards/state/cards.state';
import { Chat } from 'src/app/chat/model/chat.model';
import { ChatState } from 'src/app/chat/state/chats.state';
import { FeedbackComponent } from 'src/app/contact-edecy/feedback/feedback.component';
import { Profile } from 'src/app/profile/model/profile.model';
import { ProfileState } from 'src/app/profile/state/profile.state';
import * as fromAuth from '../../../auth/state/auth.actions';
import { Tracking } from '../../model/tracking.model';
import { MatomoHelperService } from '../../services/matomo-helper.service';
import { ScrollService } from '../../services/scroll.service';
import * as fromTracking from '../../state/tracking.actions';
import { TrackingState } from '../../state/tracking.state';
import { OtherChatsComponent } from '../chat-bar/other-chats/other-chats.component';


declare const openBitrix: any;

export interface DialogData {
  desktopDialog: boolean;
}
@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent implements OnInit {
  @Select(AuthState.loggedIn) isLoggedIn$: Observable<boolean>;
  @Input() opened = false;
  @Output() toggleSideNav = new EventEmitter<boolean>();
  @Select(ChatState.openedChats) openedChats$: Observable<Chat[]>;
  @Select(ChatState.getChat) activeChat$: Observable<Chat>;
  @Select(ChatState.getUserChats) userChats$: Observable<Chat[]>;
  @Select(ProfileState.getUserProfile) userProfile$: Observable<Profile>;
  @Select(CardsState.getUsersCards) userCards$: Observable<Card[]>;
  @Select(TrackingState.getSession) session$: Observable<Tracking>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;

  sessionCreated = false;

  showSupport = true;

  userMenuOpen = false;
  legalMenuOpen = false;
  desktopAccess = false;

  maxNumberOfBars = 3;

  currentRoute = '';


  constructor(
    private store: Store,
    public router: Router,
    public dialog: MatDialog,
    private scrollService: ScrollService,
    private breakpointObserver: BreakpointObserver,
    private bottomSheet: MatBottomSheet,
    private matomoHelper: MatomoHelperService
  ) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.desktopAccess = true;
    }

    if (this.breakpointObserver.isMatched('(min-width: 1280px)')) {
      this.maxNumberOfBars = 2;
    }

    if (this.breakpointObserver.isMatched('(min-width: 1600px)')) {
      this.maxNumberOfBars = 3;
    }

    if (this.breakpointObserver.isMatched('(min-width: 2000px)')) {
      this.maxNumberOfBars = 4;
    }

    setTimeout(() => {
      this.session$.subscribe(session => {
        if (session === null) {
          this.currentUser$.pipe(take(1)).subscribe(user => {
            this.userCards$.pipe(take(1)).subscribe(cards => {
              this.userProfile$.pipe(take(1)).subscribe(profile => {
                if (user && cards && profile && this.sessionCreated === false) {
                  this.store.dispatch(new fromTracking.CreateSession(user, cards, profile));
                  this.sessionCreated = true;
                }
              });
            });
          });
        }
      });
    }, 2000);
  }

  editProfile() {
    console.log('edit');
  }

  privacySettings() {
    console.log('private');
  }

  logout() {
    this.store.dispatch(new fromAuth.LogoutUser());
    this.onToggleSideNav();
    setTimeout(() => {
      this.router.navigate(['/welcome']);
    }, 5000);
    this.matomoHelper.trackEvent('Authentication', 'Logout');
  }

  onToggleSideNav() {
    this.opened = !this.opened;
    this.toggleSideNav.emit(false);
  }

  openCards() {
    this.router.navigate(['/cards']);
    this.onToggleSideNav();
  }

  openMyCards() {
    this.router.navigate(['/cards/my-cards']);
    this.onToggleSideNav();
    this.userMenuOpen = false;
  }

  goToSettings() {
    if (this.desktopAccess) {
      this.dialog.open(SettingsComponent, {
        minHeight: '500px',
        data: { desktopDialog: true }
      });
    } else {
      this.router.navigate(['/settings']);
    }
    this.onToggleSideNav();
    this.userMenuOpen = false;
  }

  goToProfile() {
    if (this.desktopAccess) {
      this.dialog.open(UpdateProfileComponent, {
        minHeight: '800px',
        minWidth: '600px',
        disableClose: true,
        data: { desktopDialog: true }
      });
    } else {
      this.router.navigate(['/update-profile']);
    }
    this.matomoHelper.trackEvent('Navigation', 'GoTo', 'Profile');
    this.onToggleSideNav();
    this.userMenuOpen = false;
  }

  goToChangePassword() {
    this.router.navigate(['/change-password']);
    this.matomoHelper.trackEvent('Navigation', 'GoTo', 'Change Password');
    this.onToggleSideNav();
  }

  createRequest() {
    this.isLoggedIn$.pipe(take(1)).subscribe(loggedIn => {
      if (loggedIn) {

        this.router.navigate(['/cards/create-request']);
        this.onToggleSideNav();
      } else {
        this.openTeaser();
      }
    });
  }

  goToAboutUs() {
    this.router.navigate(['/about-us']);
    this.matomoHelper.trackEvent('Navigation', 'GoTo', 'About Us');
    this.onToggleSideNav();
  }

  goToFeedback() {
    if (this.desktopAccess) {
      this.dialog.open(FeedbackComponent, {
        minHeight: '480px',
        maxWidth: '420px',
        data: { inDialog: true }
      });
    } else {
      this.router.navigate(['/feedback']);
    }
    this.matomoHelper.trackEvent('Navigation', 'GoTo', 'Feedback');
    this.onToggleSideNav();
  }

  goToPrices() {
    this.router.navigate(['/prices']);
    this.onToggleSideNav();
    this.matomoHelper.trackEvent('Navigation', 'GoTo', 'Prices');
  }


  goToFAQ() {
    this.router.navigate(['/faq']);
    this.matomoHelper.trackEvent('Navigation', 'GoTo', 'FAQ');
    this.onToggleSideNav();
  }

  goToSupportMenu() {
    openBitrix();
    this.onToggleSideNav();
  }

  goToPrivacyPolicy() {
    if (this.desktopAccess) {
      this.router.navigate(['/legal/privacy-policy']);
    } else {
      this.router.navigate(['/privacy-policy']);
    }
    this.onToggleSideNav();
    this.legalMenuOpen = false;
    this.matomoHelper.trackEvent('Navigation', 'GoTo', 'Privacy Policy');
  }

  goToTOS() {
    if (this.desktopAccess) {
      this.router.navigate(['/legal/terms-of-use']);
    } else {
      this.router.navigate(['/terms-of-use']);
    }
    this.onToggleSideNav();
    this.legalMenuOpen = false;
    this.matomoHelper.trackEvent('Navigation', 'GoTo', 'Terms of Use');
  }

  goToImprint() {
    if (this.desktopAccess) {
      this.router.navigate(['/legal/imprint']);
    } else {
      this.router.navigate(['/imprint']);
    }
    this.onToggleSideNav();
    this.legalMenuOpen = false;
    this.matomoHelper.trackEvent('Navigation', 'GoTo', 'Imprint');
  }

  openUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    this.legalMenuOpen = false;
  }

  openLegalMenu() {
    this.legalMenuOpen = !this.legalMenuOpen;
    this.userMenuOpen = false;
  }

  closeSubMenus() {
    this.legalMenuOpen = false;
    this.userMenuOpen = false;
  }

  goToLogin() {
    if (this.desktopAccess) {
      this.dialog.open(LoginComponent, {
        minHeight: '600px',
        minWidth: '600px',
        data: { desktopDialog: true }
      });
    } else {
      this.router.navigate(['/login']);
    }
    this.onToggleSideNav();
    this.matomoHelper.trackEvent('Navigation', 'GoTo', 'Login');
  }

  goToRegister() {
    if (this.desktopAccess) {
      this.dialog.open(RegisterComponent, {
        minHeight: '800px',
        minWidth: '600px',
        disableClose: true,
        data: { desktopDialog: true }
      });
    } else {
      this.router.navigate(['/register']);
    }
    this.onToggleSideNav();
    this.matomoHelper.trackEvent('Navigation', 'GoTo', 'Register');
  }

  openTeaser() {
    const dialogRef = this.dialog.open(FunctionTeaserComponent, {
      width: '90vw',
      height: '70vh',
      data: { source: 'create' }
    });
  }

  onScroll($event: any) {
    this.scrollService.setScroll($event);
  }

  changeChat() {
    this.bottomSheet.open(OtherChatsComponent, {
      data: { bars: this.maxNumberOfBars },
    });
  }
}
