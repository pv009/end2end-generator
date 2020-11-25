import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { BlogPost } from './model/blogpost.model';
import { BlogState } from './state/blog.state';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  @Select(BlogState.getBlogPosts) blogPosts$: Observable<BlogPost[]>;

  postShown = 1;

  constructor() { }

  ngOnInit() {
  }

  nextPost() {
    this.blogPosts$.pipe(take(1)).subscribe(posts => {
      if (this.postShown === posts.length) {
        this.postShown = 1;
      } else {
        this.postShown++;
      }
    });
  }

  previousPost() {
    this.blogPosts$.pipe(take(1)).subscribe(posts => {
      if (this.postShown === 1) {
        this.postShown = posts.length;
      } else {
        this.postShown--;
      }
    });
  }

}
