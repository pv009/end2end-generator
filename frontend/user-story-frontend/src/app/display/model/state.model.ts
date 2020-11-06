import { UserStory } from 'src/app/shared/model/user-story.model';
import { StoryFilter } from './filter.model';

export interface  StoryStateModel {
    loading: boolean;
    loaded: boolean;
    loadedStories: Array<UserStory>;
    selectedStory: UserStory;
    filter: StoryFilter;
    filteredStories: Array<UserStory>;
}

