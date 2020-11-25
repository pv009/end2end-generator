export interface Booking {
    organisation: string;
    branche?: string;
    partner: string;
    receiptReceiver: string;
    street: string;
    streetNo: string;
    plz: string;
    city: string;
    telephone?: string;
    email: string;
    promocode?: string;
    payment: string;
    packages?: any[];
    foundEdecyOther?: string;
    foundEdecy?: Array<string>;
    offer: string;
}
