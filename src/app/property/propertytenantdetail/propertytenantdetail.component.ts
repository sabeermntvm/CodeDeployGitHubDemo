import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PropertyService } from '../../core/services/api-property.service';
import { LoginService } from '../../core/services/login.service';
import { PopupmodelComponent } from '../popupmodel/popupmodel.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Suggestion } from '../../core/models/suggestion';
import { PropertysummaryComponent } from '../propertysummary/propertysummary.component';
import { SuggestionsService } from '../../core/services/suggestions.service';

@Component({
  selector: 'app-propertytenantdetail',
  templateUrl: './propertytenantdetail.component.html',
  styleUrls: ['./propertytenantdetail.component.css']
})
export class PropertytenantdetailComponent implements OnInit {
  @Output() onClose = new EventEmitter();
  @Input() BranchID : number;
  @Input() BranchName:string;
  @Input() Tier:number;

  Reviewed:number = null;
  tenantFields:any;
  mergedTenant:Array<any> = [];
  providerTenants:Array<any> = [];
  orginalMergedData:Array<any> = [];
  mergedTenantID:string;
  loginEntityID: number;
  UserID; any;
  PropertyId: number;
  constructor(private _propertyService: PropertyService,
     private _loginService: LoginService,
      public dialog: MatDialog ,
      private property: PropertysummaryComponent,
      private suggestionservice: SuggestionsService) {
    this.PropertyId = this.property.propertyDetails.PropertyID;

      const loginData = this._loginService.UserInfo;
      if (loginData) {
        this.UserID = loginData.EntityID;
      }
  }

  ngOnInit() {
    this.Reviewed = null;
    this.tenantFields=[];
    this.mergedTenant= [];
    this.providerTenants= [];
    this.orginalMergedData= [];
    this.mergedTenantID="";

    let response_details:any = null
    if(this.Tier == 1){
      response_details = this._propertyService.getTenantMatrixGetDetailsByID(this.BranchID,this._loginService.UserInfo.EntityID);
    }else{
      response_details = this._propertyService.getTenantMatrixNonVerifiedGetDetailsByID(this.BranchID,this._loginService.UserInfo.EntityID);
    }
    response_details.subscribe(result => {
      let data = JSON.parse(result['_body']).responseData;
      if (data && data.length > 0) {
      if(data[0] && data[0].length > 0) {
        this.tenantFields = data[0];
      }
      if(data[1] &&  data[1].length > 0)
      {
      data[0].forEach(element => {
        if(data[1].some(x=>x.FieldName == element.FieldName)){
          let field = data[1].find(x=>x.FieldName == element.FieldName);
          this.mergedTenant.push({Source:field.FieldSource, IsSelected:false,DisplayGroup:element.DisplayGroup, IsVisible:element.IsVisible, FieldName:element.FieldName, Value:field.FieldValue, UpdatedDate:field.UpdatedDate});
        }else{
          this.mergedTenant.push({Source:"", IsSelected:false,DisplayGroup:element.DisplayGroup, IsVisible:element.IsVisible, FieldName:element.FieldName, Value:""});
        }
      });
      
      this.mergedTenantID = this.mergedTenant.find(x=>x.FieldName == "TenantID").Value;
      this.orginalMergedData = JSON.parse(JSON.stringify(this.mergedTenant)); 
      }
      if(data[2] && data[2].length>0){
      let providerData = data[2];
      let resultCounts = Array.from(new Set(providerData.map(x => x.ID)));
      if(resultCounts.length>0){
        resultCounts.forEach((element, i) => {
         let pdata = providerData.filter(x=>x.ID==element);
         let pdataList:Array<any>= []; 
         this.tenantFields.forEach(element => {
          if(pdata.some(x=>x.FieldName == element.FieldName)){
          pdataList.push({IsSelected:false, DisplayGroup:element.DisplayGroup, IsVisible:element.IsVisible, FieldName:element.FieldName, Value:pdata.find(x=>x.FieldName == element.FieldName).FieldValue});
          }else{
            pdataList.push({IsSelected:false, DisplayGroup:element.DisplayGroup, IsVisible:element.IsVisible, FieldName:element.FieldName, Value:""});
          }
        });
          this.providerTenants.push({ProviderID:pdata.find(x=>x.FieldName == "ProviderID").FieldValue,Title:pdata.find(x=>x.FieldName == "ProviderDisplayName").FieldValue,SourceTenantID:pdata.find(x=>x.FieldName == "TenantID").FieldValue,List:pdataList});
        });
        }
      }
    }
    });
  }
  close() {
    this.onClose.emit(this.Reviewed);
  }

  onTenantSuggestion(filedname){
    const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '20%';
  dialogConfig.data = { labelvalue: filedname  , value: '' , comment: '', showSuggestedValue: true };
  const dialogRef = this.dialog.open(PopupmodelComponent, dialogConfig);

   dialogRef.afterClosed().subscribe( (result)  => {
  if (!!result ) {
    const suggestion = new Suggestion();
    suggestion.FieldName =  result.labelvalue;
    suggestion.SuggestedValue = result.value;
    suggestion.SuggestionComment = result.comment;
    suggestion.Type = 'Tenant';
    suggestion.SuggestionStatus = 'Initiated';
    suggestion.SentByUserID = this.UserID;
    suggestion.details = {
      PropertyId: this.PropertyId,
      PropertyName: this.property.propertyDetails.PropertyName,
      BranchId: this.BranchID,
      BranchName: this.BranchName
    };

    this.suggestionservice.saveSuggestion(suggestion);

  }
});

  }

}
