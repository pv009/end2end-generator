import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { CardsService } from 'src/app/cards/service/cards.service';
import { Chat, ChatStateModel } from '../model/chat.model';
import { ChatService } from '../service/chat.service';
import * as chatActions from './chats.actions';

const chatStateDefaults: ChatStateModel = {
    loaded: false,
    loading: false,
    selectedChat: null,
    userChats: [],
    currentPartner: null,
    activeChat: null,
    unreadMessages: 0,
    chatLogos: [],
    openedChats: [],
    chatBarOpened: false
};
@Injectable({
    providedIn: 'root'
})
@State<ChatStateModel>({
    name: 'chatState',
    defaults: chatStateDefaults
})
export class ChatState {
    constructor(
        private chatService: ChatService,
        private cardService: CardsService,
        private breakpointObserver: BreakpointObserver,
        private router: Router
    ) { }

    @Selector()
    static isLoading(state: ChatStateModel) {
        return state.loading;
    }

    @Selector()
    static isLoaded(state: ChatStateModel) {
        return state.loaded;
    }

    @Selector()
    static getChat(state: ChatStateModel) {
        return state.selectedChat;
    }

    @Selector()
    static getUserChats(state: ChatStateModel) {
        return state.userChats;
    }

    @Selector()
    static getChatPartner(state: ChatStateModel) {
        return state.currentPartner;
    }

    @Selector()
    static activeChat(state: ChatStateModel) {
        return state.activeChat;
    }

    @Selector()
    static unreadMessages(state: ChatStateModel) {
        return state.unreadMessages;
    }

    @Selector()
    static chatLogos(state: ChatStateModel) {
        return state.chatLogos;
    }

    @Selector()
    static chatBarOpened(state: ChatStateModel) {
        return state.chatBarOpened;
    }

    @Selector()
    static openedChats(state: ChatStateModel) {
        return state.openedChats;
    }


    @Action(chatActions.LoadChatSuccessfull)
    loadChatSuccessfull(
        ctx: StateContext<ChatStateModel>,
        { payload }: chatActions.LoadChatSuccessfull
    ) {
        ctx.patchState({
            loaded: true,
            loading: false,
            selectedChat: payload,
        });
        if (ctx.getState().activeChat === null) {
            ctx.dispatch(new chatActions.SubscribeChat(payload.objectId));
        }
    }

    @Action(chatActions.SubscribeChat)
    subscribeChat(
        ctx: StateContext<ChatStateModel>,
        { id }: chatActions.SubscribeChat
    ) {
        this.chatService.activeChat(id)
            .then((subscription: Parse.LiveQuerySubscription) => {
                ctx.patchState({
                    activeChat: subscription
                });
            })
            .catch(error => {
                console.error('Error subscribing to chat: ', error);
                ctx.patchState({
                    activeChat: null
                });
            });
    }

    @Action(chatActions.LoadChatFailed)
    loadChatFailed(
        ctx: StateContext<ChatStateModel>
    ) {
        ctx.patchState({
            loaded: false,
            loading: false,
            selectedChat: null
        });
    }

