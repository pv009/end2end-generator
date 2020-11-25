import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Chat, ChatLogo } from 'src/app/chat/model/chat.model';
import { ChatState } from 'src/app/chat/state/chats.state';
import * as fromCard from '../../../../cards/state/cards.actions';
import * as fromChat from '../../../../chat/state/chats.actions';

@Component({
  selector: 'app-other-chats',
  templateUrl: './other-chats.component.html',
  styleUrls: ['./other-chats.component.scss']
})
export class OtherChatsComponent implements OnInit {
  @Select(ChatState.openedChats) openedChats$: Observable<Chat[]>;
  @Select(ChatState.chatLogos) chatLogos$: Observable<ChatLogo[]>;
  @Select(ChatState.getChat) selectedChat$: Observable<Chat>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;

  currentUser: User;

  constructor(
    private bottomSheetRef: MatBottomSheetRef<OtherChatsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private store: Store,
    public router: Router
  ) { }

  ngOnInit() {
    console.log(this.data.bars);
    this.currentUser$.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
    });
  }

  openChat(chat: Chat, i: number) {
    this.store.dispatch(new fromChat.LeaveChat());

    this.openedChats$.pipe(take(1)).subscribe(chats => {
      const newChats = Object.assign([], chats);
      [newChats[0], newChats[i]] = [newChats[i], newChats[0]];
      this.store.dispatch(new fromChat.UpdateOpenedChats(newChats));
      if (chat.partner1.uid !== this.currentUser.id) {
        this.selectChat(chat.partner1.uid, this.currentUser.id, chat.projectId);
      } else if (chat.partner2.uid !== this.currentUser.id) {
        this.selectChat(chat.partner2.uid, this.currentUser.id, chat.projectId);
      }
    });

    this.bottomSheetRef.dismiss();
  }

  private selectChat(uid1: string, uid2: string, projectId: string) {
    this.store.dispatch(new fromChat.FindChat(uid1, uid2, projectId));
    this.store.dispatch(new fromCard.LoadCard(projectId));
  }

}
