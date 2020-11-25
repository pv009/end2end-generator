import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Chat } from 'src/app/chat/model/chat.model';
import { ChatState } from 'src/app/chat/state/chats.state';
import { Tracking } from 'src/app/shared/model/tracking.model';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { TrackingService } from 'src/app/shared/services/tracking.service';
import { TrackingState } from 'src/app/shared/state/tracking.state';
import { environment } from 'src/environments/environment';
import { EdecyDescription, EdecyTitle } from '../../../textstrings/strings';
import * as fromChat from '../../chat/state/chats.actions';
import { Card } from '../model/card.model';
import * as fromCards from '../state/cards.actions';
import { CardsState } from '../state/cards.state';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit, OnDestroy {
  @Select(CardsState.getSelectedCard) selectedCard$: Observable<Card>;
  @Select(AuthState.getUser) selectedUser$: Observable<User>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(ChatState.getChat) selectedChat$: Observable<Chat>;
  @Select(CardsState.isLoading) isLoading$: Observable<boolean>;
  @Output() returnToAllCardsView = new EventEmitter<boolean>();
  @Input() categoryToShow: string;
  @Select(AuthState.getUser) user$: Observable<User>;
  @Select(TrackingState.getSession) currentSession$: Observable<Tracking>;

  private destroy$: Subject<void> = new Subject<void>();

  currentCard: Card;
  currentUser: User;


  currentPage = 'Detailansicht';
  projectChat: Chat;

  showFavorite = environment.features.favorites;

  loggedIn = true; // TODO: Implement me right!

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    public dialog: MatDialog,
    private titleService: Title,
    private metaService: Meta,
    private matomoHelper: MatomoHelperService,
    private tracking: TrackingService
  ) { }

  ngOnInit() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.store.dispatch(new fromCards.LoadCard(params.id));
    });
    let userOfCard: string;
    this.selectedCard$.pipe(takeUntil(this.destroy$)).subscribe(card => {
      if (card) {
        this.currentCard = card;
        userOfCard = card.uid;
        this.setMetaTags(card);
        this.currentUser$.pipe(take(1)).subscribe(user => {
          if (user) {
            this.currentUser = user;
            this.store.dispatch(new fromChat.FindChat(user.id, card.uid, card.objectId));
          }
        });
        this.matomoHelper.trackPageView('Request | ' + card.title);

        this.currentSession$.pipe(take(1)).subscribe(session => {
          if (session) {
            this.tracking.trackClickedCard(card, session.objectId);
          }
        });
      }
    });
  }

  deleteHTMLFromString(htmlString: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlString;
    return tmp.textContent || tmp.innerText || '';
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.removeMetaTags();
  }

  private setMetaTags(card: Card) {
    // General
    this.titleService.setTitle(card.title);
    this.metaService.updateTag({ name: 'description', content: this.deleteHTMLFromString(card.description) });
    this.metaService.updateTag({ name: 'title', content: card.title });

    // Facebook, LinkedIn, WhatsApp...
    this.metaService.addTag({ property: 'og:image', itemprop: 'image', content: card.pictureURL });
    this.metaService.addTag({ property: 'og:type', content: 'website' });
    this.metaService.addTag({ property: 'og:title', content: card.title });
    this.metaService.addTag({ property: 'og:description', content: this.deleteHTMLFromString(card.description) });
    this.metaService.addTag({ property: 'og:url', content: 'https://portal.edecy.de/cards/' + card.objectId });

    // Twitter
    this.metaService.addTag({ property: 'twitter:image', content: card.pictureURL });
    this.metaService.addTag({ property: 'twitter:card', content: 'summary_large_image' });
    this.metaService.addTag({ property: 'twitter:title', content: card.title });
    this.metaService.addTag({ property: 'twitter:description', content: this.deleteHTMLFromString(card.description) });
    this.metaService.addTag({ property: 'twitter:url', content: 'https://portal.edecy.de/cards/' + card.objectId });
  }

  private removeMetaTags() {
    // General
    this.titleService.setTitle(EdecyTitle);
    this.metaService.updateTag({ name: 'description', content: EdecyDescription });

    // Facebook, LinkedIn, WhatsApp...
    this.metaService.removeTag('property="og:title"');
    this.metaService.removeTag('property="og:description"');
    this.metaService.removeTag('property="og:image"');
    this.metaService.removeTag('property="og:url"');

    // Twitter
    this.metaService.removeTag('property="twitter:title"');
    this.metaService.removeTag('property="twitter:description"');
    this.metaService.removeTag('property="twitter:image"');
    this.metaService.removeTag('property="twitter:url"');
  }

  addFavorite() {
    // TODO: Implement me
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

  private goToChat(uid: string) {
    this.matomoHelper.trackEvent('Navigation', 'GoTo', 'Chat' + this.currentCard.title);
    this.router.navigate(['/chat/' + uid + '/' + this.currentCard.objectId]);
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
