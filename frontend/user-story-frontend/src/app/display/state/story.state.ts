import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SaveService } from 'src/app/enter/service/save.service';
import { UserStory } from 'src/app/shared/model/user-story.model';
import { StoryStateModel } from '../model/state.model';
import * as storyActions from './story.actions';

const exampleStories: Array<UserStory> = [
    {
        objectId: '85xb4y7f32',
        mainContext: 'User-Verwaltung',
        subContext: 'Registrierung',
        userRole: 'Nutzer',
        goal: 'mich auf der Plattform registrieren können',
        reason: 'damit ich persönliche Daten dauerhaft speichern kann.',
        acceptenceCriteria: [
            'Der Nutzer kann einen Account auf der Plattform anlegen',
            'Der Nutzer kann bei seiner Registrierung folgende persönliche Daten angeben',
            'Der Nutzer erhält eine Erfolgsmeldung'
        ]
    },
    {
        objectId: 'uk3ir1o0rt',
        mainContext: 'User-Verwaltung',
        subContext: 'Login',
        userRole: 'Nutzer',
        goal: 'mich auf der Plattform einloggen können',
        reason: 'damit ich Zugriff auf Funktionen habe, die nur eingeloggten Nutzern zur Verfügung stehen.',
        acceptenceCriteria: [
            'Der Nutzer kann sich mit korrekten Login-Daten einloggen',
            'Der Nutzer erhält bei falschen Login-Daten eine Fehlermeldung, dass Username oder E-Mail nicht korrekt sind',
            'Der Nutzer wird auf die Startseite weitergeleitet'
        ]
    },
    {
        objectId: 'b31xa8n3ko',
        mainContext: 'Gesuche',
        subContext: 'Übersicht',
        userRole: 'Desktopnutzer',
        goal: 'ich eine Übersicht aller Gesuche auf der Plattform haben',
        reason: 'damit sehen kann, welche möglichen Partnerschaften entstehen könnten.',
        acceptenceCriteria: [
            'Der Nutzer kann ein Einzelgesuch ausklappen, um alle Daten zu sehen',
            'Der Nutzer kann Filter einstellen',
            'Es werden pro Seite 30 Gesuche gezeigt',
            'Ein Einzelgesuch enthält folgende Daten…',
            'Der Nutzer kann ein Gesuch anklicken und kommt auf die Detailseite',
            'Der Nutzer kann nach Gesuchen suchen'
        ]
    },
    {
        objectId: 'ltv6klszvg',
        mainContext: 'Profile',
        subContext: 'Detailansicht',
        userRole: 'Forschungsinteressierter',
        goal: 'mir Profile in einer Detailansicht ansehen können',
        reason: 'damit ich möglichst viele spezifische Informationen über ein Profil erhalten kann.',
        acceptenceCriteria: [
            'Der Nutzer kann mit dem Profil Kontakt aufnehmen',
            'Der Nutzer sieht folgende Daten des Profils in der Detailansicht…',
            'Der Nutzer sieht folgende Daten des Profils in der Detailansicht…'
        ]
    },
];

const storyStateDefaults: StoryStateModel = {
    loaded: false,
    loading: false,
    loadedStories: [],
    selectedStory: null,
    filter: null,
    filteredStories: []
};

@Injectable()
@State<StoryStateModel>({
    name: 'story',
    defaults: storyStateDefaults
})
export class StoryState {

    constructor(
        private storyService: SaveService
    ) { }

    @Selector()
    static allStories(state: StoryStateModel): Array<UserStory> {
        return state.filteredStories;
    }

    @Selector()
    static selectedStory(state: StoryStateModel): UserStory {
        return state.selectedStory;
    }

    @Action(storyActions.LoadAllStories)
    loadAllStories(
        ctx: StateContext<StoryStateModel>,
    ): void {
        const loadedStories = exampleStories;
        // TODO: Implement with service + api
        ctx.patchState({
            loading: true,
            loaded: false
        });
        ctx.dispatch(new storyActions.LoadAllStoriesSuccess(loadedStories));

    }

    @Action(storyActions.LoadAllStoriesSuccess)
    loadAllStoriesSuccess(
        ctx: StateContext<StoryStateModel>,
        { payload }: storyActions.LoadAllStoriesSuccess
    ): void {
        ctx.patchState({
            loading: false,
            loaded: true,
            loadedStories: payload,
            filteredStories: payload
        });
    }

    @Action(storyActions.LoadAllStoriesFailed)
    loadAllStoriesFailed(
        ctx: StateContext<StoryStateModel>
    ): void {
        ctx.patchState({
            loading: false,
            loaded: false,
            loadedStories: []
        });
    }

    @Action(storyActions.LoadStory)
    loadStory(
        ctx: StateContext<StoryStateModel>,
        { id }: storyActions.LoadStory
    ): void {
        // TODO: Implement with service & API
        const allStories = ctx.getState().loadedStories;
        const filteredStories = allStories.filter(item => item.objectId === id);
        if (allStories.length > 0 && filteredStories.length > 0) {
            ctx.dispatch(new storyActions.LoadStorySuccess(filteredStories[0]));
        } else {
            ctx.dispatch(new storyActions.LoadStoryFailed());
        }
    }

    @Action(storyActions.LoadStorySuccess)
    loadStorySucces(
        ctx: StateContext<StoryStateModel>,
        { payload }: storyActions.LoadStorySuccess
    ): void {
        ctx.patchState({
            loading: false,
            loaded: true,
            selectedStory: payload
        });
    }

    @Action(storyActions.LoadStoryFailed)
    loadStoryFailed(
        ctx: StateContext<StoryStateModel>
    ): void {
        ctx.patchState({
            loading: false,
            loaded: false,
            selectedStory: null
        });
    }

    @Action(storyActions.CreateStory)
    createStory(
        ctx: StateContext<StoryStateModel>,
        { story }: storyActions.CreateStory
    ): void {
        this.storyService.createStory(story);
        ctx.patchState({
            loading: true,
            loaded: false
        });
        ctx.dispatch(new storyActions.LoadStorySuccess(story));
    }

    @Action(storyActions.UpdateStory)
    updateStory(
        ctx: StateContext<StoryStateModel>,
        { story }: storyActions.CreateStory
    ): void {
        this.storyService.updateStory(story);
        ctx.patchState({
            loading: true,
            loaded: false
        });
        ctx.dispatch(new storyActions.LoadStorySuccess(story));
    }

    @Action(storyActions.ChangeFilter)
    changeFilter(
        ctx: StateContext<StoryStateModel>,
        { filter }: storyActions.ChangeFilter
    ): void {
        const allStories = ctx.getState().loadedStories;
        let filteredStories: Array<UserStory>;
        if (filter.mainContext !== '') {
            if (filter.subContext === '') {
                filteredStories = allStories.filter(story => story.mainContext === filter.mainContext);
            } else {
                filteredStories = allStories.filter(story =>
                    story.mainContext === filter.mainContext && story.subContext === filter.subContext
                );
            }
        } else if (filter.subContext !== '') {
            filteredStories = allStories.filter(story => story.subContext === filter.subContext);
        } else {
            filteredStories = allStories;
        }
        ctx.patchState({
            filter,
            filteredStories
        });
    }

    @Action(storyActions.ClearFilter)
    clearFilter(
        ctx: StateContext<StoryStateModel>,
    ): void {
        const allStories = ctx.getState().loadedStories;
        ctx.patchState({
            filter: null,
            filteredStories: allStories
        });
    }

}
