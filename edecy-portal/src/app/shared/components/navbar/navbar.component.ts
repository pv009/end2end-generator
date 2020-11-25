import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { FunctionTeaserComponent } from 'src/app/auth/function-teaser/function-teaser.component';
import { AuthState } from 'src/app/auth/state/auth.state';
import { CardsState } from 'src/app/cards/state/cards.state';
import { Chat } from 'src/app/chat/model/chat.model';
import { ChatState } from 'src/app/chat/state/chats.state';
import { ProfileState } from 'src/app/profile/state/profile.state';
import { environment } from 'src/environments/environment';
import * as fromCards from '../../../cards/state/cards.actions';
import * as fromChat from '../../../chat/state/chats.actions';
import * as fromProfile from '../../../profile/state/profile.actions';
import { Tracking } from '../../model/tracking.model';
import { TrackingService } from '../../services/tracking.service';
import { TrackingState } from '../../state/tracking.state';
import * as fromBlog from '../blog/state/blog.actions';
import { CookieBannerComponent } from '../cookie-banner/cookie-banner.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(ChatState.getUserChats) userChats$: Observable<Chat[]>;
  @Select(ChatState.unreadMessages) unreadMessages$: Observable<number>;
  @Input() opened = false;
  @Output() openSideNav = new EventEmitter<boolean>();
  @Select(AuthState.loggedIn) loggedIn$: Observable<boolean>;
  @Select(CardsState.tabShown) tabShown$: Observable<string>;
  @ViewChild('searchBar') searchBar: ElementRef;
  @Select(CardsState.showFilter) showFilter$: Observable<boolean>;
  @Select(CardsState.keywords) cardKeywords$: Observable<string[]>;
  @Select(ProfileState.keywords) profileKeywords$: Observable<string[]>;
  @Select(ProfileState.profilesPerPage) profilesPerPage$: Observable<number>;
  @Select(TrackingState.getSession) currentSession$: Observable<Tracking>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  loadedUser = false;

  unreadMessages = 0;

  countedUnreadMessages = false;

  currentUser: User;

  searchForm: FormGroup;
  searched = false;
  showFilter = false;
  filterActive = false;

  filterShown: boolean;

  staging = environment.staging;

  constructor(
    private router: Router,
    private store: Store,
    public dialog: MatDialog,
    private cookieBanner: MatBottomSheet,
    private fb: FormBuilder,
    private tracking: TrackingService
  ) { }

  ngOnInit() {
    this.buildSearchForm();
    this.cardKeywords$.subscribe(keywords => {
      this.tabShown$.pipe(take(1)).subscribe(tab => {
        if (tab === 'request') {
          this.searchForm.patchValue({
            keyword: keywords.toString().replace(/,/g, ' ')
          });
        }
      });
    });

    this.profileKeywords$.subscribe(keywords => {
      this.tabShown$.pipe(take(1)).subscribe(tab => {
        if (tab === 'profile') {
          console.log('Search bar keywords: ', keywords.toString());
          this.searchForm.patchValue({
            keyword: keywords.toString().replace(/,/g, ' ')
          });
        }
      });
    });

    this.showFilter$.pipe(take(1)).subscribe(filter => {
      this.showFilter = filter;
    });

    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.store.dispatch(new fromChat.LoadUserChats(user.id));
        this.loadedUser = true;
        this.currentUser = user;
      }
    });

    this.userChats$.subscribe(chats => {
      if (this.loadedUser && chats.length > 0 && !this.countedUnreadMessages) {
        console.log('reached', chats);
        for (const chat of chats) {
          for (const message of chat.messages) {
            if (!message.read && message.authorId !== this.currentUser.id) {
              this.unreadMessages++;
            }
          }
        }
        this.store.dispatch(new fromChat.UnreadMessages(this.unreadMessages));
        this.countedUnreadMessages = true;
      }
    });
    this.openCookieBanner();
    this.loadBlogPosts();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private loadBlogPosts() {
    this.store.dispatch(new fromBlog.LoadPosts());
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
    console.log('new keyword', this.searchForm.value.keyword);
    this.store.dispatch(new fromProfile.ResetPage());
    this.store.dispatch(new fromProfile.SearchProfilesES(this.searchForm.value.keyword));
    this.currentSession$.pipe(take(1)).subscribe(session => {
      if (session) {
        this.tracking.trackProfileSearch(this.searchForm.value.keyword, session.objectId);
      }
    });

  }

  clearSearch() {
    if (this.searched) {
      this.tabShown$.pipe(take(1)).subscribe(tabShown => {
        if (tabShown === 'request') {
          this.store.dispatch(new fromCards.LoadRequests());
          this.store.dispatch(new fromCards.ClearKeywords());
        } else if (tabShown === 'profile') {
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

  onOpenSideNav() {
    this.opened = !this.opened;
    this.openSideNav.emit(this.opened);
  }

  openChats() {
    this.loggedIn$.pipe(take(1)).subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/chat/overview']);
      } else {
        this.openTeaser('');
      }
    });
    this.openSideNav.emit(false);
  }

  openCards() {
    this.loggedIn$.pipe(take(1)).subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigate(['/cards/my-cards']);
      } else {
        this.openTeaser('profile');
      }
    });
    this.openSideNav.emit(false);
  }

  openAllCards() {
    this.router.navigate(['/cards/list']);
    this.openSideNav.emit(false);
  }

  openTeaser(viewSource: string) {
    const dialogRef = this.dialog.open(FunctionTeaserComponent, {
      width: '90vw',
      height: '70vh',
      data: { source: viewSource }
    });
  }

  openCookieBanner() {
    if (window.location.pathname !== '/login') {
      this.cookieBanner.open(CookieBannerComponent, {
        data: { openedByUser: false }
      });
    }
  }

  toggleFilter() {
    if (this.filterShown) {
      this.store.dispatch(new fromCards.HideFilter());
    } else {
      this.store.dispatch(new fromCards.ShowFilter());
    }
    this.filterShown = !this.filterShown;
  }
}
