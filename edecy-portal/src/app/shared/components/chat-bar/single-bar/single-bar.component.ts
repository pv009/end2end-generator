import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import * as moment from 'moment';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Card } from 'src/app/cards/model/card.model';
import { CardsState } from 'src/app/cards/state/cards.state';
import { Chat, ChatLogo, ChatMessage } from 'src/app/chat/model/chat.model';
import { ChatState } from 'src/app/chat/state/chats.state';
import * as fromChat from '../../../../chat/state/chats.actions';

@Component({
  selector: 'app-single-bar',
  templateUrl: './single-bar.component.html',
  styleUrls: ['./single-bar.component.scss']
})
export class SingleBarComponent implements OnInit, OnDestroy {
  @Select(ChatState.chatLogos) chatLogos$: Observable<ChatLogo[]>;
  @Select(ChatState.openedChats) openedChats$: Observable<Chat[]>;
  @Select(ChatState.getChat) activeChat$: Observable<Chat>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Input() opened = false;
  @Input() openedChat: Chat;
  @Select(ChatState.isLoaded) chatLoaded$: Observable<boolean>;
  @Select(CardsState.getSelectedCard) selectedCard$: Observable<Card>;

  private destroy$: Subject<void> = new Subject<void>();

  currentWidth = 350;
  topBarMargin = 0;

  messageForm: FormGroup;
  markedAsRead = false;

  currentUser: User;
  currentChat: Chat;

  screenHeight: number;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    public router: Router
  ) { }

  ngOnInit() {
    this.onResize();
    console.log('DIsplaying chat: ', this.openedChat);
    this.activeChat$.pipe(takeUntil(this.destroy$)).subscribe(chat => {
      if (chat) {
        if (chat.objectId === this.openedChat.objectId) {
          this.opened = true;
          this.currentWidth = 500;
          this.topBarMargin = 0;
        } else {
          this.opened = false;
          this.currentWidth = 350;
          this.topBarMargin = (this.screenHeight / 2 - 178 + 130);
        }
      }
    });

    this.currentUser$.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
    this.activeChat$.pipe(takeUntil(this.destroy$)).subscribe(chat => {
      this.chatLoaded$.pipe(takeUntil(this.destroy$)).subscribe(loaded => {
        if (chat && loaded) {
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
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenHeight = window.innerHeight;
    console.log('New height: ', this.screenHeight);
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

  toggleChat() {
    this.activeChat$.pipe(take(1)).subscribe(chat => {
      if (chat && !this.opened) {
        this.store.dispatch(new fromChat.LeaveChat());
        this.topBarMargin = 0;
      } else if (chat && this.opened) {
        this.topBarMargin = (this.screenHeight / 2 - 178 + 130);
      }
    });

    if (!this.opened) {
      this.store.dispatch(new fromChat.LoadChatSuccessfull(this.openedChat));
      this.opened = true;
      this.currentWidth = 500;
    } else {
      this.store.dispatch(new fromChat.LeaveChat());
      this.opened = false;
      this.currentWidth = 350;
    }
  }

  closeChat() {
    this.openedChats$.pipe(take(1)).subscribe(chats => {
      const newChats: Chat[] = Object.assign([], chats);
      newChats.forEach((chat, index) => {
        if (chat.objectId === this.openedChat.objectId) {
          newChats.splice(index, 1);
        }
      });
      this.store.dispatch(new fromChat.UpdateOpenedChats(newChats));
    });
    this.store.dispatch(new fromChat.LeaveChat());
  }

  sendMessage() {
    const newMessage: ChatMessage = {
      authorId: this.currentUser.id,
      email: this.currentUser.attributes.email,
      message: this.messageForm.value.message,
      read: false,
      time: moment().locale('de').format('LT'),
      date: moment().locale('de').format('LL')
    };
    this.store.dispatch(new fromChat.WriteMessage(newMessage, this.currentChat));
    this.messageForm.patchValue({
      message: ''
    });
  }

}
