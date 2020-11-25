import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, forwardRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { DeleteDialogComponent } from 'src/app/auth/update-profile/dialogs/delete-dialog/delete-dialog.component';
import { FeedbackComponent } from 'src/app/contact-edecy/feedback/feedback.component';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { environment } from 'src/environments/environment';
import { Card } from '../../model/card.model';
import {
  Discipline, SingleSubject, Subject1, Subject2, Subject3, Subject4, Subject5, Subject6,
  Subject7
} from '../../model/specialties.model';
import { CardsService } from '../../service/cards.service';
import * as fromCards from '../../state/cards.actions';
import { CardsState } from '../../state/cards.state';




@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditCardComponent),
      multi: true
    }
  ]
})
export class EditCardComponent implements OnInit, OnDestroy {
  @Select(CardsState.getSelectedCard) selectedCard$: Observable<Card>;
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  private destroy$: Subject<void> = new Subject<void>();

  currentPage = 'Anzeige bearbeiten';

  cardToEdit: Card;

  editForm: FormGroup;

  // Tag-related variables
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  tags: Array<string> = [];

  imageUpload: FormGroup;

  category = [];

  // Editor Options
  public froalaOptions = {
    key: environment.froala.key,
    placeholderText: 'Erläuterung des Projekts*',
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
  cardDescription = '';


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

  pictureUrl: string;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = true;
  pictureName = '';

  orgSizes = [
    'weniger als 10 Beschäftigte',
    '10 bis 49 Beschäftigte',
    '50 bis 249 Beschäftigte',
    '250 Beschäftigte'
  ];


  constructor(
    private fb: FormBuilder,
    private cardsService: CardsService,
    private snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
    private matomoHelper: MatomoHelperService,
    @Inject('isBrowser') public isBrowser: boolean
  ) { }

  ngOnInit() {
    this.route.params.pipe(take(1)).subscribe(params => {
      this.store.dispatch(new fromCards.LoadCard(params.id));
    });
    this.buildEditForm();
    this.buildImageUpload();
    this.loadCard();
    this.matomoHelper.trackPageView('EditCardPage');
  }

  ngOnDestroy() {
    this.store.dispatch(new fromCards.ClearSelectedCard());
  }

  private buildEditForm() {
    this.editForm = this.fb.group({
      title: '',
      description: '',
      specialty1: '',
      specialty2: '',
      specialty3: '',
      showUserName: false,
      showOrganisation: false,
      loginRequired: false,
      mailAlert: false,
      showPlz: false,
      showProjectPlz: true,
      projectStreetNo: '',
      projectPLZ: '',
      projectCity: '',
      clientPLZ: '',
      clientCity: '',
      clientStreetNo: '',
      tags: [],
      category: [],
      pictureURL: '',
      organisation: '',
      orgSize: ''
    });
  }

  private buildImageUpload() {
    this.imageUpload = this.fb.group({
      file: ''
    });
  }


  private loadCard() {
    this.selectedCard$.pipe(takeUntil(this.destroy$)).subscribe(card => {
      if (card) {
        this.currentUser$.pipe(take(1)).subscribe(user => {
            if (user === null || card.uid !== user.id) {
              this.router.navigate(['/cards/list']);
            }
        });
        console.log('Card found', card);
        const newTags = Object.assign([], card.tags);

        this.editForm.patchValue({
          title: card.title,
          description: card.description,
          specialty1: card.specialty1,
          specialty2: card.specialty2,
          specialty3: card.specialty3,
          showUserName: card.showUserName,
          loginRequired: card.loginRequired,
          showOrganisation: card.showOrganisation,
          mailAlert: card.mailAlert,
          showPlz: card.showPlz,
          showProjectPlz: card.showProjectPlz,
          projectStreetNo: card.projectStreetNo,
          projectPLZ: card.projectPLZ,
          projectCity: card.projectCity,
          clientPLZ: card.clientPLZ,
          clientCity: card.clientCity,
          clientStreetNo: card.clientStreetNo,
          tags: newTags,
          category: card.category,
          pictureURL: card.pictureURL,
          organisation: card.organisation,
          orgSize: card.orgSize
        });

        this.tags = newTags;
        this.category = card.category;
        this.pictureUrl = card.pictureURL;
        this.cardToEdit = card;
        this.cardDescription = card.description;

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


        this.destroy$.next();
        this.destroy$.unsubscribe();
      }
    });
  }

  showDisciplines() {
    console.log(this.selectedSubject);
    this.editForm.value.specialty1 = this.selectedSubject;

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
    this.editForm.value.specialty2 = this.disciplineToShow[this.selectedDiscipline].disciplineTitle;
    this.specialtiesToShow = this.disciplineToShow[this.selectedDiscipline].specialties;
  }

  selectSpecialty() {
    this.editForm.value.specialty3 = this.selectedSpecialty;
  }

  changeCategory(event) {
    if (event.checked) {
      this.category.push(event.source.value);
      console.log('Categories: ', this.category);
      this.editForm.patchValue({
        category: this.category
      });
    } else {
      for (let i = 0; i < this.category.length; i++) {
        if (event.source.value === this.category[i]) {
          this.category.splice(i, 1);
        }
      }
      console.log('Categories: ', this.category);
      this.editForm.patchValue({
        category: this.category
      });
    }
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
    this.editForm.patchValue({
      tags: this.tags
    });
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.editForm.patchValue({
      tags: this.tags
    });
  }

  // Template validations needed by Mat Chips
  isObject(obj) {
    return typeof obj === 'object';
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
          this.editForm.patchValue({
            pictureURL: saveResult._url
          });
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

  removeDuplicates() {
    this.tags = this.tags.reduce((unique, tag) => {
      return unique.includes(tag) ? unique : [...unique, tag];
    }, []);
  }

  saveCard() {
    this.removeDuplicates();

    const cardToSave: Card = {
      ...this.cardToEdit,
      ...this.editForm.value,
      category: this.category,
      tags: this.tags,
      specialty2: this.editForm.value.specialty2,
      specialty3: this.selectedSpecialty,
      description: this.cardDescription
    };

    this.store.dispatch(new fromCards.SaveCard(cardToSave));
    this.router.navigate(['/cards/' + cardToSave.objectId]);
    console.log(this.cardDescription);
    this.matomoHelper.trackEvent('Cards', 'Edit', cardToSave.title);
  }

  dePublishCard() {
    const cardToSave: Card = {
      ...this.cardToEdit,
      ...this.editForm.value,
      category: this.category,
      tags: this.tags,
      specialty2: this.editForm.value.specialty2,
      specialty3: this.selectedSpecialty,
      status: 'saved'
    };
    this.store.dispatch(new fromCards.SaveCard(cardToSave));
    this.matomoHelper.trackEvent('Cards', 'Unpublish', this.cardToEdit.title);
    this.router.navigate(['/cards/' + cardToSave.objectId]);
  }

  publishCard() {
    const cardToSave: Card = {
      ...this.cardToEdit,
      ...this.editForm.value,
      category: this.category,
      tags: this.tags,
      specialty2: this.editForm.value.specialty2,
      specialty3: this.selectedSpecialty,
      status: 'published'
    };
    this.store.dispatch(new fromCards.SaveCard(cardToSave));
    this.matomoHelper.trackEvent('Cards', 'Publish', this.cardToEdit.title);
    this.router.navigate(['/cards/' + cardToSave.objectId]);
  }

  deleteCard() {
    this.matomoHelper.trackEvent('Cards', 'DeleteCard', this.cardToEdit.title);
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '473px',
      data: {
        content:
          `Sind Sie sicher,
          dass Sie Ihre Anzeige
          endgültig löschen
          wollen?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const cardID = this.cardToEdit.objectId;
        this.store.dispatch(new fromCards.DeleteCard(cardID));
        this.router.navigate(['/cards/my-cards']);
      }
    });
  }

  openFeedbackDialog() {
    this.dialog.open(FeedbackComponent, {
      minHeight: '480px',
      maxWidth: '420px',
      data: { inDialog: true }
    });
  }
}
