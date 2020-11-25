import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../shared/shared.module';
import { BookOfferComponent } from './book-offer/book-offer.component';
import { SuccessMessageComponent } from './book-offer/success-message/success-message.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ContactService } from './service/contact.service';



@NgModule({
  declarations: [FeedbackComponent, BookOfferComponent, SuccessMessageComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AuthModule,
    RouterModule
  ],
  providers: [
    ContactService
  ],
  exports: [
    FeedbackComponent
  ]
})
export class ContactEdecyModule { }
