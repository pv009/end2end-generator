import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private event = new BehaviorSubject<any>({});
  private currentEvent = this.event.asObservable();

  setScroll(event: any) {
    this.event.next(event);
  }

  getScroll() {
    return this.currentEvent;
  }
}
