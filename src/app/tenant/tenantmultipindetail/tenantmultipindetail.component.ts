import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TenantSearchCriteria } from '../../core/models/TenantSearchCriteria';
import { TenantService } from '../../core/services/tenant.service';
import { PagerService } from '../../core/services/pager.service';
import { PropertyService } from '../../core/services/api-property.service';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SharedDataService } from '../../core/services/shareddata.service';

@Component({
  selector: 'app-tenantmultipindetail',
  templateUrl: './tenantmultipindetail.component.html',
  styleUrls: ['./tenantmultipindetail.component.css']
})
export class TenantmultipindetailComponent implements OnInit {
  @Input() tenant;
  @Input() PropertyId;
  @Input() PropertyName;

  mediaUrl: string = "";
  selectedTenantInfo: any;
  tenantTitle: string = "";
  tenantList: Array<any>;
  allTenantList: Array<any>;
  tenantCopy: Array<any>;
  IsLoader: boolean = false;
  multiTenantSubscription: Subscription;
  tenantSearchCriteria: any;
  sortValue: string = "";
  sortFun: string = "";
  filterInput: any = "";
  filterCount: boolean = false;

  constructor(private propertyService: PropertyService
    , private _router: Router
    , private _tenantService: TenantService
    , private pagerService: PagerService
    , private _CommService: CommunicationService
    , private _sharedDataService: SharedDataService) {
    this.tenantSearchCriteria = new TenantSearchCriteria();
    this.tenantList = new Array<any>();
    this.tenantCopy = new Array<any>();
    this.multiTenantSubscription = this._CommService.subscribe("FromMultiTenant").subscribe((result) => {
      this.PropertyId = result.data;
      this.getTenantsByPropertyId();
    });
  }

  ngOnInit() {
    this.mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
    this.getTenantsByPropertyId();
    if(this._sharedDataService.selectedTenantPin && this._sharedDataService.IsSinglePin==false){
      this.tenant = new Object();
      this.tenant=this._sharedDataService.selectedTenantMultiDetails;
      this.PropertyId = this._sharedDataService.selectedTenantPin;
      this.PropertyName = localStorage.getItem('tenantPropertyName');
      this.getTenantsByPropertyId();
  }
 
  }
  ngOnDestroy() {
    this.multiTenantSubscription.unsubscribe();
  }
  getTenantsByPropertyId() {
    this.tenantList = [];
    this.IsLoader = true;

    const tenantSearchCriteria = new TenantSearchCriteria();
    tenantSearchCriteria.StartingIndex = 1;
    tenantSearchCriteria.OffsetValue = 100;
    tenantSearchCriteria.CountryId = 14;
    tenantSearchCriteria.SortParam = 'CompanyName';
    tenantSearchCriteria.SortDirection = 'Ascending';
    tenantSearchCriteria.PropertyId = +this.PropertyId;
    const tenant = this.propertyService.getTenantsByPropertyId(this.PropertyId);
    tenant.subscribe(result => {
      if (!JSON.parse(result['_body']).error) {
        const responseData = JSON.parse(result['_body']).responseData;
        this.tenantList = responseData;
        this.tenantCopy = responseData;
        this.allTenantList = JSON.parse(JSON.stringify(this.tenantList));
        this.onSelectClick(1);
      }
      this.IsLoader = false;
    });

  }

  showPropertyTenant(tenant, PropertyId, TenantId, branchID) {
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
    // localStorage.setItem('tenantmultipinbackCheck', "1")
    // localStorage.removeItem("tenantsinglepinbackCheck");
    this._router.navigate(['/property/propertySummary', PropertyId, "", "", TenantIdValue]);
  }

  showMultiplePropertyTenant(tenant, PropertyId, TenantId) {
    this._sharedDataService.setTenantStageID = "";
    this._sharedDataService.setBranchID = "";
    this._router.navigate(['/property/propertySummary', PropertyId, "", "", TenantId]);
  }

