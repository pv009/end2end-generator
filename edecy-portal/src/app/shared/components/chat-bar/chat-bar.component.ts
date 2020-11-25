import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Chat, ChatLogo } from 'src/app/chat/model/chat.model';
import * as fromCard from '../../../cards/state/cards.actions';
import * as fromChat from '../../../chat/state/chats.actions';
import { ChatState } from '../../../chat/state/chats.state';

@Component({
  selector: 'app-chat-bar',
  templateUrl: './chat-bar.component.html',
  styleUrls: ['./chat-bar.component.scss']
})
export class ChatBarComponent implements OnInit {
  @Select(ChatState.chatBarOpened) barOpened$: Observable<boolean>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(ChatState.getUserChats) userChats$: Observable<Chat[]>;
  @Select(ChatState.chatLogos) chatLogos$: Observable<ChatLogo[]>;
  @Select(ChatState.openedChats) openedChats$: Observable<Chat[]>;
  @Select(ChatState.getChat) selectedChat$: Observable<Chat>;

  currentUser: User;
  constructor(
    private store: Store,
    public router: Router
  ) { }

  ngOnInit() {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      this.store.dispatch(new fromChat.LoadUserChats(user.id));
      this.currentUser = user;
    });
    this.fetchLogos();

  }

  private fetchLogos() {
    this.userChats$.subscribe(chats => {
      if (chats && chats.length > 0) {
        const projectIds: Array<string> = [];
        chats.forEach(chat => {
          projectIds.push(chat.projectId);
        });
        this.store.dispatch(new fromChat.GetLogos(projectIds));
      }
    });
  }

  toggleChat() {
    this.barOpened$.pipe(take(1)).subscribe(opened => {
      if (opened) {
        this.store.dispatch(new fromChat.HideChatBar());
      } else {
        this.store.dispatch(new fromChat.ShowChatBar());
      }
    });
  }

  openChat(chat: Chat) {
    this.openedChats$.pipe(take(1)).subscribe(chats => {
      const newChats = Object.assign([], chats);
      if (chats.indexOf(chat) < 0) {
        newChats.push(chat);
        this.store.dispatch(new fromChat.UpdateOpenedChats(newChats));
        if (chat.partner1.uid !== this.currentUser.id) {
          this.selectChat(chat.partner1.uid, this.currentUser.id, chat.projectId);
        } else if (chat.partner2.uid !== this.currentUser.id) {
          this.selectChat(chat.partner2.uid, this.currentUser.id, chat.projectId);
        }
      }
    });
    this.selectedChat$.pipe(take(1)).subscribe(currentChat => {
      if (currentChat && currentChat.objectId !== chat.objectId) {
        this.store.dispatch(new fromChat.LeaveChat());
      }
    });
  }

  private selectChat(uid1: string, uid2: string, projectId: string) {
    this.store.dispatch(new fromChat.FindChat(uid1, uid2, projectId));
    this.store.dispatch(new fromCard.LoadCard(projectId));
  }
}
