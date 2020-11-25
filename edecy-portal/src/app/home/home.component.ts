import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = 'edecy-portal';
  opened = false;

  onToggleSideNav($event: boolean) {
    this.opened = $event;
  }

  onActivate(event) {
    const element = document.querySelector('mat-sidenav-content') || window;
    element.scrollTo(0, 0);
}


}
