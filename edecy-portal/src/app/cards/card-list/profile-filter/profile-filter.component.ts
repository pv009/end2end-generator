import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import { ProfileState } from 'src/app/profile/state/profile.state';
import * as fromProfile from '../../../profile/state/profile.actions';
import { CardsState } from '../../state/cards.state';

@Component({
  selector: 'app-profile-filter',
  templateUrl: './profile-filter.component.html',
  styleUrls: ['./profile-filter.component.scss']
})
export class ProfileFilterComponent implements OnInit, OnDestroy {
  @Select(CardsState.tabShown) tabShown$: Observable<string>;
  @Select(ProfileState.keywords) searchKeywords$: Observable<string[]>;
  @Select(ProfileState.categoryFilter) categoryFilter$: Observable<string>;
  @Select(ProfileState.cityFilter) cityFilter$: Observable<string>;
  @Select(ProfileState.profilesPerPage) querySize$: Observable<number>;


  categoryField = new FormControl();
  cityField = new FormControl();

  filteredPublic: boolean;

  categories: Array<string> = [];
  cities: Array<string> = [];


  filteredCategories: Observable<string[]>;
  filteredCities: Observable<string[]>;

  categoryForm: FormGroup;

  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(
    private store: Store,
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getFilterList();
    this.filteredCategories = this.categoryField.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterCategory(name) : this.categories.slice())
      );

    this.filteredCities = this.cityField.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterCity(name) : this.cities.slice())
      );

    this.cityFilter$.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      if (filterValue) {
        this.cityField.patchValue(filterValue);
      }
    });

    this.categoryFilter$.pipe(takeUntil(this.destroy$)).subscribe(filterValue => {
      if (filterValue) {
        this.categoryField.patchValue(filterValue);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getFilterList() {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');

    this.http.get('/assets/data/categories.json', { headers }).pipe(take(1)).subscribe((response: Array<string>) => {
      this.categories = response;
    });

    this.http.get('/assets/data/cities.json', { headers }).pipe(take(1)).subscribe((response: Array<string>) => {
      this.cities = response;
    });
  }

  private _filterCategory(category: string): string[] {
    const filterValue = category.toLowerCase();

    return this.categories.filter(cat => cat.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterCity(city: string): string[] {
    const filterValue = city.toLowerCase();

    return this.cities.filter(cat => cat.toLowerCase().indexOf(filterValue) === 0);
  }

  setCategory() {
    this.store.dispatch(new fromProfile.ResetPage());
    this.store.dispatch(new fromProfile.SetCategory(this.categoryField.value));

  }

  clearCategory() {
    this.categoryField.patchValue('');
    this.store.dispatch(new fromProfile.ResetPage());
    this.store.dispatch(new fromProfile.ClearCategory());
  }

  setCity() {
    this.store.dispatch(new fromProfile.ResetPage());
    this.store.dispatch(new fromProfile.SetCity(this.cityField.value));

  }

  clearCity() {
    this.cityField.patchValue('');
    this.store.dispatch(new fromProfile.ResetPage());
    this.store.dispatch(new fromProfile.ClearCity());
  }

  resetFilter() {
    this.clearCategory();
    this.clearCity();
  }

  applyFilter(type: string) {
    if (type === 'public') {
      this.filteredPublic = true;
    } else {
      this.filteredPublic = false;
    }
    this.store.dispatch(new fromProfile.FilterPublicES(type));

  }

  resetPublicFilter() {
    this.filteredPublic = undefined;
    this.store.dispatch(new fromProfile.FilterPublicES(null));
  }

}
