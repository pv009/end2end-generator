export class LoadAllStories {
    static type = '[State] Loading all Stories';
}

export class LoadAllStoriesSuccess {
    static type = '[State] Loaded all stories successfully';
}

export class LoadAllStoriesFailed {
    static type = '[State] Loading all stories failed';
}


export class LoadStory {
    static type = '[State] Loading specific Story';
}

export class LoadStorySuccess {
    static type = '[State] Loaded specific story successfully';
}

export class LoadStoryFailed {
    static type = '[State] Loading specific story failed';
}

export type StoryActions =
    | LoadAllStories
    | LoadAllStoriesFailed
    | LoadAllStoriesSuccess
    | LoadStory
    | LoadStorySuccess
    | LoadStoryFailed;
