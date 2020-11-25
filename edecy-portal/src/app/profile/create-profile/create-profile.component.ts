import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserModel } from 'src/app/auth/model/user.model';
import { AuthState } from 'src/app/auth/state/auth.state';
import { IconServiceService } from 'src/app/icon-service/icon-service.service';
import { environment } from 'src/environments/environment';
import {
  Discipline, SingleSubject, Subject1, Subject2, Subject3, Subject4, Subject5, Subject6,
  Subject7
} from '../../cards/model/specialties.model';
import { Profile, Project, Publication, ResearchFocus } from '../model/profile.model';
import { ProfileService } from '../service/profile.service';
import * as fromProfile from '../state/profile.actions';
import { ProfileState } from '../state/profile.state';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})
export class CreateProfileComponent implements OnInit, OnDestroy {
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(ProfileState.getUserProfile) userProfile$: Observable<Profile>;
  @Output() profileEnabled = new EventEmitter<boolean>();

  private destroy$: Subject<void> = new Subject<void>();

  userHasProfile = false;
  userId = '';
  userProfileId = '';

  loginRequired = false;

  editForm: FormGroup;
  step1: FormGroup;
  step2: FormGroup;
  step3: FormGroup;
  tagForm: FormGroup;
  researchForm: FormGroup;
  editResearchForm: FormGroup;

  pictureUrl = '';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  pictureName = '';

  currentUser: UserModel;
  loadedProfile: Profile;


  projects: Array<Project> = [];
  publications: Array<Publication> = [];
  focuses: Array<ResearchFocus> = [];

  // Fachliche Zuordnung
  specialties: Array<SingleSubject> = [
    Subject1,
    Subject2,
    Subject3,
    Subject4,
    Subject5,
    Subject6,
    Subject7,
  ];

  disciplineToShow: Array<Discipline> = [
    {
      disciplineTitle: '',
      specialties: [''],
      index: 0
    }
  ];

  selectedSubject: string;
  selectedDiscipline: number;
  specialtiesToShow: Array<string> = [
    ''
  ];
  disciplineSelected = false;

  selectedSpecialty: Array<string> = [];

  // Editor Options
  public froalaOptions = {
    key: environment.froala.key,
    placeholderText: 'Beschreibung*',
    height: 300,
    quickInsertEnabled: false,
    language: 'de',
    attribution: false,
    toolbarButtons: {
      moreText: {
        buttons: ['bold', 'italic', 'underline', 'insertLink', 'subscript', 'superscript'],
        buttonsVisible: 5
      },
      moreParagraph: {
        buttons: ['formatOL', 'formatUL', 'paragraphStyle'],
        buttonsVisible: 5
      },
      moreRich: {
        buttons: ['specialCharacters']
      },
      moreMisc: {
        buttons: ['undo', 'redo'],
        align: 'right'
      }
    },
    toolbarButtonsXS: {
      moreText: {
        buttons: ['bold', 'italic', 'underline', 'insertLink', 'subscript', 'superscript'],
        buttonsVisible: 4
      },
      moreParagraph: {
        buttons: ['formatOL', 'formatUL', 'paragraphStyle'],
        buttonsVisible: 3
      },
      moreRich: {
        buttons: ['specialCharacters'],
        align: 'right'
      }
    },
    paragraphFormat: {
      H2: 'Überschrift 1',
      H3: 'Überschrift 2',
      N: 'Absatz'
    },
    pastePlain: true,
    imagePaste: false
  };

  // Tag-related variables
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  tags = [];

  orgSizes = [
    '1 - 10',
    '10 - 49',
    '50 - 249',
    '>250'
  ];

  progress = 0;
  currentStep = 1;

  companyTypes = [
    'KMU',
    'Mittelstand',
    'Konzern / Großunternehmen'
  ];

  instituteTypes = [
    'Hochschuleinrichtung',
    'Forschungsinstitut',
    'Kammer',
    'Netzwerk'
  ];

  interests = [
    'Kooperationsprojekt',
    'Auftragsforschung',
    'gemeinsame Lehre',
    'Abschlussarbeit'
  ];

  emptyInterests = [];

  popUpTitle = '';
  elementToAdd = '';
  elementToEdit: ResearchFocus | Project | Publication = null;
  editIndex: number = null;
  editObjectType = '';
  editedDescription = '';
  finished = false;

