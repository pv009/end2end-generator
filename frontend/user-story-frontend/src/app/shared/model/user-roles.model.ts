import { Context } from './context.model';

export interface UserRole {
    name: string;
    correspondingContexts: Array<Context>;
}
