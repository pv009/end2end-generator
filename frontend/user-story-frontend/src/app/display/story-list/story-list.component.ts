import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserStory } from 'src/app/shared/model/user-story.model';
import { contexts } from '../../shared/text/constants';
import { StoryFilter } from '../model/filter.model';
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

  allContexts = contexts;

  mainContexts: Array<string> = [];
  subContexts: Array<string> = [];

  selectedFilter: StoryFilter = {
    mainContext: '',
    subContext: ''
  };

  constructor(
    private store: Store
  ) { }

  ngOnInit(): void {
    this.loadStories();
    this.getMainContexts();
  }

  private getMainContexts(): void {
    this.allContexts.forEach(context => {
      if (!this.mainContexts.includes(context.mainContext)) {
        this.mainContexts.push(context.mainContext);
      }
    });
  }

  private loadStories(): void {
    this.store.dispatch(new storeActions.LoadAllStories());
  }

  applyFilter(): void {
    this.store.dispatch(new storeActions.ChangeFilter(this.selectedFilter));
  }

  clearFilter(): void {
    this.selectedFilter = {
      mainContext: '',
      subContext: ''
    };
    this.subContexts = [];

    this.store.dispatch(new storeActions.ClearFilter());
  }

  filterSubContexts(): void {
    const filteredSubContexts: Array<string> = [];
    const correspondingContexts = this.allContexts.filter(context =>
      context.mainContext === this.selectedFilter.mainContext
    );
    correspondingContexts.forEach(context => {
      filteredSubContexts.push(context.subContext);
    });
    this.subContexts = filteredSubContexts;
    this.applyFilter();
  }

}
