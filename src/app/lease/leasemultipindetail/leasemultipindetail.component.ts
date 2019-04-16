import { Component, OnInit, Input } from '@angular/core';
import { PropertyService } from '../../core/services/api-property.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../../core/services/communication.service';
import {Property} from '../../core/models/Property';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../core/services/login.service';
import { SharedDataService } from "../../core/services/shareddata.service";
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-leasemultipindetail',
  templateUrl: './leasemultipindetail.component.html',
  styleUrls: ['./leasemultipindetail.component.css']
})
export class LeasemultipindetailComponent implements OnInit {
  

  @Input() leasetransaction :any;
  @Input() PropertyId:number;
  @Input() CountryId:number;
  leaseTransactionList:Array<any>;
  allLeaseTransactionList:Array<any>;
  Isloader:boolean = false;
  multiLeaseTransactionSubscription:Subscription;
  propertyDetails: any;
  mediaUrl :string = "";  
  photoUrl: String = "";
  sortValue : string = "";
  sortFun : string = "";
  myDate:any;
 constructor(private propertyService: PropertyService,
      private _router: Router   , private _CommService: CommunicationService, private _loginService: LoginService , private _sharedDataService: SharedDataService  
  ) { 
    this.leaseTransactionList=Array<any>();
    this.multiLeaseTransactionSubscription = this._CommService.subscribe("OpenMultiLeaseTransactionModel").subscribe((data) => {
      this.PropertyId = data.data;
      this.getPropertyDetails();
      this.getLeaseTransactionsByPropertyId();
    });
    this.mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
    this.propertyDetails = new Property();
    }

  ngOnInit() {
    if(!!this.PropertyId){      
      this.getLeaseTransactionsByPropertyId();
    }
    if(this._sharedDataService.selectedLeasePin && this._sharedDataService.IsSinglePin==false){
        this.leasetransaction = new Object();
        this.leasetransaction = this._sharedDataService.selectedLeaseMultiDetails;
        this.PropertyId = this._sharedDataService.selectedLeasePin;
        this.getPropertyDetails();
        this.getLeaseTransactionsByPropertyId();
    }
    else{
    this.getPropertyDetails();
    }
  }
  ngOnDestroy(){
    this.multiLeaseTransactionSubscription.unsubscribe();
  }
  getPropertyDetails()
  {
    this.propertyService.GetPropertyDetailsById(this.PropertyId).subscribe( prop => {
      this.propertyDetails = JSON.parse(prop['_body']).responseData[0];
      this.photoUrl =(!! this.propertyDetails) ? ( this.mediaUrl + this.propertyDetails.MainPhotoUrl ) : "";
    });
  }
  getLeaseTransactionsByPropertyId() {
    this.leaseTransactionList = [];
    this.Isloader = true;
    //let leaseCompItem ={ SortBy : "",SortDirection:"" };
    let relationData = { RelationID: this.PropertyId };
    const data = this.propertyService.getLeaseTransactionsByPropertyId(relationData,this._loginService.UserInfo.EntityID);
    data.subscribe(result => {
      if (!JSON.parse(result['_body']).error)
        this.leaseTransactionList = JSON.parse(result['_body']).responseData; 
        this.allLeaseTransactionList = JSON.parse(result['_body']).responseData; 
        this.Isloader =false; 
        this.applySearchFilter(1);
    });    
  }
  sortLease(field:string, sortOrder:string, sortType:number=0){
    this.sortValue = field;
    this.sortFun = sortOrder;
    if(sortType){
      this.leaseTransactionList = this.leaseTransactionList.sort(this.dynamicIntegerSort(field, sortOrder));
    }else {
    this.leaseTransactionList = this.leaseTransactionList.sort(this.dynamicSort(field, sortOrder));
    }
  }
  showPropertyTransaction(leaseId) {
    localStorage.setItem('SelectedPropertyLease', JSON.stringify(this.leaseTransactionList));
    this._router.navigate(['/property/propertySummary', this.PropertyId,0,0,leaseId,0]);      
  }

  openPropertySummary(PropertyId,leaseId){ 
    localStorage.setItem('SelectedPropertyLease', JSON.stringify(this.leaseTransactionList));
    this._router.navigate(['/property/propertySummary', PropertyId,0,0,leaseId,0]); 
  }
  dynamicSort(Lease:string, sortDirection:string) {
    let sortOrder = 1;
    sortOrder = sortDirection==="Ascending"?1:-1;
    return function (a,b) {
        let result = ( TryParseInt(a[Lease],a[Lease])  < TryParseInt(b[Lease],b[Lease]))? -1 : (TryParseInt(a[Lease],a[Lease]) > TryParseInt(b[Lease],b[Lease])) ? 1 : 0;
        return result * sortOrder;
    }
  }
  
