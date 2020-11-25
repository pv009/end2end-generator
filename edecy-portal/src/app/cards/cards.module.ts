import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { FunctionTeaserComponent } from '../auth/function-teaser/function-teaser.component';
import { ChatState } from '../chat/state/chats.state';
import { ContactEdecyModule } from '../contact-edecy/contact-edecy.module';
import { ProfileComponent } from '../profile/profile.component';
import { ProfileModule } from '../profile/profile.module';
import { SharedModule } from '../shared/shared.module';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { DetailsComponent } from './card-detail/details/details.component';
import { CardListItemComponent } from './card-list-item/card-list-item.component';
import { CardFilterComponent } from './card-list/card-filter/card-filter.component';
import { CardListComponent } from './card-list/card-list.component';
import { NewCardComponent } from './card-list/new-card/new-card.component';
import { ProfileFilterComponent } from './card-list/profile-filter/profile-filter.component';
import { ProfileListComponent } from './card-list/profile-list/profile-list.component';
import { SingleProfileEsComponent } from './card-list/profile-list/single-profile-es/single-profile-es.component';
import { ProjectListComponent } from './card-list/project-list/project-list.component';
import { CardsRoutingModule } from './cards-routing.module';
import { CardsComponent } from './cards.component';
import { CategoryInfoComponent } from './category-info/category-info.component';
import { CreateRequestComponent } from './create-request/create-request.component';
import { CreateSuccessComponent } from './create-success/create-success.component';
import { EditCardComponent } from './my-cards/edit-card/edit-card.component';
import { MyCardsComponent } from './my-cards/my-cards.component';
import { CardsService } from './service/cards.service';
import { EdecyInfoDialogComponent } from './single-card/edecy-info-dialog/edecy-info-dialog.component';
import { SingleCardComponent } from './single-card/single-card.component';
import { CardsState } from './state/cards.state';


@NgModule({
  declarations: [
    CardsComponent,
    CreateRequestComponent,
    ProjectListComponent,
    CardListComponent,
    SingleCardComponent,
    NewCardComponent,
    CardDetailComponent,
    DetailsComponent,
    MyCardsComponent,
    EditCardComponent,
    CreateSuccessComponent,
    CardListItemComponent,
    CategoryInfoComponent,
    EdecyInfoDialogComponent,
    ProfileListComponent,
    CardFilterComponent,
    ProfileFilterComponent,
    SingleProfileEsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CardsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxsModule.forFeature([CardsState, ChatState]),
    MaterialFileInputModule,
    ImageCropperModule,
    ContactEdecyModule,
    MatExpansionModule,
    RouterModule,
    FroalaEditorModule,
    FroalaViewModule,
    ProfileModule,
    NgxImageZoomModule
  ],
  providers: [CardsService],
  entryComponents: [
    FunctionTeaserComponent,
    EdecyInfoDialogComponent,
    ProfileComponent
  ],
  exports: [
    MyCardsComponent,
    ProfileComponent,
    MyCardsComponent,
    CreateRequestComponent,
  ]
})
export class CardsModule { }
