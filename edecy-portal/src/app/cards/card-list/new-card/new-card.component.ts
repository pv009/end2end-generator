import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { User } from 'parse';
import { combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { FunctionTeaserComponent } from 'src/app/auth/function-teaser/function-teaser.component';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Card } from '../../model/card.model';
import { CardsState } from '../../state/cards.state';

@Component({
  selector: 'app-new-card',
  templateUrl: './new-card.component.html',
  styleUrls: ['./new-card.component.scss']
})
export class NewCardComponent implements OnInit {
  @Input() cardType: string;
  @Select(AuthState.getUser) user$: Observable<User>;
  @Select(CardsState.getUsersCards) usersCards$: Observable<Card[]>;
  @Select(CardsState.tabShown) tabShown$: Observable<string>;

  desktopAccess = false;
  showMsg = false;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched('(min-Width: 960px)')) {
      this.desktopAccess = true;
    }
  }

  createCard() {
    combineLatest([this.user$, this.usersCards$]).pipe(take(1)).subscribe(([userData, usersCards]) => {
      console.log('combineLatest');
      if (this.user$) {
        const user = userData.toJSON();
        let maxCards: number;
        if (user.rate) {
          switch (user.rate) {
            case 'basic':
              maxCards = 1;
              break;
            case 'premium':
              maxCards = 3;
              break;
            case 'premium-plus':
              maxCards = 10000;
              break;
            default:
              maxCards = 1;
              break;
          }
        } else {
          maxCards = 1;
        }
        console.log('maxCards: ', maxCards);
        console.log('cardType: ', this.cardType);
        console.log('usersCards.length: ', usersCards.length);
        if (this.cardType === 'request' && usersCards.length < maxCards) {
          this.showMsg = false;
          this.router.navigate(['/cards/create-request']);
        } else {
          this.showMsg = true;
        }
      } else {
        this.openTeaser();
      }
    });
  }

  openTeaser() {
    const dialogRef = this.dialog.open(FunctionTeaserComponent, {
      width: '90vw',
      height: '70vh',
      data: { source: 'create' }
    });
  }

}
