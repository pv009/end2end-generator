import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Lightbox } from 'ngx-lightbox';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/service/auth.service';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Card } from 'src/app/cards/model/card.model';
import { CardsState } from 'src/app/cards/state/cards.state';
import { FeedbackComponent } from 'src/app/contact-edecy/feedback/feedback.component';
import { IconServiceService } from 'src/app/icon-service/icon-service.service';
import { Tracking } from 'src/app/shared/model/tracking.model';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { TrackingService } from 'src/app/shared/services/tracking.service';
import { TrackingState } from 'src/app/shared/state/tracking.state';
import { EdecyDescription, EdecyTitle } from 'src/textstrings/strings';
import { allDisciplines, allSubjects } from '../../cards/model/specialties.model';
import * as fromCards from '../../cards/state/cards.actions';
import { ProfileES, ProfileProject, ProfilePublications, ProfileResearchFocus } from '../model/profileES.model';
import * as fromProfile from '../state/profile.actions';
import { ProfileState } from '../state/profile.state';
import { ContactProfileComponent } from './contact-profile/contact-profile.component';

@Component({
  selector: 'app-profile-es',
  templateUrl: './profile-es.component.html',
  styleUrls: ['./profile-es.component.scss']
})
export class ProfileEsComponent implements OnInit, OnDestroy {
  @Select(ProfileState.loadedProfileES) selectedProfile$: Observable<ProfileES>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(ProfileState.profileOwner) profileOwner$: Observable<string>;
  @Select(CardsState.getRequests) profileRequests$: Observable<Card[]>;
  @Select(TrackingState.getSession) currentSession$: Observable<Tracking>;
  @ViewChild('profileNavigation') profileNavigation: ElementRef;
  @ViewChild('allgemein') allgemein: ElementRef;
  @ViewChild('gesuche') gesuche: ElementRef;
  @ViewChild('projekte') projekte: ElementRef;
  @ViewChild('publikationen') publikationen: ElementRef;
  @ViewChild('schwerpunkte') schwerpunkte: ElementRef;


  destroy$: Subject<boolean> = new Subject<boolean>();

  profileLoaded: ProfileES;

  private albums: Array<{ src: string, caption: string, thumb: string }> = [];

  shortDescription = true;

  cardTypeShown = 'requests';

  linesShown = 3;

  sectionShown = 'Allgemein';

  currentPage = 'Profildetails';

  allSubjectsAvailable = allSubjects;
  allDisciplinesAvailable = allDisciplines;

  publicationOpen: ProfilePublications;
  projectOpen: ProfileProject;
  focusOpen: ProfileResearchFocus;

  requestsNavLength = 93;

  userRate = '';

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private titleService: Title,
    private metaService: Meta,
    private lightbox: Lightbox,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private matomoHelper: MatomoHelperService,
    private tracking: TrackingService,
    private iconService: IconServiceService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.iconService.registerIcons();
    this.loadProfile();


    this.selectedProfile$.pipe(takeUntil(this.destroy$)).subscribe(profile => {
      if (profile) {
        this.profileLoaded = profile;
        this.matomoHelper.trackPageView('Profile | ' + profile._source.institute_name);
        this.setMetaTags(profile);

        this.currentSession$.pipe(take(1)).subscribe(session => {
          if (session) {
            this.tracking.trackClickedProfile(profile, session.objectId);
          }
        });

        if (profile._source.uid) {
          if (profile._source.uid.length > 0) {
            this.loadUserRate(profile._source.uid[0]);
          }
        }
      }
    });

    this.profileOwner$.pipe(takeUntil(this.destroy$)).subscribe(ownerID => {
      if (ownerID) {
        this.store.dispatch(new fromCards.LoadProfileCards(ownerID));
      }
    });

    this.calculateNavRequestsLength();
  }

  ngOnDestroy() {
    this.store.dispatch(new fromProfile.ClearESProfile());

    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.removeMetaTags();
  }

  private loadUserRate(uid: string) {
    this.authService.loadUser(uid)
      .then(user => {
        this.userRate = user.attributes.rate;
      })
      .catch(error => {
        console.error('Error loading user', error);
      });
  }

  private setMetaTags(profile: ProfileES) {
    // General
    this.titleService.setTitle(profile._source.institute_name);
    this.metaService.updateTag({ name: 'description', content: this.deleteHTMLFromString(profile._source.description) });
    this.metaService.updateTag({ name: 'title', content: profile._source.institute_name });

    // Facebook, LinkedIn, WhatsApp...
    this.metaService.addTag({ property: 'og:image', itemprop: 'image', content: profile._source.logo_url });
    this.metaService.addTag({ property: 'og:type', content: 'website' });
    this.metaService.addTag({ property: 'og:title', content: profile._source.institute_name });
    this.metaService.addTag({ property: 'og:description', content: this.deleteHTMLFromString(profile._source.description) });
    this.metaService.addTag({ property: 'og:url', content: 'https://portal.edecy.de/profiles/es/' + profile._id });

    // Twitter
    this.metaService.addTag({ property: 'twitter:image', content: profile._source.logo_url });
    this.metaService.addTag({ property: 'twitter:card', content: 'summary_large_image' });
    this.metaService.addTag({ property: 'twitter:title', content: profile._source.institute_name });
    this.metaService.addTag({ property: 'twitter:description', content: this.deleteHTMLFromString(profile._source.description) });
    this.metaService.addTag({ property: 'twitter:url', content: 'https://portal.edecy.de/profiles/es/' + profile._id });
  }

  private removeMetaTags() {
    // General
    this.titleService.setTitle(EdecyTitle);
    this.metaService.updateTag({ name: 'description', content: EdecyDescription });
    this.metaService.updateTag({ name: 'title', content: EdecyTitle });

    // Facebook, LinkedIn, WhatsApp...
    this.metaService.removeTag('property="og:title"');
    this.metaService.removeTag('property="og:description"');
    this.metaService.removeTag('property="og:image"');
    this.metaService.removeTag('property="og:url"');

    // Twitter
    this.metaService.removeTag('property="twitter:title"');
    this.metaService.removeTag('property="twitter:description"');
    this.metaService.removeTag('property="twitter:image"');
    this.metaService.removeTag('property="twitter:url"');
  }


  private loadProfile() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.store.dispatch(new fromProfile.LoadProfileES(params.id));
    });
  }

  private deleteHTMLFromString(htmlString: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlString;
    return tmp.textContent || tmp.innerText || '';
  }

  openImage(url: string) {
    const src = url;
    const caption = '';
    const thumb = '';
    const userImage = {
      src,
      caption,
      thumb
    };
    this.albums = [userImage];
    this.lightbox.open(this.albums);
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

  contactProfile() {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.openContactDialog();
    } else {
      this.selectedProfile$.pipe(take(1)).subscribe(profile => {
        this.router.navigate(['/profiles/contact/' + profile._id]);
      });
    }
    this.selectedProfile$.pipe(take(1)).subscribe(profile => {
      this.currentSession$.pipe(take(1)).subscribe(session => {
        if (session) {
          this.tracking.trackProfileMessage(profile, session.objectId);
        }
      });
    });
  }

  openContactDialog() {
    this.dialog.open(ContactProfileComponent, {
      minHeight: '700px',
      maxWidth: '600px',
    });
  }

  showAddress(address: string): string {
    return address.split(',').join('<br>');
  }

  searchTag(tag: string) {
    this.store.dispatch(new fromProfile.ResetPage());
    this.store.dispatch(new fromCards.ShowTab('profile'));
    this.store.dispatch(new fromProfile.SearchProfilesES(tag));
    this.router.navigate(['/cards/list']);
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
