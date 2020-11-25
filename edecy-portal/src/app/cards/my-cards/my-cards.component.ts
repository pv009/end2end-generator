import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { Card } from '../model/card.model';
import { EdecyInfoDialogComponent } from '../single-card/edecy-info-dialog/edecy-info-dialog.component';
import * as fromCards from '../state/cards.actions';
import { CardsState } from '../state/cards.state';

@Component({
  selector: 'app-my-cards',
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.scss']
})
export class MyCardsComponent implements OnInit {
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(CardsState.getUsersCards) userCards$: Observable<Card[]>;
  @Select(CardsState.tabShown) tabShown$: Observable<string>;
  @Input() embeddedMode = false;
  @Input() detailView = false;

  centerWidth = 100;

  inEditorView = false;

  searchForm: FormGroup;
  searched = false;

  viewList = false;
  fontSize = 19;
  secondRowHeight = 85;

  requestType = 'request';
  userCard = true;

  currentUser: User;

  showPublished = true;
  desktopDialog = false;

  tabShown = 'profile';

  showEmbedded = true;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private matomoHelper: MatomoHelperService,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.detailView) {
      this.loadCards();
    }
    this.buildSearchForm();
    this.checkDesktop();
    this.matomoHelper.trackPageView('MyCardsPage');
    if (this.router.url.indexOf('requests') > -1) {
      this.tabShown = 'request';
    }
    if (this.router.url.indexOf('saved') > -1) {
      this.showPublished = false;
    }
  }

  checkDesktop() {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.desktopDialog = true;
      this.fontSize = 12;
      if (!this.embeddedMode) {
        this.centerWidth = 50;
      } else {
        this.secondRowHeight = 42;
      }
    }
  }

  buildSearchForm() {
    this.searchForm = this.fb.group({
      keyword: ''
    });
  }

  submitSearch() {
    this.store.dispatch(new fromCards.SearchUserCards(this.searchForm.value.keyword, this.currentUser.id));
    this.searched = true;
  }

  clearSearch() {
    if (this.searched) {
      this.loadCards();
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


  private loadCards() {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      this.store.dispatch(new fromCards.LoadUserCards(user.id));
      this.currentUser = user;
    });
  }

  editCard() {

  }

  changeView() {
    this.viewList = !this.viewList;
  }

  showTab(tab: string) {
    this.tabShown = tab;
  }

  openEdecyInfoDialog() {
    this.dialog.open(EdecyInfoDialogComponent,
      {
        height: '300px',
      });
  }

  togglColumnNavigation(showColumnNavigation: boolean) {
    console.log('Editor view? ', showColumnNavigation);
    this.inEditorView = showColumnNavigation;
  }

}
