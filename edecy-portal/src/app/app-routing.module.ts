import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { DeleteAccountComponent } from './auth/delete-account/delete-account.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LandingComponent } from './auth/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { SettingsComponent } from './auth/settings/settings.component';
import { UpdateProfileComponent } from './auth/update-profile/update-profile.component';
import { VerifyUserComponent } from './auth/verify-user/verify-user.component';
import { BookOfferComponent } from './contact-edecy/book-offer/book-offer.component';
import { FeedbackComponent } from './contact-edecy/feedback/feedback.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AboutUsComponent } from './static-pages/about-us/about-us.component';
import { FaqComponent } from './static-pages/faq/faq.component';
import { ImprintComponent } from './static-pages/imprint/imprint.component';
import { LegalComponent } from './static-pages/legal/legal.component';
import { PricesComponent } from './static-pages/prices/prices.component';
import { PrivacyPolicyComponent } from './static-pages/privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './static-pages/terms-of-use/terms-of-use.component';



const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'reset-password/**',
    redirectTo: '/reset-password',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'verified',
    component: VerifyUserComponent
  },
  {
    path: 'verified/**',
    redirectTo: '/verified',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/cards/list',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    component: LandingComponent
  },
  {
    path: 'legal/:page',
    component: LegalComponent
  },
  {
    path: 'imprint',
    component: ImprintComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-of-use',
    component: TermsOfUseComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  },
  {
    path: 'feedback',
    component: FeedbackComponent
  },
  {
    path: 'prices',
    component: PricesComponent
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'update-profile',
    component: UpdateProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'faq',
    component: FaqComponent,
  },
  {
    path: 'profiles',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
  },
  {
    path: 'cards',
    loadChildren: () => import('./cards/cards.module').then(m => m.CardsModule)
  },
  {
    path: 'chat',
    canActivate: [AuthGuard],
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: 'logout',
    canActivate: [AuthGuard],
    component: LogoutComponent
  },
  {
    path: 'delete-account',
    canActivate: [AuthGuard],
    component: DeleteAccountComponent
  },
  {
    path: 'book-offer/:offer',
    component: BookOfferComponent
  },
  {
    path: 'book-offer',
    component: BookOfferComponent
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
