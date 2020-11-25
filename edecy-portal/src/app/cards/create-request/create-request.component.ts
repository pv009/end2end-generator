import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { UserModel } from 'src/app/auth/model/user.model';
import { AuthState } from 'src/app/auth/state/auth.state';
import { FeedbackComponent } from 'src/app/contact-edecy/feedback/feedback.component';
import { IconServiceService } from 'src/app/icon-service/icon-service.service';
import { Profile } from 'src/app/profile/model/profile.model';
import { ProfileState } from 'src/app/profile/state/profile.state';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { environment } from 'src/environments/environment';
import { Card } from '../model/card.model';
import {
  Discipline, SingleSubject, Subject1, Subject2, Subject3, Subject4, Subject5, Subject6,
  Subject7
} from '../model/specialties.model';
import { CardsService } from '../service/cards.service';
import * as fromCard from '../state/cards.actions';
import { CardsState } from '../state/cards.state';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})
export class CreateRequestComponent implements OnInit, OnDestroy {
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(ProfileState.getUserProfile) userProfile$: Observable<Profile>;
  @Select(CardsState.getSelectedCard) selectedCard$: Observable<Card>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  cardId = '';
  loadedCard: Card;

  currentStep = 1;
  progress = 0;

  successStatus = '';

  showUserName = false;
  showOrganisation = true;
  loginRequired = false;
  showPlz = true;
  showProjectPlz = true;
  mailAlert = false;

  showPreview = false;
  desktopAccess = false;

  editMode = false;


  descriptionExplanation = 'Hier können Sie unter anderem den fachlichen Hintergrund, den konkreten Projektgegenstand ' +
    'sowie das Ziel Ihres Projekt nennen. Außerdem haben Sie die Möglichkeit, weitere Anforderungen passender Partner zu definieren.';

  // Editor Options
  public froalaOptions = {
    key: environment.froala.key,
    placeholderText: this.descriptionExplanation,
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

  pictureUrl = '';

  categories = [
    'Campus',
    'Maschine',
    'Projekt'
  ];

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

  selectedSpecialty: string;

  newCard: Card = {
    objectId: '',
    uid: '',
    title: '',
    description: '',
    category: [],
    specialty1: '',
    specialty2: '',
    specialty3: '',
    userName: '',
    showUserName: true,
    loginRequired: false,
    userMail: '',
    organisation: '',
    showOrganisation: false,
    createdAt: '',
    updatedAt: '',
    projectStreetNo: '',
    projectPLZ: '',
    projectCity: '',
    clientPLZ: '',
    clientCity: '',
    clientStreetNo: '',
    tags: [],
    pictureURL: '',
    logoURL: '',
    mailAlert: false,
    showPlz: true,
    showProjectPlz: false,
    adType: 'request',
    status: '',
    userFirstName: '',
    userLastName: '',
    orgSize: '',
    projectType: '',
    partnerType: [],
    partnerCompanyType: [],
    partnerInstituteType: [],
    projectStage: '',
    projectLeadershipPossible: false,
    partnerRange: '',
    fundingNeeded: false
  };

  step1: FormGroup;
  step2: FormGroup;
  step3: FormGroup;
  step4: FormGroup;
  step5: FormGroup;
  step6: FormGroup;
  step7: FormGroup;
  step8: FormGroup;
  step9: FormGroup;
  step10: FormGroup;
  imageUpload: FormGroup;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  pictureName = '';

  currentUser: UserModel;

  image: SafeStyle;

  orgSizes = [
    'weniger als 10 Beschäftigte',
    '10 bis 49 Beschäftigte',
    '50 bis 249 Beschäftigte',
    '250 Beschäftigte'
  ];

  projectTypes = [
    'Kooperation',
    'Auftrag',
    'gemeinsame Lehre',
    'Abschlussarbeit'
  ];

  companyTypes = [
    'KMU',
    'Konzern / Großunternehmen',
    'Mittelstand'
  ];

  instituteTypes = [
    'Hochschuleinrichtung',
    'Kammer',
    'Forschungsinstitut',
    'Netzwerk'
  ];

  projectStages = [
    '1. Bedarfsfeststellung & Ideenfindung',
    '2. Projektvorbereitung',
    '3. Projektinitiierung',
    '4. Projektdurchführung',
    '5. Projektabschluss'
  ];
  partnerRanges = [
    'egal',
    'regional \/ lokal',
    'national'
  ];

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private location: Location,
    private cardsService: CardsService,
    private snackbar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private matomoHelper: MatomoHelperService,
    @Inject('isBrowser') public isBrowser: boolean,
    private iconService: IconServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.desktopAccess = true;
    }

