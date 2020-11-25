export interface UserModel {
    objectId?: string;
    profileId?: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    title?: string;
    gender?: string;
    organisation?: string;
    orgStreetNo?: string;
    orgPlz?: string;
    orgCity?: string;
    telephone?: string;
    emailVerified?: boolean;
    updatedAt?: Date;
    createdAt?: Date;
    orgLogo?: string;
    favorites?: Array<string>;
    rate?: 'basic' | 'premium' | 'premium-plus';
    receiveChatNewsletter?: boolean;
    phoneAvailable?: string;
}
