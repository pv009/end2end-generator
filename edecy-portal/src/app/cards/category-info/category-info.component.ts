import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  category: string;
}

@Component({
  selector: 'app-category-info',
  templateUrl: './category-info.component.html',
  styleUrls: ['./category-info.component.scss']
})
export class CategoryInfoComponent implements OnInit {
  selectedCategory = '';

  constructor(
    private dialogRef: MatDialogRef<CategoryInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.selectedCategory = this.data.category;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
