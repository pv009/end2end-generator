import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserStory } from 'src/app/shared/model/user-story.model';
import * as storeActions from '../state/story.actions';
import { StoryState } from '../state/story.state';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {
  @Select(StoryState.allStories) loadedStories$: Observable<UserStory[]>;

  storyShown: UserStory;
  contextFilter: '';

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.loadStories();
  }

  private loadStories(): void {
    this.store.dispatch(new storeActions.LoadAllStories());
  }



}
