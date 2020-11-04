import { Injectable } from '@angular/core';
import { Selector } from '@ngxs/store/src/decorators/selector/selector';
import { State } from '@ngxs/store/src/decorators/state';
import { UserStory } from 'src/app/shared/model/user-story.model';
import { StoryStateModel } from '../model/state.model';

const storyStateDefaults: StoryStateModel = {
    loaded: false,
    loading: false,
    loadedStories: [],
    selectedStory: null
};
@Injectable({
    providedIn: 'root'
})
@State<StoryStateModel>({
    name: 'story',
    defaults: storyStateDefaults
})
export class StoryState {

    constructor(
    ) { }

    @Selector()
    static allStories(state: StoryStateModel): Array<UserStory> {
        return state.loadedStories;
    }

    @Selector()
    static selectedStory(state: StoryStateModel): UserStory {
        return state.selectedStory;
    }
}
