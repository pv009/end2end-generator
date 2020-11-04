import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailViewComponent } from './display/detail-view/detail-view.component';
import { StoryListComponent } from './display/story-list/story-list.component';
import { CreateStoryComponent } from './enter/create-story/create-story.component';

const routes: Routes = [
  {
    path: '/all-stories',
    component: StoryListComponent,
    children: [
      {
        path: ':id',
        component: DetailViewComponent,
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '/create-story',
    component: CreateStoryComponent,
  },
  {
    path: '/edit-story/:id',
    component: CreateStoryComponent
  },
  {
    path: '',
    redirectTo: '/all-stories',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
