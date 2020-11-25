import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewChecked, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import * as Parse from 'parse';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { environment } from 'src/environments/environment';
import { Card } from '../../cards/model/card.model';
import * as fromCard from '../../cards/state/cards.actions';
import { CardsState } from '../../cards/state/cards.state';
import { Chat, ChatMessage } from '../model/chat.model';
import { ChatService } from '../service/chat.service';
import * as fromChat from '../state/chats.actions';
import { ChatState } from '../state/chats.state';


@Component({
  selector: 'app-singlechat',
  templateUrl: './singlechat.component.html',
  styleUrls: ['./singlechat.component.scss']
})
export class SinglechatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Select(ChatState.getChat) chatFromState$: Observable<Chat>;
  @Select(CardsState.getSelectedCard) selectedCard$: Observable<Card>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(ChatState.activeChat) activeChat$: Observable<Parse.LiveQuerySubscription>;
  @Select(ChatState.isLoaded) chatLoaded$: Observable<boolean>;
  @Input() selectedChat$: Observable<Chat>;

  messagesDiv: HTMLElement;

  currentActiveFroala: any;

  private destroy$: Subject<void> = new Subject<void>();

  currentPage = 'Chat';

  messageForm: FormGroup;

  currentUser: User;
  currentChat: Chat;

  subscriptionStarted = false;
  markedAsRead = false;

  // Editor Options

  public froalaOptions = {
    key: environment.froala.key,
    placeholderText: 'Ihre Nachricht...',
    height: 0,
    width: 'auto',
    quickInsertEnabled: false,
    language: 'de',
    attribution: false,
    toolbarButtons: {
      moreText: {
        buttons: ['bold', 'italic', 'underline'],
        buttonsVisible: 5
      },
      moreParagraph: {
        buttons: [,
          'formatOL', 'formatUL'],
        buttonsVisible: 5
      },
      moreRich: {
        buttons: ['specialCharacters']
      },
    },
    toolbarButtonsXS: {
      moreText: {
        buttons: ['bold', 'italic', 'underline'],
        buttonsVisible: 5
      },
      moreParagraph: {
        buttons: [,
          'formatOL', 'formatUL'],
        buttonsVisible: 5
      },
    },
    paragraphFormat: {
      H2: 'Überschrift 1',
      H3: 'Überschrift 2',
      N: 'Absatz'
    },
    pastePlain: true,
    imagePaste: false
  };
  froalaHeight = 0;
  editor: any;

  messageTyped = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private fb: FormBuilder,
    private chatService: ChatService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngAfterViewChecked() {
    this.messagesDiv = document.getElementById('messages');
    this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight;
  }

  ngOnInit() {
    this.onResize();
    this.selectedChat$ = this.chatFromState$;
    this.currentUser$.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });


    if (this.breakpointObserver.isMatched('(max-width: 959px)')) {
      this.route.params.pipe(take(1)).subscribe(params => {
        this.currentUser$.pipe(take(1)).subscribe(user => {
          this.store.dispatch(new fromChat.FindChat(params.uid, user.id, params.projectid));
        });
      });
    }

    this.chatFromState$.pipe(takeUntil(this.destroy$)).subscribe(chat => {
      this.chatLoaded$.pipe(takeUntil(this.destroy$)).subscribe(loaded => {
        if (chat && loaded) {
          if (this.breakpointObserver.isMatched('(max-width: 959px)')) {
            this.store.dispatch(new fromCard.LoadCard(chat.projectId));
          }
          this.currentChat = chat;
          if (!this.markedAsRead) {
            this.markAsRead(chat);
          }
        }
      });
    });

    this.buildMessageForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(new fromChat.LeaveChat());
  }

  private buildMessageForm() {
    this.messageForm = this.fb.group({
      message: ['', Validators.minLength(1)]
    });
  }

  markAsRead(chat: Chat) {
    let readMessages = 0;
    const updatedChat = Object.assign({}, chat);
    const newMessages = [];
    for (const message of updatedChat.messages) {
      if (!message.read && message.authorId !== this.currentUser.id) {
        newMessages.push(Object.assign({}, message, {
          read: true
        }));
        readMessages++;
      } else {
        newMessages.push(message);
      }
    }
    updatedChat.messages = newMessages;
    this.store.dispatch(new fromChat.MarkAsRead(updatedChat, readMessages));
    this.markedAsRead = true;
  }

  sendMessage() {
    const newMessage: ChatMessage = {
      authorId: this.currentUser.id,
      email: this.currentUser.attributes.email,
      message: this.messageTyped,
      read: false,
      time: moment().locale('de').format('LT'),
      date: moment().locale('de').format('LL')
    };
    this.chatFromState$.pipe(take(1)).subscribe(chat => {
      this.store.dispatch(new fromChat.WriteMessage(newMessage, chat));
    });
    this.messageTyped = '';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.froalaHeight = ((window.innerHeight - 200) * this.calculateFlexfactor()) - 50;
    if (this.editor !== undefined) {
      this.updateFroala();
    }
  }

  initFroala(e) {
    this.froalaOptions.height = ((window.innerHeight - 200) * this.calculateFlexfactor()) - 50;
    e.initialize();
    this.editor = e;
  }

  updateFroala() {
    this.editor.destroy();
    this.froalaOptions.height = this.froalaHeight;
    console.log('Update froala size to: ', this.froalaHeight);
    this.editor.initialize();
  }

  calculateFlexfactor(): number {
    if (window.innerHeight >= 1280 || window.innerHeight < 960) {
      return 0.3;
    }
    return 0.5;
  }
}

