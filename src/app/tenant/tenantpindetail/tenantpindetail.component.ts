import { Component, OnInit, Input } from '@angular/core';
import { PropertyService } from '../../core/services/api-property.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../core/services/login.service';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { SharedDataService } from '../../core/services/shareddata.service';
@Component({
  selector: 'app-tenantpindetail',
  templateUrl: './tenantpindetail.component.html',
  styleUrls: ['./tenantpindetail.component.css']
})
export class TenantpindetailComponent implements OnInit {
  @Input() tenant: any;

  OccupiedHeader: string = "Occupied SqM";
  USCountryCode: number;
  mediaUrl: string;
  unitId: number = 0;
  metricUnit: number;
  constructor(private propertyService: PropertyService,
    private _router: Router
    , private _loginService: LoginService, private _sharedDataService: SharedDataService) {
    this.metricUnit = UnitConversionEnum.Metric;
  }

  ngOnInit() {
    if(this._sharedDataService.IsSinglePin==true && this._sharedDataService.selectedTenantSingleDetails){
      this.tenant = new Object();
        this.tenant=this._sharedDataService.selectedTenantSingleDetails;
    }
   
    this.mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
    this.unitId = this._loginService.UserInfo.UnitId
    if (this.unitId != this.metricUnit) {
      this.OccupiedHeader = "Occupied SF";
    }
  }
  showPropertyTenant(PropertyId, TenantId, branchID) {
    let TenantIdValue;
    if(branchID){
      TenantIdValue = branchID;
      this._sharedDataService.setBranchID = 'BranchID' ;
      this._sharedDataService.setTenantStageID = "";
    }
    else if(TenantId){
      TenantIdValue = TenantId;
      this._sharedDataService.setBranchID = "";
      this._sharedDataService.setTenantStageID = 'TenantID';
    }
    // localStorage.setItem("tenantsinglepinbackCheck","1");
    // localStorage.removeItem("tenantmultipinbackCheck");
     this._router.navigate(['/property/propertySummary', PropertyId, "","", TenantIdValue]);
  }
}
