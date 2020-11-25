import { User } from 'parse';
import { Card } from 'src/app/cards/model/card.model';
import { Profile } from 'src/app/profile/model/profile.model';
import { Tracking } from '../model/tracking.model';

export class CreateSession {
    static readonly type = '[Auth] Creating Tracking Session';
    constructor(public readonly user: User, public readonly userCards: Card[], public readonly userProfile: Profile) { }
}

export class CreateSessionSuccessfull {
    static readonly type = '[Auth] Created Tracking Session successfully';
    constructor(public readonly session: Tracking) { }
}

export class CreateSessionFailed {
    static readonly type = '[Auth] Creating Tracking Session failed';
}

export class UpdateSession {
    static readonly type = '[Auth] Updating Session';
    constructor(public readonly session: Tracking) { }
}

export type TrackingActions =
| CreateSession
| CreateSessionSuccessfull
| CreateSessionFailed
| UpdateSession;
