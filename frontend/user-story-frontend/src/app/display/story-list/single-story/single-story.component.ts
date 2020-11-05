import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserStory } from 'src/app/shared/model/user-story.model';

@Component({
  selector: 'app-single-story',
  templateUrl: './single-story.component.html',
  styleUrls: ['./single-story.component.scss']
})
export class SingleStoryComponent implements OnInit {
  @Input() storyToDisplay: UserStory;
  opened = false;

  constructor(
    private router: Router
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
    this.router.navigate(['/edit-story/' + this.storyToDisplay.objectId]);
  }

}
