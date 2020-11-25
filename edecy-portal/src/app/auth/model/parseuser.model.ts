export interface ParseUser {
  attributes: {
    objectId: string;
    username: string;
    email: string;
    emailVerified: string;
    updatedAt?: Date;
    createdAt?: Date;
    password?: string;
    authData?: any;
    ACL?: any;
  };
}
