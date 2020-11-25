import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { User } from 'parse';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { ProfileContact } from '../../model/contact-profile.model';
import { ProfileES } from '../../model/profileES.model';
import { ProfileService } from '../../service/profile.service';
import { ProfileState } from '../../state/profile.state';

@Component({
  selector: 'app-contact-profile',
  templateUrl: './contact-profile.component.html',
  styleUrls: ['./contact-profile.component.scss']
})
export class ContactProfileComponent implements OnInit, OnDestroy {
  @Select(AuthState.getUser) currentUser$: Observable<User>;
  @Select(ProfileState.loadedProfileES) selectedProfile$: Observable<ProfileES>;
  currentPage = 'Profil kontaktieren';

  destroy$: Subject<boolean> = new Subject<boolean>();

  contactForm: FormGroup;

  newMessage: ProfileContact = {
    sender: '',
    senderId: '',
    profileId: '',
    message: '',
    subject: '',
    email: ''
  };

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private profileService: ProfileService,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private matomoHelper: MatomoHelperService,
    public dialogRef: MatDialogRef<ContactProfileComponent>
  ) { }

  ngOnInit() {
    this.buildContactForm();

    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        console.log('CURRENT USER', user);
        this.contactForm.patchValue({
          sender: user.attributes.firstName + ' ' + user.attributes.lastName,
          email: user.attributes.username
        });

        this.newMessage.senderId = user.id;
      }
    });

    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.selectedProfile$.pipe(take(1)).subscribe(profile => {
        this.newMessage.profileId = profile._id;
      });
    } else {
      this.route.params.pipe(take(1)).subscribe(params => {
        this.newMessage.profileId = params.id;
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private buildContactForm() {
    this.contactForm = this.fb.group({
      sender: '',
      email: ['', Validators.required],
      subject: '',
      message: ['', Validators.required]
    });
  }

  submitMessage() {
    this.newMessage = {
      ...this.newMessage,
      ...this.contactForm.value,
    };
    this.matomoHelper.trackGoal(5);
    this.profileService.contactProfile(this.newMessage);
    setTimeout(() => this.navigateBack(), 1000);
  }

  private navigateBack() {
    if (this.breakpointObserver.isMatched('(min-width: 960px)')) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/profiles/es/' + this.newMessage.profileId]);
    }
  }

}