  onSelectClick(value: any) {
    let tenants = JSON.parse(JSON.stringify(this.allTenantList));
    if (this._sharedDataService.tenantSearchCriteria && value == 1) {
      let minRevenue = this._sharedDataService.tenantSearchCriteria.MinAnnualRevenue || 0;
      let maxRevenue = this._sharedDataService.tenantSearchCriteria.MaxAnnualRevenue || Number.MAX_SAFE_INTEGER;
      let minCompanySize = this._sharedDataService.tenantSearchCriteria.MinCompanySize || 0;
      let maxCompanySize = this._sharedDataService.tenantSearchCriteria.MaxCompanySize || Number.MAX_SAFE_INTEGER;
      let siccodes = this._sharedDataService.tenantSearchCriteria.ISIC ? this._sharedDataService.tenantSearchCriteria.ISIC.split(',') : [];

      tenants = tenants.filter(x => (x.Revenue = x.Revenue || 0) >= minRevenue && (x.Revenue = x.Revenue || 0) <= maxRevenue && (x.PeopleCount = x.PeopleCount || 0) >= minCompanySize && (x.PeopleCount = x.PeopleCount || 0) <= maxCompanySize);
      if (siccodes.length > 0) tenants = tenants.filter(x => siccodes.includes(x.SICCode));
    }
    this.tenantList = tenants;
    this.tenantCopy = tenants;
    // this.sortValue = "";
    // this.sortFun = "";
    this.tenantList = this.tenantList.sort(this.dynamicSort('TenantName', 'Ascending'));
    this.tenantList = this.tenantList.sort(this.dynamicIntegerSort('Address2', 'Descending'));
    this.tenantList = this.tenantList.sort(this.dynamicIntegerSort('FloorNumber', 'Descending'));
    this.filterItem(this.filterInput);
    
  }

  sortTenant(field:string, sortOrder:string, sortType:number=0){
    this.sortValue = field;
    this.sortFun = sortOrder;
    this.IsLoader = false;
    if(sortType){
      this.tenantList = this.tenantList.sort(this.dynamicIntegerSort(field, sortOrder));
    }else {
    this.tenantList = this.tenantList.sort(this.dynamicSort(field, sortOrder));
    }
  }

  dynamicSort(property: string, sortDirection: string) {
    let sortOrder = 1;
    sortOrder = sortDirection === "Ascending" ? 1 : -1;
    return function (a, b) {
      let result = (TryParseInt(a[property], a[property]) < TryParseInt(b[property], b[property])) ? -1 : (TryParseInt(a[property], a[property]) > TryParseInt(b[property], b[property])) ? 1 : 0;
      return result * sortOrder;
    }
  }
  dynamicIntegerSort(property:string, sortDirection:string) {
    let sortOrder = 1;
    sortOrder = sortDirection==="Ascending"?1:-1;
    return function (a,b) {
        let result = ( getInt(a[property])  < getInt(b[property]))? -1 : (getInt(a[property]) > getInt(b[property])) ? 1 : 0;
        return result * sortOrder;
    }
  }

  filterItem(value:any){
    if(value.length >= 3){
      this.tenantList = Object.assign([], this.tenantCopy).filter(item => item.TenantName.toLowerCase().indexOf(value.toLowerCase()) > -1);
      this.filterCount = true;
    }
    else{
      this.filterCount = false;
      this.tenantList = this.tenantCopy;
    }
 }
 
 clearSearchFilter(){
   this.filterCount = false;
   this.filterInput = "";
   this.sortValue = "";
   this.sortFun = "";
   this.tenantList = this.tenantCopy;
 }
}

function TryParseInt(str: any, defaultValue: any): any {
  var retValue = defaultValue;
  if (str !== null) {
    if (str.length > 0) {
      if (!isNaN(str)) {
        retValue = parseInt(str);
      } else {
        retValue = str.toLowerCase();
      }
    }
  } else {
    retValue = "";
  }
  return retValue;
}

function getInt(value){
  if(value){
  let match= value.match(/\d+/);
  if(match && match.length>0 && match[0]){
    return TryParseInt(match[0], match[0]);
  }
}
  return 0;
}

