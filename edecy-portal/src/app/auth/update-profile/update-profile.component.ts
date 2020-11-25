import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Select, Store } from '@ngxs/store';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { UserModel } from '../model/user.model';
import { AuthService } from '../service/auth.service';
import * as fromAuth from '../state/auth.actions';
import { AuthState } from '../state/auth.state';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';

export interface DialogData {
  desktopDialog: boolean;
}
@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  @Select(AuthState.getUser) currentUser$: Observable<User>;

  currentPage = 'Nutzerdaten ändern';

  currentUser: UserModel;
  userId: string;

  userDataForm: FormGroup;

  orgLogo = '';

  editLogo = false;

  imageUpload: FormGroup;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = true;
  pictureName = '';

  desktopDialog = false;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<UpdateProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private matomoHelper: MatomoHelperService
  ) { }

  ngOnInit() {
    this.buildUserDataForm();
    this.buildImageUpload();
    this.currentUser$.pipe(take(1)).subscribe((user: any) => {
      if (user) {
        this.currentUser = user.toJSON();
        this.userId = user.id;
        console.log('Got user: ', this.currentUser);
        this.orgLogo = user.attributes.orgLogo;

        this.prefillForm(user);
      }
    });

    this.desktopDialog = this.data.desktopDialog;
    this.matomoHelper.trackPageView('UpdateProfilePage');
  }

  private buildImageUpload() {
    this.imageUpload = this.fb.group({
      file: ''
    });
  }

  private buildUserDataForm() {
    this.userDataForm = this.fb.group({
      email: ['', {
        validators: [Validators.required, Validators.email]
      }],
      title: '',
      gender: '',
      firstName: '',
      lastName: '',
      organisation: '',
      orgStreetNo: '',
      orgPlz: '',
      orgCity: '',
      telephone: ['', Validators.pattern('^[0-9\+]*$')],
      phoneAvailable: ''
    });
  }

  prefillForm(user: User) {
    this.userDataForm.patchValue({
      email: user.attributes.email,
      title: user.attributes.title,
      gender: user.attributes.gender,
      firstName: user.attributes.firstName,
      lastName: user.attributes.lastName,
      organisation: user.attributes.organisation,
      orgStreetNo: user.attributes.orgStreetNo,
      orgPlz: user.attributes.orgPlz,
      orgCity: user.attributes.orgCity,
      telephone: user.attributes.telephone,
      phoneAvailable: user.attributes.phoneAvailable
    });
  }

  uploadPicture() {
    const fileName = this.pictureName.split('.')[0];
    const file = this.croppedImage;

    const filesize = this.croppedImage.length * 0.000000125;

    console.log('filesize: ', filesize);

    if (filesize < 10) {
      this.authService.uploadPicture(fileName, { base64: file })
        .then(saveResult => {
          console.log('Result saving: ', saveResult);
          this.orgLogo = saveResult._url;
          console.log(this.orgLogo);
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

    this.editLogo = false;

  }

  changePicture() {
    this.orgLogo = '';
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

  updateProfile() {
    this.currentUser = {
      ...this.currentUser,
      ...this.userDataForm.value,
      username: this.userDataForm.value.email,
      orgLogo: this.orgLogo
    };
    console.log(this.currentUser);
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user.attributes.email === this.userDataForm.value.email) {
        this.authService.updateUser(this.currentUser, false);
      } else {
        this.authService.updateUser(this.currentUser, true);
      }
    });
    if (this.data.desktopDialog) {
      window.setTimeout(() => {
        this.dialogRef.close();
      }, 1000);
    }
  }

  deleteUserDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '473px',
      data: {
        content:
          `Sind Sie sicher,
          dass Sie Ihr Profil
          endgültig löschen
          wollen?`
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(new fromAuth.DeleteUser());
      }
    });
  }

}
