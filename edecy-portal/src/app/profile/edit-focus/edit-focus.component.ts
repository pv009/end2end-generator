import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Profile, ResearchFocus } from '../model/profile.model';
import { ProfileService } from '../service/profile.service';
import * as fromProfile from '../state/profile.actions';
import { ProfileState } from '../state/profile.state';

export interface DialogData {
  desktopDialog: boolean;
  editMode: boolean;
  currentFocus: ResearchFocus;
  currentIndex: number;
}
@Component({
  selector: 'app-edit-focus',
  templateUrl: './edit-focus.component.html',
  styleUrls: ['./edit-focus.component.scss']
})
export class EditFocusComponent implements OnInit {
  @Input() focus: ResearchFocus;
  @Input() index: number;
  @Select(ProfileState.getUserProfile) userProfile$: Observable<Profile>;
  @Output() editMode = new EventEmitter<boolean>();

  currentPage = 'Schwerpunkt';

  focusForm: FormGroup;

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
    private dialogRef: MatDialogRef<EditFocusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.desktopDialog = this.data.desktopDialog;
    if (this.data.desktopDialog) {
      this.focus = this.data.currentFocus;
      this.index = this.data.currentIndex;
    }
    console.log(this.focus);
    this.buildFocusForm();

  }

  private buildFocusForm() {
    this.focusForm = this.fb.group({
      title: this.focus.title,
      description: this.focus.description
    });
  }

  saveFocus() {
    this.userProfile$.pipe(take(1)).subscribe(profile => {
      let newProfile = Object.assign({}, profile);
      const focuses = [];
      newProfile.researchFocus.forEach(focus => {
        focuses.push(focus);
      });
      if (focuses.length === this.index) {
        const newFocus: ResearchFocus = { ...this.focusForm.value };
        this.profileService.addFocus(newFocus, profile.objectId);
      } else {
        focuses[this.index] = this.focusForm.value;
        newProfile = {
          ...newProfile,
          researchFocus: focuses
        };
        this.store.dispatch(new fromProfile.SaveProfile(newProfile));
      }

    });
    if (this.desktopDialog) {
      this.dialogRef.close();
    }
    this.editMode.emit(false);
  }

  goBack() {
    this.editMode.emit(false);
  }
}