  dynamicIntegerSort(Lease:string, sortDirection:string) {
    let sortOrder = 1;
    sortOrder = sortDirection==="Ascending"?1:-1;
    return function (a,b) {
        let result = ( getInt(a[Lease])  < getInt(b[Lease]))? -1 : (getInt(a[Lease]) > getInt(b[Lease])) ? 1 : 0;
        return result * sortOrder;
    }
  }
  applySearchFilter(value: any) {
    let leaseComp = JSON.parse(JSON.stringify(this.allLeaseTransactionList));
    var datePipe = new DatePipe('en-US');
    if (this._sharedDataService.leaseSearchCriteria && value == 1) {
      let minExpiry = datePipe.transform(this._sharedDataService.leaseSearchCriteria.ExpiryDateMin, 'MM/dd/yyyy') || null;
      let maxExpiry = datePipe.transform(this._sharedDataService.leaseSearchCriteria.ExpiryDateMax, 'MM/dd/yyyy') || null;
      let minExecution = datePipe.transform(this._sharedDataService.leaseSearchCriteria.ExecutionDateMin, 'MM/dd/yyyy') || null;
      let maxExecution = datePipe.transform(this._sharedDataService.leaseSearchCriteria.ExecutionDateMax, 'MM/dd/yyyy') || null;
      let minCreatedDate = datePipe.transform(this._sharedDataService.leaseSearchCriteria.DateCreatedMin, 'MM/dd/yyyy') || null;
      let maxCreatedDate = datePipe.transform(this._sharedDataService.leaseSearchCriteria.DateCreatedMax, 'MM/dd/yyyy') || null;

      let landLordReps = this._sharedDataService.leaseSearchCriteria.LandLordRep ? this._sharedDataService.leaseSearchCriteria.LandLordRep.split(',') : [];

      let tenantReps = this._sharedDataService.leaseSearchCriteria.TenantRep ? this._sharedDataService.leaseSearchCriteria.TenantRep.split(',') : [];

      let landLords = this._sharedDataService.leaseSearchCriteria.LandLord ? this._sharedDataService.leaseSearchCriteria.LandLord.split(',') : [];

      minExpiry?
      leaseComp = leaseComp.filter(x => x.ExpirationDateDT?new Date(x.ExpirationDateDT)>=new Date(minExpiry):null):null;

      maxExpiry?
      leaseComp = leaseComp.filter(x => x.ExpirationDateDT?new Date(x.ExpirationDateDT)<=new Date(maxExpiry):null):null;
      
      minExecution?
      leaseComp = leaseComp.filter(x => x.ExecutionDateDT?new Date(x.ExecutionDateDT)>=new Date(minExecution):null):null;
            
      maxExecution?
      leaseComp = leaseComp.filter(x => x.ExecutionDateDT?new Date(x.ExecutionDateDT)<=new Date(maxExecution):null):null;
      
      minCreatedDate?
      leaseComp = leaseComp.filter(x => x.CreatedDateDT?new Date(x.CreatedDateDT)>=new Date(minCreatedDate):null):null;
            
      maxCreatedDate?
      leaseComp = leaseComp.filter(x => x.CreatedDateDT?new Date(x.CreatedDateDT)<=new Date(maxCreatedDate):null):null;

      this._sharedDataService.leaseSearchCriteria.LeasedSqMMin?leaseComp = leaseComp.filter(x => x.AvailableSpaceSF?new Date(x.AvailableSpaceSF)>=new Date(this._sharedDataService.leaseSearchCriteria.LeasedSqMMin):null):null;

      this._sharedDataService.leaseSearchCriteria.LeasedSqMMax?leaseComp = leaseComp.filter(x => x.AvailableSpaceSF?new Date(x.AvailableSpaceSF)<=new Date(this._sharedDataService.leaseSearchCriteria.LeasedSqMMax):null):null;

      if (landLordReps.length > 0) leaseComp = leaseComp.filter(x => landLordReps.includes(x.LandLordRep));
      
      if (tenantReps.length > 0) leaseComp = leaseComp.filter(x => tenantReps.includes(x.TenantRep));
      
      if (landLords.length > 0) leaseComp = leaseComp.filter(x => landLords.includes(x.LandLord));
    }
    this.leaseTransactionList = leaseComp;
  }
  
}
function TryParseInt(str:any,defaultValue:any):any {
  var retValue = defaultValue;
  if(str !== null) {
      if(str.length > 0) {
          if (!isNaN(str)) {
              retValue = parseInt(str);
          }else{
            retValue = str.toLowerCase();
          }
      }
  }else{
    retValue = "";
  }
  return  retValue;
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