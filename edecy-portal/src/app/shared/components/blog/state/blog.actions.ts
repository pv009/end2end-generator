import { BlogPost } from '../model/blogpost.model';

export class LoadPosts {
    static readonly type = '[BLOG] Fetching Blogposts';
}

export class LoadPostsSuccessfully {
    static readonly type = '[BLOG] Fetched Blogposts successfully';
    constructor(public readonly payload: Array<BlogPost>) {}
}

export class LoadPostsFailed {
    static readonly type = '[BLOG] Fetching Blogposts failed';
    constructor(public readonly payload?: any) {}
}

export type ChatActions = LoadPosts
| LoadPostsSuccessfully
| LoadPostsFailed;
