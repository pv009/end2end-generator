import { UserStory } from 'src/app/shared/model/user-story.model';

export interface  StoryStateModel {
    loading: boolean;
    loaded: boolean;
    loadedStories: Array<UserStory>;
    selectedStory: UserStory;
}

