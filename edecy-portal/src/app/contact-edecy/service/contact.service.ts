import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Parse from 'parse';
import { environment } from 'src/environments/environment';
import { SuccessMessageComponent } from '../book-offer/success-message/success-message.component';
import { Booking } from '../model/booking.model';
import { Feedback } from '../model/feedback.model';
import { Registration } from '../model/registration.model';

Parse.initialize(environment.parse.appID, environment.parse.masterKey);
(Parse as any).serverURL = environment.parse.serverURL;

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    constructor(
        private snackbar: MatSnackBar,
        private dialog: MatDialog,
    ) { }

    async sendFeedback(feedback: Feedback) {
        const feedbackMessage = Parse.Object.extend('Feedback');
        const feedbackToCreate = new feedbackMessage();

        feedbackToCreate.save({
            firstName: feedback.firstName,
            lastName: feedback.lastName,
            feedback: feedback.feedback,
            email: feedback.email
        });

        const params = {
            firstName: feedback.firstName,
            lastName: feedback.lastName,
            feedback: feedback.feedback,
            email: feedback.email
        };

        await Parse.Cloud.run('sendFeedback', params)
            .then(() => {
                this.snackbar.open('Vielen Dank für Ihr Feedback!', '', {
                    duration: 4000
                });
            })
            .catch(error => {
                console.error('Error sending mail: ', error.message);
                this.snackbar.open('Ihr Feedback konnte nicht gesendet werden' +
                    'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
                    duration: 4000
                });
            });
    }

    async sendBooking(booking: Booking) {
        const newBooking = Parse.Object.extend('Bookings');
        const bookingToCreate = new newBooking();

        bookingToCreate.save({
            organisation: booking.organisation,
            branche: booking.branche,
            partner: booking.partner,
            receiptReceiver: booking.receiptReceiver,
            street: booking.street,
            streetNo: booking.streetNo,
            plz: booking.plz,
            city: booking.city,
            telephone: booking.telephone,
            email: booking.email,
            promocode: booking.promocode,
            payment: booking.payment,
            foundEdecyOther: booking.foundEdecyOther,
            foundEdecy: booking.foundEdecy,
            offer: booking.offer,
        });

        const params = {
            organisation: booking.organisation,
            branche: booking.branche,
            partner: booking.partner,
            receiptReceiver: booking.receiptReceiver,
            street: booking.street,
            streetNo: booking.streetNo,
            plz: booking.plz,
            city: booking.city,
            telephone: booking.telephone,
            email: booking.email,
            promocode: booking.promocode,
            payment: booking.payment,
            foundEdecyOther: booking.foundEdecyOther,
            foundEdecy: booking.foundEdecy,
            offer: booking.offer,
        };

        await Parse.Cloud.run('sendBooking', params)
            .then(() => {
                this.dialog.open(SuccessMessageComponent);
            })
            .catch(error => {
                console.error('Error sending mail: ', error.message);
                this.snackbar.open('Ihre Buchung konnte nicht gesendet werden' +
                    'Sollte das Problem weiterhin bestehen, wenden Sie sich bitte an unseren Support.', '', {
                    duration: 4000
                });
            });

        await Parse.Cloud.run('sendBookingToUser', params)
            .then(() => {
                console.log('Sent mail to user');
            })
            .catch(error => {
                console.error('Error sending mail to user: ', error.message);
            });
    }

    async sendRegistration(registration: Registration) {

        const params = {
            organisation: registration.organisation,
            name: registration.name,
            telephone: registration.telephone,
            email: registration.email,
            phoneAvailable: registration.phoneAvailable
        };

        await Parse.Cloud.run('sendRegistration', params);
    }
}