  constructor(
    private store: Store,
    private snackbar: MatSnackBar,
    private profileService: ProfileService,
    private fb: FormBuilder,
    private iconService: IconServiceService,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildProfileForm();
    this.currentUser$.pipe(take(1)).subscribe((user: any) => {
      console.log('Current user: ', user);
      this.currentUser = user.toJSON();
      this.loadUserProfile(user.attributes.profileId);
      this.userId = user.id;
      if (user.attributes.profileId === '') {
        this.userHasProfile = false;
        console.log('User has a profile: ', this.userHasProfile);
      } else {
        this.userHasProfile = true;
        console.log('User has a profile: ', this.userHasProfile);
      }
    });

    this.iconService.registerIcons();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }


  private buildProfileForm() {
    this.buildStep1();
    this.buildStep2();
    this.buildStep3();
    this.buildTagForm();
    this.buildResearchForm();
    this.buildEditResearchForm();
  }

  private buildStep1() {
    this.step1 = this.fb.group({
      public: null,
      companyType: '',
      instituteType: '',
      title: ['', Validators.required],
      organisation: ['', Validators.required],
      streetNo: '',
      city: '',
      plz: '',
      loginRequired: false
    });
  }

  private buildStep2() {
    this.step2 = this.fb.group({
      description: '',
      orgSize: '',
      specialty1: '',
      specialty2: '',
      specialties3: [[]]
    });
  }

  private buildTagForm() {
    this.tagForm = this.fb.group({
      tags: [this.tags]
    });
  }

  private buildStep3() {
    this.step3 = this.fb.group({
      interest: [this.emptyInterests],
      projectLeadershipPossible: true,
    });
  }

  private buildResearchForm() {
    this.researchForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  private buildEditResearchForm() {
    this.editResearchForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push(value);
    }
    if (input) {
      input.value = '';
    }
    this.step3.patchValue({
      tags: this.tags
    });
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.step3.patchValue({
      tags: this.tags
    });
  }

  nextStep() {
    this.currentStep++;
    this.progress += 33;
  }

  lastStep() {
    this.currentStep--;
    this.progress -= 33;
  }

  changePublic(isPublic: boolean) {
    this.step1.patchValue({
      public: isPublic,
      companyType: '',
      instituteType: ''
    });

  }

  changeLoginRequired() {
    if (this.step1.value.loginRequired) {
      this.step1.patchValue({
        loginRequired: false
      });
    } else {
      this.step1.patchValue({
        loginRequired: true
      });
    }
  }

  changeCompanyType(type: string) {
    this.step1.patchValue({
      companyType: type
    });
  }

  changeInstituteType(type: string) {
    this.step1.patchValue({
      instituteType: type
    });
  }

  selectSize(size: string) {
    this.step2.patchValue({
      orgSize: size
    });
  }

