export interface UserStory {
    objectId?: string;
    createdAt?: string;
    updatedAt?: string;
    mainContext: string;
    subContext: string;
    userRole: string;
    goal: string;
    reason: string;
    acceptenceCriteria: Array<string>;
}
