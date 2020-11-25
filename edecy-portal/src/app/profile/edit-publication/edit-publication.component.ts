import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Profile, Publication } from '../model/profile.model';
import { ProfileService } from '../service/profile.service';
import * as fromProfile from '../state/profile.actions';
import { ProfileState } from '../state/profile.state';

export interface DialogData {
  desktopDialog: boolean;
  editMode: boolean;
  currentPublication: Publication;
  currentIndex: number;
}
@Component({
  selector: 'app-edit-publication',
  templateUrl: './edit-publication.component.html',
  styleUrls: ['./edit-publication.component.scss']
})
export class EditPublicationComponent implements OnInit {
  @Input() publication: Publication;
  @Input() index: number;
  @Select(ProfileState.getUserProfile) userProfile$: Observable<Profile>;
  @Output() editMode = new EventEmitter<boolean>();

  currentPage = 'Projektreferenz';

  publicationForm: FormGroup;

  desktopDialog = false;

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

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private profileService: ProfileService,
    private dialogRef: MatDialogRef<EditPublicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.desktopDialog = this.data.desktopDialog;
    if (this.data.desktopDialog) {
      this.publication = this.data.currentPublication;
      this.index = this.data.currentIndex;
    }
    console.log(this.data);
    console.log(this.publication);
    this.buildPublicationForm();

  }

  private buildPublicationForm() {
    this.publicationForm = this.fb.group({
      title: this.publication.title,
      description: this.publication.description
    });
  }

  savePublication() {
    this.userProfile$.pipe(take(1)).subscribe(profile => {
      let newProfile = Object.assign({}, profile);
      const publications = [];
      newProfile.publications.forEach(publication => {
        publications.push(publication);
      });
      if (publications.length === this.index) {
        this.profileService.addPublication(this.publicationForm.value, profile.objectId);
      } else {
        publications[this.index] = this.publicationForm.value;
        newProfile = {
          ...newProfile,
          publications
        };
        this.store.dispatch(new fromProfile.SaveProfile(newProfile));
      }

    });
    this.editMode.emit(false);
    if (this.desktopDialog) {
      this.dialogRef.close();
    }
  }

  goBack() {
    this.editMode.emit(false);
  }

}
