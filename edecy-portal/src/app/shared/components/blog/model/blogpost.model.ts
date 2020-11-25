export interface BlogPost {
    objectId?: string;
    order: number;
    url: string;
    pictureURL: string;
    title: string;
    snippet: string;
    showPost: boolean;
}

export interface BlogStateModel {
    blogPosts: Array<BlogPost>;
    loading?: boolean;
    loaded?: boolean;
}
