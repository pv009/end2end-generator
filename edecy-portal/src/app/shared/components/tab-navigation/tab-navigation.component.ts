import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Card } from 'src/app/cards/model/card.model';
import * as fromCards from 'src/app/cards/state/cards.actions';
import { CardsState } from 'src/app/cards/state/cards.state';
import { Profile } from 'src/app/profile/model/profile.model';
import { ProfileES } from 'src/app/profile/model/profileES.model';
import * as fromProfile from 'src/app/profile/state/profile.actions';
import { ProfileState } from 'src/app/profile/state/profile.state';
import { Tracking } from '../../model/tracking.model';
import { TrackingService } from '../../services/tracking.service';
import { TrackingState } from '../../state/tracking.state';

@Component({
  selector: 'app-tab-navigation',
  templateUrl: './tab-navigation.component.html',
  styleUrls: ['./tab-navigation.component.scss']
})
export class TabNavigationComponent implements OnInit, OnDestroy {
  @Select(ProfileState.getProfiles) profiles$: Observable<Profile[]>;
  @Select(CardsState.getRequests) requests$: Observable<Card[]>;
  @Select(CardsState.tabShown) tabShown$: Observable<string>;
  @Select(ProfileState.keywords) profileKeywords$: Observable<string[]>;
  @Select(CardsState.keywords) cardKeywords$: Observable<string[]>;
  @Select(ProfileState.profilesES) profilesES$: Observable<ProfileES[]>;
  @Select(ProfileState.profilesPerPage) profilesPerPage$: Observable<number>;
  @Select(ProfileState.page) page$: Observable<number>;
  @Select(TrackingState.getSession) currentSession$: Observable<Tracking>;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private tracking: TrackingService
  ) { }

  round = 1;

  profileData$: Observable<Profile[]>;
  data$: Observable<Card[]>;
  cardType = 'request';

  removable = true;

  sumOfResults = 0;
  showPlus = true;

  showFilterOptions = true;

  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit() {
    this.profileData$ = this.profiles$;
    this.data$ = this.requests$;

    this.page$.pipe(takeUntil(this.destroy$)).subscribe(page => {
      this.profilesES$.pipe(takeUntil(this.destroy$)).subscribe(profiles => {
        if (profiles.length > 0) {
          this.sumOfResults = profiles.length + ((page - 1) * 50);
          if (profiles.length !== 50) {
            this.showPlus = false;
          } else {
            this.showPlus = true;
          }
        }
      });
    });

    this.route.params.subscribe(params => {
      if (params.id) {
        this.showFilterOptions = false;
      } else {
        this.showFilterOptions = true;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  showTab(tab: string) {
    console.log('round: ', this.round);
    this.round++;

    switch (tab) {
      case 'profile':
        this.router.navigate(['/cards/list']);
        this.profileData$ = this.profiles$;
        this.store.dispatch(new fromCards.ShowTab('profile'));
        break;
      case 'request':
        this.router.navigate(['/cards/list']);
        this.cardKeywords$.pipe(take(1)).subscribe(keywords => {
          if (keywords) {
            if (keywords.length > 0) {
              const newKeywords = Object.assign([], keywords);
              const newKeyword = newKeywords.toString().replace(/,/g, ' ');
              this.store.dispatch(new fromCards.SearchRequests(newKeyword));
            } else {
              this.profileKeywords$.pipe(take(1)).subscribe(profileKeywords => {
                if (profileKeywords.length > 0) {
                  const newKeywords = Object.assign([], profileKeywords);
                  const newKeyword = newKeywords.toString().replace(/,/g, ' ');
                  this.store.dispatch(new fromCards.SearchRequests(newKeyword));
                } else {
                  this.store.dispatch(new fromCards.LoadRequests());
                }
              });
            }
          }

        });
        this.data$ = this.requests$;
        this.store.dispatch(new fromCards.ShowTab('request'));
        this.cardType = 'request';
        break;
    }
  }

  removeProfileKeyword(index: number) {
    this.profileKeywords$.pipe(take(1)).subscribe(keywords => {
      if (keywords.length < 2) {

        this.profilesPerPage$.pipe(take(1)).subscribe(profileSize => {
          this.store.dispatch(new fromProfile.LoadProfilesES());
          this.store.dispatch(new fromProfile.ClearKeywords());
        });
      } else {
        const newKeywords = Object.assign([], keywords);
        newKeywords.splice(index, 1);
        const newKeyword = newKeywords.toString().replace(/,/g, ' ');
        this.store.dispatch(new fromProfile.ResetPage());
        this.store.dispatch(new fromProfile.SearchProfilesES(newKeyword));
        this.currentSession$.pipe(take(1)).subscribe(session => {
          if (session) {
            this.tracking.trackProfileSearch(newKeyword, session.objectId);
          }
        });
      }
    });
  }

  removeCardKeyword(index: number) {
    this.cardKeywords$.pipe(take(1)).subscribe(keywords => {
      if (keywords.length < 2) {
        this.resetCardFilter();
      } else {
        const newKeywords = Object.assign([], keywords);
        newKeywords.splice(index, 1);
        const newKeyword = newKeywords.toString().replace(/,/g, ' ');
        this.tabShown$.pipe(take(1)).subscribe(tab => {
          if (tab === 'request') {
            this.store.dispatch(new fromCards.SearchRequests(newKeyword));
          }
        });
      }
    });
  }

  resetProfileFilter() {
    this.store.dispatch(new fromProfile.ClearKeywords());
  }

  resetCardFilter() {
    this.store.dispatch(new fromCards.ClearKeywords());
    this.tabShown$.pipe(take(1)).subscribe(tab => {
      if (tab === 'request') {
        this.store.dispatch(new fromCards.LoadRequests());
      }
    });
  }
}