    this.buildForms();
    this.loadUser();
    this.iconService.registerIcons();

    this.matomoHelper.trackPageView('CreateRequestPage');

    this.checkEditMode();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private loadUser() {
    this.currentUser$.pipe(take(1)).subscribe((user: any) => {
      this.currentUser = user.toJSON();

      this.newCard = {
        ...this.newCard,
        uid: user.id,
        userMail: user.attributes.email,
        userName: user.attributes.email,
        userFirstName: user.attributes.firstName,
        userLastName: user.attributes.lastName,
        logoURL: user.attributes.orgLogo
      };

      this.step1.patchValue({
        organisation: user.attributes.organisation,
        clientStreetNo: user.attributes.orgStreetNo,
        clientCity: user.attributes.orgCity,
        clientPLZ: user.attributes.orgPlz,
      });
    });
  }

  private checkEditMode() {
    this.route.params.pipe(take(1)).subscribe(params => {
      console.log('ROUTE PARAMS', params);
      if (params.id && params.id !== '') {
        this.cardId = params.id;
        this.editMode = true;
        this.store.dispatch(new fromCard.LoadCard(params.id));
        this.loadCard();
      }
    });
  }

  private loadCard() {
    this.selectedCard$.pipe(takeUntil(this.destroy$)).subscribe(card => {
      if (card) {
        if (card.objectId === this.cardId) {
          this.loadedCard = card;
          const newTags = Object.assign([], card.tags);
          this.tags = newTags;
          this.pictureUrl = card.pictureURL;
          this.step1.patchValue({
            organisation: card.organisation,
            clientStreetNo: card.clientStreetNo,
            clientCity: card.clientCity,
            clientPLZ: card.clientCity,
            hideOrganisation: !card.showOrganisation
          });
          this.step2.patchValue({
            projectType: card.projectType,
            partnerType: Object.assign([], card.partnerType),
            partnerCompanyType: Object.assign([], card.partnerCompanyType),
            partnerInstituteType: Object.assign([], card.partnerInstituteType)
          });
          this.step3.patchValue({
            title: card.title,
            specialty1: card.specialty1,
            specialty2: card.specialty2,
            specialty3: card.specialty3
          });
          this.step4.patchValue({
            tags: newTags,
            description: card.description,
            projectStage: card.projectStage
          });
          this.step5.patchValue({
            projectLeadershipPossible: card.projectLeadershipPossible,
            projectPLZ: card.projectPLZ,
            projectCity: card.projectCity,
            hideProjectPlz: !card.showProjectPlz,
            partnerRange: card.partnerRange,
            fundingNeeded: card.fundingNeeded
          });
          this.selectedSubject = card.specialty1;
          for (const subject of this.specialties) {
            if (subject.title === card.specialty1) {
              for (const discipline of subject.disciplines) {
                if (discipline.disciplineTitle === card.specialty2) {
                  this.disciplineToShow = subject.disciplines;
                  this.selectedDiscipline = discipline.index;
                  this.specialtiesToShow = subject.disciplines[discipline.index].specialties;
                  this.selectedSpecialty = card.specialty3;
                }
              }
            }
          }
        }
      }
    });
  }