    @Action(chatActions.CreateChat)
    createChat(
        ctx: StateContext<ChatStateModel>,
        { payload }: chatActions.CreateChat
    ) {
        ctx.patchState({ loading: true });
        this.chatService.createChat(payload)
            .then((result: any) => {
                const createdChat: Chat = {
                    ...result.toJSON()
                };
                ctx.dispatch(new chatActions.LoadChatSuccessfull(createdChat));

                if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
                    this.router.navigate(['/chat/overview/' + createdChat.objectId]);
                }
            })
            .catch(error => {
                console.error('Error creating chat: ', error);
                ctx.dispatch(new chatActions.LoadChatFailed());
            });
    }

    @Action(chatActions.LoadChat)
    loadChat(
        ctx: StateContext<ChatStateModel>,
        { chatId }: chatActions.LoadChat
    ) {
        ctx.patchState({
            loading: true,
            loaded: false
        });
        this.chatService.loadChat(chatId)
            .then((result: any) => {
                const loadedChat = result.toJSON();
                ctx.dispatch(new chatActions.LoadChatSuccessfull(loadedChat));
            })
            .catch(error => {
                console.error('Error loading Chat: ', error);
                ctx.dispatch(new chatActions.LoadChatFailed());
            });
    }

    @Action(chatActions.FindChat)
    findChat(
        ctx: StateContext<ChatStateModel>,
        { uid1, uid2, projectid }: chatActions.FindChat,
    ) {
        ctx.patchState({
            loading: true,
            loaded: false
        });
        this.chatService.findChat(uid1, uid2, projectid)
            .then((result: any) => {
                if (result.length > 0) {
                    const loadedChat = result[0].toJSON();
                    ctx.dispatch(new chatActions.LoadChatSuccessfull(loadedChat));
                } else {
                    console.error('No chat found');
                    ctx.dispatch(new chatActions.LoadChatFailed());
                }

            })
            .catch(error => {
                console.error('Error finding Chat: ', error);
                ctx.dispatch(new chatActions.LoadChatFailed());
            });
    }

    @Action(chatActions.UpdateChat)
    updateChat(
        ctx: StateContext<ChatStateModel>,
        { chatId }: chatActions.UpdateChat
    ) {
        ctx.dispatch(new chatActions.LoadChat(chatId));
    }

    @Action(chatActions.WriteMessage)
    writeMessage(
        ctx: StateContext<ChatStateModel>,
        { message, chat }: chatActions.WriteMessage,
    ) {
        let receiverID = '';
        let authorName = '';
        const chatMessage = message.message.slice(0, 50) + '...';

        if (message.authorId === chat.partner1.uid) {
            receiverID = chat.partner2.uid;
            authorName = chat.partner1.firstName + ' ' + chat.partner1.lastName;
        } else {
            receiverID = chat.partner1.uid;
            authorName = chat.partner2.firstName + ' ' + chat.partner2.lastName;
        }


        this.chatService.writeMessage(message, chat.objectId);
        this.chatService.sendNotification(receiverID, authorName, chatMessage);

        setTimeout(() => {
            if (receiverID === 'p1AhzPcK6s' || receiverID === 'nP47dNplqR') {
                this.chatService.writeBotMessage(authorName, chat.projectId, chat.subject, chat.objectId, message.message);
            }
        }, 5000);

    }

    @Action(chatActions.LeaveChat)
    leaveChat(
        ctx: StateContext<ChatStateModel>,
    ) {
        ctx.getState().activeChat.unsubscribe();
        ctx.patchState({
            selectedChat: null,
            activeChat: null
        });
    }

    @Action(chatActions.LoadUserChatsSuccessfull)
    loadUserChatsSuccessfull(
        ctx: StateContext<ChatStateModel>,
        { payload }: chatActions.LoadUserChatsSuccessfull
    ) {
        ctx.patchState({
            loaded: true,
            loading: false,
            userChats: payload
        });
    }

    @Action(chatActions.LoadUserChatsFailed)
    loadUserChatsFailed(
        ctx: StateContext<ChatStateModel>,
    ) {
        ctx.patchState({
            loaded: false,
            loading: false,
            userChats: []
        });
    }

    @Action(chatActions.LoadUserChats)
    loadUserChats(
        ctx: StateContext<ChatStateModel>,
        { uid }: chatActions.LoadUserChats
    ) {
        ctx.patchState({
            loaded: false,
            loading: true
        });

        this.chatService.loadUserChats(uid)
            .then((results: any) => {
                const loadedChats: Array<Chat> = [];
                for (const chat of results) {
                    loadedChats.push(chat.toJSON());
                }
                console.log('Found user chats: ', loadedChats);
                ctx.dispatch(
                    new chatActions.LoadUserChatsSuccessfull(loadedChats)
                );
            })
            .catch(error => {
                console.error('Error loading user chats: ', error.message);
                ctx.dispatch(
                    new chatActions.LoadUserChatsFailed()
                );
            });
    }

    @Action(chatActions.SearchUserChats)
    searchUserChats(
        ctx: StateContext<ChatStateModel>,
        { keyword, uid }: chatActions.SearchUserChats,
    ) {
        ctx.patchState({
            loading: true,
            loaded: false
        });

        this.chatService.searchUserChats(keyword, uid)
            .then((results: any) => {
                const searchResults: Array<Chat> = [];
                for (const chat of results) {
                    searchResults.push(chat.toJSON());
                }
                console.log('Found chats: ', searchResults);

                ctx.dispatch(new chatActions.LoadUserChatsSuccessfull(searchResults));
            })
            .catch(error => {
                console.error('Error searching chats: ', error);
            });
    }

    @Action(chatActions.MarkAsRead)
    markAsRead(
        ctx: StateContext<ChatStateModel>,
        { payload, count }: chatActions.MarkAsRead
    ) {
        const newCount = ctx.getState().unreadMessages - count;
        ctx.patchState({
            loading: true,
            unreadMessages: newCount
        });
        this.chatService.updateChat(payload);
    }

    @Action(chatActions.UnreadMessages)
    unreadMessages(
        ctx: StateContext<ChatStateModel>,
        { count }: chatActions.UnreadMessages
    ) {
        ctx.patchState({
            unreadMessages: count
        });
    }

    @Action(chatActions.GetLogosSuccessfull)
    getLogosSuccessfull(
        ctx: StateContext<ChatStateModel>,
        { payload }: chatActions.GetLogosSuccessfull
    ) {
        ctx.patchState({
            loading: false,
            loaded: true,
            chatLogos: payload
        });
    }

    @Action(chatActions.GetLogosFailed)
    getLogosFailed(
        ctx: StateContext<ChatStateModel>,
    ) {
        ctx.patchState({
            loaded: false,
            loading: false,
            chatLogos: []
        });
    }

    @Action(chatActions.GetLogos)
    getLogos(
        ctx: StateContext<ChatStateModel>,
        { projectIds }: chatActions.GetLogos
    ) {
        ctx.patchState({
            loading: true
        });
        this.chatService.getLogos(projectIds)
            .then(result => {
                console.log('got logos: ', result);
                ctx.dispatch(new chatActions.GetLogosSuccessfull(result));
            })
            .catch(error => {
                console.error('Error fetching logos: ', error);
                ctx.dispatch(new chatActions.GetLogosFailed());
            });
    }

    @Action(chatActions.ShowChatBar)
    showChatBar(
        ctx: StateContext<ChatStateModel>
    ) {
        ctx.patchState({
            chatBarOpened: true
        });
    }

    @Action(chatActions.HideChatBar)
    hideChatBar(
        ctx: StateContext<ChatStateModel>
    ) {
        ctx.patchState({
            chatBarOpened: false
        });
    }

    @Action(chatActions.UpdateOpenedChats)
    updateOpenedChats(
        ctx: StateContext<ChatStateModel>,
        { payload }: chatActions.UpdateOpenedChats
    ) {
        ctx.patchState({
            openedChats: payload
        });
    }
}

