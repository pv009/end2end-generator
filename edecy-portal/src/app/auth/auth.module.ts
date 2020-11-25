import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from '../shared/shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FunctionTeaserComponent } from './function-teaser/function-teaser.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SettingsComponent } from './settings/settings.component';
import { DeleteDialogComponent } from './update-profile/dialogs/delete-dialog/delete-dialog.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    LandingComponent,
    VerifyUserComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    LogoutComponent,
    SettingsComponent,
    UpdateProfileComponent,
    ChangePasswordComponent,
    FunctionTeaserComponent,
    DeleteDialogComponent,
    DeleteAccountComponent,
    SettingsComponent
  ],
  imports: [CommonModule, SharedModule, RouterModule, ImageCropperModule],
  exports: [FunctionTeaserComponent],
  entryComponents: [DeleteDialogComponent]
})
export class AuthModule { }
