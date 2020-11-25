import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import * as Parse from 'parse';
import { CardsModule } from 'src/app/cards/cards.module';
import { CardsState } from 'src/app/cards/state/cards.state';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChatRoutingModule } from '../chat-routing.module';
import { Chat, ChatMessage } from '../model/chat.model';
import { ChatState } from '../state/chats.state';
import { ChatService } from './chat.service';

const exampleChat: Chat = {
    objectId: '',
    partner1: {
        uid: 'p1AhzPcK6s',
        firstName: 'Paul',
        lastName: 'Voges'
    },
    partner2: {
        uid: 'RfpwVhIlJI',
        firstName: 'Ole',
        lastName: 'Boesche'
    },
    chatpartners: ['p1AhzPcK6s', 'RfpwVhIlJI'],
    messages: [
        {
            authorId: 'p1AhzPcK6s',
            email: 'paul.voges@edecy.de',
            message: 'Moin Ole!',
            read: false,
            time: '10:41',
            date: '11. Juli 2020'
        }
    ],
    projectId: '6sOT8vDE28',
    subject: 'Testanzeige Login'
};

const exampleMessage: ChatMessage = {
    authorId: 'p1AhzPcK6s',
    email: 'paul.voges@edecy.de',
    message: 'Moin Ole!',
    read: false,
    time: '11:41',
    date: '26. Juli 2020'
};

let chatId = '';
const uid = 'p1AhzPcK6s';
let subscription: Parse.LiveQuerySubscription;

describe('ChatService', () => {
    let service: ChatService;
    let store: Store;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                ChatRoutingModule,
                SharedModule,
                ReactiveFormsModule,
                FormsModule,
                NgxsModule.forRoot([CardsState, ChatState]),
                CardsModule,
                FroalaEditorModule,
                FroalaViewModule,
                RouterTestingModule,
                HttpClientTestingModule,
                BrowserAnimationsModule
            ],
            declarations: [],
            providers: [
                ChatService,
                MatomoHelperService
            ]
        });

        store = TestBed.inject(Store);
    });

    beforeEach(inject([ChatService], s => {
        service = s;
    }));

    afterAll(() => {
        subscription.unsubscribe();
    });


    it('creates a chat', async (done) => {
        const creation = service.createChat(exampleChat, true);

        creation.then(res => {
            chatId = res.id;
            exampleChat.objectId = res.id;
            console.log('Created chat with id ', chatId);
            expect(res.id).toEqual(jasmine.any(String));
            done();
        }).catch(error => {
            console.error('Error creating chat: ', error);
        });
    });

    it('writes message and loads created chat', async (done) => {
        service.writeMessage(exampleMessage, chatId, true);

        const loading = service.loadChat(chatId);

        setTimeout(() => {
            loading.then(res => {
                expect(res.attributes.messages.length).toBeGreaterThan(1);
                exampleChat.messages.push(res.attributes.messages[1]);
                done();
            }).catch(error => {
                console.error('Error writing message ', error);
            });
        }, 2000);
    });

    it('finds created chat', async (done) => {
        const finding = service.findChat(exampleChat.partner1.uid, exampleChat.partner2.uid, exampleChat.projectId);

        finding.then(res => {
            expect(res.length).toBeGreaterThan(0);
            done();
        }).catch(error => {
            console.error('Error finding chat ', error);
        });
    });

    it('subscribes to created chat', async (done) => {
        const subscribe = service.activeChat(chatId, true);

        subscribe.then(res => {
            subscription = res;
            expect(res).toBeDefined();
            done();
        }).catch(error => {
            console.error('Error subscribing to chat ', error);
        });
    });

    it('loads user chats', async (done) => {
        const query = service.loadUserChats(uid);

        query.then(res => {
            expect(res.length).toBeGreaterThan(0);
            done();
        }).catch(error => {
            console.error('Error finding chats', error);
        });
    });

    it('searches user chats', async (done) => {
        const query = service.searchUserChats('Login', uid);

        query.then(res => {
            expect(res.length).toBeGreaterThan(0);
            done();
        }).catch(error => {
            console.error('Error finding chats', error);
        });
    });

    it('marks messages as read and loads created chat', async (done) => {
        exampleChat.messages.forEach(message => {
            message.read = true;
        });
        service.updateChat(exampleChat);

        const loading = service.loadChat(chatId);

        setTimeout(() => {
            loading.then(res => {
                expect(res.attributes.messages[1].read).toBe(true);
                done();
            }).catch(error => {
                console.error('Error writing message ', error);
            });
        }, 2000);
    });

    // TODO: Test Cloud functions on Server

    it('loads chat logos', async (done) => {
        const logoSearch = service.getLogos([exampleChat.projectId]);

        logoSearch.then(res => {
            expect(res.length).toBeGreaterThan(0);
            done();
        }).catch(error => {
            console.error('Error loading logos', error);
        });
    });

    it('deletes created chat', async (done) => {
        const deletion = service.deleteChat(chatId);

        deletion.then(res => {
            expect(res).toBe(true);
            done();
        }).catch(error => {
            console.error('Error deleting chat', error);
        });
    });

});

