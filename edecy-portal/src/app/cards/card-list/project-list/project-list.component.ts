import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { IconServiceService } from 'src/app/icon-service/icon-service.service';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { Card } from '../../model/card.model';
import { Filter } from '../../model/filter.model';
import {
  Discipline, SingleSubject, Subject1, Subject2, Subject3, Subject4, Subject5, Subject6,
  Subject7
} from '../../model/specialties.model';
import * as fromCards from '../../state/cards.actions';
import { CardsState } from '../../state/cards.state';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  @Input() data: Card[];
  @Output() filterSelected = new EventEmitter<boolean>();
  @Input() cardType: string;
  @Select(CardsState.showFilter) showFilter$: Observable<boolean>;
  @Output() showFilterChange = new EventEmitter<boolean>();
  @Select(CardsState.tabShown) tabShown$: Observable<string>;
  @Select(CardsState.getRequests) requests$: Observable<Card[]>;
  @Select(CardsState.keywords) searchKeywords$: Observable<string[]>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;

  userCard = false;

  searched = false;

  showStudent = true;
  showMachine = true;
  showProject = true;

  filterActive = false;

  cardSelected = false;
  chosenCard = '';

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

  destroy$: Subject<boolean> = new Subject<boolean>();

  desktopAccess = false;

  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver,
    private matomoHelper: MatomoHelperService,
    private iconService: IconServiceService
  ) { }

  ngOnInit() {
    this.iconService.registerIcons();
    this.tabShown$.pipe(takeUntil(this.destroy$)).subscribe(tab => {
      this.searchKeywords$.pipe(take(1)).subscribe(keywords => {
        if (keywords) {
          if (tab === 'request') {
            if (keywords.length > 0) {
              this.store.dispatch(new fromCards.SearchRequests(keywords.toString().replace(',', ' ')));
            } else {
              this.store.dispatch(new fromCards.LoadRequests());
            }
          }
        }
      });
    });

    if (this.breakpointObserver.isMatched('(min-Width: 960px)')) {
      this.desktopAccess = true;
    }
    this.matomoHelper.trackPageView('Request List');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
    }
  }

  selectionView(changeToCardView: boolean) {
    this.cardSelected = changeToCardView;
  }

  loadCard(selectedCard: string) {
    this.store.dispatch(new fromCards.LoadCard(selectedCard));
  }

  showSpecialties() {
    this.showSpecialtyOptions = true;
    console.log(this.selectedDiscipline);
    this.specialty2 = this.disciplineToShow[this.selectedDiscipline].disciplineTitle;
    this.specialtiesToShow = this.disciplineToShow[this.selectedDiscipline].specialties;
    this.specialty3 = '';
  }

  selectSpecialty() {
    this.specialty3 = this.selectedSpecialty;
  }

  applyFilter() {
    const filter: Filter = {
      specialties: [
        this.selectedSubject,
        this.specialty2,
        this.specialty3
      ]
    };
    console.log('Filter: ', filter);

    if (this.cardType === 'request') {
      this.store.dispatch(new fromCards.FilterRequests(filter));
    }
    this.store.dispatch(new fromCards.HideFilter());
    this.showFilterChange.emit(false);
    this.filterActive = true;
    this.filterSelected.emit(false);
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
  }

  returnToAllCards(doReturn: boolean) {
    this.cardSelected = !doReturn;
  }
}
