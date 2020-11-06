import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DisplayModule } from '../display/display.module';
import { SharedModule } from '../shared/shared.module';
import { CreateStoryComponent } from './create-story/create-story.component';



@NgModule({
  declarations: [CreateStoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    DisplayModule
  ]
})
export class EnterModule { }
