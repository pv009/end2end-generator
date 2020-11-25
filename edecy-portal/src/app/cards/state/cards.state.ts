import { Injectable } from '@angular/core';
import { Action, Select, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Tracking } from 'src/app/shared/model/tracking.model';
import { TrackingService } from 'src/app/shared/services/tracking.service';
import { TrackingState } from 'src/app/shared/state/tracking.state';
import { Card, CardsStateModel } from '../model/card.model';
import { CardsService } from '../service/cards.service';
import * as cardsActions from './cards.actions';

const cardsStateDefaults: CardsStateModel = {
    usersCards: [],
    usersCardsLoaded: false,
    cardsToDisplay: [],
    selectedCard: null,
    requestsFiltered: false,
    filteredRequests: [],
    loading: false,
    loaded: false,
    loadedRequests: [],
    tabShown: 'profile',
    showFilter: false,
    searchKeywords: []
};
@Injectable({
    providedIn: 'root'
})
@State<CardsStateModel>({
    name: 'cardsState',
    defaults: cardsStateDefaults
})
export class CardsState {
    @Select(TrackingState.getSession) currentSession$: Observable<Tracking>;

    constructor(
        private cardsService: CardsService,
        private tracking: TrackingService
    ) { }

    @Selector()
    static getSelectedCard(state: CardsStateModel) {
        return state.selectedCard;
    }

    @Selector()
    static getCardToDisplay(state: CardsStateModel) {
        return state.cardsToDisplay;
    }

    @Selector()
    static getRequests(state: CardsStateModel) {
        if (state.requestsFiltered) {
            return state.filteredRequests;
        } else {
            return state.loadedRequests;
        }

    }

    @Selector()
    static getUsersCards(state: CardsStateModel) {
        return state.usersCards;
    }

    @Selector()
    static usersCardsLoaded(state: CardsStateModel) {
        return state.usersCardsLoaded;
    }

    @Selector()
    static isLoading(state: CardsStateModel) {
        return state.loading;
    }

    @Selector()
    static isLoaded(state: CardsStateModel) {
        return state.loaded;
    }

    @Selector()
    static tabShown(state: CardsStateModel) {
        return state.tabShown;
    }

    @Selector()
    static showFilter(state: CardsStateModel) {
        return state.showFilter;
    }

    @Selector()
    static keywords(state: CardsStateModel) {
        return state.searchKeywords;
    }

    ngxsOnInit(ctx: StateContext<CardsStateModel>) {
        ctx.patchState({
            tabShown: 'profile'
        });
    }

    @Action(cardsActions.LoadCard)
    loadCard(
        ctx: StateContext<CardsStateModel>,
        { id }: cardsActions.LoadCard
    ) {
        ctx.patchState({
            loading: true
        });

        this.cardsService.loadCard(id)
            .then((result: any) => {
                console.log('LOADED CARD', result);
                ctx.dispatch(new cardsActions.LoadCardSuccessfull(result[0].toJSON()));
            })
            .catch(error => {
                console.error('Error loading Card: ', error);
                ctx.dispatch(new cardsActions.LoadCardFailed());
            });
    }

    @Action(cardsActions.LoadCardSuccessfull)
    loadCardSuccessfull(
        ctx: StateContext<CardsStateModel>,
        { payload }: cardsActions.LoadCardSuccessfull
    ) {
        ctx.patchState({
            loading: false,
            loaded: true,
            selectedCard: payload,
        });
    }

    @Action(cardsActions.LoadCardFailed)
    loadCardFailed(
        { dispatch }: StateContext<CardsStateModel>
    ) {
        dispatch({
            selectedCard: null,
            loading: false,
            loaded: false
        });
    }

    @Action(cardsActions.CreateCard)
    createCard(
        ctx: StateContext<CardsStateModel>,
        { payload }: cardsActions.CreateCard
    ) {
        ctx.patchState({ loading: true });
        this.cardsService.createCard(payload)
            .then((result: any) => {
                const createdCard: Card = {
                    ...result.toJSON()
                };
                console.log('Store: Created card: ', createdCard);
                ctx.dispatch(new cardsActions.LoadCardSuccessfull(createdCard));
                ctx.dispatch(new cardsActions.LoadUserCards(createdCard.uid));
            })
            .catch(error => {
                console.error('Store: Error creating card: ', error);
                ctx.dispatch(new cardsActions.LoadCardFailed());
            });
    }

    @Action(cardsActions.SaveCard)
    saveCard(
        ctx: StateContext<CardsStateModel>,
        { payload }: cardsActions.SaveCard
    ) {
        ctx.patchState({ loading: true });
        this.cardsService.saveCard(payload).then(result => {
            ctx.dispatch(new cardsActions.LoadCard(payload.objectId));
            ctx.dispatch(new cardsActions.LoadUserCards(payload.uid));
        })
            .catch(error => {
                console.error('Updating card not successfull: ', error);
            });
    }