  selectInterest(interestSelected: string) {
    const selectedInterests: Array<string> = Object.assign([], this.step3.value.interest);
    if (selectedInterests.includes(interestSelected)) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < selectedInterests.length; i++) {
        if (selectedInterests[i] === interestSelected) {
          selectedInterests.splice(i, 1);
        }
      }
    } else {
      selectedInterests.push(interestSelected);
    }
    this.step3.patchValue({
      interest: selectedInterests
    });
    console.log(this.step3.value);
  }

  loadUserProfile(profileId: string) {
    this.store.dispatch(new fromProfile.LoadUserProfile(profileId));

    this.userProfile$.pipe(takeUntil(this.destroy$)).subscribe(profile => {
      if (profile) {
        const newTags = Object.assign([], profile.tags);
        this.step1.patchValue({
          public: profile.public,
          companyType: profile.companyType,
          instituteType: profile.instituteType,
          title: profile.title,
          organisation: profile.organisation,
          streetNo: profile.streetNo,
          city: profile.city,
          plz: profile.plz,
          loginRequired: profile.loginRequired
        });
        this.step2.patchValue({
          description: profile.description,
          orgSize: profile.orgSize,
          specialty1: profile.specialty1,
          specialty2: profile.specialty2,
          specialties3: profile.specialties3
        });
        this.step3.patchValue({
          interest: profile.interest,
          projectLeadershipPossible: profile.projectLeadershipPossible,
        });
        this.tagForm.patchValue({
          tags: newTags
        });
        this.projects = Object.assign([], profile.projects);
        this.focuses = Object.assign([], profile.researchFocus);
        this.publications = Object.assign([], profile.publications);
        this.loadedProfile = profile;
        this.userProfileId = profile.objectId;
        this.pictureUrl = profile.logoURL;
        this.tags = newTags;

        this.selectedSubject = profile.specialty1;
        for (const subject of this.specialties) {
          if (subject.title === profile.specialty1) {
            for (const discipline of subject.disciplines) {
              if (discipline.disciplineTitle === profile.specialty2) {
                this.disciplineToShow = subject.disciplines;
                this.selectedDiscipline = discipline.index;
                this.specialtiesToShow = subject.disciplines[discipline.index].specialties;
                this.selectedSpecialty = profile.specialties3;
              }
            }
          }
        }
      }
    });
  }

  enterProfileEditor() {
    this.profileEnabled.emit(true);
  }

  showDisciplines() {
    this.step2.value.specialty1 = this.selectedSubject;

    switch (this.selectedSubject) {
      case 'Wirtschaftswissenschaften':
        this.disciplineToShow = this.specialties[0].disciplines;
        this.disciplineSelected = true;
        break;
      case 'Rechtswissenschaften, Jurisprudenz':
        this.disciplineToShow = this.specialties[1].disciplines;
        this.disciplineSelected = true;
        break;
      case 'Naturwissenschaften':
        this.disciplineToShow = this.specialties[2].disciplines;
        this.disciplineSelected = true;
        break;
      case 'Informationswissenschaften und Mathematik':
        this.disciplineToShow = this.specialties[3].disciplines;
        this.disciplineSelected = true;
        break;
      case 'Medizintechnik':
        this.disciplineToShow = this.specialties[4].disciplines;
        this.disciplineSelected = true;
        break;
      case 'Ingenieurswissenschaften':
        this.disciplineToShow = this.specialties[5].disciplines;
        this.disciplineSelected = true;
        break;
      case 'Interdisziplinäres':
        this.disciplineToShow = this.specialties[6].disciplines;
        this.disciplineSelected = true;
        break;
      default:
        console.error('Wrong selection');
        break;
    }

    if (this.disciplineSelected) {
      this.selectedSpecialty = null;
      this.selectedDiscipline = null;
      this.specialtiesToShow = null;
    }

  }

  showSpecialties() {
    this.step2.value.specialty2 = this.disciplineToShow[this.selectedDiscipline].disciplineTitle;
    this.specialtiesToShow = this.disciplineToShow[this.selectedDiscipline].specialties;
  }

  selectSpecialty() {
    console.log(this.selectedSpecialty);
    this.step2.value.specialties3 = this.selectedSpecialty;
  }

  saveProfile() {
    let newProfile: Profile;

    if (this.userHasProfile) {
      newProfile = {
        ...this.step1.value,
        ...this.step2.value,
        ...this.step3.value,
        ...this.tagForm.value,
        objectId: this.userProfileId,
        status: this.loadedProfile.status,
        logoURL: this.pictureUrl,
        category: this.loadedProfile.category,
        researchFocus: this.focuses,
        projects: this.projects,
        publications: this.publications,
        infrastructure: this.loadedProfile.infrastructure,
        uid: [this.loadedProfile.uid],
      };
      console.log('Saving profile: ', newProfile);
      this.store.dispatch(new fromProfile.SaveProfile(newProfile));
      this.userProfile$.pipe(take(1)).subscribe(profile => {
        if (profile) {
          this.router.navigate(['/profiles/' + profile.objectId]);
        }
      });
    } else {
      newProfile = {
        ...this.step1.value,
        ...this.step2.value,
        ...this.step3.value,
        ...this.tagForm.value,
        status: 'saved',
        logoURL: this.pictureUrl,
        category: [],
        researchFocus: this.focuses,
        projects: this.projects,
        publications: this.publications,
        infrastructure: [],
        uid: [this.userId]
      };
      this.store.dispatch(new fromProfile.CreateProfile(newProfile));
      console.log(newProfile);
      this.userProfile$.pipe(takeUntil(this.destroy$)).subscribe(profile => {
        if (profile) {
          this.router.navigate(['/profiles/' + profile.objectId]);
        }
      });
    }
    this.profileEnabled.emit(true);

    this.currentStep = 4;
    this.progress = 100;
    this.finished = true;
  }

  returnToProfileView() {
    console.log(true);
    const enterEditor = false;
    this.profileEnabled.emit(!enterEditor);
  }

  uploadPicture() {
    const fileName = this.pictureName.split('.')[0];
    const file = this.croppedImage;

    const filesize = this.croppedImage.length * 0.000000125;

    console.log('filesize: ', filesize);

    if (filesize < 10) {
      this.profileService.uploadPicture(fileName, { base64: file })
        .then(saveResult => {
          console.log('Result saving: ', saveResult);
          this.pictureUrl = saveResult._url;
          console.log(this.pictureUrl);
        })
        .catch(error => {
          console.error('Error uploading picture: ', error);
          this.snackbar.open('Ihr Bild konnte nicht hochgeladen werden.' +
            'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
            duration: 2000
          });
        });
      this.showCropper = false;
    } else {
      this.snackbar.open('Ihr Bild überschreitet die maximale Dateigröße.', '', {
        duration: 4000
      });
    }

  }

  changePicture() {
    this.pictureUrl = '';
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  fileChangeEvent(event: any): void {
    console.log('Changed file,', event.srcElement.files[0].name);
    this.imageChangedEvent = event;
    this.pictureName = event.srcElement.files[0].name;
    this.showCropper = true;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    console.log('image was loaded');
  }
  cropperReady() {
    console.log('cropper is ready');
  }
  loadImageFailed() {
    this.snackbar.open('Ihr Bild konnte nicht geladen werden.' +
      'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
      duration: 2000
    });
  }

  addResearch(type: string) {
    this.elementToAdd = type;

    switch (type) {
      case 'focus':
        this.popUpTitle = 'Forschungsschwerpunkte';
        break;
      case 'project':
        this.popUpTitle = 'Projektreferenzen';
        break;
      case 'publication':
        this.popUpTitle = 'Publikationen';
        break;
    }
    window.scroll(0, 0);
  }

  editFocus(index: number) {
    window.scroll(0, 0);
    this.elementToEdit = this.focuses[index];
    this.popUpTitle = 'Forschungsschwerpunkte';
    this.editIndex = index;
    this.editObjectType = 'focus';
    this.fillEditForm();
  }

  deleteFocus(index: number) {
    this.focuses.splice(index, 1);
  }

  editProject(index: number) {
    window.scroll(0, 0);
    this.elementToEdit = this.projects[index];
    this.popUpTitle = 'Projektreferenzen';
    this.editIndex = index;
    this.editObjectType = 'project';
    this.fillEditForm();
  }

  deleteProject(index: number) {
    this.projects.splice(index, 1);
  }

  editPublication(index: number) {
    window.scroll(0, 0);
    this.elementToEdit = this.publications[index];
    this.popUpTitle = 'Publikationen';
    this.editIndex = index;
    this.editObjectType = 'publication';
    this.fillEditForm();
  }

  deletePublication(index: number) {
    this.publications.splice(index, 1);
  }

  private fillEditForm() {
    this.editResearchForm.patchValue({
      title: this.elementToEdit.title,
      description: this.elementToEdit.description
    });
    this.editedDescription = this.elementToEdit.description;
  }

  closeEditPopUp() {
    this.elementToEdit = null;
    this.popUpTitle = '';
    this.editIndex = null;
    this.editResearchForm.patchValue({
      title: '',
      description: ''
    });
    this.editedDescription = '';
  }

  closePopUp() {
    this.elementToAdd = '';
    this.popUpTitle = '';
    this.researchForm.patchValue({
      title: '',
      description: ''
    });
  }

  saveResearchItem() {
    console.log(this.researchForm.value);
    switch (this.elementToAdd) {
      case 'focus':
        const newFocus: ResearchFocus = {
          ...this.researchForm.value
        };
        this.focuses.push(newFocus);
        this.closePopUp();
        break;
      case 'project':
        const newProject: Project = {
          ...this.researchForm.value
        };
        this.projects.push(newProject);
        this.closePopUp();
        break;
      case 'publication':
        const newPublication: Publication = {
          ...this.researchForm.value
        };
        this.publications.push(newPublication);
        this.closePopUp();
        break;
    }
  }

  saveEditResearchItem() {
    switch (this.editObjectType) {
      case 'focus':
        this.focuses[this.editIndex] = { ...this.editResearchForm.value };
        break;
      case 'project':
        this.projects[this.editIndex] = { ...this.editResearchForm.value };
        break;
      case 'publication':
        this.publications[this.editIndex] = { ...this.editResearchForm.value };
        break;
    }
    this.closeEditPopUp();
  }

  cancelPictureUpload() {
    this.showCropper = false;
    this.imageChangedEvent.srcElement.value = '';
    // this.croppedImage = '';
    this.pictureName = '';
  }
}
