import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as Parse from 'parse';
import { environment } from 'src/environments/environment';
import { NotificationSubscription } from '../model/notification-sub.model';
import { UserModel } from '../model/user.model';



Parse.initialize(environment.parse.appID, environment.parse.masterKey);
(Parse as any).serverURL = environment.parse.serverURL;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  public getUsers(): Promise<any> {
    const users = Parse.Object.extend('User');
    const query = new Parse.Query(users);

    return query.find();
  }

  public loadUser(uid: string): Promise<any> {
    const users = Parse.Object.extend('User');
    const query = new Parse.Query(users);

    return query.get(uid);
  }

  public async registerUser(newUser: UserModel, password: string) {
    const user = new Parse.User();

    // necessary fields
    user.set('username', newUser.email);
    user.set('password', password);
    user.set('email', newUser.email);

    // optional fields
    user.set('firstName', newUser.firstName);
    user.set('lastName', newUser.lastName);
    user.set('title', newUser.title);
    user.set('gender', newUser.gender);
    user.set('organisation', newUser.organisation);
    user.set('orgStreetNo', newUser.orgStreetNo);
    user.set('orgPlz', newUser.orgPlz);
    user.set('orgCity', newUser.orgCity);
    user.set('telephone', newUser.telephone);
    user.set('orgLogo', newUser.orgLogo);
    user.set('favorites', []);
    user.set('profileId', newUser.profileId);
    user.set('rate', newUser.rate ? newUser.rate : 'basic');
    user.set('receiveChatNewsletter', newUser.receiveChatNewsletter);
    user.set('phoneAvailable', newUser.phoneAvailable);

    await user.signUp().then(() => {
      this.snackbar.open('Ihre Registrierung war erfolgreich!', '', {
        duration: 2000
      });
    })
      .catch(error => {
        console.log('Error happened during registration: ', error);
        this.snackbar.open('Ihre Registrierung ist leider fehlgeschlagen.' +
          'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
          duration: 2000
        });
      });
  }

  public async loginUser(email: string, password: string) {
    return await Parse.User.logIn(email, password);
  }


  public changePassword(email: string): Promise<Parse.User> {
    return Parse.User.requestPasswordReset(email);
  }

  public setPassword(userMail: string, password: string) {
    const query = new Parse.Query('User');
    query.equalTo('email', userMail);

    query.find().then(results => {
      results[0].set('password', password);
      results[0].save().then(() => {
        this.snackbar.open('Passwort erfolgreich geändert.', '', {
          duration: 2000
        });
        this.router.navigate(['/login']);
      })
        .catch(error => {
          console.error('Error changing password: ', error);
          this.snackbar.open('Passwort konnte nicht geändert werden.' +
            'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
            duration: 2000
          });
        });
    })
      .catch(error => {
        console.error('Error finding user: ', error);
      });
  }

  public getSession() {
    return Parse.Session.current();
  }

  public getUser() {
    return Parse.User.current();
  }

  public logOutUser() {
    return Parse.User.logOut();
  }

  refreshUser() {
    Parse.User.current().fetch();
  }

  uploadPicture(fileName: string, fileToUpload: any): any {
    const newPicture = new Parse.File(fileName, fileToUpload);
    return newPicture.save();
  }

  updateUser(user: UserModel, mailChange?: boolean) {
    const query = new Parse.Query('User');
    query.get(user.objectId)
      .then(result => {
        if (mailChange) {
          result.save({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            title: user.title,
            organisation: user.organisation,
            orgStreetNo: user.orgStreetNo,
            orgPlz: user.orgPlz,
            orgCity: user.orgCity,
            orgLogo: user.orgLogo,
            profileId: user.profileId,
            rate: user.rate,
            telephone: user.telephone,
            phoneAvailable: user.phoneAvailable
          }).then(() => {
            this.snackbar.open('Daten gespeichert.', '', {
              duration: 2000
            });
          })
            .catch(error => {
              console.error('Error saving user: ', error);
              this.snackbar.open('Daten konnten nicht gespeichert werden.' +
                'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
                duration: 3500
              });
            });
        } else {
          result.save({
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            title: user.title,
            organisation: user.organisation,
            orgStreetNo: user.orgStreetNo,
            orgPlz: user.orgPlz,
            orgCity: user.orgCity,
            orgLogo: user.orgLogo,
            profileId: user.profileId,
            rate: user.rate,
            telephone: user.telephone,
            phoneAvailable: user.phoneAvailable
          }).then(() => {
            this.snackbar.open('Daten gespeichert.', '', {
              duration: 2000
            });
          })
            .catch(error => {
              console.error('Error saving user: ', error);
              this.snackbar.open('Daten konnten nicht gespeichert werden.' +
                'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
                duration: 3500
              });
            });
        }
      })
      .catch(error => {
        console.error('Error finding user: ', error);
        this.snackbar.open('Daten konnten nicht gespeichert werden.' +
          'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
          duration: 3500
        });
      });
  }

  setProfile(user: UserModel) {
    const query = new Parse.Query('User');
    query.get(user.objectId)
      .then(result => {
        result.save({
          profileId: user.profileId

        }).then(() => {
          console.log('Saved profile');
        })
          .catch(error => {
            console.error('Error saving user: ', error);
            this.snackbar.open('Daten konnten nicht gespeichert werden.' +
              'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
              duration: 3500
            });
          });
      })
      .catch(error => {
        console.error('Error finding user: ', error);
        this.snackbar.open('Daten konnten nicht gespeichert werden.' +
          'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
          duration: 3500
        });
      });
  }

  enableChatNewsletter(uid: string) {
    const query = new Parse.Query('User');
    query.get(uid)
      .then(result => {
        result.save({
          receiveChatNewsletter: true
        }).then(() => {
          console.log('Enabled chat newsletter');
        }).catch(error => {
          console.error('Error saving user: ', error);
          this.snackbar.open('Einstellung konnte nicht gespeichert werden.' +
            'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
            duration: 3500
          });
        });
      }).catch(error => {
        console.error('Error finding user: ', error);
        this.snackbar.open('Einstellung konnte nicht gespeichert werden.' +
          'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
          duration: 3500
        });
      });
  }

  disableChatNewsletter(uid: string) {
    const query = new Parse.Query('User');
    query.get(uid)
      .then(result => {
        result.save({
          receiveChatNewsletter: false
        }).then(() => {
          console.log('Disabled chat newsletter');
        }).catch(error => {
          console.error('Error saving user: ', error);
          this.snackbar.open('Einstellung konnte nicht gespeichert werden.' +
            'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
            duration: 3500
          });
        });
      }).catch(error => {
        console.error('Error finding user: ', error);
        this.snackbar.open('Einstellung konnte nicht gespeichert werden.' +
          'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
          duration: 3500
        });
      });
  }

  deleteUser() {
    return Parse.User.current().destroy();
  }

  checkMail(email: string) {
    const query = new Parse.Query('User');
    query.equalTo('email', email);
    return query.find();
  }

  enableNotifications(sub: NotificationSubscription): Promise<Parse.Object> {
    const subscription = Parse.Object.extend('NotificationSubs');
    const subscriptionToCreate = new subscription();

    return subscriptionToCreate.save({
      uid: sub.uid,
      subscription: sub.subscription,
      platform: sub.platform,
      active: sub.active
    });
  }

  loadNotificationSubscription(uid: string, platform: string) {
    const query = new Parse.Query('NotificationSubs');
    query.equalTo('uid', uid);
    query.equalTo('platform', platform);

    return query.find();
  }

  findNotificationSubscription(id: string) {
    const query = new Parse.Query('NotificationSubs');
    return query.get(id);
  }

  disableNotifications(id: string): Promise<boolean | void> {
    const query = new Parse.Query('NotificationSubs');
    return query.get(id)
      .then(result => {
        result.save({
          active: false
        });
        this.snackbar.open('Ihre Benachrichtigungen wurden deaktiviert.', '', {
          duration: 3000
        });
        return true;
      })
      .catch(error => {
        console.error('Error disabling notifications ', error);
        this.snackbar.open('Ihre Benachrichtigungen konnten nicht deaktiviert werden.' +
          'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
          duration: 3000
        });
        return false;
      });
  }

  reEnableNotifications(id: string): Promise<boolean | void> {
    const query = new Parse.Query('NotificationSubs');
    return query.get(id)
      .then(result => {
        result.save({
          active: true
        });
        this.snackbar.open('Ihre Benachrichtigungen wurden aktiviert.', '', {
          duration: 3000
        });
        return true;
      })
      .catch(error => {
        console.error('Error disabling notifications ', error);
        this.snackbar.open('Ihre Benachrichtigungen konnten nicht aktiviert werden.' +
          'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
          duration: 3000
        });
        return false;
      });
  }

  saveTrackingDecision(accepted: boolean) {
    const decision = Parse.Object.extend('TrackingDecisions');
    const decisionToCreate = new decision();

    decisionToCreate.save({
      trackingAccepted: accepted
    }).then(result => {
      console.log('Saved user decision');
    }).catch(error => {
      console.error('Error saving user decision', error);
    });
  }
}
