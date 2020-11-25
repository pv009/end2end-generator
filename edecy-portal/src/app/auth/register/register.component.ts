import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Registration } from 'src/app/contact-edecy/model/registration.model';
import { ContactService } from 'src/app/contact-edecy/service/contact.service';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { PrivacyPolicyDialogComponent } from 'src/app/static-pages/privacy-policy/privacy-policy-dialog/privacy-policy-dialog.component';
import { TosDialogComponent } from 'src/app/static-pages/terms-of-use/tos-dialog/tos-dialog.component';
import { UserModel } from '../model/user.model';
import { AuthService } from '../service/auth.service';

export interface DialogData {
  desktopDialog: boolean;
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  currentPage = 'Registrieren';
  hide = true;


  registerPage = 1;
  desktopDialog = false;
  succesfulRegistration = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = true;
  pictureName = '';

  alreadyRegistered = false;

  acceptedPrivacy = false;

  registrationStep1: FormGroup;
  registrationStep2: FormGroup;
  registrationStep3: FormGroup;
  registrationStep4: FormGroup;

  logoURL = '';

  newUser: UserModel = {
    objectId: '',
    emailVerified: false,
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    title: '',
    gender: '',
    organisation: '',
    orgStreetNo: '',
    orgPlz: '',
    orgCity: '',
    telephone: '',
    orgLogo: '',
    profileId: '',
    rate: 'basic',
    receiveChatNewsletter: true,
    phoneAvailable: ''
  };

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private location: Location,
    private contactService: ContactService,
    private matomoHelper: MatomoHelperService
  ) { }

  ngOnInit() {
    this.buildRegisterForm();
    this.desktopDialog = this.data.desktopDialog;
    this.matomoHelper.trackPageView('RegisterPage');
  }

  private buildRegisterForm() {
    this.registrationStep1 = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      telephone: ['', Validators.pattern('^[0-9\+]*$')],
      phoneAvailable: ''
    });

    this.registrationStep2 = this.fb.group({
      gender: '',
      title: '',
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.registrationStep3 = this.fb.group({
      organisation: ['', Validators.required],
      orgStreetNo: '',
      orgPlz: '',
      orgCity: ''
    });

    this.registrationStep4 = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      receiveChatNewsletter: true
    });
  }

  goToStep2() {
    this.auth.checkMail(this.registrationStep1.value.email)
      .then(result => {
        if (result.length === 0) {
          this.registerPage = 2;
          this.newUser.email = this.registrationStep1.value.email;
          this.newUser.telephone = this.registrationStep1.value.telephone;
          this.newUser.phoneAvailable = this.registrationStep1.value.phoneAvailable;
          console.log('New user: ', this.newUser);
          console.log(this.registerPage);
          this.alreadyRegistered = false;
        } else {
          document.getElementById('emailField').scrollIntoView();
          this.alreadyRegistered = true;
        }
      })
      .catch(error => {
        console.log(error);
      });

  }

  goToStep3() {
    this.newUser.title = this.registrationStep2.value.title;
    this.newUser.gender = this.registrationStep2.value.gender;
    this.newUser.firstName = this.registrationStep2.value.firstName;
    this.newUser.lastName = this.registrationStep2.value.lastName;
    console.log('New user: ', this.newUser);
    this.registerPage = 3;
  }

  goToStep4() {
    this.newUser.organisation = this.registrationStep3.value.organisation;
    this.newUser.orgStreetNo = this.registrationStep3.value.orgStreetNo;
    this.newUser.orgPlz = this.registrationStep3.value.orgPlz;
    this.newUser.orgCity = this.registrationStep3.value.orgCity;
    console.log('New user: ', this.newUser);
    this.registerPage = 4;
  }

  goToStep5() {
    this.newUser.orgLogo = this.logoURL;
    console.log('New user: ', this.newUser);
    this.registerPage = 5;
  }

  registerUser(permitDesktopLogin: boolean) {
    this.matomoHelper.trackEvent('Authentication', 'Register');
    this.matomoHelper.trackGoal(1);
    if (!this.desktopDialog || permitDesktopLogin) {
      const regData: Registration = {
        organisation: this.newUser.organisation,
        name: `${this.newUser.firstName} ${this.newUser.lastName}`,
        telephone: this.newUser.telephone,
        email: this.newUser.email,
        phoneAvailable: this.newUser.phoneAvailable
      };
      console.log('Calling this!', this.newUser);
      this.auth.registerUser(this.newUser, this.registrationStep4.value.password)
        .then(() => {
          this.registerPage = 6;
          this.contactService.sendRegistration(regData);
        });
    }
  }

  lastStep() {
    if (this.registerPage !== 1) {
      this.registerPage -= 1;
    } else {
      this.openLastPage();
    }
  }

  openLastPage() {
    this.location.back();
    this.matomoHelper.trackEvent('Navigation', 'Return');
  }

  uploadPicture() {
    const fileName = this.pictureName.split('.')[0];
    const file = this.croppedImage;

    const filesize = this.croppedImage.length * 0.000000125;

    if (filesize < 10) {
      this.auth.uploadPicture(fileName, { base64: file })
        .then(saveResult => {
          console.log('Result saving: ', saveResult);
          this.logoURL = saveResult._url;
        })
        .catch(error => {
          console.error('Error uploading picture: ', error);
          this.snackbar.open('Ihr Bild konnte nicht hochgeladen werden.', '', {
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
    this.logoURL = '';
    this.imageChangedEvent = '';
    this.croppedImage = '';
  }

  // Cropper
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
    this.snackbar.open('Ihr Bild konnte nicht geladen werden. ' +
      'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
      duration: 2000
    });
  }

  openPrivacyDialog() {
    this.dialog.open(PrivacyPolicyDialogComponent);
  }

  openTOS() {
    this.dialog.open(TosDialogComponent);
  }

  registerOnDesktop() {
    this.newUser.receiveChatNewsletter = this.registrationStep4.value.receiveChatNewsletter;
    this.goToStep2();

    if (this.desktopDialog) {
      this.newUser = {
        ...this.registrationStep1.value,
        ...this.registrationStep2.value,
        ...this.registrationStep3.value,
        ...this.registrationStep4.value,
        orgLogo: this.logoURL,
        profileId: ''
      };

      console.log('new user desk: ', this.newUser);
    }

    if (this.registerPage === 2 && !this.alreadyRegistered) {
      this.succesfulRegistration = true;
      this.registerUser(true);
    }
  }
}
