import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Parse from 'parse';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { environment } from '../../../environments/environment';
import { Card } from '../model/card.model';

Parse.initialize(environment.parse.appID, environment.parse.masterKey);
(Parse as any).serverURL = environment.parse.serverURL;

@Injectable({
    providedIn: 'root'
})
export class CardsService {

    constructor(
        private snackbar: MatSnackBar,
        private matomoHelper: MatomoHelperService
    ) { }

    createCard(newCard: Card, testing?: boolean): Promise<Parse.Object> {
        const card = Parse.Object.extend('Ads');
        const cardToCreate = new card();

        const acl = new Parse.ACL(Parse.User.current());
        acl.setPublicReadAccess(true);
        if (testing === true) {
            acl.setPublicWriteAccess(true);
        }
        cardToCreate.setACL(acl);


        return cardToCreate.save({
            uid: newCard.uid,
            title: newCard.title,
            description: newCard.description,
            category: newCard.category,
            specialty1: newCard.specialty1,
            specialty2: newCard.specialty2,
            specialty3: newCard.specialty3,
            userName: newCard.userName,
            showUserName: newCard.showUserName,
            userMail: newCard.userMail,
            organisation: newCard.organisation,
            showOrganisation: newCard.showOrganisation,
            projectStreetNo: newCard.projectStreetNo,
            projectPLZ: newCard.projectPLZ,
            projectCity: newCard.projectCity,
            clientPLZ: newCard.clientPLZ,
            clientCity: newCard.clientCity,
            clientStreetNo: newCard.clientStreetNo,
            tags: newCard.tags,
            pictureURL: newCard.pictureURL,
            logoURL: newCard.logoURL,
            mailAlert: newCard.mailAlert,
            showPlz: newCard.showPlz,
            showProjectPlz: newCard.showProjectPlz,
            adType: newCard.adType,
            status: newCard.status,
            userFirstName: newCard.userFirstName,
            userLastName: newCard.userLastName,
            loginRequired: newCard.loginRequired,
            orgSize: newCard.orgSize,
            projectType: newCard.projectType,
            partnerType: newCard.partnerType,
            partnerCompanyType: newCard.partnerCompanyType,
            partnerInstituteType: newCard.partnerInstituteType,
            projectStage: newCard.projectStage,
            projectLeadershipPossible: newCard.projectLeadershipPossible,
            partnerRange: newCard.partnerRange,
            fundingNeeded: newCard.fundingNeeded
        });
    }

