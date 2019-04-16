import { Component, OnInit , Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
export interface DialogData {
  labelvalue: string;
  value: string;
  comment: string;
  showSuggestedValue: boolean;
}
@Component({
  selector: 'app-popupmodel',
  templateUrl: './popupmodel.component.html',
  styleUrls: ['./popupmodel.component.css']
})
export class PopupmodelComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PopupmodelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