    @Action(cardsActions.DeleteCard)
    deleteCard(
        ctx: StateContext<CardsStateModel>,
        { cardID }: cardsActions.DeleteCard
    ) {
        const userCards: Card[] = [];
        ctx.getState().usersCards.forEach(card => {
            if (card.objectId !== cardID)
                userCards.push(card);
        });
        this.cardsService.deleteCard(cardID)
            .then(result => {
                console.log(userCards);
                ctx.patchState({
                    loading: false,
                    loaded: true,
                    selectedCard: null,
                    usersCards: userCards
                });

            })
            .catch(error => {
                console.error('Error deleting card: ', error);
            });

    }

    @Action(cardsActions.LoadProfileCardsSuccessfull)
    loadProfileCardsSuccessfull(
        ctx: StateContext<CardsStateModel>,
        { requests }: cardsActions.LoadProfileCardsSuccessfull
    ) {
        ctx.patchState({
            loaded: true,
            loading: false,
            loadedRequests: requests
        });
    }

    @Action(cardsActions.LoadProfileCardsFailed)
    loadProfileCardsFailed(
        ctx: StateContext<CardsStateModel>,
    ) {
        ctx.patchState({
            loaded: false,
            loading: false
        });
    }

    @Action(cardsActions.LoadProfileCards)
    loadProfileCards(
        ctx: StateContext<CardsStateModel>,
        { uid }: cardsActions.LoadProfileCards
    ) {
        ctx.patchState({
            loading: true,
            loaded: false
        });

        this.cardsService.loadUserCards(uid)
            .then((result: any) => {
                const foundRequests: Array<Card> = [];

                for (const card of result) {
                    const foundCard = card.toJSON();
                    if (foundCard.adType && foundCard.status === 'published') {
                        foundRequests.push(foundCard);
                    }
                }

                ctx.dispatch(new cardsActions.LoadProfileCardsSuccessfull(foundRequests));
            })
            .catch(error => {
                console.error('Error finding cards: ', error);
                ctx.dispatch(new cardsActions.LoadProfileCardsFailed());
            });
    }

    @Action(cardsActions.LoadRequests)
    loadRequests(
        ctx: StateContext<CardsStateModel>
    ) {
        ctx.patchState({ loading: true });
        this.cardsService.loadCards()
            .then((result: any) => {
                console.log('Loaded cards: ', result);
                const loadedRequests: Array<Card> = [];
                for (const card of result) {
                    loadedRequests.push(card.toJSON());
                }
                ctx.dispatch(
                    new cardsActions.LoadRequestsSuccessfull(loadedRequests)
                );
                ctx.patchState({ requestsFiltered: false });

            })
            .catch(error => {
                console.error('Error loading requests: ', error);
                ctx.dispatch(new cardsActions.LoadRequestsFailed());
            });
    }

    @Action(cardsActions.LoadRequestsSuccessfull)
    loadRequestsSuccessfull(
        { patchState }: StateContext<CardsStateModel>,
        { requests }: cardsActions.LoadRequestsSuccessfull
    ) {
        patchState({
            loadedRequests: requests,
            loading: false,
            loaded: true
        });
    }

    @Action(cardsActions.LoadRequestsFailed)
    loadRequestsFailed(
        { patchState }: StateContext<CardsStateModel>
    ) {
        patchState({
            loading: false,
            loadedRequests: null,
            loaded: false
        });
    }

    @Action(cardsActions.LoadRequestsByCategory)
    loadRequestsByCategory(
        ctx: StateContext<CardsStateModel>,
        { category }: cardsActions.LoadRequestsByCategory
    ) {
        ctx.patchState({ loading: true });
        this.cardsService.loadCardsByCategory(category)
            .then((result: any) => {
                console.log('Loaded cards: ', result);
                const loadedRequests: Array<Card> = [];
                for (const card of result) {
                    loadedRequests.push(card.toJSON());
                }
                ctx.dispatch(
                    new cardsActions.LoadRequestsSuccessfull(loadedRequests)
                );

            })
            .catch(error => {
                console.error('Error loading requests: ', error);
                ctx.dispatch(new cardsActions.LoadRequestsFailed());
            });
    }

    @Action(cardsActions.FilterRequests)
    filterRequests(
        ctx: StateContext<CardsStateModel>,
        { payload }: cardsActions.FilterRequests
    ) {
        let filteredRequests: Array<Card>;
        const allRequests = ctx.getState().loadedRequests;

        const specialtiesToFilter = payload.specialties;

        if (specialtiesToFilter[2] !== '') {
            filteredRequests = allRequests.filter(request => request.specialty3 === specialtiesToFilter[2]);
        } else if (specialtiesToFilter[1] !== '') {
            filteredRequests = allRequests.filter(request => request.specialty2 === specialtiesToFilter[1]);
        } else if (specialtiesToFilter[0] !== '') {
            filteredRequests = allRequests.filter(request => request.specialty1 === specialtiesToFilter[0]);
        } else {
            filteredRequests = allRequests;
        }

        ctx.patchState({
            requestsFiltered: true,
            filteredRequests
        });
    }

