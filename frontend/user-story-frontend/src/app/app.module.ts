import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayModule } from './display/display.module';
import { StoryState } from './display/state/story.state';
import { EnterModule } from './enter/enter.module';
import { SharedModule } from './shared/shared.module';

export const ngxsForRoot = NgxsModule.forRoot([StoryState], {
  developmentMode: !environment.production
});

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    SharedModule,
    ngxsForRoot,
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production
    }),
    EnterModule,
    DisplayModule
    /* NgxsReduxDevtoolsPluginModule.forRoot({
      name: 'Edecy-portal',
      disabled: environment.production
    }), */
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