    saveCard(cardToSave: Card): Promise<boolean | void> {
        const query = new Parse.Query('Ads');
        return query.get(cardToSave.objectId)
            .then(foundCard => {
                foundCard.save({
                    uid: cardToSave.uid,
                    title: cardToSave.title,
                    description: cardToSave.description,
                    category: cardToSave.category,
                    specialty1: cardToSave.specialty1,
                    specialty2: cardToSave.specialty2,
                    specialty3: cardToSave.specialty3,
                    userName: cardToSave.userName,
                    showUserName: cardToSave.showUserName,
                    loginRequired: cardToSave.loginRequired,
                    userMail: cardToSave.userMail,
                    organisation: cardToSave.organisation,
                    showOrganisation: cardToSave.showOrganisation,
                    projectStreetNo: cardToSave.projectStreetNo,
                    projectPLZ: cardToSave.projectPLZ,
                    projectCity: cardToSave.projectCity,
                    clientPLZ: cardToSave.clientPLZ,
                    clientCity: cardToSave.clientCity,
                    clientStreetNo: cardToSave.clientStreetNo,
                    tags: cardToSave.tags,
                    pictureURL: cardToSave.pictureURL,
                    logoURL: cardToSave.logoURL,
                    mailAlert: cardToSave.mailAlert,
                    showPlz: cardToSave.showPlz,
                    showProjectPlz: cardToSave.showProjectPlz,
                    adType: cardToSave.adType,
                    status: cardToSave.status,
                    userFirstName: cardToSave.userFirstName,
                    userLastName: cardToSave.userLastName,
                    orgSize: cardToSave.orgSize,
                    projectType: cardToSave.projectType,
                    partnerType: cardToSave.partnerType,
                    partnerCompanyType: cardToSave.partnerCompanyType,
                    partnerInstituteType: cardToSave.partnerInstituteType,
                    projectStage: cardToSave.projectStage,
                    projectLeadershipPossible: cardToSave.projectLeadershipPossible,
                    partnerRange: cardToSave.partnerRange,
                    fundingNeeded: cardToSave.fundingNeeded
                });
                if (cardToSave.status === 'saved') {
                    this.snackbar.open('Ihre Anzeige wurde gespeichert', '', {
                        duration: 2000
                    });
                } else if (cardToSave.status === 'published') {
                    this.snackbar.open('Ihre Anzeige wurde veröffentlicht', '', {
                        duration: 2000
                    });
                }

                return true;
            })
            .catch(error => {
                console.error('Error finding card: ', error);
                this.snackbar.open('Ihre Bearbeitung konnte nicht gespeichert werden!' +
                    'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
                    duration: 2000
                });
                return false;
            });
    }

    deleteCard(id: string): Promise<boolean | void> {
        const query = new Parse.Query('Ads');
        return query.get(id)
            .then(result => {
                result.destroy();
                this.snackbar.open('Ihre Anzeige wurde gelöscht.', '', {
                    duration: 2000
                });
                return true;
            })
            .catch(error => {
                console.error('Error finding card: ', error);
            });
    }

    uploadPicture(fileName: string, fileToUpload: any): any {
        const newPicture = new Parse.File(fileName, fileToUpload);
        return newPicture.save();
    }

    loadCards() {
        const query = new Parse.Query('Ads');
        query.equalTo('status', 'published');
        query.descending('updatedAt');

        return query.find();
    }

    loadCardsByCategory(category: Array<string>) {
        if (category.length === 1) {
            const query = new Parse.Query('Ads');
            query.equalTo('status', 'published');
            query.equalTo('category', category[0]);
            query.descending('updatedAt');

            return query.find();

        } else if (category.length === 2) {
            const query1 = new Parse.Query('Ads');
            query1.equalTo('status', 'published');
            query1.equalTo('category', category[0]);

            const query2 = new Parse.Query('Ads');
            query2.equalTo('status', 'published');
            query2.equalTo('category', category[1]);

            const mainQuery = Parse.Query.or(query1, query2);
            mainQuery.descending('updatedAt');

            return mainQuery.find();

        } else if (category.length === 3) {
            const query1 = new Parse.Query('Ads');
            query1.equalTo('status', 'published');
            query1.equalTo('category', category[0]);

            const query2 = new Parse.Query('Ads');
            query2.equalTo('status', 'published');
            query2.equalTo('category', category[1]);

            const query3 = new Parse.Query('Ads');
            query3.equalTo('status', 'published');
            query3.equalTo('category', category[2]);

            const mainQuery = Parse.Query.or(query1, query2, query3);
            mainQuery.descending('updatedAt');

            return mainQuery.find();
        }
    }

    loadCard(id: string) {
        const query = new Parse.Query('Ads');
        query.equalTo('objectId', id);
        return query.find();
    }

    searchCards(keyword: string, testing?: boolean) {
        const searchQuery = new Parse.Query('Ads');
        searchQuery.fullText('title', keyword);
        searchQuery.descending('updatedAt');
        if (testing === undefined) {
            this.matomoHelper.trackSiteSearch(keyword, 'cards');
        }


        return searchQuery.find();
    }

    searchUserCards(keyword: string, uid: string, testing?: boolean) {
        if (testing === undefined) {
            this.matomoHelper.trackSiteSearch(keyword, 'user-cards');
        }

        const query = new Parse.Query('Ads');
        query.equalTo('uid', uid);
        query.fullText('title', keyword);
        query.descending('updatedAt');

        return query.find();
    }

    loadUserCards(uid: string) {
        const query = new Parse.Query('Ads');
        query.equalTo('uid', uid);
        query.descending('updatedAt');

        return query.find();
    }

}
