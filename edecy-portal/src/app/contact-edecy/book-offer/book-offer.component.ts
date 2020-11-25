import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { User } from 'parse';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthState } from 'src/app/auth/state/auth.state';
import { MatomoHelperService } from 'src/app/shared/services/matomo-helper.service';
import { Booking } from '../model/booking.model';
import { ContactService } from '../service/contact.service';

@Component({
  selector: 'app-book-offer',
  templateUrl: './book-offer.component.html',
  styleUrls: ['./book-offer.component.scss']
})
export class BookOfferComponent implements OnInit, OnDestroy {
  @Select(AuthState.getUser) currentUser$: Observable<User>;

  bookingFormSubscription: Subscription;

  offer: string;
  showVoucher = false;

  currentPage = 'Bestellformular';

  bookingForm: FormGroup;

  acceptedTos = false;

  offerSum = 0;

  promocodeCorrect = false;
  discount = 0;

  // Price for selected offer
  basicOfferPrice = 0;

  netSum = 0;
  brutSum = 0;

  waysToFindEdecy = [
    'Homepage',
    'Suchmaschine',
    'Presse',
    'persönliche Empfehlung',
    'Werbeaktion'
  ];


  foundEdecy = [];
  foundEdecyOther = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private contactService: ContactService,
    private matomoHelper: MatomoHelperService
  ) { }

  ngOnInit() {
    this.buildBookingForm();

    this.route.params.pipe(take(1)).subscribe(params => {
      if (params) {
        switch (params.offer) {
          case 'basic':
            this.offer = 'Edecy Basic';
            this.offerSum += 459;
            this.basicOfferPrice = 459;
            break;
          case 'premium':
            this.offer = 'Edecy Premium';
            this.offerSum += 799;
            this.basicOfferPrice = 799;
            break;
          case 'premium-plus':
            this.offer = 'Edecy Premium+';
            this.offerSum += 1799;
            this.basicOfferPrice = 1799;
            break;
          default:
            this.offer = '';
            break;
        }
      }

    });

    this.loadUserData();


    this.bookingFormSubscription = this.bookingForm.valueChanges.subscribe(changes => {
      if (changes) {
        // this.checkPromoCode(changes.promocode);
        // TODO: Reactivate with new promoocode
        this.calculateSumAndTaxes();
      }
    });

    this.matomoHelper.trackPageView('Booking');

  }

  ngOnDestroy(): void {
    this.bookingFormSubscription.unsubscribe();
    this.matomoHelper.trackEvent('Booking', 'Closed Booking Form');
  }

  private buildBookingForm() {
    this.bookingForm = this.fb.group({
      organisation: ['', Validators.required],
      branche: [''],
      partner: ['', Validators.required],
      receiptReceiver: [''],
      street: ['', Validators.required],
      streetNo: ['', Validators.required],
      plz: ['', Validators.required],
      city: ['', Validators.required],
      telephone: [''],
      email: ['', [Validators.required, Validators.email]],
      promocode: [''],
      payment: ['Rechnung'],
      foundEdecyOther: ['']
    });
  }

  private loadUserData() {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        const username: string = user.attributes.firstName + ' ' + user.attributes.lastName;
        this.bookingForm.patchValue({
          organisation: user.attributes.organisation,
          partner: username,
          receiptReceiver: user.attributes.organisation,
          street: user.attributes.orgStreetNo.split(' ')[0],
          streetNo: user.attributes.orgStreetNo.split(' ')[1],
          plz: user.attributes.orgPlz,
          city: user.attributes.orgCity,
          telephone: user.attributes.telephone,
          email: user.attributes.email
        });
      }
    });

  }

  changeCheckbox(event) {
    if (event.checked) {
      this.foundEdecy.push(event.source.value);
    } else {
      for (let i = 0; i < this.foundEdecy.length; i++) {
        if (event.source.value === this.foundEdecy[i]) {
          this.foundEdecy.splice(i, 1);
        }
      }
    }
  }

  bookOffer() {
    const newBooking: Booking = {
      ...this.bookingForm.value,
      offer: this.offer,
      foundEdecy: this.foundEdecy
    };
    this.contactService.sendBooking(newBooking);
    this.matomoHelper.trackGoal(4, this.netSum);
    this.matomoHelper.trackEcommerceOrder('ID', this.brutSum, this.netSum, this.netSum * 0.16, 0, this.discount);
  }

  changedOffer(event: any) {
    switch (event.value) {
      case 'Edecy Basic':
        this.basicOfferPrice = 459;
        break;
      case 'Edecy Premium':
        this.basicOfferPrice = 799;
        break;
      case 'Edecy Premium+':
        this.basicOfferPrice = 1799;
        break;
      default:
        console.error('Selection not found');
        break;
    }
    this.calculateSumAndTaxes();
  }

  private checkPromoCode(code: string) {
    if (code === '#First50' || code === '#Corona' || code === 'First50' || code === 'Corona') {
      this.promocodeCorrect = true;
    }
  }

  private calculateSumAndTaxes() {
    // Add Package Price To Basic Price
    this.offerSum = this.basicOfferPrice;

    // Adjust for Promo Code
    this.discount = this.promocodeCorrect ? this.offerSum * 0.2 : 0;

    this.netSum = this.promocodeCorrect ? this.offerSum * 0.8 : this.offerSum;

    // Calculate Taxes
    this.brutSum = this.netSum * 1.16;

    this.matomoHelper.trackEcommerceCartUpdate(this.brutSum);
  }

}
