import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
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
import * as Parse from 'parse';
import { ContactEdecyModule } from 'src/app/contact-edecy/contact-edecy.module';
import { ProfileModule } from 'src/app/profile/profile.module';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { Card, CardsStateModel } from '../model/card.model';
import { Filter } from '../model/filter.model';
import { CardsService } from '../service/cards.service';
import {
    AddKeywords, ClearKeywords, ClearLoadedCards, ClearSelectedCard, CreateCard, DeleteCard,
    FilterRequests,

    HideFilter, LoadCard, LoadCardSuccessfull,
    LoadProfileCardsSuccessfull, LoadRequests, LoadRequestsByCategory, LoadRequestsSuccessfull, LoadUserCards,
    LoadUserCardsSuccessfull, SaveCard, SearchRequests, SearchUserCards, ShowFilter, ShowTab
} from './cards.actions';
import { CardsState } from './cards.state';




const cardPromisedData = new Parse.Object('Ads');
let createdCardId = '';

const truePromise = new Promise<boolean>((resolve) => {
    resolve(true);
});

const exampleCard: Card = {
    objectId: 'tBJFLv4xP7',
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
    orgSize: '50 bis 249 Beschäftigte'
};

const exampleCardArray = [exampleCard, exampleCard, exampleCard];

const stateWithLoadedCards: CardsStateModel = {
    usersCards: [],
    usersCardsLoaded: false,
    cardsToDisplay: [],
    selectedCard: exampleCard,
    requestsFiltered: false,
    filteredRequests: [],
    loading: false,
    loaded: false,
    loadedRequests: exampleCardArray,
    tabShown: 'request',
    showFilter: false,
    searchKeywords: []
};

const exampleFilter: Filter = {
    specialties: [
        exampleCard.specialty1,
        exampleCard.specialty2,
        exampleCard.specialty3
    ]
};

