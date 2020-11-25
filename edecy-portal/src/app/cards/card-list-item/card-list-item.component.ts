import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { DeleteDialogComponent } from 'src/app/auth/update-profile/dialogs/delete-dialog/delete-dialog.component';
import { Card } from '../model/card.model';
import { EdecyInfoDialogComponent } from '../single-card/edecy-info-dialog/edecy-info-dialog.component';
import * as fromCards from '../state/cards.actions';



@Component({
  selector: 'app-card-list-item',
  templateUrl: './card-list-item.component.html',
  styleUrls: ['./card-list-item.component.scss']
})
export class CardListItemComponent {
  @Input() cardToDisplay: Card;

  constructor(
    private router: Router,
    private store: Store,
    private dialog: MatDialog
  ) { }

  openCard() {
    this.router.navigate(['/cards/' + this.cardToDisplay.objectId]);
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

}
