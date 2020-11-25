
import * as Parse from 'parse';
import { User } from 'parse';

export interface Chat {
    objectId?: string;
    partner1: ChatPartner;
    partner2: ChatPartner;
    chatpartners: Array<string>;
    messages: Array<ChatMessage>;
    createdAt?: string;
    updatedAt?: string;
    projectId?: string;
    subject?: string;
}

export interface ChatMessage {
    authorId: string;
    email?: string;
    message: string;
    read?: boolean;
    time: string;
    date: string;
}

export interface ChatPartner {
    uid: string;
    firstName?: string;
    lastName?: string;
}

export interface ChatStateModel {
    loading: boolean;
    loaded: boolean;
    selectedChat: Chat;
    userChats: Array<Chat>;
    currentPartner: User;
    activeChat: Parse.LiveQuerySubscription;
    unreadMessages: number;
    chatLogos: Array<ChatLogo>;
    chatBarOpened: boolean;
    openedChats: Array<Chat>;
}

export interface ChatLogo {
    projectId: string;
    logoURL: string;
}