  private buildForms() {
    this.buildStep1();
    this.buildStep2();
    this.buildStep3();
    this.buildStep4();
    this.buildStep5();
    this.buildImageUpload();
  }

  buildStep1() {
    this.step1 = this.fb.group({
      organisation: ['', Validators.required],
      clientStreetNo: '',
      clientCity: '',
      clientPLZ: '',
      hideOrganisation: false
    });
  }

  buildStep2() {
    this.step2 = this.fb.group({
      projectType: ['', Validators.required],
      partnerType: [[]],
      partnerCompanyType: [[]],
      partnerInstituteType: [[]]
    });
  }

  buildStep3() {
    this.step3 = this.fb.group({
      title: ['', Validators.required],
      specialty1: ['', Validators.required],
      specialty2: '',
      specialty3: ''
    });
  }

  buildStep4() {
    this.step4 = this.fb.group({
      tags: [this.tags],
      description: ['', Validators.required],
      projectStage: ['', Validators.required]
    });
  }

  buildStep5() {
    this.step5 = this.fb.group({
      projectLeadershipPossible: false,
      projectPLZ: ['', Validators.required],
      projectCity: ['', Validators.required],
      hideProjectPlz: false,
      partnerRange: ['', Validators.required],
      fundingNeeded: false
    });
  }

  buildImageUpload() {
    this.imageUpload = this.fb.group({
      file: ''
    });
  }

  stepBack() {
    if (this.currentStep === 5) {
      this.showPreview = false;
    }
    if (this.currentStep === 1) {
      this.location.back();
    } else {
      this.currentStep -= 1;
      this.progress -= 20;
    }
  }

  nextStep() {
    if (this.currentStep === 10) {
      this.removeDuplicates();
    }
    this.currentStep += 1;
    this.progress += 20;

    window.scroll(0, 0);
  }

  createCard() {
    this.newCard = {
      ...this.newCard,
      ...this.step1.value,
      ...this.step2.value,
      ...this.step3.value,
      ...this.step4.value,
      ...this.step5.value,
    };

    window.scroll(0, 0);
    console.log('Card to create: ', this.newCard);
  }

  goToPreview() {
    this.newCard = {
      ...this.newCard,
      ...this.step1.value,
      ...this.step2.value,
      ...this.step3.value,
      ...this.step4.value,
      ...this.step5.value,
      showOrganisation: !this.step1.value.hideOrganisation,
      showProjectPlz: !this.step5.value.hideProjectPlz,
      pictureURL: this.pictureUrl
    };
    this.showPreview = true;
    this.store.dispatch(new fromCard.LoadCardSuccessfull(this.newCard));
    console.log('Card to create: ', this.newCard);
    this.currentStep = 5;
    this.progress = 100;

    window.scroll(0, 0);
  }

  showDisciplines() {
    console.log(this.selectedSubject);
    this.step3.patchValue({
      specialty1: this.selectedSubject
    });

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
    console.log(this.selectedDiscipline);
    this.step3.value.specialty2 = this.disciplineToShow[this.selectedDiscipline].disciplineTitle;
    this.specialtiesToShow = this.disciplineToShow[this.selectedDiscipline].specialties;
  }

  selectSpecialty() {
    this.step3.value.specialty3 = this.selectedSpecialty;
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
    this.step4.patchValue({
      tags: this.tags
    });
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.step4.patchValue({
      tags: this.tags
    });
  }

  removeDuplicates() {
    this.tags = this.tags.reduce((unique, tag) => {
      return unique.includes(tag) ? unique : [...unique, tag];
    }, []);
  }

  // Template validations needed by Mat Chips
  isObject(obj) {
    return typeof obj === 'object';
  }

