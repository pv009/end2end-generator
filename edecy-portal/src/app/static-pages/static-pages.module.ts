import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardsModule } from '../cards/cards.module';
import { SharedModule } from '../shared/shared.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { FaqComponent } from './faq/faq.component';
import { ImprintComponent } from './imprint/imprint.component';
import { LegalComponent } from './legal/legal.component';
import { ExclusiveOfferComponent } from './prices/exclusive-offer/exclusive-offer.component';
import { PricesComponent } from './prices/prices.component';
import { PrivacyPolicyDialogComponent } from './privacy-policy/privacy-policy-dialog/privacy-policy-dialog.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { TosDialogComponent } from './terms-of-use/tos-dialog/tos-dialog.component';
import { FaqTemplateComponent } from './faq-template/faq-template.component';



@NgModule({
  declarations: [
    ImprintComponent,
    TermsOfUseComponent,
    PrivacyPolicyComponent,
    AboutUsComponent, FaqComponent,
    PricesComponent,
    PrivacyPolicyDialogComponent,
    TosDialogComponent,
    LegalComponent,
    ExclusiveOfferComponent,
    FaqTemplateComponent,
    ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CardsModule,
    HttpClientModule
  ]
})
export class StaticPagesModule { }
