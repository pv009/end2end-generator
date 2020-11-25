import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CardFilter, Tracking } from 'src/app/shared/model/tracking.model';
import { TrackingService } from 'src/app/shared/services/tracking.service';
import { TrackingState } from 'src/app/shared/state/tracking.state';
import { Filter } from '../../model/filter.model';
import {
  Discipline, SingleSubject, Subject1, Subject2, Subject3, Subject4, Subject5, Subject6,
  Subject7
} from '../../model/specialties.model';
import * as fromCards from '../../state/cards.actions';
import { CardsState } from '../../state/cards.state';

@Component({
  selector: 'app-card-filter',
  templateUrl: './card-filter.component.html',
  styleUrls: ['./card-filter.component.scss']
})
export class CardFilterComponent implements OnInit {
  @Select(CardsState.tabShown) tabShown$: Observable<string>;
  @Select(TrackingState.getSession) currentSession$: Observable<Tracking>;

  // Filter related
  specialties: Array<SingleSubject> = [
    Subject1,
    Subject2,
    Subject3,
    Subject4,
    Subject5,
    Subject6,
    Subject7,
  ];

  disciplineToShow: Array<Discipline> = [
    {
      disciplineTitle: '',
      specialties: [''],
      index: 0
    }
  ];

  selectedSubject = '';
  selectedDiscipline: number = null;
  specialtiesToShow: Array<string> = [
    ''
  ];
  showDisciplineOptions = false;
  showSpecialtyOptions = false;

  disciplineSelected = false;
  selectedSpecialty: string;

  specialty2 = '';
  specialty3 = '';

  constructor(
    private store: Store,
    private tracking: TrackingService
  ) { }

  ngOnInit() {
  }

  showDisciplines() {
    this.showDisciplineOptions = true;
    this.showSpecialtyOptions = false;

    switch (this.selectedSubject) {
      case 'Wirtschaftswissenschaften':
        this.disciplineToShow = this.specialties[0].disciplines;
        this.disciplineSelected = true;
        break;
      case 'Rechtswissenschaften, Jurisprudenz':
        this.disciplineToShow = this.specialties[1].disciplines;
        this.disciplineSelected = true;
        break;
      case 'Naturwissenschaften':
        this.disciplineToShow = this.specialties[2].disciplines;
        this.disciplineSelected = true;
        break;
      case 'Informationswissenschaften und Mathematik':
        this.disciplineToShow = this.specialties[3].disciplines;
        this.disciplineSelected = true;
        break;
      case 'Medizintechnik':
        this.disciplineToShow = this.specialties[4].disciplines;
        this.disciplineSelected = true;
        break;
      case 'Ingenieurswissenschaften':
        this.disciplineToShow = this.specialties[5].disciplines;
        this.disciplineSelected = true;
        break;
      case 'Interdisziplinäres':
        this.disciplineToShow = this.specialties[6].disciplines;
        this.disciplineSelected = true;
        break;
      default:
        console.error('Wrong selection');
        break;
    }

    if (this.disciplineSelected) {
      this.selectedSpecialty = null;
      this.selectedDiscipline = null;
      this.specialty2 = '';
      this.specialty3 = '';
      this.specialtiesToShow = null;
    }

    this.applyFilter();
  }

  showSpecialties() {

    console.log(this.selectedDiscipline);
    this.specialty2 = this.disciplineToShow[this.selectedDiscipline].disciplineTitle;
    this.specialtiesToShow = this.disciplineToShow[this.selectedDiscipline].specialties;
    this.specialty3 = '';
    if (this.specialtiesToShow.length > 1) {
      this.showSpecialtyOptions = true;
    }

    this.applyFilter();
  }

  selectSpecialty() {
    this.specialty3 = this.selectedSpecialty;

    this.applyFilter();
  }

  applyFilter() {
    const filter: Filter = {
      specialties: [
        this.selectedSubject,
        this.specialty2,
        this.specialty3
      ]
    };
    const trackingFilter: CardFilter = {
      subject_areas: filter.specialties
    };
    console.log('Filter: ', filter);
    this.currentSession$.pipe(take(1)).subscribe(session => {
      if (session) {
        this.tracking.trackCardFilter(trackingFilter, session.objectId);
      }
    });

    this.tabShown$.pipe(take(1)).subscribe(cardType => {
      if (cardType === 'request') {
        this.store.dispatch(new fromCards.FilterRequests(filter));
      }
    });

  }

  resetFilter() {
    this.selectedSubject = '';
    this.selectedDiscipline = null;
    this.selectedSpecialty = null;
    this.specialty2 = '';
    this.specialty3 = '';
    this.disciplineToShow = [];
    this.specialtiesToShow = [''];

    this.showDisciplineOptions = false;
    this.showSpecialtyOptions = false;

    this.tabShown$.pipe(take(1)).subscribe(cardType => {
      if (cardType === 'request') {
        this.store.dispatch(new fromCards.LoadRequests());
      }
    });
  }

}
