import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatomoModule } from 'ngx-matomo';
import { SharedModule } from '../shared/shared.module';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditFocusComponent } from './edit-focus/edit-focus.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { EditPublicationComponent } from './edit-publication/edit-publication.component';
import { ProfileCardComponent } from './profile-card/profile-card.component';
import { ContactProfileComponent } from './profile-es/contact-profile/contact-profile.component';
import { ProfileEsComponent } from './profile-es/profile-es.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { ProfileState } from './state/profile.state';



@NgModule({
  declarations: [
    ProfileComponent,
    CreateProfileComponent,
    EditFocusComponent,
    ProfileEsComponent,
    ProfileCardComponent,
    ContactProfileComponent,
    EditProjectComponent,
    EditPublicationComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxsModule.forFeature([ProfileState]),
    MaterialFileInputModule,
    ImageCropperModule,
    FroalaEditorModule,
    FroalaViewModule,
    MatomoModule
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
