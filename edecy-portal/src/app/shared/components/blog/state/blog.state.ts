import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { BlogPost, BlogStateModel } from '../model/blogpost.model';
import { BlogService } from '../service/blog.service';
import * as blogActions from './blog.actions';

const blogStateDefaults: BlogStateModel = {
    blogPosts: [],
    loading: false,
    loaded: false
};
@Injectable({
    providedIn: 'root'
  })
@State<BlogStateModel>({
    name: 'blogState',
    defaults: blogStateDefaults
})
export class BlogState {
    constructor(
        private blogService: BlogService
    ) { }

    @Selector()
    static getBlogPosts(state: BlogStateModel) {
        return state.blogPosts;
    }

    @Action(blogActions.LoadPosts)
    loadPosts(
        ctx: StateContext<BlogStateModel>,
    ) {
        ctx.patchState({
            loaded: false,
            loading: true
        });

        this.blogService.loadBlogPosts()
            .then((results: any) => {
                const loadedPosts: Array<BlogPost> = [];
                for (const post of results) {
                    loadedPosts.push(post.toJSON());
                }
                ctx.dispatch(new blogActions.LoadPostsSuccessfully(loadedPosts));
                console.log('blog results: ', loadedPosts);
            })
            .catch(error => {
                console.error('Error loading chats', error);
                ctx.dispatch(new blogActions.LoadPostsFailed());
            });
    }

    @Action(blogActions.LoadPostsSuccessfully)
    loadPostsSuccessfully(
        ctx: StateContext<BlogStateModel>,
        { payload }: blogActions.LoadPostsSuccessfully
    ) {
        ctx.patchState({
            loading: false,
            loaded: true,
            blogPosts: payload
        });
    }

    @Action(blogActions.LoadPostsFailed)
    loadPostsFailed(
        ctx: StateContext<BlogStateModel>
    ) {
        ctx.patchState({
            loaded: false,
            loading: false,
            blogPosts: []
        });
    }

}
