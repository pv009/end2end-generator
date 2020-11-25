import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import * as Parse from 'parse';
import { User } from 'parse';
import { AuthService } from 'src/app/auth/service/auth.service';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { environment } from 'src/environments/environment';
import { Chat, ChatLogo, ChatMessage } from '../model/chat.model';
import * as fromChat from '../state/chats.actions';

Parse.initialize(environment.parse.appID, environment.parse.masterKey);
(Parse as any).serverURL = environment.parse.serverURL;
(Parse as any).liveQueryServerURL = environment.parse.liveQueryServerURL;

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(
        private snackbar: MatSnackBar,
        private router: Router,
        private store: Store,
        private auth: AuthService,
        private matomoHelper: MatomoHelperService
    ) { }

    createChat(newChat: Chat, testing?: boolean): Promise<any> {
        const chat = Parse.Object.extend('Chats');
        const chatToCreate = new chat();

        if (testing === undefined) {
            return this.auth.loadUser(newChat.partner2.uid)
                .then((partnerUser: User) => {
                    const acl = new Parse.ACL();

                    const parseUserList = [Parse.User.current(), partnerUser];

                    parseUserList.forEach(user => {
                        acl.setReadAccess(user, true);
                        acl.setWriteAccess(user, true);
                    });

                    chatToCreate.setACL(acl);

                    return chatToCreate.save({
                        partner1: newChat.partner1,
                        partner2: newChat.partner2,
                        chatpartners: newChat.chatpartners,
                        messages: newChat.messages,
                        projectId: newChat.projectId,
                        subject: newChat.subject
                    });
                })
                .catch(error => {
                    console.error('Error loading partner: ', error);
                });
        } else {
            const acl = new Parse.ACL();
            acl.setPublicWriteAccess(true);
            acl.setPublicReadAccess(true);
            chatToCreate.setACL(acl);

            return chatToCreate.save({
                partner1: newChat.partner1,
                partner2: newChat.partner2,
                chatpartners: newChat.chatpartners,
                messages: newChat.messages,
                projectId: newChat.projectId,
                subject: newChat.subject
            });
        }

    }

    loadChat(chatId: string) {
        const query = new Parse.Query('Chats');
        return query.get(chatId);
    }

    findChat(uid1: string, uid2: string, projectId: string) {
        const query = new Parse.Query('Chats');
        query.containsAll('chatpartners', [uid1, uid2]);
        query.equalTo('projectId', projectId);
        return query.find();
    }

    writeMessage(message: ChatMessage, chatId: string, testing?: boolean) {
        const query = new Parse.Query('Chats');
        query.get(chatId)
            .then(chatToUpdate => {
                chatToUpdate.addUnique('messages', message);
                chatToUpdate.save();
            })
            .catch(error => {
                console.log('Error finding chat: ', error.message);
            });

        if (testing === undefined) {
            this.matomoHelper.trackGoal(2);
        }

    }

    async activeChat(chatId: string, testing?: boolean) {
        const query = new Parse.Query('Chats');
        query.get(chatId);
        const querySub = await query.subscribe();
        if (testing === undefined) {
            querySub.on('update', (object) => {
                this.store.dispatch(new fromChat.LoadChat(object.id));
            });
        }
        return querySub;
    }

    loadUserChats(uid: string) {
        const query1 = new Parse.Query('Chats');
        query1.equalTo('partner1.uid', uid);

        const query2 = new Parse.Query('Chats');
        query2.equalTo('partner2.uid', uid);

        const query = Parse.Query.or(query1, query2);
        query.descending('updatedAt');
        return query.find();
    }

    searchUserChats(keyword: string, uid: string) {
        const query = new Parse.Query('Chats');
        query.contains('chatpartners', uid);
        query.fullText('subject', keyword);

        return query.find();
    }

    updateChat(chat: Chat) {
        const query = new Parse.Query('Chats');
        query.get(chat.objectId)
            .then(result => {
                result.save({
                    messages: chat.messages
                });
            })
            .catch(error => {
                console.error('Error finding chat: ', error);
            });

    }

    async sendNotification(receiverId: string, authorName: string, chatMessage: string) {
        const params = {
            uid: receiverId,
            senderName: authorName,
            message: chatMessage
        };

        await Parse.Cloud.run('sendPush', params)
            .then(() => {
                console.log('Sent push notification');
            })
            .catch(error => {
                console.error('Error sending push', error);
            });
    }

    getLogos(ids: Array<string>): Promise<any> {
        let foundLogos: Array<ChatLogo> = [];
        const logoLoop = new Promise<ChatLogo[]>((resolve, reject) => {
            ids.forEach((id, index, array) => {
                const query = new Parse.Query('Ads');
                query.get(id)
                    .then(result => {
                        const newLogo = {
                            projectId: id,
                            logoURL: result.toJSON().logoURL
                        };
                        foundLogos = [
                            ...foundLogos,
                            newLogo
                        ];
                        if (index === array.length - 1) {
                            resolve(foundLogos);
                        }
                    })
                    .catch(error => {
                        const newLogo = {
                            projectId: id,
                            logoURL: '/assets/icons/chatLogo.png'
                        };
                        foundLogos = [
                            ...foundLogos,
                            newLogo
                        ];
                        if (index === array.length - 1) {
                            resolve(foundLogos);
                        }
                    });
            });
        });
        return logoLoop;
    }

    async writeBotMessage(receiverName: string, cardId: string, cardTitle: string, chatId: string, message: string) {
        const params = {
            receiverName,
            cardId,
            cardTitle,
            chatId,
            message
        };

        await Parse.Cloud.run('writeBotMessage', params)
            .then(() => {
                console.log('Wrote Bot Message');
            })
            .catch(error => {
                console.error('Error writing bot message', error);
            });

    }

    deleteChat(id: string): Promise<boolean | void> {
        const query = new Parse.Query('Chats');
        return query.get(id)
            .then(result => {
                result.destroy();
                return true;
            })
            .catch(error => {
                console.error('Error finding chat: ', error);
            });
    }
}

