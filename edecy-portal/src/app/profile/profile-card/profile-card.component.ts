import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Card } from 'src/app/cards/model/card.model';
import { CardsState } from 'src/app/cards/state/cards.state';
import { Chat } from 'src/app/chat/model/chat.model';
import { ChatState } from 'src/app/chat/state/chats.state';
import { IconServiceService } from 'src/app/icon-service/icon-service.service';
import { Tracking } from 'src/app/shared/model/tracking.model';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { TrackingService } from 'src/app/shared/services/tracking.service';
import { TrackingState } from 'src/app/shared/state/tracking.state';
import * as fromCards from '../../cards/state/cards.actions';
import * as fromChat from '../../chat/state/chats.actions';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  @Input() cardToDisplay: Card;
  @Select(CardsState.tabShown) tabShown$: Observable<string>;
  @Select(ChatState.getChat) selectedChat$: Observable<Chat>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(CardsState.getSelectedCard) selectedCard$: Observable<Card>;
  @Select(TrackingState.getSession) currentSession$: Observable<Tracking>;

  fullView = false;

  currentCard: Card;
  currentUser: User;

  private destroy$: Subject<void> = new Subject<void>();

  searchingFor: Array<string> = [
    'Kooperation',
    'Partner',
    'KMU'
  ]; // TODO: Implement me correctly

  constructor(
    private router: Router,
    @Inject('isBrowser') public isBrowser: boolean,
    private store: Store,
    private breakpointObserver: BreakpointObserver,
    private tracking: TrackingService,
    private iconService: IconServiceService,
    private matomoHelper: MatomoHelperService

  ) { }

  ngOnInit() {
    this.iconService.registerIcons();
    this.selectedCard$.pipe(takeUntil(this.destroy$)).subscribe(card => {
      if (card) {
        this.currentCard = card;
        this.currentUser$.pipe(take(1)).subscribe(user => {
          if (user) {
            this.currentUser = user;
            this.store.dispatch(new fromChat.FindChat(user.id, card.uid, card.objectId));
          }
        });
      }
    });
  }

  openCard() {
    this.router.navigate(['/cards/' + this.cardToDisplay.objectId]);
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

  startChat() {
    this.selectedChat$.pipe(take(1)).subscribe(chat => {
      if (chat) {
        this.goToChat(this.currentCard.uid);
      } else {
        this.createChat();
        this.goToChat(this.currentCard.uid);
      }
      this.matomoHelper.trackEvent('Chat', 'Start', this.currentCard.title);
      this.currentSession$.pipe(take(1)).subscribe(session => {
        if (session) {
          this.tracking.trackCardMessage(this.currentCard, session.objectId);
        }
      });

    });
  }

  private goToChat(uid: string, chatId?: string) {
    if (this.breakpointObserver.isMatched('(max-width: 960px)')) {
      this.router.navigate(['/chat/' + uid + '/' + this.currentCard.objectId]);
    } else if (chatId) {
      this.router.navigate(['/chat/overview/' + chatId]);
    }
  }

  private createChat() {
    const newChat: Chat = {
      messages: [],
      partner1: {
        uid: this.currentUser.id,
        firstName: this.currentUser.attributes.firstName,
        lastName: this.currentUser.attributes.lastName
      },
      partner2:
      {
        uid: this.currentCard.uid,
        firstName: this.currentCard.userFirstName,
        lastName: this.currentCard.userLastName
      },
      chatpartners: [this.currentUser.id, this.currentCard.uid],
      projectId: this.currentCard.objectId,
      subject: this.currentCard.title
    };
    console.log('New chat to create: ', newChat);
    this.store.dispatch(new fromChat.CreateChat(newChat));
  }

}
