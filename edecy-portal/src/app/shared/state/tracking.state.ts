import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Tracking, TrackingStateModel } from '../model/tracking.model';
import { TrackingService } from '../services/tracking.service';
import * as trackingActions from './tracking.actions';


const trackingStateDefaults: TrackingStateModel = {
    session: null,
    loaded: false,
    loading: false
};

@Injectable({
    providedIn: 'root'
})
@State<TrackingStateModel>({
    name: 'tracking',
    defaults: trackingStateDefaults
})
export class TrackingState {

    constructor(
        private trackingService: TrackingService
    ) { }

    @Selector()
    static getSession(state: TrackingStateModel): Tracking {
        return state.session;
    }

    @Action(trackingActions.CreateSession)
    createSession(
        ctx: StateContext<TrackingStateModel>,
        { user, userCards, userProfile }: trackingActions.CreateSession
    ) {
        ctx.patchState({
            loading: true,
            loaded: false
        });
        this.trackingService.createSession(user, userCards, userProfile)
            .then((result: any) => {
                ctx.dispatch(new trackingActions.CreateSessionSuccessfull(result.toJSON()));
            })
            .catch(error => {
                console.error('From state: Error creating session: ', error);
                ctx.dispatch(new trackingActions.CreateSessionFailed());
            });
    }

    @Action(trackingActions.CreateSessionSuccessfull)
    createSessionSuccessfull(
        ctx: StateContext<TrackingStateModel>,
        { session }: trackingActions.CreateSessionSuccessfull
    ) {
        ctx.patchState({
            session,
            loaded: true,
            loading: false
        });
    }

    @Action(trackingActions.CreateSessionFailed)
    createSessionFailed(
        ctx: StateContext<TrackingStateModel>,
    ) {
        ctx.patchState({
            loaded: false,
            loading: false
        });
    }

    @Action(trackingActions.UpdateSession)
    updateSession(
        ctx: StateContext<TrackingStateModel>,
        { session }: trackingActions.UpdateSession
    ) {
        ctx.patchState({
            loaded: true,
            loading: false,
            session
        });
    }
}

