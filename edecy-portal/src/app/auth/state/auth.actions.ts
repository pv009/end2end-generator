import { NotificationSubscription } from '../model/notification-sub.model';

export class CheckSession {
    static type = '[Auth] Check Session';
}

export class LoginUser {
    static readonly type = '[Auth] Login User';
    constructor(public email: string, public password: string) { }
}

export class LoginSuccess {
    static type = '[Auth] Login Success';
    constructor(public loggedInUser: any) { }
}

export class LoginFailed {
    static type = '[Auth] Login Failed';
    constructor(public errorMessage: string) {}
}

export class LogoutUser {
  static readonly type = '[Auth] Logout User';
}

export class LogoutUserSuccess {
  static readonly type = '[Auth] Logout User Success';
}

export class DeleteUser {
  static readonly type = '[Auth] Delete User';
}

export class DeleteUserSuccess {
  static readonly type = '[Auth] Delete User Success';
}

export class CreateNotificationSubscription {
  static readonly type = '[Auth] Create Notification Subscription';
  constructor(public readonly payload: NotificationSubscription) {}
}

export class LoadNotificationSubscription {
  static readonly type = '[Auth] Loading Notification Subscription';
  constructor(public readonly uid: string, public readonly platform: string) {}
}

export class FindNotifcationSubscription {
  static readonly type = '[Auth] Finding Notification Subscription';
  constructor(public readonly subId: string) {}
}

export class LoadNotificationSubscriptionSucessfull {
  static readonly type = '[Auth] Loading Notification Subscription was successfull';
  constructor(public readonly sub: NotificationSubscription) {}
}

export class LoadNotificationSubscriptionFailed {
  static readonly type = '[Auth] Loading Notification Subscription failed';
}

export class DisableNotificationSubscription {
  static readonly type = '[Auth] Disabling Notification Subscription';
  constructor(public readonly subId: string) {}
}

export class ReEnableNotificationSubscription {
  static readonly type = '[Auth] Re-Enabling Notification Subscription';
  constructor(public readonly subId: string) {}
}

export class EnableChatNewsletter {
  static readonly type = '[Auth] Enabling Chat Newsletter';
  constructor(public readonly uid: string) {}
}

export class DisableChatNewsletter {
  static readonly type = '[Auth] Disabling Chat Newsletter';
  constructor(public readonly uid: string) {}
}



export type AuthActions =
| CheckSession
| LoginUser
| LoginFailed
| LoginSuccess
| LogoutUser
| LogoutUserSuccess
| DeleteUser
| DeleteUserSuccess
| CreateNotificationSubscription
| LoadNotificationSubscription
| FindNotifcationSubscription
| LoadNotificationSubscriptionSucessfull
| LoadNotificationSubscriptionFailed
| DisableNotificationSubscription
| EnableChatNewsletter
| DisableChatNewsletter;
