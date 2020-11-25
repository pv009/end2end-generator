import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class LogService {
    log(msg: any, object?: any) {
        if (object) {
            console.log(moment().locale('de').format('LLL') + ': '
                + JSON.stringify(msg)
                + object);
        } else {
            console.log(moment().locale('de').format('LLL') + ': '
                + JSON.stringify(msg));
        }

    }
}
