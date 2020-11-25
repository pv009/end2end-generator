import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Lightbox } from 'ngx-lightbox';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserModel } from '../auth/model/user.model';
import { AuthState } from '../auth/state/auth.state';
import { DeleteDialogComponent } from '../auth/update-profile/dialogs/delete-dialog/delete-dialog.component';
import { Card } from '../cards/model/card.model';
import * as fromCards from '../cards/state/cards.actions';
import { CardsState } from '../cards/state/cards.state';
import { FeedbackComponent } from '../contact-edecy/feedback/feedback.component';
import { IconServiceService } from '../icon-service/icon-service.service';
import { MatomoHelperService } from '../shared/services/matomo-helper.service';
import { EditFocusComponent } from './edit-focus/edit-focus.component';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { EditPublicationComponent } from './edit-publication/edit-publication.component';
import { Profile, Project, Publication, ResearchFocus } from './model/profile.model';
import { ProfileProject, ProfilePublications, ProfileResearchFocus } from './model/profileES.model';
import * as fromProfile from './state/profile.actions';
import { ProfileState } from './state/profile.state';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(ProfileState.getSelectedProfile) selectedProfile$: Observable<Profile>;
  @Select(ProfileState.getUserProfile) userProfile$: Observable<Profile>;
  @Select(ProfileState.profileOwner) profileOwner$: Observable<string>;
  @Select(CardsState.getUsersCards) profileRequests$: Observable<Card[]>;
  @ViewChild('profileNavigation') profileNavigation: ElementRef;
  @ViewChild('allgemein') allgemein: ElementRef;
  @ViewChild('gesuche') gesuche: ElementRef;
  @ViewChild('projekte') projekte: ElementRef;
  @ViewChild('publikationen') publikationen: ElementRef;
  @ViewChild('schwerpunkte') schwerpunkte: ElementRef;


  @Output() showColumnNavigation = new EventEmitter<boolean>();
  @Input() embedded = false;

  inMyProfileView: boolean;
  showProfile = true;
  showEditor = false;

  editFocuses = false;
  selectedFocus: ResearchFocus;
  focusIndex: number;
  newFocus: ResearchFocus = {
    title: '',
    description: ''
  };
  focusesLength: number;

  editProjects = false;
  selectedProject: Project;
  projectIndex: number;
  newProject: Project = {
    title: '',
    description: ''
  };
  projectsLength: number;

  editPublications = false;
  selectedPublication: Publication;
  publicationIndex: number;
  newPublication: Publication = {
    title: '',
    description: ''
  };
  publicationsLength: number;

  profileID = '';
  currentUser: UserModel;
  currentProfile$: Observable<Profile>;
  profileLoaded: Profile;

  destroy$: Subject<boolean> = new Subject<boolean>();

  onlineStateFontSize = 15;

  currentPage = 'Profil';

  desktopDialog = false;

  shortDescription = true;

  cardTypeShown = 'requests';

  profileBlockMargin = 12;
  linesShown = 3;

  sectionShown = 'Allgemein';

  publicationOpen: ProfilePublications;
  projectOpen: ProfileProject;
  focusOpen: ProfileResearchFocus;

  requestsNavLength = 93;

  inSideBar = false;

  userCard = false;

  smallView = false;

  constructor(
    private store: Store,
    private lightbox: Lightbox,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private titleService: Title,
    private metaService: Meta,
    private matomoHelper: MatomoHelperService,
    private iconService: IconServiceService
  ) { }

  private albums: Array<{ src: string, caption: string, thumb: string }> = [];

  ngOnInit() {
    this.iconService.registerIcons();
    this.loadProfile();
    this.checkDesktop();

    this.profileOwner$.pipe(takeUntil(this.destroy$)).subscribe(ownerID => {
      if (ownerID) {
        this.store.dispatch(new fromCards.LoadProfileCards(ownerID));
      }
    });

    this.calculateNavRequestsLength();

  }

  private checkDesktop() {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.desktopDialog = true;
    }

    if (this.breakpointObserver.isMatched('(max-width: 1279px)')) {
      this.smallView = true;
    }
  }

  private loadProfile() {
    this.loadMyProfile();
  }

  private loadPublicProfile() {
    this.profileID = this.route.children.toString().substr(11, 10);
    this.store.dispatch(new fromProfile.LoadProfile(this.profileID));
    this.currentProfile$ = this.selectedProfile$;
    this.selectedProfile$.pipe(takeUntil(this.destroy$)).subscribe(profile => {
      if (profile && Object.entries(profile).length && this.profileLoaded === undefined) {
        console.log('reached');
        this.profileLoaded = profile;
        this.focusesLength = profile.researchFocus && profile.researchFocus.length;
        this.projectsLength = profile.projects && profile.projects.length;
        this.publicationsLength = profile.publications && profile.publications.length;
      }
    });
    this.inMyProfileView = false;
  }

  private loadMyProfile() {
    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.store.dispatch(new fromProfile.LoadUserProfile(user.attributes.profileId));
      this.currentProfile$ = this.userProfile$;
      this.userProfile$.pipe(takeUntil(this.destroy$)).subscribe(profile => {
        if (profile && Object.entries(profile).length) {
          this.profileLoaded = profile;
          this.focusesLength = profile.researchFocus && profile.researchFocus.length;
          this.projectsLength = profile.projects && profile.projects.length;
          this.publicationsLength = profile.publications && profile.publications.length;
        }
      });
      this.inMyProfileView = true;
      if (this.router.url.indexOf('my-cards') < 0 && this.router.url.indexOf('profiles/') < 0) {
        this.inSideBar = true;
      }
    });
  }

  ngOnDestroy() {
    if (!this.embedded) {
      this.store.dispatch(new fromProfile.ClearSelectedProfile());
    }

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  deleteHTMLFromString(htmlString: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlString;
    return tmp.textContent || tmp.innerText || '';
  }

  openImage() {
    if (!this.embedded) {
      let src = '';
      this.currentProfile$.pipe(take(1)).subscribe(profile => {
        src = profile.logoURL;
      });
      const caption = '';
      const thumb = '';
      const userImage = {
        src,
        caption,
        thumb
      };
      this.albums = [userImage];
      this.lightbox.open(this.albums);
    } else if (this.embedded) {
      this.goToProfile();
    }
  }

  changePublic() {
    console.log(this.profileLoaded);
    const updatedProfile: Profile = Object.assign({}, this.profileLoaded);
    if (this.profileLoaded.status === 'saved') {
      updatedProfile.status = 'published';
    } else {
      updatedProfile.status = 'saved';
    }
    this.store.dispatch(new fromProfile.SaveProfile(updatedProfile));
    this.currentProfile$ = this.userProfile$;
  }

  changeFocusEdit(editMode: boolean) {
    this.editFocuses = editMode;
    this.showProfile = true;
    if (!editMode) {
      this.loadProfile();
    }
    this.showColumnNavigation.emit(editMode);
  }

  editFocus(focus: ResearchFocus, index: number) {
    this.selectedFocus = focus;
    this.focusIndex = index;
    if (this.desktopDialog) {
      this.dialog.open(EditFocusComponent, {
        minHeight: '700px',
        minWidth: '800px',
        data: { desktopDialog: true, editMode: false, currentFocus: focus, currentIndex: index }
      });
    } else {
      this.editFocuses = true;
      this.showProfile = false;
      this.showColumnNavigation.emit(true);
    }
  }

  deleteFocus(index: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '473px',
      data: {
        content:
          `Sind Sie sicher,
          dass Sie diesen Schwerpunkt
          endgültig löschen
          wollen?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        let newProfile = Object.assign({}, this.profileLoaded);
        const focuses = [];
        newProfile.researchFocus.forEach(focus => {
          focuses.push(focus);
        });
        focuses.splice(index, 1);
        newProfile = {
          ...newProfile,
          researchFocus: focuses
        };
        this.store.dispatch(new fromProfile.SaveProfile(newProfile));

        this.loadProfile();
      }
    });
  }

  changeProjectEdit(editMode: boolean) {
    this.editProjects = editMode;
    this.showProfile = true;
    if (!editMode) {
      this.loadProfile();
    }
    this.showColumnNavigation.emit(editMode);
  }

  editProject(project: Project, index: number) {
    this.selectedProject = project;
    this.projectIndex = index;
    if (this.desktopDialog) {
      this.dialog.open(EditProjectComponent, {
        minHeight: '700px',
        minWidth: '800px',
        data: { desktopDialog: true, editMode: false, currentProject: project, currentIndex: index }
      });
    } else {
      this.editProjects = true;
      this.showProfile = false;
      this.showColumnNavigation.emit(true);
    }
  }

  deleteProject(index: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '473px',
      data: {
        content:
          `Sind Sie sicher,
          dass Sie dieses Projekt
          endgültig löschen
          wollen?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        let newProfile = Object.assign({}, this.profileLoaded);
        const projects = [];
        newProfile.projects.forEach(project => {
          projects.push(project);
        });
        projects.splice(index, 1);
        newProfile = {
          ...newProfile,
          projects
        };
        this.store.dispatch(new fromProfile.SaveProfile(newProfile));

        this.loadProfile();
      }
    });
  }

  changePublicationEdit(editMode: boolean) {
    this.editPublications = editMode;
    this.showProfile = true;
    if (!editMode) {
      this.loadProfile();
    }
    this.showColumnNavigation.emit(editMode);
  }

  editPublication(publication: Publication, index: number) {
    this.selectedPublication = publication;
    this.publicationIndex = index;
    if (this.desktopDialog) {
      this.dialog.open(EditPublicationComponent, {
        minHeight: '700px',
        minWidth: '800px',
        data: { desktopDialog: true, editMode: false, currentPublication: publication, currentIndex: index }
      });
    } else {
      this.editPublications = true;
      this.showProfile = false;
      this.showColumnNavigation.emit(true);
    }
  }

  deletePublication(index: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '473px',
      data: {
        content:
          `Sind Sie sicher,
          dass Sie diese Publikation
          endgültig löschen
          wollen?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        let newProfile = Object.assign({}, this.profileLoaded);
        const publications = [];
        newProfile.publications.forEach(publication => {
          publications.push(publication);
        });
        publications.splice(index, 1);
        newProfile = {
          ...newProfile,
          publications
        };
        this.store.dispatch(new fromProfile.SaveProfile(newProfile));

        this.loadProfile();
      }
    });
  }

  openProfile() {
    console.log('Open Profile!');
    console.log(this.profileLoaded.objectId);
    this.router.navigate(['/profiles/' + this.profileLoaded.objectId]);
  }

  showMoreText() {
    this.shortDescription = false;
    this.linesShown = 1000;
  }

  openFeedbackDialog() {
    console.log('Open Feedback');
    this.dialog.open(FeedbackComponent, {
      minHeight: '480px',
      maxWidth: '420px',
      data: { inDialog: true }
    });
  }

  goToProfile() {
    if (this.embedded) {
      this.currentProfile$.pipe(take(1)).subscribe(profile => {
        this.router.navigate(['/profiles/' + profile.objectId]);
      });
    }
  }

  showSection(section: string) {
    this.sectionShown = section;
    if (this.breakpointObserver.isMatched('(max-width: 960px)')) {
      this.scrollNavigation(section);
    }

    window.scroll(0, 0);
  }

  private scrollNavigation(section: string) {
    const basicWidth = window.innerWidth / 2;
    switch (section) {
      case 'Forschungsschwerpunkte':
        this.profileNavigation.nativeElement.scrollLeft = basicWidth + this.schwerpunkte.nativeElement.offsetLeft +
          (this.schwerpunkte.nativeElement.offsetWidth / 2) - 10;
        break;
      case 'Projektreferenzen':
        this.profileNavigation.nativeElement.scrollLeft = basicWidth + this.projekte.nativeElement.offsetLeft +
          (this.projekte.nativeElement.offsetWidth / 2) - 10;
        console.log(this.projekte.nativeElement.offsetWidth);
        break;
      case 'Publikationen':
        this.profileNavigation.nativeElement.scrollLeft = basicWidth + this.publikationen.nativeElement.offsetLeft +
          (this.publikationen.nativeElement.offsetWidth / 2) - 10;
        break;
    }
  }

  openPublication(publication: ProfilePublications) {
    this.publicationOpen = publication;
    this.sectionShown = 'Publikationen';
  }

  closePublication() {
    this.publicationOpen = null;
  }

  openProject(project: ProfileProject) {
    this.projectOpen = project;
  }

  closeProject() {
    this.projectOpen = null;
  }

  openFocus(focus: ProfileResearchFocus) {
    this.focusOpen = focus;
  }

  closeFocus() {
    this.focusOpen = null;
  }

  private calculateNavRequestsLength() {
    this.profileRequests$.pipe(takeUntil(this.destroy$)).subscribe(requests => {
      if (requests) {
        const length = requests.length.toString().length;
        switch (length) {
          case 1:
            this.requestsNavLength = 76;
            break;
          case 2:
            this.requestsNavLength = 86;
            break;
          case 3:
            this.requestsNavLength = 97;
        }
      }
    });
  }
}
