import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { IconServiceService } from 'src/app/icon-service/icon-service.service';
import { ProfileES } from 'src/app/profile/model/profileES.model';
import { ProfileState } from 'src/app/profile/state/profile.state';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import * as fromProfile from '../../../profile/state/profile.actions';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent implements OnInit, OnDestroy {
  @Select(ProfileState.profilesPerPage) profilesPerPage$: Observable<number>;
  @Select(ProfileState.page) currentPage$: Observable<number>;
  @Select(ProfileState.keywords) searchKeywords$: Observable<string[]>;
  @Select(ProfileState.isLoaded) isLoaded$: Observable<boolean>;
  @Select(ProfileState.profilesES) loadedProfiles$: Observable<ProfileES[]>;
  @Select(ProfileState.categoryFilter) categoryFilter$: Observable<string>;
  @Select(ProfileState.showFilter) showFilter$: Observable<boolean>;
  @Select(ProfileState.cityFilter) cityFilter$: Observable<string>;
  @Select(ProfileState.isLoaded) profilesLoaded$: Observable<boolean>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(ProfileState.listView) listView$: Observable<boolean>;

  @Input() data: ProfileES[];

  chosenSize = 20;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  pageNumber = 200;

  sizeOptions = [
    {
      value: 10,
      viewValue: '10'
    },
    {
      value: 20,
      viewValue: '20'
    },
    {
      value: 50,
      viewValue: '50'
    }
  ];
  constructor(
    private store: Store,
    private http: HttpClient,
    private matomoHelper: MatomoHelperService,
    private iconService: IconServiceService
  ) { }

  ngOnInit() {
    this.loadedProfiles$.pipe(takeUntil(this.destroy$)).subscribe(profiles => {
      if (profiles && profiles.length > 0) {
        console.log('List data: ', this.data);
      }
    });

    this.store.dispatch(new fromProfile.LoadProfilesES());


    this.profilesPerPage$.pipe(takeUntil(this.destroy$)).subscribe(size => {
      this.chosenSize = size;
    });
    this.matomoHelper.trackPageView('Profile List');

    this.getPageCount();

    this.iconService.registerIcons();
  }

  private getPageCount() {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');

    this.http.get('/assets/data/institute_count.json', { headers }).pipe(take(1)).subscribe((response: number) => {
      this.pageNumber = Math.ceil(response / 50);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  changeResults() {
    this.store.dispatch(new fromProfile.SetSize(this.chosenSize));
  }

  totalPages(length) {
    return new Array(length);
  }

  lastPage() {
    this.store.dispatch(new fromProfile.PreviousPage());
  }

  nextPage() {
    this.store.dispatch(new fromProfile.NextPage());
  }

  goToPage(chosenPage: number) {
    this.store.dispatch(new fromProfile.GoToPage(chosenPage));
  }

  changePage(change: number) {
    this.store.dispatch(new fromProfile.ChangeToPage(change));
  }

  private generateSearchterm(input: Array<string>): string {
    return input.join(' ');
  }

  applyFilter() {
    this.store.dispatch(new fromProfile.ToggleFilter());
  }

  changeView(listView: boolean) {
    this.store.dispatch(new fromProfile.ChangeView(listView));
  }

}
