import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { DeleteDialogComponent } from 'src/app/auth/update-profile/dialogs/delete-dialog/delete-dialog.component';
import { Card } from '../model/card.model';
import * as fromCards from '../state/cards.actions';
import { CardsState } from '../state/cards.state';
import { EdecyInfoDialogComponent } from './edecy-info-dialog/edecy-info-dialog.component';



@Component({
  selector: 'app-single-card',
  templateUrl: './single-card.component.html',
  styleUrls: ['./single-card.component.scss']
})
export class SingleCardComponent implements OnInit {
  @Input() cardToDisplay: Card;
  @Input() userCard: boolean;
  @Output() cardSelected = new EventEmitter<boolean>();
  @Output() chosenCard = new EventEmitter<string>();
  @Select(CardsState.tabShown) tabShown$: Observable<string>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;

  fullView = false;

  searchingFor: Array<string> = [
    'Kooperation',
    'Partner',
    'KMU'
  ]; // TODO: Implement me correctly

  constructor(
    private router: Router,
    private store: Store,
    private dialog: MatDialog,
    @Inject('isBrowser') public isBrowser: boolean,
  ) { }

  ngOnInit() {
  }

  openCard() {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.router.navigate(['/cards/' + this.cardToDisplay.objectId]);
      }
    });
  }

  editCard() {
    console.log('edit!');
    this.store.dispatch(new fromCards.LoadCard(this.cardToDisplay.objectId));
    this.router.navigate(['/cards/edit/' + this.cardToDisplay.objectId]);
  }

  boostCard() {
    // TODO: Implement me
  }

  deleteCard() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '473px',
      data: {
        content:
          `Sind Sie sicher,
          dass Sie Ihre Anzeige
          endgültig löschen
          wollen?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new fromCards.DeleteCard(this.cardToDisplay.objectId));
        this.store.dispatch(new fromCards.LoadUserCards(this.cardToDisplay.uid));
        this.router.navigate(['/cards/my-cards']);
      }
    });
  }

  publishCard() {
    const updatedCard = {
      ...this.cardToDisplay,
      status: 'published'
    };

    this.store.dispatch(new fromCards.SaveCard(updatedCard));
  }

  dePublishCard() {
    const updatedCard = {
      ...this.cardToDisplay,
      status: 'saved'
    };

    this.store.dispatch(new fromCards.SaveCard(updatedCard));
  }

  openEdecyInfoDialog() {
    this.dialog.open(EdecyInfoDialogComponent,
      {
        height: '300px',
      });
  }

  get tagsJoined() {
    return this.cardToDisplay && this.cardToDisplay.tags && this.cardToDisplay.tags.join(', ');
  }

  searchTag(tag: string) {
    const keyword: string[] = [tag];
    this.store.dispatch(new fromCards.AddKeywords(keyword));
    this.tabShown$.pipe(take(1)).subscribe(tab => {
      if (tab === 'request') {
        this.store.dispatch(new fromCards.SearchRequests(tag));
      }
    });
  }
}
