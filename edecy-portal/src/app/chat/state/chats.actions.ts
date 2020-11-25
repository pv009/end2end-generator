import { Chat, ChatLogo, ChatMessage } from '../model/chat.model';

export class CreateChat {
    static readonly type = '[CHAT] Creating Chat';
    constructor(public readonly payload: Chat) {}
}

export class LoadChat {
    static readonly type = '[CHAT] Loading Chat';
    constructor(public readonly chatId: string) {}
}

export class FindChat {
    static readonly type = '[CHAT] Searching Chat';
    constructor(public readonly uid1: string, public readonly uid2: string, public readonly projectid: string) {}
}

export class LoadChatSuccessfull {
    static readonly type = '[CHAT] Loaded Chat successfully';
    constructor(public readonly payload: Chat) {}
}

export class LoadChatFailed {
    static readonly type = '[CHAT] Loading Chat failed';
    constructor(public readonly payload?: any) {}
}

export class LeaveChat {
    static readonly type = '[CHAT] Leaving Chat';
    constructor() {}
}

export class UpdateChat {
    static readonly type = '[CHAT] Updating chat';
    constructor(public readonly chatId: string) {}
}

export class WriteMessage {
    static readonly type = '[CHAT] Writing Message';
    constructor(public readonly message: ChatMessage, public readonly chat: Chat) {}
}

export class LoadUserChats {
    static readonly type = '[CHAT] Loading User Chats';
    constructor(public readonly uid: string) {}
}

export class LoadUserChatsSuccessfull {
    static readonly type = '[CHAT] Loaded User Chats successfully';
    constructor(public readonly payload: Array<Chat>) {}
}

export class LoadUserChatsFailed {
    static readonly type = '[CHAT] Loading User Chats failed';
    constructor(public readonly payload?: any) {}
}

export class SearchUserChats {
    static readonly type = '[CHAT] Searching User Chats';
    constructor(public readonly keyword: string, public readonly uid: string) {}
}

export class UnreadMessages {
    static readonly type = '[CHAT] Setting unread messages';
    constructor(public readonly count: number) {}
}

export class MarkAsRead {
    static readonly type = '[CHAT] Marking chat as read';
    constructor(public readonly payload: Chat, public readonly count: number) {}
}

export class UnsubscribeChat {
    static readonly type = '[CHAT] Unsubscribing from Chat';
    constructor(public readonly id: string) {}
}

export class SubscribeChat {
    static readonly type = '[CHAT] Subscribing to Chat';
    constructor(public readonly id: string) {}
}

export class GetLogos {
    static readonly type = '[CHAT] Fetching Logos';
    constructor(public readonly projectIds: Array<string>) {}
}

export class GetLogosSuccessfull {
    static readonly type = '[CHAT] Fetched Logos successfully';
    constructor(public readonly payload: Array<ChatLogo>) {}
}

export class GetLogosFailed {
    static readonly type = '[CHAT] Fetching Logos Failed';
    constructor(public readonly payload?: any) {}
}

export class ShowChatBar {
    static readonly type = '[CHAT] Showing Chatbar';
}

export class HideChatBar {
    static readonly type = '[CHAT] Hiding Chatbar';
}

export class UpdateOpenedChats {
    static readonly type = '[CHAT] Updating opened Chats';
    constructor(public readonly payload: Array<Chat>) {}
}

export type ChatActions =
| CreateChat
| LoadChat
| FindChat
| UpdateChat
| LeaveChat
| LoadChatSuccessfull
| LoadChatFailed
| LoadUserChats
| LoadChatSuccessfull
| LoadUserChatsFailed
| SearchUserChats
| UnreadMessages
| UnsubscribeChat
| SubscribeChat
| GetLogos
| GetLogosFailed
| GetLogosSuccessfull
| ShowChatBar
| HideChatBar
| UpdateOpenedChats;