  updateCard(status?: string) {
    if (status) {
      this.loadedCard = {
        ...this.loadedCard,
        ...this.step1.value,
        ...this.step2.value,
        ...this.step3.value,
        ...this.step4.value,
        ...this.step5.value,
        showOrganisation: !this.step1.value.hideOrganisation,
        showProjectPlz: !this.step5.value.hideProjectPlz,
        pictureURL: this.pictureUrl,
        status
      };
    } else {
      this.loadedCard = {
        ...this.loadedCard,
        ...this.step1.value,
        ...this.step2.value,
        ...this.step3.value,
        ...this.step4.value,
        ...this.step5.value,
        showOrganisation: !this.step1.value.hideOrganisation,
        showProjectPlz: !this.step5.value.hideProjectPlz,
        pictureURL: this.pictureUrl,
      };

    }

    this.store.dispatch(new fromCard.SaveCard(this.loadedCard));
    if (!status) {
      if (this.loadedCard.status === 'saved') {
        this.router.navigate(['/cards/my-cards/requests/saved']);
        window.scroll(0, 0);
      } else {
        this.router.navigate(['/cards/my-cards/requests']);
        window.scroll(0, 0);
      }
    }

  }

  saveCard() {
    const status = 'saved';
    this.newCard = {
      ...this.newCard,
      status
    };
    this.pushToDB(status);
  }

  publishCard() {
    const status = 'published';
    this.newCard = {
      ...this.newCard,
      status
    };
    this.pushToDB(status);
  }

  private pushToDB(status: string) {
    this.store.dispatch(new fromCard.CreateCard(this.newCard));
    this.router.navigate(['/cards/my-cards']);
  }

  uploadPicture() {
    const fileName = this.pictureName.split('.')[0];
    const file = this.croppedImage;

    const filesize = this.croppedImage.length * 0.000000125;

    console.log('filesize: ', filesize);

    if (filesize < 10) {
      this.cardsService.uploadPicture(fileName, { base64: file })
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

  openFeedbackDialog() {
    console.log('Open Feedback');
    this.dialog.open(FeedbackComponent, {
      minHeight: '480px',
      maxWidth: '420px',
      data: { inDialog: true }
    });
  }

  changeProjectType(type: string) {
    this.step2.patchValue({
      projectType: type
    });
    if (type === 'Kooperation' || type === 'Auftrag') {
      this.step2.get('partnerType').setValidators([Validators.minLength(1)]);
      this.step2.updateValueAndValidity();
    } else {
      this.step2.get('partnerType').clearValidators();
    }
  }

  togglePartnerType(type: string) {
    const selectedTypes: Array<string> = this.step2.value.partnerType;
    if (selectedTypes.length > 0) {
      if (selectedTypes.indexOf(type) > -1) {
        for (let i = 0; i < selectedTypes.length; i++) {
          if (selectedTypes[i] === type) {
            selectedTypes.splice(i, 1);
          }
        }
      } else {
        selectedTypes.push(type);
      }
    } else {
      selectedTypes.push(type);
    }
    this.step2.patchValue({
      partnerType: selectedTypes
    });

  }

  toggleCompanyType(type: string) {
    const selectedTypes: Array<string> = this.step2.value.partnerCompanyType;
    if (selectedTypes.length > 0) {
      if (selectedTypes.indexOf(type) > -1) {
        for (let i = 0; i < selectedTypes.length; i++) {
          if (selectedTypes[i] === type) {
            selectedTypes.splice(i, 1);
          }
        }
      } else {
        selectedTypes.push(type);
      }
    } else {
      selectedTypes.push(type);
    }

    this.step2.patchValue({
      partnerCompanyType: selectedTypes
    });
  }

  toggleInstituteType(type: string) {
    const selectedTypes: Array<string> = this.step2.value.partnerInstituteType;
    if (selectedTypes.length > 0) {
      if (selectedTypes.indexOf(type) > -1) {
        for (let i = 0; i < selectedTypes.length; i++) {
          if (selectedTypes[i] === type) {
            selectedTypes.splice(i, 1);
          }
        }
      } else {
        selectedTypes.push(type);
      }
    } else {
      selectedTypes.push(type);
    }

    this.step2.patchValue({
      partnerInstituteType: selectedTypes
    });

  }
}
