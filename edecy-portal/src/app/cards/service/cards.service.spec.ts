import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { ChatState } from 'src/app/chat/state/chats.state';
import { ContactEdecyModule } from 'src/app/contact-edecy/contact-edecy.module';
import { ProfileModule } from 'src/app/profile/profile.module';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { Card } from '../model/card.model';
import { CardsState } from '../state/cards.state';
import { CardsService } from './cards.service';

const exampleCard: Card = {
    objectId: '',
    uid: 'p1AhzPcK6s',
    title: 'Testing Card',
    description: 'Testing Card',
    category: [
        'Maschine',
        'Projekt',
        'Campus'
    ],
    specialty1: 'Rechtswissenschaften, Jurisprudenz',
    specialty2: 'Rechtswissenschaften',
    specialty3: 'Rechtssoziologie',
    userName: 'paul.voges@edecy.de',
    showUserName: true,
    userMail: 'paul.voges@edecy.de',
    organisation: 'Edecy UG',
    showOrganisation: true,
    projectStreetNo: 'Wendenstraße 130',
    projectPLZ: '20537',
    projectCity: 'Hamburg',
    clientPLZ: '20537',
    clientCity: 'Hamburg',
    clientStreetNo: 'Wendenstraße 130',
    tags: ['test', 'tag'],
    pictureURL: 'http://v22019027841683103.goodsrv.de:1337/parse/files/' +
        'edecy_parse/5b807bd8219defff68fabc56ae69a813_Pizigani_1367_Chart_10MB.png',
    logoURL: 'http://v22019027841683103.goodsrv.de:1337/parse/files/edecy_parse/948e55d6c1caf9853b27809624d9273f_DloeOYuWsAMDJDm.png',
    mailAlert: true,
    showPlz: true,
    showProjectPlz: true,
    adType: 'request',
    status: 'published',
    userFirstName: 'Paul',
    userLastName: 'Voges',
    loginRequired: true,
    orgSize: '50 - 249',
    projectType: 'Kooperation',
    partnerCompanyType: [
        'Mittelstand',
        'KMU',
        'Konzern / Großunternehmen'
    ],
    partnerInstituteType: [],
    projectStage: '1. Bedarfsfeststellung & Ideenfindung',
    projectLeadershipPossible: true,
    partnerRange: 'egal',
    fundingNeeded: true,
    partnerType: ['private']
};

let cardId = '';
const uid = 'p1AhzPcK6s';

describe('CardsService', () => {
    let service: CardsService;
    let store: Store;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatSnackBarModule,
                ReactiveFormsModule,
                FormsModule,
                NgxsModule.forRoot([CardsState, ChatState]),
                MaterialFileInputModule,
                ImageCropperModule,
                ContactEdecyModule,
                MatExpansionModule,
                RouterModule,
                FroalaEditorModule,
                FroalaViewModule,
                ProfileModule,
                NgxImageZoomModule,
                RouterTestingModule,
                HttpClientTestingModule,
                BrowserAnimationsModule
            ],
            declarations: [],
            providers: [
                CardsService,
                MatomoHelperService
            ]
        });

        store = TestBed.inject(Store);
    });

    beforeEach(inject([CardsService], s => {
        service = s;
    }));

    it('should create a card', async (done) => {
        const creation = service.createCard(exampleCard, true);

        creation.then(res => {
            cardId = res.id;
            exampleCard.objectId = res.id;
            exampleCard.title = 'Testing Card Updated';
            console.log('Created card with id ', cardId);
            expect(res.id).toEqual(jasmine.any(String));
            done();
        }).catch(error => {
            console.error('Error creating card: ', error);
        });
    });

    it('should update created card', async (done) => {
        const update = service.saveCard(exampleCard);

        update.then(res => {
            console.log('Updated card with id ', cardId);
            expect(res).toBe(true);
            done();
        }).catch(error => {
            console.error('Error creating card: ', error);
        });
    });

    it('should load created card', async (done) => {
        const loading = service.loadCard(cardId);

        loading.then(res => {
            const card = res[0].toJSON();
            expect(card.objectId).toEqual(jasmine.any(String));
            done();
        }).catch(error => {
            console.error('Error loading card: ', error);
        });
    });

    it('should load all cards', async (done) => {
        const loading = service.loadCards();

        loading.then(res => {
            expect(res.length).toBeGreaterThan(0);
            done();
        }).catch(error => {
            console.error('Error loading cards: ', error);
        });
    });

    it('should load cards by category', async (done) => {
        const loading = service.loadCardsByCategory(['Maschine']);

        loading.then(res => {
            expect(res.length).toBeGreaterThan(0);
            done();
        }).catch(error => {
            console.error('Error loading cards: ', error);
        });
    });

    it('should find cards by keyword', async (done) => {
        const searching = service.searchCards('Hamburg', true);

        searching.then(res => {
            expect(res.length).toBeGreaterThan(0);
            done();
        }).catch(error => {
            console.error('Error searching cards: ', error);
        });
    });

    it('should find user cards by keyword', async (done) => {
        const searching = service.searchUserCards('Hamburg', uid, true);

        searching.then(res => {
            expect(res.length).toBeGreaterThan(0);
            done();
        }).catch(error => {
            console.error('Error searching cards: ', error);
        });
    });

    it('should load users cards', async (done) => {
        const loading = service.loadUserCards(uid);

        loading.then(res => {
            expect(res.length).toBeGreaterThan(0);
            done();
        }).catch(error => {
            console.error('Error loading cards: ', error);
        });
    });

    it('should delete created card', async (done) => {
        const deletion = service.deleteCard(cardId);

        deletion.then(res => {
            expect(res).toBe(true);
            done();
        }).catch(error => {
            console.error('Error deleting card: ', error);
        });
    });

});
