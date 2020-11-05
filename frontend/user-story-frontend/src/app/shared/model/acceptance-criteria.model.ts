import { Context } from './context.model';

export interface AcceptanceCriteria {
    text: string;
    correspondingContexts: Array<Context>;
}
