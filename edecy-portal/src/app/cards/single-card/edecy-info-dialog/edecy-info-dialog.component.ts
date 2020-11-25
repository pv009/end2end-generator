import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edecy-info-dialog',
  templateUrl: './edecy-info-dialog.component.html',
  styleUrls: ['./edecy-info-dialog.component.scss']
})
export class EdecyInfoDialogComponent {

  constructor(public dialogRef: MatDialogRef<EdecyInfoDialogComponent>) { }

  closeDialog() {
    this.dialogRef.close();
  }
}
