import { Card } from '../model/card.model';
import { Filter } from '../model/filter.model';

export class LoadCard {
    static readonly type = '[CARD] Loading Card';
    constructor(public readonly id: string) {}
}

export class LoadCardSuccessfull {
    static readonly type = '[CARD] Loaded Card Successfull';
    constructor(public readonly payload: Card) {}
}

export class LoadCardFailed {
    static readonly type = '[CARD] Loading Card Failed';
    constructor(public readonly payload?: any) {}
}

export class CreateCard {
    static readonly type = '[CARD] Creating Card';
    constructor(public readonly payload: Card) {}
}

export class SaveCard {
    static readonly type = '[CARD] Saving Card';
    constructor(public readonly payload: Card) {}
}

export class DeleteCard {
    static readonly type = '[CARD] Deleting Card';
    constructor(public readonly cardID: string) {}
}

export class LoadRequests {
    static readonly type = '[CARD] Loading Requests';
}

export class LoadRequestsSuccessfull {
    static readonly type = '[CARD] Loaded Requests successfully';
    constructor(public readonly requests: Array<Card>) {}
}

export class LoadRequestsFailed {
    static readonly type = '[CARD] Loading Requests failed';
}

export class LoadRequestsByCategory {
    static readonly type = '[CARD] Loading Requests by category';
    constructor(public readonly category: Array<string>) {}
}

export class SearchRequests {
    static readonly type = '[CARD] Searching Requests';
    constructor(public readonly keyword: string) {}
}

export class FilterRequests {
    static readonly type = '[CARD] Filtering Requests';
    constructor(public readonly payload: Filter) {}
}

export class SearchUserCards {
    static readonly type = '[CARD] Searching User Cards';
    constructor(public readonly keyword: string, public readonly uid: string) {}
}

export class LoadUserCards {
    static readonly type = '[CARD] Loading User\'s Cards';
    constructor(public readonly uid: string) {}
}

export class LoadUserCardsSuccessfull {
    static readonly type = '[CARD] Loaded User Cards successfully';
    constructor(public readonly userCards: Array<Card>) {}
}

export class LoadUserCardsFailed {
    static readonly type = '[CARD] Loading User Cards failed';
}

export class ClearSelectedCard {
    static readonly type = '[CARD] Clearing selected Card';
}

export class ShowTab {
    static readonly type = '[CARD] Switching shown tab';
    constructor(public readonly tab: string) {}
}

export class ShowFilter {
    static readonly type = '[CARD] Showing filters';
}

export class HideFilter {
    static readonly type = '[CARD] Hiding filters';
}

export class AddKeywords {
    static readonly type = '[CARD] Adding Keywords';
    constructor(public readonly payload: Array<string>) {}
}

export class ClearKeywords {
    static readonly type = '[CARD] Clearing Keywords';
}

export class LoadProfileCards {
    static readonly type = '[CARD] Loading Profile Cards';
    constructor(public readonly uid: string) {}
}

export class LoadProfileCardsSuccessfull {
    static readonly type = '[CARD] Loading Profile Cards successfully';
    constructor(public readonly requests: Array<Card>) {}
}

export class LoadProfileCardsFailed {
    static readonly type = '[CARD] Loading Profile Cards failed';
}

export class ClearLoadedCards {
    static readonly type = '[CARD] Clearing loaded cards';
}

export type CardActions =
| LoadRequests
| LoadRequestsSuccessfull
| LoadRequestsFailed
| LoadRequestsByCategory
| LoadUserCards
| LoadUserCardsSuccessfull
| LoadUserCardsFailed
| CreateCard
| SaveCard
| DeleteCard
| LoadCard
| LoadCardSuccessfull
| LoadCardSuccessfull
| SearchRequests
| FilterRequests
| SearchUserCards
| ClearSelectedCard
| ShowTab
| ShowFilter
| HideFilter
| AddKeywords
| ClearKeywords
| LoadProfileCards
| LoadProfileCardsFailed
| LoadProfileCardsSuccessfull
| ClearLoadedCards;
