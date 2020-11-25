export interface Card {
    objectId: string;
    profileId?: string;
    uid: string;
    title: string;
    description: string;
    category: Array<string>;
    specialty1?: string;
    specialty2?: string;
    specialty3?: string;
    userName?: string;
    showUserName?: boolean;
    userMail?: string;
    organisation?: string;
    showOrganisation?: boolean;
    createdAt?: string;
    projectStreetNo?: string;
    projectPLZ?: string;
    projectCity?: string;
    clientPLZ?: string;
    clientCity?: string;
    clientStreetNo?: string;
    tags?: Array<string>;
    pictureURL?: string;
    logoURL?: string;
    mailAlert?: boolean;
    updatedAt?: string;
    showPlz?: boolean;
    showProjectPlz?: boolean;
    adType: string;
    status?: string;
    userFirstName?: string;
    userLastName?: string;
    loginRequired?: boolean;
    orgSize?: string;
    projectType?: string;
    partnerType?: Array<string>;
    partnerCompanyType?: Array<string>;
    partnerInstituteType?: Array<string>;
    projectStage?: string;
    projectLeadershipPossible?: boolean;
    partnerRange?: string;
    fundingNeeded?: boolean;
}

export interface CardsStateModel {
    usersCards?: Array<Card>;
    usersCardsLoaded?: boolean;
    cardsToDisplay?: Array<Card>;
    loadedRequests?: Array<Card>;
    filteredRequests?: Array<Card>;
    selectedCard?: Card;
    requestsFiltered: boolean;
    loading: boolean;
    loaded: boolean;
    tabShown: string;
    showFilter: boolean;
    searchKeywords: Array<string>;
}

export interface CardBasic {
    id: string;
    category: string[];
}
