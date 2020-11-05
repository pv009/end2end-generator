import { Injectable } from '@angular/core';
import { UserStory } from 'src/app/shared/model/user-story.model';

@Injectable({
  providedIn: 'root'
})
export class SaveService {

  constructor() { }

  createStory(story: UserStory): void {
    console.log(story);
    // TODO: Implement with api
  }

  updateStory(story: UserStory): void {
    console.log(story);
    // TODO: Implement with api
  }
}
