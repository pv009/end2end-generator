import { UserStory } from 'src/app/shared/model/user-story.model';
import { StoryFilter } from '../model/filter.model';

export class LoadAllStories {
    static type = '[State] Loading all Stories';
}

export class LoadAllStoriesSuccess {
    static type = '[State] Loaded all stories successfully';
    constructor(public readonly payload: Array<UserStory>) {}
}

export class LoadAllStoriesFailed {
    static type = '[State] Loading all stories failed';
}


export class LoadStory {
    static type = '[State] Loading specific Story';
    constructor(public readonly id: string) {}
}

export class LoadStorySuccess {
    static type = '[State] Loaded specific story successfully';
    constructor(public readonly payload: UserStory) {}
}

export class LoadStoryFailed {
    static type = '[State] Loading specific story failed';
}

export class CreateStory {
    static type = '[State] Saving new story';
    constructor(public readonly story: UserStory) {}
}

export class UpdateStory {
    static type = '[State] Saving story';
    constructor(public readonly story: UserStory) {}
}

export class ChangeFilter {
    static type = '[State] Changing filter';
    constructor(public readonly filter: StoryFilter) {}
}

export class ClearFilter {
    static type = '[State] Clearing filter';
}

export type StoryActions =
    | LoadAllStories
    | LoadAllStoriesFailed
    | LoadAllStoriesSuccess
    | LoadStory
    | LoadStorySuccess
    | LoadStoryFailed
    | UpdateStory
    | CreateStory
    | ChangeFilter
    | ClearFilter;
