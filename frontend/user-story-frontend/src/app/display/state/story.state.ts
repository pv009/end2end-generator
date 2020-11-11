import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SaveService } from 'src/app/enter/service/save.service';
import { UserStory } from 'src/app/shared/model/user-story.model';
import { StoryStateModel } from '../model/state.model';
import { FetchService } from '../service/fetch.service';
import * as storyActions from './story.actions';

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
        private saveService: SaveService,
        private fetchService: FetchService
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
        ctx.patchState({
            loading: true,
            loaded: false
        });

        const loadedStories: Array<UserStory> = [];
        this.fetchService.fetchAllStories()
            .then((result: Array<UserStory>) => {
                if (result.length > 0) {
                    result.forEach(story => {
                        loadedStories.push(story);
                    });
                }
                ctx.dispatch(new storyActions.LoadAllStoriesSuccess(loadedStories));
            })
            .catch(error => {
                console.error('Error fetching all stories', error);
                ctx.dispatch(new storyActions.LoadAllStoriesFailed());
            });
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
        ctx.patchState({
            loading: true,
            loaded: false
        });
        this.fetchService.fetchStory(id)
            .then((result: Array<UserStory>) => {
                ctx.dispatch(new storyActions.LoadStorySuccess(result[0]));
            })
            .catch(error => {
                console.error('Error fetching story ', error);
                ctx.dispatch(new storyActions.LoadStoryFailed());
            });
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
        ctx.patchState({
            loading: true,
            loaded: false
        });
        this.saveService.createStory(story)
            .then((result: UserStory) => {
                ctx.dispatch(new storyActions.LoadStorySuccess(result));
            })
            .catch(error => {
                console.error('Error creating story', error);
            });
    }

    @Action(storyActions.UpdateStory)
    updateStory(
        ctx: StateContext<StoryStateModel>,
        { story }: storyActions.CreateStory
    ): void {
        ctx.patchState({
            loading: true,
            loaded: false
        });
        this.saveService.updateStory(story)
            .then((result: UserStory) => {
                ctx.dispatch(new storyActions.LoadStorySuccess(result));
            })
            .catch(error => {
                console.error('Error creating story', error);
            });
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

    @Action(storyActions.DeleteStory)
    deleteStory(
        ctx: StateContext<StoryStateModel>,
        { id }: storyActions.DeleteStory
    ): void {
        this.saveService.deleteStory(id)
            .then((result: any) => {
                ctx.dispatch(new storyActions.LoadAllStories());
            })
            .catch(error => {
                console.error('Error deleting story', error);
            });
    }

}
