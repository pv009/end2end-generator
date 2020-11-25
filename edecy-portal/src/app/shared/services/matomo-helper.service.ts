import { Injectable } from '@angular/core';
import { MatomoTracker } from 'ngx-matomo';
import { environment } from '../../../environments/environment';

declare var window: {
    [key: string]: any;
    prototype: Window;
    new(): Window;
};

@Injectable()
export class MatomoHelperService {

    prefix = '';

    constructor(
        private matomoTracker: MatomoTracker
    ) {
        if (environment.staging) {
            this.prefix = 'staging-';
        }
    }

    setUserId(uid: string): void {
        const paq = window._paq || [];
        paq.push(['setUserId', uid]);
        console.log('Matomo: Set uid to ', uid);
    }

    trackEvent(category: string, action: string, name?: string, value?: number): void {
        if (environment.matomo.tracking) {
            console.log('Event tracked: ', this.prefix + category, this.prefix + action, name, value);
            this.matomoTracker.trackEvent(this.prefix + category, this.prefix + action, name, value);
        } else {
            console.log('DID NOD TRACK Event: ', this.prefix + category, this.prefix + action, name, value);
        }
    }

    trackPageView(customTitle?: string): void {
        if (environment.matomo.tracking) {
            console.log('Page View tracked: ', this.prefix + customTitle);
            this.matomoTracker.trackPageView(this.prefix + customTitle);
        } else {
            console.log('DID NOT TRACK Page View: ', this.prefix + customTitle);
        }
    }

    trackSiteSearch(keyword: string, category?: string, resultsCount?: number): void {
        if (environment.matomo.tracking) {
            console.log('Site Search tracked: ', this.prefix + keyword, this.prefix + category, resultsCount);
            this.matomoTracker.trackSiteSearch(this.prefix + keyword, this.prefix + category, resultsCount);
        } else {
            console.log('DID NOT TRACK Site Search: ', this.prefix + keyword, this.prefix + category, resultsCount);
        }
    }

    trackGoal(idGoal: number, customRevenue?: number): void {
        if (environment.matomo.tracking) {
            console.log('Goal tracked: ', idGoal, customRevenue);
            this.matomoTracker.trackGoal(idGoal, customRevenue);
        } else {
            console.log('DID NOT TRACK Goal: ', idGoal, customRevenue);
        }
    }

    trackEcommerceCartUpdate(grandTotal: number): void {
        if (environment.matomo.tracking) {
            console.log('Ecommerce Cart Update tracked: ', grandTotal);
            this.matomoTracker.trackEcommerceCartUpdate(grandTotal);
        } else {
            console.log('DID NOT TRACK Ecommerce Cart Update: ', grandTotal);
        }
    }

    trackEcommerceOrder(orderId: string, grandTotal: number, subTotal?: number, tax?: number, shipping?: number, discount?: number): void {
        if (environment.matomo.tracking) {
            console.log('Ecommerce Order tracked: ', this.prefix + orderId, grandTotal, subTotal, tax, shipping, discount);
            this.matomoTracker.trackEcommerceOrder(this.prefix + orderId, grandTotal, subTotal, tax, shipping, discount);
        } else {
            console.log('DID NOT TRACK Ecommerce Order: ', this.prefix + orderId, grandTotal, subTotal, tax, shipping, discount);
        }
    }

}
