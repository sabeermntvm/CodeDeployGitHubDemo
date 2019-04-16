import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExcelService} from '../../../core/services/excel.service';
import {UserPreferencesService} from '../../../core/services/user-preferences.service';

@Component({
  selector: 'app-user-preferences-modal',
  templateUrl: './user-preferences-modal.component.html',
  styleUrls: ['./user-preferences-modal.component.scss']
})
export class UserPreferencesModalComponent implements OnInit {

  @Output() onClose = new EventEmitter();
  @Input() sheets: Array<any>;
  @Input() type: string;
  @Input() screen: string;
  @Input() userId: number;
  @Input() userPreferencesId: number;
  @Input() Type: any;
  @Output() saveUserPreferences = new EventEmitter();
  buttonText:any;
  constructor(private _excelService: ExcelService,
              private _userPreferencesService: UserPreferencesService) {

  }

  ngOnInit() {
    if(this.Type == 'Settings')
    this.buttonText = "Save";
    else
    this.buttonText = "Export";
    this.sheets.forEach(sheet => {
      sheet.fields.sort((value1, value2) => value1.order - value2.order)
    })
  }

  save() {
    this.sheets.forEach(sheet => {
      sheet.fields.forEach((field, index) => {
        field.order = index + 1;
      })
    });
    this._userPreferencesService.saveUserPreferences({
      UserPreferencesID: this.userPreferencesId,
      UserID: this.userId,
      Type: this.type,
      Screen: this.screen,
      Data: JSON.stringify(this.sheets),
      LoginEntityID: this.userId
    }).subscribe(result => {
      this.userPreferencesId = JSON.parse(result['_body']).responseData[0].UserPreferencesID;
      this.saveUserPreferences.emit(this.userPreferencesId);
      if(this.Type == 'Settings')
      this.onClose.emit();
      else
      this.onClose.emit('Download');
    });
  }

  cancel() {
    this.onClose.emit()
  }
}
