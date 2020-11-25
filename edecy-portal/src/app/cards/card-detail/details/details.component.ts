import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { Lightbox } from 'ngx-lightbox';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import * as fromCards from 'src/app/cards/state/cards.actions';
import { Chat } from 'src/app/chat/model/chat.model';
import { ChatState } from 'src/app/chat/state/chats.state';
import { FeedbackComponent } from 'src/app/contact-edecy/feedback/feedback.component';
import { IconServiceService } from 'src/app/icon-service/icon-service.service';
import { Profile } from 'src/app/profile/model/profile.model';
import * as fromProfile from 'src/app/profile/state/profile.actions';
import { ProfileState } from 'src/app/profile/state/profile.state';
import { Tracking } from 'src/app/shared/model/tracking.model';
import { TrackingService } from 'src/app/shared/services/tracking.service';
import { TrackingState } from 'src/app/shared/state/tracking.state';
import * as fromChat from '../../../chat/state/chats.actions';
import { Card } from '../../model/card.model';
import { CardsState } from '../../state/cards.state';


export interface DialogData {
  inDialog: boolean;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  @Input() cardToDisplay: Card;
  @Input() preview = false;
  @Select(AuthState.getUser) user$: Observable<User>;
  @Select(ProfileState.getSelectedProfile) selectedProfile$: Observable<Profile>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(CardsState.getSelectedCard) selectedCard$: Observable<Card>;
  @Select(ChatState.getChat) selectedChat$: Observable<Chat>;
  @Select(TrackingState.getSession) currentSession$: Observable<Tracking>;
  @Select(CardsState.tabShown) tabShown$: Observable<string>;

  creationTime: string;

  private albums: Array<{ src: string, caption: string, thumb: string }> = [];

  currentCard: Card;
  currentUser: User;

  private destroy$: Subject<void> = new Subject<void>();

  searchingFor: Array<string> = [
    'Kooperation',
    'Partner',
    'KMU'
  ]; // TODO: Implement me correctly


  constructor(
    private lightbox: Lightbox,
    private dialog: MatDialog,
    private router: Router,
    private store: Store,
    @Inject('isBrowser') public isBrowser: boolean,
    private breakpointObserver: BreakpointObserver,
    private tracking: TrackingService,
    private iconService: IconServiceService
  ) { }

  ngOnInit() {
    this.iconService.registerIcons();
    console.log('CARD TO DISPLAY', this.cardToDisplay);
    this.creationTime = moment(this.cardToDisplay.createdAt).locale('de').format('LL');

    this.store.dispatch(new fromProfile.GetProfileByUser(this.cardToDisplay.uid));

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(new fromCards.ClearSelectedCard());
  }



  openImage(url: string) {
    const src = url;
    const caption = '';
    const thumb = '';
    const userImage = {
      src,
      caption,
      thumb
    };
    this.albums = [userImage];
    this.lightbox.open(this.albums);
  }

  openFeedbackDialog() {
    console.log('Open Feedback');
    this.dialog.open(FeedbackComponent, {
      minHeight: '480px',
      maxWidth: '420px',
      data: { inDialog: true }
    });
  }
  addFavorite() {
    // TODO: Implement me!
  }

  startChat() {
    this.selectedChat$.pipe(take(1)).subscribe(chat => {
      if (chat) {
        this.goToChat(this.currentCard.uid, chat.objectId);
      } else {
        this.createChat();
        this.goToChat(this.currentCard.uid);
      }
    });
    this.currentSession$.pipe(take(1)).subscribe(session => {
      if (session) {
        this.tracking.trackCardMessage(this.currentCard, session.objectId);
      }
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

  showFavorite() {
    // TODO: Implement me!
  }

  searchTag(tag: string) {
    // const keyword: string[] = [tag];
    // this.store.dispatch(new fromCards.AddKeywords([tag]));
    this.tabShown$.pipe(take(1)).subscribe(tab => {
      if (tab === 'request') {
        this.store.dispatch(new fromCards.SearchRequests(tag));
      }
    });
  }


}
