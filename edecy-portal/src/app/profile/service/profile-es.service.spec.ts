import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatomoModule } from 'ngx-matomo';
import { take } from 'rxjs/operators';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileResponse } from '../model/profileES.model';
import { ProfileQuery } from '../model/query.model';
import { ProfileRoutingModule } from '../profile-routing.module';
import { ProfileState } from '../state/profile.state';
import { ProfileEsService } from './profile-es.service';

describe('ProfileEsService', () => {
    let service: ProfileEsService;
    let store: Store;
    let http: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                SharedModule,
                ProfileRoutingModule,
                ReactiveFormsModule,
                FormsModule,
                NgxsModule.forRoot([ProfileState]),
                MaterialFileInputModule,
                ImageCropperModule,
                FroalaEditorModule,
                FroalaViewModule,
                MatomoModule,
                RouterTestingModule,
                HttpClientModule,
                BrowserAnimationsModule,
            ],
            declarations: [],
            providers: [
                ProfileEsService,
                MatomoHelperService
            ]
        });

        store = TestBed.inject(Store);
        http = TestBed.inject(HttpClient);

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    beforeEach(inject([ProfileEsService], s => {
        service = s;
    }));


    it('gets Profiles', (done: DoneFn) => {
        service.getProfiles(50, 1).pipe(take(1)).subscribe((result: ProfileResponse) => {
            expect(result.data.items.length > 0);
            done();
        }, (error: any) => {
            console.error('Error loading ', error);
        });
    });

    it('searches Profiles', (done: DoneFn) => {
        const query: ProfileQuery = {
            q: 'Maschinenbau',
            city: 'Stuttgart',
            size: 50,
            page: 1,
        };
        service.searchProfiles(query, true).pipe(take(1)).subscribe((result: ProfileResponse) => {
            expect(result.data.items.length > 0);
            done();
        }, (error: any) => {
            console.error('Error loading ', error);
        });
    });

    it('loads one profile', (done: DoneFn) => {
        const id = '3lcfAXQB8DfeOPYuyb4N';
        service.loadProfile(id).pipe(take(1)).subscribe((result: ProfileResponse) => {
            expect(result.data.items.length > 0);
            done();
        }, (error: any) => {
            console.error('Error loading ', error);
        });
    });

});
