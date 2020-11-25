import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import { environment } from 'src/environments/environment';

Parse.initialize(environment.parse.appID, environment.parse.masterKey);
(Parse as any).serverURL = environment.parse.serverURL;

@Injectable({
    providedIn: 'root'
})
export class BlogService {
    constructor(
    ) { }

    loadBlogPosts() {
        const query = new Parse.Query('BlogPosts');
        query.equalTo('showPost', true);

        return query.find();
    }
}
