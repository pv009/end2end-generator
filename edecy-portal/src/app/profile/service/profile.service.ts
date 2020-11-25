import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import * as Parse from 'parse';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { environment } from '../../../environments/environment';
import { ProfileContact } from '../model/contact-profile.model';
import { Profile, Project, Publication, ResearchFocus } from '../model/profile.model';
import * as fromProfile from '../state/profile.actions';

Parse.initialize(environment.parse.appID, environment.parse.masterKey);
(Parse as any).serverURL = environment.parse.serverURL;

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(
        private snackbar: MatSnackBar,
        private store: Store,
        private matomoHelper: MatomoHelperService
    ) { }

    createProfile(newProfile: Profile, testing?: boolean): Promise<Parse.Object> {
        const profile = Parse.Object.extend('Profiles');
        const profileToCreate = new profile();

        const acl = new Parse.ACL(Parse.User.current());
        acl.setPublicReadAccess(true);
        if (testing === true) {
            acl.setPublicWriteAccess(true);
        }
        profileToCreate.setACL(acl);

        return profileToCreate.save({
            title: newProfile.title,
            status: newProfile.status,
            description: newProfile.description,
            logoURL: newProfile.logoURL,
            category: newProfile.category,
            specialty1: newProfile.specialty1,
            specialty2: newProfile.specialty2,
            specialties3: newProfile.specialties3,
            organisation: newProfile.organisation,
            streetNo: newProfile.streetNo,
            plz: newProfile.plz,
            city: newProfile.city,
            public: newProfile.public,
            researchFocus: newProfile.researchFocus,
            projects: newProfile.projects,
            publications: newProfile.publications,
            infrastructure: newProfile.infrastructure,
            tags: newProfile.tags,
            loginRequired: newProfile.loginRequired,
            orgSize: newProfile.orgSize,
            companyType: newProfile.companyType,
            instituteType: newProfile.instituteType,
            interest: newProfile.interest,
            projectLeadershipPossible: newProfile.projectLeadershipPossible,
            uid: newProfile.uid
        });
    }

    saveProfile(profileToSave: Profile): Promise<boolean | void> {
        const query = new Parse.Query('Profiles');
        return query.get(profileToSave.objectId)
            .then(foundProfile => {
                foundProfile.save({
                    title: profileToSave.title,
                    status: profileToSave.status,
                    description: profileToSave.description,
                    logoURL: profileToSave.logoURL,
                    category: profileToSave.category,
                    specialty1: profileToSave.specialty1,
                    specialty2: profileToSave.specialty2,
                    specialties3: profileToSave.specialties3,
                    organisation: profileToSave.organisation,
                    streetNo: profileToSave.streetNo,
                    plz: profileToSave.plz,
                    city: profileToSave.city,
                    public: profileToSave.public,
                    researchFocus: profileToSave.researchFocus,
                    projects: profileToSave.projects,
                    publications: profileToSave.publications,
                    infrastructure: profileToSave.infrastructure,
                    tags: profileToSave.tags,
                    loginRequired: profileToSave.loginRequired,
                    orgSize: profileToSave.orgSize,
                    companyType: profileToSave.companyType,
                    instituteType: profileToSave.instituteType,
                    interest: profileToSave.interest,
                    projectLeadershipPossible: profileToSave.projectLeadershipPossible
                });
                if (profileToSave.status === 'saved') {
                    this.snackbar.open('Ihr Profil wurde gespeichert', '', {
                        duration: 2000
                    });
                } else if (profileToSave.status === 'published') {
                    this.snackbar.open('Ihr Profil wird veröffentlicht', '', {
                        duration: 2000
                    });
                }

                return true;
            })
            .catch(error => {
                console.error('Error finding profile: ', error);
                this.snackbar.open('Ihre Bearbeitung konnte nicht gespeichert werden!' +
                    'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
                    duration: 2000
                });
                return false;
            });

    }

    deleteProfile(id: string): Promise<boolean | void> {
        const query = new Parse.Query('Profiles');
        return query.get(id)
            .then(result => {
                result.destroy();
                this.snackbar.open('Ihr Profil wird gelöscht.', '', {
                    duration: 2000
                });
                return true;
            })
            .catch(error => {
                console.error('Error finding profile: ', error);
            });
    }


    uploadPicture(fileName: string, fileToUpload: any): any {
        const newPicture = new Parse.File(fileName, fileToUpload);
        return newPicture.save();
    }

    loadProfile(id: string) {
        const query = new Parse.Query('Profiles');
        return query.get(id);
    }

    loadUserProfile(uid: string) {
        const query = new Parse.Query('Profiles');
        query.equalTo('uid', uid);
        return query.find();
    }

    addFocus(focus: ResearchFocus, profileId: string, testing?: boolean) {
        const query = new Parse.Query('Profiles');
        query.get(profileId)
            .then(profileToUpdate => {
                profileToUpdate.addUnique('researchFocus', focus);
                if (testing === undefined) {
                    profileToUpdate.save().then((profile: any) => {
                        this.store.dispatch(new fromProfile.LoadUserProfileSuccessfull(profile.toJSON()));
                    });
                } else {
                    profileToUpdate.save().then(() => console.log('saved profile'));
                }

            })
            .catch(error => {
                console.log('Error finding Profile: ', error.message);
            });
    }

    addProject(project: Project, profileId: string, testing?: boolean) {
        const query = new Parse.Query('Profiles');
        query.get(profileId)
            .then(profileToUpdate => {
                profileToUpdate.addUnique('projects', project);

                if (testing === undefined) {
                    profileToUpdate.save().then((profile: any) => {
                        this.store.dispatch(new fromProfile.LoadUserProfileSuccessfull(profile.toJSON()));
                    });
                } else {
                    profileToUpdate.save().then(() => console.log('saved profile'));
                }
            })
            .catch(error => {
                console.log('Error finding Profile: ', error.message);
            });
    }

    addPublication(publication: Publication, profileId: string, testing?: boolean) {
        const query = new Parse.Query('Profiles');
        query.get(profileId)
            .then(profileToUpdate => {
                profileToUpdate.addUnique('publications', publication);

                if (testing === undefined) {
                    profileToUpdate.save().then((profile: any) => {
                        this.store.dispatch(new fromProfile.LoadUserProfileSuccessfull(profile.toJSON()));
                    });
                } else {
                    profileToUpdate.save().then(() => console.log('saved profile'));
                }
            })
            .catch(error => {
                console.log('Error finding Profile: ', error.message);
            });
    }

    loadProfileOwner(profileID: string) {
        const query = new Parse.Query('User');
        query.equalTo('profileId', profileID);

        return query.find();
    }

    async contactProfile(message: ProfileContact) {
        const profileMessage = Parse.Object.extend('ProfileContacts');
        const messageToCreate = new profileMessage();

        messageToCreate.save({
            sender: message.sender,
            senderId: message.senderId,
            subject: message.subject,
            email: message.email,
            profileId: message.profileId,
            message: message.message
        });

        const params = {
            sender: message.sender,
            senderId: message.senderId,
            subject: message.subject,
            email: message.email,
            profileId: message.profileId,
            message: message.message
        };

        await Parse.Cloud.run('contactProfile', params)
            .then(() => {
                this.snackbar.open('Ihre Nachricht wurde gesendet!', '', {
                    duration: 4000
                });
            })
            .catch(error => {
                console.error('Error sending mail: ', error.message);
                this.snackbar.open('Ihre Nachricht konnte nicht gesendet werden.' +
                    'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
                    duration: 4000
                });
            });
    }
}

