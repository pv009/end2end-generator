import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { MatomoModule } from 'ngx-matomo';
import { AuthOverlayComponent } from './auth-overlay/auth-overlay.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogService } from './components/blog/service/blog.service';
import { BlogState } from './components/blog/state/blog.state';
import { ButtonListComponent } from './components/button-list/button-list.component';
import { ChatBarComponent } from './components/chat-bar/chat-bar.component';
import { OtherChatsComponent } from './components/chat-bar/other-chats/other-chats.component';
import { SingleBarComponent } from './components/chat-bar/single-bar/single-bar.component';
import { CookieBannerComponent } from './components/cookie-banner/cookie-banner.component';
import { CurrentpageComponent } from './components/currentpage/currentpage.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileOverviewComponent } from './components/profile-overview/profile-overview.component';
import { SideNavigationComponent } from './components/side-navigation/side-navigation.component';
import { TabNavigationComponent } from './components/tab-navigation/tab-navigation.component';
import { MaterialModule } from './material.module';
import { DeletehtmlPipe } from './pipes/deletehtml.pipe';
import { LogService } from './services/log.service';
import { MatomoHelperService } from './services/matomo-helper.service';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    RouterModule,
    DragDropModule,
    NgxsModule.forFeature([BlogState]),
    MatomoModule,
    FroalaEditorModule,
    FroalaViewModule,
  ],
  declarations: [
    SideNavigationComponent,
    CurrentpageComponent,
    NavbarComponent,
    ButtonListComponent,
    CookieBannerComponent,
    BlogComponent,
    ProfileOverviewComponent,
    FooterComponent,
    TabNavigationComponent,
    ChatBarComponent,
    SingleBarComponent,
    OtherChatsComponent,
    DeletehtmlPipe,
    AuthOverlayComponent,
    NotFoundComponent
  ],
  providers: [
    BlogService,
    LogService,
    MatomoHelperService
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    SideNavigationComponent,
    CurrentpageComponent,
    NavbarComponent,
    BlogComponent,
    ProfileOverviewComponent,
    FooterComponent,
    TabNavigationComponent,
    AuthOverlayComponent,
    NotFoundComponent
  ]
})
export class SharedModule { }