describe('CardsState', () => {
    let store: Store;
    let cardsService: CardsService;

    beforeAll(async(() => {
        cardPromisedData.save({
            uid: exampleCard.uid,
            title: exampleCard.title,
            description: exampleCard.description,
            category: exampleCard.category,
            specialty1: exampleCard.specialty1,
            specialty2: exampleCard.specialty2,
            specialty3: exampleCard.specialty3,
            userName: exampleCard.userName,
            showUserName: exampleCard.showUserName,
            userMail: exampleCard.userMail,
            organisation: exampleCard.organisation,
            showOrganisation: exampleCard.showOrganisation,
            projectStreetNo: exampleCard.projectStreetNo,
            projectPLZ: exampleCard.projectPLZ,
            projectCity: exampleCard.projectCity,
            clientPLZ: exampleCard.clientPLZ,
            clientCity: exampleCard.clientCity,
            clientStreetNo: exampleCard.clientStreetNo,
            tags: exampleCard.tags,
            pictureURL: exampleCard.pictureURL,
            logoURL: exampleCard.logoURL,
            mailAlert: exampleCard.mailAlert,
            showPlz: exampleCard.showPlz,
            showProjectPlz: exampleCard.showProjectPlz,
            adType: exampleCard.adType,
            status: exampleCard.status,
            userFirstName: exampleCard.userFirstName,
            userLastName: exampleCard.userLastName,
            loginRequired: exampleCard.loginRequired,
            orgSize: exampleCard.orgSize
        }).then(result => {
            const createdCard = result.toJSON();
            createdCardId = createdCard.objectId;
            exampleCard.objectId = createdCard.objectId;
        }).catch(error => {
            console.error('Error creating card: ', error);
        });
    }));

    // tslint:disable-next-line:no-shadowed-variable
    const singleCardPromise = new Promise<Parse.Object>((resolve) => {
        resolve(cardPromisedData);
    });

    const multiCardPromise = new Promise<Parse.Object[]>((resolve) => {
        resolve([cardPromisedData]);
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                MatSnackBarModule,
                ReactiveFormsModule,
                FormsModule,
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
                BrowserAnimationsModule,
                NgxsModule.forRoot([CardsState])
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
        cardsService = s;
    }));

    afterAll((inject([CardsService], s => {
        s.deleteCard(createdCardId);
    })));

    it('it loads card with id ' + createdCardId, async (done) => {
        console.log('CARD ID:', createdCardId);
        spyOn(cardsService, 'loadCard').and.returnValue(multiCardPromise);
        store.dispatch(new LoadCard(createdCardId));
        expect(cardsService.loadCard).toHaveBeenCalledWith(createdCardId);
        done();
    });

    it('it loads returned card to state', () => {
        store.dispatch(new LoadCardSuccessfull(exampleCard));

        const selectedCard = store.selectSnapshot(state => state.cardsState.selectedCard);
        expect(selectedCard).toEqual(jasmine.any(Object));
    });

    it('creates a new card', async (done) => {
        spyOn(cardsService, 'createCard').and.returnValue(singleCardPromise);
        store.dispatch(new CreateCard(exampleCard));
        expect(cardsService.createCard).toHaveBeenCalledWith(exampleCard);
        done();
    });

    it('saves a new card', async (done) => {
        spyOn(cardsService, 'saveCard').and.returnValue(truePromise);
        store.dispatch(new SaveCard(exampleCard));
        expect(cardsService.saveCard).toHaveBeenCalledWith(exampleCard);
        done();
    });

    it('deletes a new card', async (done) => {
        spyOn(cardsService, 'deleteCard').and.returnValue(truePromise);
        store.dispatch(new DeleteCard(exampleCard.objectId));
        expect(cardsService.deleteCard).toHaveBeenCalledWith(exampleCard.objectId);
        done();
    });

    it('loads profile cards', async (done) => {
        spyOn(cardsService, 'loadUserCards').and.returnValue(multiCardPromise);
        store.dispatch(new LoadUserCards(exampleCard.uid));
        expect(cardsService.loadUserCards).toHaveBeenCalledWith(exampleCard.uid);
        done();
    });

    it('loads profile cards to state', () => {
        store.dispatch(new LoadProfileCardsSuccessfull(exampleCardArray));

        const loadedRequests = store.selectSnapshot(state => state.cardsState.loadedRequests);
        expect(loadedRequests.length).toBeGreaterThan(2);
    });

    it('loads all requests', async (done) => {
        spyOn(cardsService, 'loadCards').and.returnValue(multiCardPromise);
        store.dispatch(new LoadRequests());
        expect(cardsService.loadCards).toHaveBeenCalled();
        done();
    });

    it('loads all requests to state', () => {
        store.dispatch(new LoadRequestsSuccessfull(exampleCardArray));

        const loadedRequests = store.selectSnapshot(state => state.cardsState.loadedRequests);
        expect(loadedRequests.length).toBeGreaterThan(2);
    });

    it('loads request by category', async (done) => {
        spyOn(cardsService, 'loadCardsByCategory').and.returnValue(multiCardPromise);
        store.dispatch(new LoadRequestsByCategory(exampleCard.category));
        expect(cardsService.loadCardsByCategory).toHaveBeenCalledWith(exampleCard.category);
        done();
    });

    it('filters all requests', () => {
        store.reset({
            ...store.snapshot(),
            cardsState: stateWithLoadedCards
        });
        store.dispatch(new FilterRequests(exampleFilter));

        const finalState = store.selectSnapshot(state => state.cardsState);
        expect(finalState.filteredRequests.length).toBeGreaterThan(2);
        expect(finalState.requestsFiltered).toBe(true);
    });

    it('searches requests', async (done) => {
        spyOn(cardsService, 'searchCards').and.returnValue(multiCardPromise);
        store.dispatch(new SearchRequests('Hamburg'));
        expect(cardsService.searchCards).toHaveBeenCalledWith('Hamburg');
        done();
    });

    it('searches user cards', async (done) => {
        spyOn(cardsService, 'searchUserCards').and.returnValue(multiCardPromise);
        store.dispatch(new SearchUserCards('Hamburg', exampleCard.uid));
        expect(cardsService.searchUserCards).toHaveBeenCalledWith('Hamburg', exampleCard.uid);
        done();
    });

    it('loads user cards', async (done) => {
        spyOn(cardsService, 'loadUserCards').and.returnValue(multiCardPromise);
        store.dispatch(new LoadUserCards(exampleCard.uid));
        expect(cardsService.loadUserCards).toHaveBeenCalledWith(exampleCard.uid);
        done();
    });

    it('loads user cards to state', () => {
        store.dispatch(new LoadUserCardsSuccessfull(exampleCardArray));

        const userCards = store.selectSnapshot(state => state.cardsState.usersCards);
        expect(userCards.length).toBeGreaterThan(2);
    });

    it('clears selectedCard', () => {
        store.reset({
            ...store.snapshot(),
            cardsState: stateWithLoadedCards
        });
        store.dispatch(new ClearSelectedCard());
        const finalState = store.selectSnapshot(state => state.cardsState);
        expect(finalState.selectedCard).toBeNull();
    });

    it('shows tab profile', () => {
        store.dispatch(new ShowTab('profile'));
        const finalState = store.selectSnapshot(state => state.cardsState);
        expect(finalState.tabShown).toBe('profile');
    });

    it('shows filter', () => {
        store.dispatch(new ShowFilter());
        const finalState = store.selectSnapshot(state => state.cardsState);
        expect(finalState.showFilter).toBe(true);
    });

    it('hides filter', () => {
        store.dispatch(new HideFilter());
        const finalState = store.selectSnapshot(state => state.cardsState);
        expect(finalState.showFilter).toBe(false);
    });

    it('adds keywords to state', () => {
        const keywords = ['Hamburg', 'Test'];
        store.dispatch(new AddKeywords(keywords));
        const finalState = store.selectSnapshot(state => state.cardsState);
        expect(finalState.searchKeywords).toBe(keywords);
    });

    it('clears keywords', () => {
        store.dispatch(new ClearKeywords());
        const finalState = store.selectSnapshot(state => state.cardsState);
        expect(finalState.searchKeywords.length).toBeLessThan(1);
    });

    it('clears loaded cards', () => {
        store.dispatch(new ClearLoadedCards());
        const finalState = store.selectSnapshot(state => state.cardsState);
        expect(finalState.loadedRequests.length).toBeLessThan(1);
    });
});
