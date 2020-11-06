import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';
import { PaginationComponent } from './pagination/pagination.component';
import { SingleStoryComponent } from './story-list/single-story/single-story.component';
import { StoryListComponent } from './story-list/story-list.component';



@NgModule({
  declarations: [
    PaginationComponent,
    StoryListComponent,
    SingleStoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    SingleStoryComponent
  ]
})
export class DisplayModule { }
