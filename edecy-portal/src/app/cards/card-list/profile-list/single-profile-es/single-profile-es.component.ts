import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/service/auth.service';
import { Card } from 'src/app/cards/model/card.model';
import { CardsState } from 'src/app/cards/state/cards.state';
import { IconServiceService } from 'src/app/icon-service/icon-service.service';
import { ProfileES } from 'src/app/profile/model/profileES.model';
import { ProfileState } from 'src/app/profile/state/profile.state';
import * as fromProfile from '../../../../profile/state/profile.actions';

@Component({
  selector: 'app-single-profile-es',
  templateUrl: './single-profile-es.component.html',
  styleUrls: ['./single-profile-es.component.scss']
})
export class SingleProfileEsComponent implements OnInit {
  @Input() profileToDisplay: ProfileES;
  @Select(CardsState.getRequests) allRequests$: Observable<Card[]>;
  @Select(ProfileState.listView) listView$: Observable<boolean>;

  tagLimitLow = 0;
  tagLimitHigh = 2;

  switchingTags = false;
  interval: any;

  cardRequests = 0;
  userRate = '';

  constructor(
    private router: Router,
    private store: Store,
    private iconService: IconServiceService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.iconService.registerIcons();
    if (this.profileToDisplay._source.uid) {
      if (this.profileToDisplay._source.uid.length > 0) {
        this.countRequests();
        this.loadUserRate(this.profileToDisplay._source.uid[0]);
      }
    }

  }

  private countRequests() {
    this.allRequests$.pipe(take(1)).subscribe(requests => {
      requests.forEach(request => {
        if (this.profileToDisplay._source.uid.indexOf(request.uid) > -1) {
          this.cardRequests++;
        }
      });
    });
  }

  private loadUserRate(uid: string) {
    this.authService.loadUser(uid)
      .then(user => {
        this.userRate = user.attributes.rate;
      })
      .catch(error => {
        console.error('Error loading user', error);
      });
  }

  openProfile() {
    this.router.navigate(['/profiles/es/' + this.profileToDisplay._id]);
    window.scroll(0, 0);
  }

  searchTag(tag: string) {
    this.store.dispatch(new fromProfile.ResetPage());
    this.store.dispatch(new fromProfile.SearchProfilesES(tag));
  }

  switchTags() {
    this.switchingTags = true;
    const tagsLength = this.profileToDisplay._source.tags.length - 1;
    if (tagsLength > 2) {
      this.interval = setInterval(() => {
        if (!this.switchingTags) {
          clearInterval(this.interval);
        }
        if ((tagsLength - this.tagLimitHigh) === 0) {
          this.tagLimitLow = 0;
          this.tagLimitHigh = 2;
        } else if ((tagsLength - this.tagLimitHigh) === 1) {
          this.tagLimitHigh += 1;
          this.tagLimitLow += 3;
        } else if ((tagsLength - this.tagLimitHigh) === 2) {
          this.tagLimitHigh += 2;
          this.tagLimitLow += 3;
        } else {
          this.tagLimitHigh += 3;
          this.tagLimitLow += 3;
        }
      }, 4000);

    }
  }

}
