import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserStory } from 'src/app/shared/model/user-story.model';
import * as fromStore from '../../state/story.actions';

@Component({
  selector: 'app-single-story',
  templateUrl: './single-story.component.html',
  styleUrls: ['./single-story.component.scss']
})
export class SingleStoryComponent implements OnInit {
  @Input() storyToDisplay: UserStory;
  @Input() preview = false;
  opened = false;

  constructor(
    private router: Router,
    private store: Store
  ) { }

  ngOnInit(): void {
  }

  goToStory(id: string): void {
    console.log(id); // TODO: Implement correctly
  }

  showStory(): void {
    this.opened = true;
  }

  hideStory(): void {
    this.opened = false;
  }

  editStory(): void {
    this.router.navigate(['/edit-story/' + this.storyToDisplay._id.$oid]);
  }

  deleteStory(): void {
    this.store.dispatch(new fromStore.DeleteStory(this.storyToDisplay._id.$oid));
  }

}
