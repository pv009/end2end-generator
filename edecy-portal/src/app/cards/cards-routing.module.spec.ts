import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2 } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { LightboxConfig } from 'ngx-lightbox';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatomoInjector, MatomoTracker } from 'ngx-matomo';
import { ContactEdecyModule } from '../contact-edecy/contact-edecy.module';
import { ProfileModule } from '../profile/profile.module';
import { MatomoHelperService } from '../shared/services/matomo-helper.service';
import { ScrollService } from '../shared/services/scroll.service';
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
import { routes } from './cards-routing.module';
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


let location: Location;
let router: Router;
let fixture;
const exampleCardId = 'tBJFLv4xP7';

describe('CardsRoutingModule', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(routes),
                NgxsModule.forRoot([CardsState]),
                CommonModule,
                MatSnackBarModule,
                ReactiveFormsModule,
                FormsModule,
                MaterialFileInputModule,
                ImageCropperModule,
                ContactEdecyModule,
                MatExpansionModule,
                RouterModule,
                FroalaEditorModule,
                FroalaViewModule,
                ProfileModule,
                NgxImageZoomModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
            ],
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
            providers: [
                CardsService,
                MatomoHelperService,
                MatomoInjector,
                MatomoTracker,
                LightboxConfig,
                FormBuilder,
                ScrollService,
                Renderer2,
                MatDialog,
                BreakpointObserver,
            ]
        });

        router = TestBed.inject(Router);
        location = TestBed.inject(Location);
        fixture = TestBed.createComponent(CardListComponent);
        router.initialNavigation();
    });

    it('navigates to home', fakeAsync(() => {
        router.navigate(['']);
        tick();
        expect(location.path()).toBe('/');
    }));

    it('navigates to create-request', fakeAsync(() => {
        router.navigate(['create-request']);
        tick();
        expect(location.path()).toBe('/create-request');
    }));

    it('navigates to list', fakeAsync(() => {
        router.navigate(['list']);
        tick();
        expect(location.path()).toBe('/list');
    }));

    it('navigates to my cards', fakeAsync(() => {
        router.navigate(['my-cards']);
        tick();
        expect(location.path()).toBe('/my-cards');
    }));

    it('navigates to edit card ', fakeAsync(() => {
        router.navigate(['edit/' + exampleCardId]);
        tick();
        expect(location.path()).toBe('/edit/' + exampleCardId);
    }));

    it('navigates to card ', fakeAsync(() => {
        router.navigate([exampleCardId]);
        tick();
        expect(location.path()).toBe('/' + exampleCardId);
    }));
});
