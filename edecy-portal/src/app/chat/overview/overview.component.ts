import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { UpdateProfileComponent } from 'src/app/auth/update-profile/update-profile.component';
import { Card } from 'src/app/cards/model/card.model';
import { CardsState } from 'src/app/cards/state/cards.state';
import * as fromCard from '../../cards/state/cards.actions';
import { Chat, ChatLogo } from '../model/chat.model';
import { ChatService } from '../service/chat.service';
import * as fromChat from '../state/chats.actions';
import { ChatState } from '../state/chats.state';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(ChatState.getUserChats) userChats$: Observable<Chat[]>;
  @Select(ChatState.isLoaded) chatsLoaded$: Observable<boolean>;
  @Select(CardsState.getRequests) requests$: Observable<Card[]>;
  @Select(ChatState.chatLogos) chatLogos$: Observable<ChatLogo[]>;
  @Select(ChatState.getChat) selectedChat$: Observable<Chat>;

  currentPage = 'Postfach';

  searchForm: FormGroup;
  searched = false;

  selectedChat: Chat;

  currentUser: User;

  destroy$: Subject<boolean> = new Subject<boolean>();

  chatSelected = false;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private chatService: ChatService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) { }



  ngOnInit() {
    this.buildSearchForm();
    this.currentUser$.pipe(take(1)).subscribe(user => {
      this.currentUser = user;
      this.store.dispatch(new fromChat.LoadUserChats(user.id));
    });
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.fetchLogos();
    }

    this.openChatFromURL();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private openChatFromURL() {
    this.route.params.pipe(take(1)).subscribe(params => {
      console.log('ROUTE PARAMS', params);
      if (params.id && params.id !== '') {
        this.userChats$.pipe((takeUntil(this.destroy$))).subscribe(chats => {
          if (chats.length > 0) {
            chats.forEach(chat => {
              if (chat.objectId === params.id) {
                this.openChat(chat);
              }
            });
          }
        });
      }
    });
  }

  private fetchLogos() {
    this.userChats$.pipe(takeUntil(this.destroy$)).subscribe(chats => {
      if (chats && chats.length > 0) {
        const projectIds: Array<string> = [];
        chats.forEach(chat => {
          projectIds.push(chat.projectId);
        });
        this.store.dispatch(new fromChat.GetLogos(projectIds));
      }
    });
  }

  buildSearchForm() {
    this.searchForm = this.fb.group({
      keyword: ''
    });
  }

  submitSearch() {
    this.store.dispatch(new fromChat.SearchUserChats(this.searchForm.value.keyword, this.currentUser.id));
    this.searched = true;
  }

  clearSearch() {
    if (this.searched) {
      this.store.dispatch(new fromChat.LoadUserChats(this.currentUser.id));
      this.searchForm.patchValue({
        keyword: ''
      });
      this.searched = false;
    } else {
      this.searchForm.patchValue({
        keyword: ''
      });
    }
  }

  openChat(chat: Chat) {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.selectedChat$.pipe(take(1)).subscribe(currentChat => {
        if (currentChat) {
          this.store.dispatch(new fromChat.LeaveChat());
        }
      });
    }
    if (chat.partner1.uid !== this.currentUser.id) {
      if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
        this.selectChat(chat.partner1.uid, this.currentUser.id, chat.projectId);
      } else {
        this.router.navigate(['/chat/' + chat.partner1.uid + '/' + chat.projectId]);
      }
    } else if (chat.partner2.uid !== this.currentUser.id) {
      if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
        this.selectChat(chat.partner2.uid, this.currentUser.id, chat.projectId);
      } else {
        this.router.navigate(['/chat/' + chat.partner2.uid + '/' + chat.projectId]);
      }
    }
  }

  private selectChat(uid1: string, uid2: string, projectId: string) {
    this.store.dispatch(new fromChat.FindChat(uid1, uid2, projectId));
    this.store.dispatch(new fromCard.LoadCard(projectId));
    this.chatSelected = true;
  }

  editProfile() {
    this.dialog.open(UpdateProfileComponent, {
      minHeight: '800px',
      minWidth: '600px',
      disableClose: true,
      data: { desktopDialog: true }
    });
  }
}


