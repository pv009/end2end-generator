import { User } from 'parse';
import { NotificationSubscription } from './notification-sub.model';


export interface AuthStateModel {
  loaded: boolean;
  loading: boolean;
  error: string;
  user: User;
  subscription: NotificationSubscription;
}
