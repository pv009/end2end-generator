import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PaginationComponent } from './pagination/pagination.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { StoryListComponent } from './story-list/story-list.component';



@NgModule({
  declarations: [PaginationComponent, DetailViewComponent, StoryListComponent],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DisplayModule { }
