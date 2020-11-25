import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatomoModule } from 'ngx-matomo';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Profile, Project, Publication, ResearchFocus } from '../model/profile.model';
import { ProfileRoutingModule } from '../profile-routing.module';
import { ProfileState } from '../state/profile.state';
import { ProfileService } from './profile.service';

const exampleProfile: Profile = {
    objectId: '',
    title: 'Testprofil',
    status: 'saved',
    description: 'Testbeschreibung',
    logoURL: 'http://v22019027841683103.goodsrv.de:1337/parse/files/edecy_parse/3751bb5e1952cc648c00a0e408492006_edecy_keyvisual.png',
    category: [],
    specialty1: 'Informationswissenschaften und Mathematik',
    specialty2: 'Informationswissenschaften',
    specialty3: '',
    specialties3: [
        'Komplexitätstheorie',
        'Theorie der Programmiersprachen',
        'Theorie der formalen Methoden'
    ],
    organisation: 'Edecy UG',
    public: false,
    streetNo: 'Wendenstraße 130',
    plz: '20537',
    city: 'Hamburg',
    uid: [],
    tags: [
        'Test',
        'Edecy',
        'Hallo'
    ],
    loginRequired: true,
    researchFocus: [
        {
            title: 'Testfokus',
            description: 'Testbeschreibung'
        }
    ],
    projects: [
        {
            title: 'Testprojekt',
            description: 'Testbeschreibung'
        }
    ],
    publications: [
        {
            title: 'Testpublikation',
            description: 'Testbeschreibung'
        }
    ],
    infrastructure: [],
    orgSize: '1 - 10',
    companyType: 'KMU',
    instituteType: '',
    projectLeadershipPossible: true,
    interest: [
        'Kooperationsprojekt',
        'Auftragsforschung',
        'gemeinsame Lehre',
        'Abschlussarbeit'
    ]
};

const exampleUID = 'Xu2S9WVTtC';

describe('ProfileService', () => {
    let service: ProfileService;
    let store: Store;

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
                HttpClientTestingModule,
                BrowserAnimationsModule
            ],
            declarations: [],
            providers: [
                ProfileService,
                MatomoHelperService
            ]
        });

        store = TestBed.inject(Store);

    });

    beforeEach(inject([ProfileService], s => {
        service = s;
    }));

    it('creates profile', async (done) => {
        const creation = service.createProfile(exampleProfile, true);

        creation.then(res => {
            exampleProfile.objectId = res.id;
            exampleProfile.title = 'Testprofil Updated';
            console.log('Created profile with id ', exampleProfile.objectId);
            expect(res.id).toEqual(jasmine.any(String));
            done();
        }).catch(error => {
            console.error('Error creating profile: ', error);
        });
    });

    it('should update profile', async (done) => {
        const creation = service.saveProfile(exampleProfile);

        creation.then(res => {
            expect(res).toBe(true);
            done();
        }).catch(error => {
            console.error('Error saving profile: ', error);
        });
    });

    it('should load created profile', async (done) => {
        const loading = service.loadProfile(exampleProfile.objectId);

        loading.then(res => {
            console.log(res);
            const profile = res.toJSON();
            expect(profile.objectId).toEqual(exampleProfile.objectId);
            done();
        }).catch(error => {
            console.error('Error loading profile: ', error);
        });
    });

    it('should add a research focus', async (done) => {
        const exampleFocus: ResearchFocus = {
            title: 'Testfokus2',
            description: 'Testbeschreibung'
        };
        service.addFocus(exampleFocus, exampleProfile.objectId, true);
        setTimeout(() => {
            const loading = service.loadProfile(exampleProfile.objectId);

            loading.then(res => {
                const profile = res.toJSON();
                expect(profile.researchFocus.length).toEqual(2);
                done();
            }).catch(error => {
                console.error('Error loading profile: ', error);
            });
        }, 3000);
    });

    it('should add a project', async (done) => {
        const exampleProject: Project = {
            title: 'Testprojekt2',
            description: 'Testbeschreibung'
        };
        service.addProject(exampleProject, exampleProfile.objectId, true);
        setTimeout(() => {
            const loading = service.loadProfile(exampleProfile.objectId);

            loading.then(res => {
                const profile = res.toJSON();
                expect(profile.projects.length).toEqual(2);
                done();
            }).catch(error => {
                console.error('Error loading profile: ', error);
            });
        }, 3000);
    });

    it('should add a publication', async (done) => {
        const examplePublication: Publication = {
            title: 'Testpublikation2',
            description: 'Testbeschreibung'
        };
        service.addPublication(examplePublication, exampleProfile.objectId, true);
        setTimeout(() => {
            const loading = service.loadProfile(exampleProfile.objectId);

            loading.then(res => {
                console.log(res);
                const profile = res.toJSON();
                expect(profile.publications.length).toEqual(2);
                done();
            }).catch(error => {
                console.error('Error loading profile: ', error);
            });
        }, 3000);
    });

    it('should load profile owner', async (done) => {
        const query = service.loadProfileOwner('TzUP4MjxTE');

        query.then(res => {
            const owner = res[0].toJSON();
            expect(owner.objectId).toEqual(exampleUID);
            done();
        }).catch(error => {
            console.error('Error loading owner: ', error);
        });
    });

    it('should delete created profile', async (done) => {
        const deletion = service.deleteProfile(exampleProfile.objectId);

        deletion.then(res => {
            expect(res).toBe(true);
            done();
        }).catch(error => {
            console.error('Error deleting profile: ', error);
        });
    });

});
