import { LayoutModule } from '@angular/cdk/layout';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { CookieService } from 'ngx-cookie-service';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LightboxModule } from 'ngx-lightbox';
import { MatomoModule } from 'ngx-matomo';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { SettingsComponent } from './auth/settings/settings.component';
import { AuthState } from './auth/state/auth.state';
import { CardsModule } from './cards/cards.module';
import { CategoryInfoComponent } from './cards/category-info/category-info.component';
import { CreateRequestComponent } from './cards/create-request/create-request.component';
import { EdecyInfoDialogComponent } from './cards/single-card/edecy-info-dialog/edecy-info-dialog.component';
import { ChatModule } from './chat/chat.module';
import { SuccessMessageComponent } from './contact-edecy/book-offer/success-message/success-message.component';
import { ContactEdecyModule } from './contact-edecy/contact-edecy.module';
import { HomeComponent } from './home/home.component';
import { CompareValidatorDirective } from './libs/directives/compare-validator.directive';
import { CreateProfileComponent } from './profile/create-profile/create-profile.component';
import { EditFocusComponent } from './profile/edit-focus/edit-focus.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileModule } from './profile/profile.module';
import { BlogComponent } from './shared/components/blog/blog.component';
import { OtherChatsComponent } from './shared/components/chat-bar/other-chats/other-chats.component';
import { CookieBannerComponent } from './shared/components/cookie-banner/cookie-banner.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProfileOverviewComponent } from './shared/components/profile-overview/profile-overview.component';
import { TabNavigationComponent } from './shared/components/tab-navigation/tab-navigation.component';
import { SharedModule } from './shared/shared.module';
import { ExclusiveOfferComponent } from './static-pages/prices/exclusive-offer/exclusive-offer.component';
import { PrivacyPolicyDialogComponent } from './static-pages/privacy-policy/privacy-policy-dialog/privacy-policy-dialog.component';
import { StaticPagesModule } from './static-pages/static-pages.module';
import { TosDialogComponent } from './static-pages/terms-of-use/tos-dialog/tos-dialog.component';

registerLocaleData(localeDe, 'de');


if (environment.production) {
  Sentry.init({
    dsn: environment.sentry.dsn,
    release: 'edecy-portal@' + environment.version,
    integrations: [
      new Integrations.CaptureConsole({
        levels: ['error']
      })
    ],
  });


}

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() { }
  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
    Sentry.showReportDialog({ eventId });
  }
}


@NgModule({
  declarations: [
    AppComponent,
    CompareValidatorDirective,
    HomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    MatomoModule,
    MatDialogModule,
    AppRoutingModule,
    RouterModule,
    AuthModule,
    LayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ProfileModule,
    SharedModule,
    CardsModule,
    ChatModule,
    ImageCropperModule,
    NgxsModule.forRoot([AuthState], {
      developmentMode: !( environment.production ||
        environment.staging)
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled:
        environment.production ||
        environment.staging
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      name: 'Edecy-portal',
      disabled: environment.production
    }),
    ChatModule,
    StaticPagesModule,
    ContactEdecyModule,
    MatBottomSheetModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    LightboxModule,
    ServiceWorkerModule.register('custom-service-worker.js', { enabled: environment.production || environment.staging }),
    HttpClientModule
  ],
  entryComponents: [
    PrivacyPolicyDialogComponent,
    TosDialogComponent,
    CookieBannerComponent,
    CategoryInfoComponent,
    EdecyInfoDialogComponent,
    ProfileComponent,
    RegisterComponent,
    LoginComponent,
    CreateProfileComponent,
    EditFocusComponent,
    BlogComponent,
    ProfileOverviewComponent,
    FooterComponent,
    TabNavigationComponent,
    CreateRequestComponent,
    SettingsComponent,
    OtherChatsComponent,
    SuccessMessageComponent,
    ExclusiveOfferComponent,
  ],
  providers: [
    CookieService,
    AuthGuard,
    MatBottomSheet,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    { provide: 'isBrowser', useValue: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
