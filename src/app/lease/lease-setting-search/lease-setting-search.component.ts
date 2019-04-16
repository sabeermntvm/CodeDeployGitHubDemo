import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';
import { UserPreferencesService } from '../../core/services/user-preferences.service';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
@Component({
  selector: 'app-lease-setting-search',
  templateUrl: './lease-setting-search.component.html',
  styleUrls: ['./lease-setting-search.component.css']
})
export class LeaseSettingSearchComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  @Input() sheets: Array<any>;
  @Input() type: string;
  @Input() screen: string;
  @Input() userId: number;
  @Input() userPreferencesId: number;
  @Input() Type: any;
  @Output() saveUserPreferences = new EventEmitter();
  buttonText:any;
  Isloader: boolean  = false;
  constructor(private _userPreferencesService: UserPreferencesService
    , private _CommService: CommunicationService) { }

  ngOnInit() {
    if(this.Type == 'Settings')
    this.buttonText = "Save";
    else
    this.buttonText = "Export";
    this.sheets.forEach(sheet => {
      sheet.fields.sort((value1, value2) => value1.order - value2.order)
    })
  }
  save(){
    this.Isloader = true;
    this.sheets.forEach(sheet => {
      sheet.fields.forEach((field : any, index: any) => {
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
      document.getElementById("myMapSidenav").style.width = "0";
      else
      {
        this.Isloader = false;
        let communicationModel = new CommunicationModel();
        communicationModel.Key = "CloseLeaseTransactionExportsettings";
        communicationModel.data = 'Download';
        this._CommService.broadcast(communicationModel);
      }
    });
  }
  cancel(){
    document.getElementById("MapSidenavSetting").style.width = "0";
    document.getElementById("MapSidenav").style.width = "0";
  }
}
