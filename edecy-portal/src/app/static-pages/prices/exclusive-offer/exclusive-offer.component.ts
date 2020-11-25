import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exclusive-offer',
  templateUrl: './exclusive-offer.component.html',
  styleUrls: ['./exclusive-offer.component.scss']
})
export class ExclusiveOfferComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ExclusiveOfferComponent>,
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