    @Action(cardsActions.SearchRequests)
    searchRequests(
        ctx: StateContext<CardsStateModel>,
        { keyword }: cardsActions.SearchRequests
    ) {
        ctx.patchState({
            loading: true
        });

        const keywords = keyword.split(' ');
        ctx.dispatch(new cardsActions.AddKeywords(keywords));
        this.currentSession$.pipe(take(1)).subscribe(session => {
            if (session) {
                this.tracking.trackCardSearch(keyword, session.objectId);
            }
        });

        this.cardsService.searchCards(keyword)
            .then((result: any) => {
                let loadedRequests: Array<Card> = [];
                for (const card of result) {
                    loadedRequests.push(card.toJSON());
                }
                loadedRequests = loadedRequests.filter(request => request.status === 'published');
                ctx.dispatch(
                    new cardsActions.LoadRequestsSuccessfull(loadedRequests)
                );

            })
            .catch(error => {
                console.error('Error searching requests: ', error.message);
                ctx.dispatch(new cardsActions.LoadRequestsFailed());
            });
    }

    @Action(cardsActions.SearchUserCards)
    searchUserCards(
        ctx: StateContext<CardsStateModel>,
        { keyword, uid }: cardsActions.SearchUserCards
    ) {
        console.log('Searching with uid / keyword', uid, keyword);
        ctx.patchState({
            loading: true
        });
        this.cardsService.searchUserCards(keyword, uid)
            .then((result: any) => {
                const loadedCards: Array<Card> = [];
                for (const card of result) {
                    loadedCards.push(card.toJSON());
                }
                ctx.dispatch(
                    new cardsActions.LoadUserCardsSuccessfull(loadedCards)
                );

            })
            .catch(error => {
                console.error('Error searching user cards: ', error);
                ctx.dispatch(new cardsActions.LoadUserCardsFailed());
            });
    }

    @Action(cardsActions.LoadUserCardsSuccessfull)
    loadUserCardsSuccessfull(
        { patchState }: StateContext<CardsStateModel>,
        { userCards }: cardsActions.LoadUserCardsSuccessfull
    ) {
        patchState({
            usersCards: userCards,
            loading: false,
            loaded: true
        });
    }

    @Action(cardsActions.LoadUserCardsFailed)
    loadUserCardsFailed(
        { patchState }: StateContext<CardsStateModel>
    ) {
        patchState({
            usersCards: null,
            loading: false,
            loaded: false
        });
    }

    @Action(cardsActions.LoadUserCards)
    loadUserCards(
        ctx: StateContext<CardsStateModel>,
        { uid }: cardsActions.LoadUserCards
    ) {
        ctx.patchState({
            loading: true,
            loaded: false,
        });

        this.cardsService.loadUserCards(uid)
            .then((result: any) => {
                const loadedCards: Array<Card> = [];
                for (const card of result) {
                    loadedCards.push(card.toJSON());
                }
                console.log('Loaded users cards: ', loadedCards);
                ctx.dispatch(new cardsActions.LoadUserCardsSuccessfull(loadedCards));
            })
            .catch(error => {
                console.error('Error loading user cards:', error);
                ctx.dispatch(new cardsActions.LoadUserCardsFailed());
            });
    }

    @Action(cardsActions.ClearSelectedCard)
    clearSelectedCard(
        ctx: StateContext<CardsStateModel>,
    ) {
        ctx.patchState({
            selectedCard: null
        });
    }

    @Action(cardsActions.ShowTab)
    showTab(
        ctx: StateContext<CardsStateModel>,
        { tab }: cardsActions.ShowTab
    ) {
        ctx.patchState({
            tabShown: tab
        });
    }

    @Action(cardsActions.ShowFilter)
    showFilter(
        ctx: StateContext<CardsStateModel>
    ) {
        ctx.patchState({
            showFilter: true
        });
    }

    @Action(cardsActions.HideFilter)
    hideFilter(
        ctx: StateContext<CardsStateModel>
    ) {
        ctx.patchState({
            showFilter: false
        });
    }

    @Action(cardsActions.AddKeywords)
    addKeywords(
        ctx: StateContext<CardsStateModel>,
        { payload }: cardsActions.AddKeywords
    ) {
        ctx.patchState({
            searchKeywords: payload
        });
    }

    @Action(cardsActions.ClearKeywords)
    clearKeywords(
        ctx: StateContext<CardsStateModel>,
    ) {
        ctx.patchState({
            searchKeywords: []
        });
    }

    @Action(cardsActions.ClearLoadedCards)
    clearLoadedCards(
        ctx: StateContext<CardsStateModel>,
    ) {
        ctx.patchState({
            loadedRequests: []
        });
    }
}
