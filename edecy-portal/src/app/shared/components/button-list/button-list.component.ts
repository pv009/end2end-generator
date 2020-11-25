import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-list',
  templateUrl: './button-list.component.html',
  styleUrls: ['./button-list.component.scss']
})
export class ButtonListComponent {
  @Input() icon: string;
  @Input() text: string;
  @Input() showArrow = true;
  @Input() opened = false;
  @Input() subButton = false;
}
