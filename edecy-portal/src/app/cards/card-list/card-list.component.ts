import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { AuthState } from 'src/app/auth/state/auth.state';
import { UpdateProfileComponent } from 'src/app/auth/update-profile/update-profile.component';
import { FeedbackComponent } from 'src/app/contact-edecy/feedback/feedback.component';
import { Profile } from 'src/app/profile/model/profile.model';
import { ProfileES } from 'src/app/profile/model/profileES.model';
import { ProfileState } from 'src/app/profile/state/profile.state';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { ScrollService } from 'src/app/shared/services/scroll.service';
import * as fromAuth from '../../auth/state/auth.actions';
import * as fromProfile from '../../profile/state/profile.actions';
import { Card } from '../model/card.model';
import * as fromCards from '../state/cards.actions';
import { CardsState } from '../state/cards.state';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Select(CardsState.getRequests) requests$: Observable<Card[]>;
  @Select(ProfileState.getProfiles) profiles$: Observable<Profile[]>;
  @Select(CardsState.tabShown) tabShown$: Observable<string>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @ViewChild('searchBar') searchBar: ElementRef;
  @ViewChild('mainContainer') mainContainer: ElementRef;
  @Select(CardsState.showFilter) showFilter$: Observable<boolean>;
  @Select(ProfileState.showFilter) showFilterProfile$: Observable<boolean>;
  @Select(ProfileState.profilesES) profilesES$: Observable<ProfileES[]>;
  @Select(ProfileState.profilesPerPage) profilesPerPage$: Observable<number>;
  @Select(CardsState.keywords) searchKeywords$: Observable<string[]>;
  @Select(ProfileState.keywords) profileKeywords$: Observable<string[]>;
  @Select(AuthState.getErrorMessage) error$: Observable<string>;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  hide = true;


  removable = true;

  data$: Observable<Card[]>;
  profileData$: Observable<Profile[]>;
  profileDataES$: Observable<ProfileES[]>;
  cardType = 'request';

  searchForm: FormGroup;
  searched = false;

  showStudent = true;
  showMachine = true;
  showProject = true;

  filterActive = false;

  feedbackClosed = true;
  showFeedbackPanel = true;

  lastScrollYPosition = 0;


  desktopAccess = false;
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store,
    private scrollService: ScrollService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private matomoHelper: MatomoHelperService
  ) { }

  ngOnInit() {
    this.profileData$ = this.profiles$;
    this.profileDataES$ = this.profilesES$;
    this.data$ = this.requests$;
    this.buildSearchForm();

    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.desktopAccess = true;
    }

    this.tabShown$.pipe(take(1)).subscribe(tab => {
      if (tab === 'request') {
        this.searchRequests();
      } else if (tab === 'profile') {
        this.searchProfilesByKeyword();
      }
    });

    this.buildLoginForm();

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit() {
    this.scrollService.getScroll()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(event => this.onScroll(event));
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

  private searchRequests() {
    this.searchKeywords$.pipe(take(1)).subscribe(keywords => {
      if (keywords) {
        if (keywords.length > 0) {
          const newKeywords = Object.assign([], keywords);
          const newKeyword = newKeywords.toString().replace(/,/g, ' ');
          this.store.dispatch(new fromCards.SearchRequests(newKeyword));
        }
      }
    });
  }

  private searchProfilesByKeyword() {
    this.profileKeywords$.pipe(take(1)).subscribe(keywords => {
      if (keywords) {
        if (keywords.length > 0) {
          const newKeywords = Object.assign([], keywords);
          const newKeyword = newKeywords.toString().replace(/,/g, ' ');
          this.store.dispatch(new fromProfile.SearchProfilesES(newKeyword));
        }
      }
    });
  }

  submitSearch() {
    this.tabShown$.pipe(take(1)).subscribe(tabShown => {
      if (tabShown === 'request') {
        this.store.dispatch(new fromCards.SearchRequests(this.searchForm.value.keyword));
      } else if (tabShown === 'profile') {
        this.searchProfiles();
      }
    });

    this.searched = true;
  }

  searchProfiles() {
    this.store.dispatch(new fromProfile.ResetPage());
    this.store.dispatch(new fromProfile.SearchProfilesES(this.searchForm.value.keyword));
  }

  clearSearch() {
    if (this.searched) {
      this.tabShown$.pipe(take(1)).subscribe(tabShown => {
        if (tabShown === 'request') {
          this.store.dispatch(new fromCards.LoadRequests());
        } else if (tabShown === 'profile') {
          this.store.dispatch(new fromProfile.ResetPage());
          this.store.dispatch(new fromProfile.LoadProfilesES());
          this.store.dispatch(new fromProfile.ClearKeywords());
        }
      });

      this.searchForm.patchValue({
        keyword: ''
      });
      this.searched = false;
    } else {
      this.searchForm.patchValue({
        keyword: ''
      });
    }
  }

  buildSearchForm() {
    this.searchForm = this.fb.group({
      keyword: ''
    });
  }

  resetFilter() {
    this.tabShown$.pipe(take(1)).subscribe(tabShown => {
      if (tabShown === 'request') {
        this.store.dispatch(new fromCards.LoadRequests());
      }
    });
    this.filterActive = false;
  }

  closePanel() {
    this.feedbackClosed = true;
  }

  showFeedback(event) {
    console.log(event);
    if (event) {
      this.showFeedbackPanel = false;
    } else {
      this.showFeedbackPanel = true;
    }
  }

  onScroll(event: any) {
    if (Object.entries(event).length === 0) return;

    if (this.lastScrollYPosition > event.srcElement.scrollTop) {
      this.searchBar.nativeElement.classList.add('search-bar');
      if (window.innerWidth < 960) {
        this.renderer.setStyle(
          this.searchBar.nativeElement,
          'width',
          `${this.mainContainer.nativeElement.offsetWidth}px`);
      } else {
        this.renderer.setStyle(
          this.searchBar.nativeElement,
          'width',
          '100%');
      }
    } else {
      this.searchBar.nativeElement.classList.remove('search-bar');
    }
    this.lastScrollYPosition = event.srcElement.scrollTop;
  }

  editProfile() {
    this.dialog.open(UpdateProfileComponent, {
      minHeight: '800px',
      minWidth: '600px',
      disableClose: true,
      data: { desktopDialog: true }
    });
  }

  openLogin() {
    this.dialog.open(LoginComponent, {
      minHeight: '500px',
      minWidth: '500px',
      data: { desktopDialog: true }
    });
  }

  openFeedbackDialog() {
    console.log('Open Feedback');
    this.dialog.open(FeedbackComponent, {
      minHeight: '480px',
      maxWidth: '420px',
      data: { inDialog: true }
    });
  }

  openImprint() {
    if (this.desktopAccess) {
      this.router.navigate(['/legal/imprint']);
    } else {
      this.router.navigate(['/imprint']);
    }
  }

  openPrivacy() {
    if (this.desktopAccess) {
      this.router.navigate(['/legal/privacy-policy']);
    } else {
      this.router.navigate(['/privacy-policy']);
    }
  }

  toggleFilter() {
    this.tabShown$.pipe(take(1)).subscribe(tab => {
      if (tab !== 'profile') {
        this.showFilter$.pipe(take(1)).subscribe(filter => {
          if (filter) {
            this.store.dispatch(new fromCards.HideFilter());
          } else {
            this.store.dispatch(new fromCards.ShowFilter());
          }
        });
      } else {
        this.store.dispatch(new fromProfile.ToggleFilter());
      }
    });
  }

  loginUser() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.store.dispatch(new fromAuth.LoginUser(email, password));
    this.matomoHelper.trackEvent('Authentication', 'Login');
  }
}
