import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PaginationComponent } from './pagination/pagination.component';
import { StoryListComponent } from './story-list/story-list.component';
import { SingleStoryComponent } from './story-list/single-story/single-story.component';



@NgModule({
  declarations: [
    PaginationComponent,
    StoryListComponent,
    SingleStoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DisplayModule { }
