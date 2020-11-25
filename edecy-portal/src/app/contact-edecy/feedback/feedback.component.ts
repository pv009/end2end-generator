import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { Feedback } from '../model/feedback.model';
import { ContactService } from '../service/contact.service';

export interface DialogData {
  inDialog: boolean;
}
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Output() sentFeedback = new EventEmitter();
  feedbackForm: FormGroup;

  currentPage = 'Feedback';

  newFeedback: Feedback = {
    firstName: '',
    lastName: '',
    feedback: '',
    email: ''
  };

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private contactService: ContactService,
    private matomoHelper: MatomoHelperService,

    public dialogRef: MatDialogRef<FeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.buildFeedbackForm();
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.feedbackForm.patchValue({
          firstName: user.attributes.firstName,
          lastName: user.attributes.lastName
        });
      }
    });
  }

  private buildFeedbackForm() {
    this.feedbackForm = this.fb.group({
      firstName: '',
      lastName: '',
      email: '',
      feedback: ['', Validators.required]
    });
  }

  submitFeedback() {
    this.newFeedback = this.feedbackForm.value;
    this.matomoHelper.trackEvent('Feedback', 'Send', this.newFeedback.feedback);
    this.contactService.sendFeedback(this.newFeedback);

    this.feedbackForm.patchValue({
      firstName: '',
      lastName: '',
      email: '',
      feedback: ''
    });

    this.sentFeedback.emit('true');
    this.dialogRef.close();
  }

}
