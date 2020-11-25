import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-success',
  templateUrl: './create-success.component.html',
  styleUrls: ['./create-success.component.scss']
})
export class CreateSuccessComponent implements OnInit {
  @Input() successStatus = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  refresh() {
    window.location.reload();
  }

  openMyCards() {
    this.router.navigate(['/cards/my-cards']);
  }

  openEdecyPrices() {
    this.router.navigate(['/prices']);
  }
}
