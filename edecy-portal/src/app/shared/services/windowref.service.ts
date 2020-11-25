import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowrefService {

  constructor() { }

  getWindow() {
    return window;
  }
}
