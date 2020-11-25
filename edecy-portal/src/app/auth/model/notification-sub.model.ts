export interface NotificationSubscription {
    objectId?: string;
    uid: string;
    subscription: PushSubscription;
    platform: string;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface PushSubscription {
    endpoint: string;
    expirationTime: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}
