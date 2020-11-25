import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import * as Parse from 'parse';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { Card } from 'src/app/cards/model/card.model';
import { Profile } from 'src/app/profile/model/profile.model';
import { ProfileES } from 'src/app/profile/model/profileES.model';
import { environment } from 'src/environments/environment';
import {
  CardFilter, CardSearch, ProfileFilter, ProfileSearch,
  TrackingCard, TrackingProfile, UserProfile
} from '../model/tracking.model';
import * as fromTracking from '../state/tracking.actions';

Parse.initialize(environment.parse.appID, environment.parse.masterKey);
(Parse as any).serverURL = environment.parse.serverURL;

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  @Select(AuthState.getUser) currentUser$: Observable<User>;

  constructor(
    private store: Store
  ) { }

  trackProfileSearch(searchKeyword: string, sessionId: string) {
    console.log('Session ID: ', sessionId);
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user && this.checkConsent()) {
        const search: ProfileSearch = {
          keyword: searchKeyword
        };
        const query = new Parse.Query('TrackingTest');
        query.get(sessionId)
          .then(itemToUpdate => {
            itemToUpdate.addUnique('profile_searches', search);
            itemToUpdate.save()
              .then((result: any) => {
                this.store.dispatch(new fromTracking.UpdateSession(result.toJSON()));
              })
              .catch(error => {
                console.error('Error saving tracking ', error);
              });
            console.log('Tracked profile search');
          })
          .catch(error => {
            console.log('Error finding user: ', error.message);
          });
      }
    });
  }

  trackCardSearch(searchKeyword: string, sessionId: string) {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user && this.checkConsent()) {
        const search: CardSearch = {
          keyword: searchKeyword
        };
        const query = new Parse.Query('TrackingTest');
        query.get(sessionId)
          .then(itemToUpdate => {
            itemToUpdate.addUnique('card_searches', search);
            itemToUpdate.save()
              .then((result: any) => {
                this.store.dispatch(new fromTracking.UpdateSession(result.toJSON()));
              })
              .catch(error => {
                console.error('Error saving tracking ', error);
              });
            console.log('Tracked card search');
          })
          .catch(error => {
            console.log('Error finding user: ', error.message);
          });
      }
    });
  }

  trackProfileFilter(filter: ProfileFilter, sessionId: string) {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user && this.checkConsent()) {
        const query = new Parse.Query('TrackingTest');
        query.get(sessionId)
          .then(itemToUpdate => {
            itemToUpdate.addUnique('profile_filters', filter);
            itemToUpdate.save()
              .then((result: any) => {
                this.store.dispatch(new fromTracking.UpdateSession(result.toJSON()));
              })
              .catch(error => {
                console.error('Error saving tracking ', error);
              });
            console.log('Tracked profile filter');
          })
          .catch(error => {
            console.log('Error finding user: ', error.message);
          });
      }
    });
  }

  trackCardFilter(filter: CardFilter, sessionId: string) {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user && this.checkConsent()) {
        const query = new Parse.Query('TrackingTest');
        query.get(sessionId)
          .then(itemToUpdate => {
            itemToUpdate.addUnique('card_filters', filter);
            itemToUpdate.save()
              .then((result: any) => {
                this.store.dispatch(new fromTracking.UpdateSession(result.toJSON()));
              })
              .catch(error => {
                console.error('Error saving tracking ', error);
              });
            console.log('Tracked Card filter');
          })
          .catch(error => {
            console.log('Error finding user: ', error.message);
          });
      }
    });
  }

  trackClickedProfile(profile: ProfileES, sessionId: string) {
    const clickedProfile: TrackingProfile = {
      profileId: profile._id,
      title: profile._source.institute_name,
      description: profile._source.description,
      subject_areas: profile._source.subject_areas,
      public: profile._source.public,
      plz: profile._source.zip_code,
      tags: profile._source.tags,
      research_focus: profile._source.research_focus,
      projects: profile._source.projects,
      publications: profile._source.publications,
      infrastructure: profile._source.infrastructure,
      org_size: profile._source.orgSize.replace(/\D/g, '')
    };

    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user && this.checkConsent()) {
        const query = new Parse.Query('TrackingTest');
        query.get(sessionId)
          .then(itemToUpdate => {
            itemToUpdate.addUnique('clicked_profiles', clickedProfile);
            itemToUpdate.save()
              .then((result: any) => {
                this.store.dispatch(new fromTracking.UpdateSession(result.toJSON()));
              })
              .catch(error => {
                console.error('Error saving tracking ', error);
              });
            console.log('Tracked profile click');
          })
          .catch(error => {
            console.log('Error finding user: ', error.message);
          });
      }
    });
  }

  trackClickedCard(card: Card, sessionId: string) {
    const clickedCard: TrackingCard = {
      id: card.objectId,
      title: card.title,
      description: card.description,
      category: card.category,
      subject_areas: [card.specialty1, card.specialty2, card.specialty3],
      zip_code: card.projectPLZ,
      tags: card.tags,
      org_size: card.orgSize.replace(/\D/g, '')
    };

    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user && this.checkConsent()) {
        const query = new Parse.Query('TrackingTest');
        query.get(sessionId)
          .then(itemToUpdate => {
            itemToUpdate.addUnique('clicked_cards', clickedCard);
            itemToUpdate.save()
              .then((result: any) => {
                this.store.dispatch(new fromTracking.UpdateSession(result.toJSON()));
              })
              .catch(error => {
                console.error('Error saving tracking ', error);
              });
            console.log('Tracked Card click');
          })
          .catch(error => {
            console.log('Error finding user: ', error.message);
          });
      }
    });
  }

  trackCardMessage(card: Card, sessionId: string) {
    const clickedCard: TrackingCard = {
      id: card.objectId,
      title: card.title,
      description: card.description,
      category: card.category,
      subject_areas: [card.specialty1, card.specialty2, card.specialty3],
      zip_code: card.projectPLZ,
      tags: card.tags,
      org_size: card.orgSize.replace(/\D/g, '')
    };

    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user && this.checkConsent()) {
        const query = new Parse.Query('TrackingTest');
        query.get(sessionId)
          .then(itemToUpdate => {
            itemToUpdate.addUnique('messaged_cards', clickedCard);
            itemToUpdate.save()
              .then((result: any) => {
                this.store.dispatch(new fromTracking.UpdateSession(result.toJSON()));
              })
              .catch(error => {
                console.error('Error saving tracking ', error);
              });
            console.log('Tracked Card message');
          })
          .catch(error => {
            console.log('Error finding user: ', error.message);
          });
      }
    });
  }

  trackProfileMessage(profile: ProfileES, sessionId: string) {
    const clickedProfile: TrackingProfile = {
      profileId: profile._id,
      title: profile._source.institute_name,
      description: profile._source.description,
      subject_areas: profile._source.subject_areas,
      public: profile._source.public,
      plz: profile._source.zip_code,
      tags: profile._source.tags,
      research_focus: profile._source.research_focus,
      projects: profile._source.projects,
      publications: profile._source.publications,
      infrastructure: profile._source.infrastructure,
      org_size: profile._source.orgSize.replace(/\D/g, '')
    };

    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user && this.checkConsent()) {
        const query = new Parse.Query('TrackingTest');
        query.get(sessionId)
          .then(itemToUpdate => {
            itemToUpdate.addUnique('messaged_profiles', clickedProfile);
            itemToUpdate.save()
              .then((result: any) => {
                this.store.dispatch(new fromTracking.UpdateSession(result.toJSON()));
              })
              .catch(error => {
                console.error('Error saving tracking ', error);
              });
            console.log('Tracked profile message');
          })
          .catch(error => {
            console.log('Error finding user: ', error.message);
          });
      }
    });
  }

  private checkConsent(): boolean {
    if (localStorage) {
      if (localStorage.getItem('allowTracking') !== null) {
        if (localStorage.getItem('allowTracking') === 'true') {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  createSession(user: User, userCards: Card[], userProfile: Profile): Promise<Parse.Object> {
    const trackingCards: Array<TrackingCard> = [];
    userCards.forEach(card => {
      const singleCard: TrackingCard = {
        id: card.objectId,
        title: card.title,
        description: card.description,
        category: card.category,
        subject_areas: [card.specialty1, card.specialty2, card.specialty3],
        zip_code: card.projectPLZ,
        tags: card.tags,
        org_size: card.orgSize
      };
      trackingCards.push(singleCard);
    });
    const currentProfile: UserProfile = {
      profileId: userProfile.objectId,
      title: userProfile.title,
      description: userProfile.description,
      subject_areas: [userProfile.specialty1, userProfile.specialty2].concat(userProfile.specialties3),
      public: userProfile.public,
      plz: userProfile.plz,
      tags: userProfile.tags,
      projects: userProfile.projects,
      publications: userProfile.publications,
      infrastructure: userProfile.infrastructure,
      research_focus: userProfile.researchFocus,
      org_size: userProfile.orgSize
    };

    const tracking = Parse.Object.extend('TrackingTest');
    const trackingToCreate = new tracking();

    if (this.checkConsent()) {
      return trackingToCreate.save({
        uid: user.id,
        org_plz: user.attributes.orgPlz,
        favorites: user.attributes.favorites,
        profile_id: user.attributes.profileId,
        user_cards: trackingCards,
        user_profile: currentProfile,
        profile_searches: [],
        card_searches: [],
        profile_filters: [],
        card_filters: [],
        clicked_profiles: [],
        clicked_cards: [],
        messaged_profiles: [],
        messaged_cards: []
      });
    }
  }

  loadSession(sessionId: string): Promise<Parse.Object> {
    const query = new Parse.Query('TrackingTest');
    return query.get(sessionId);
  }
}
