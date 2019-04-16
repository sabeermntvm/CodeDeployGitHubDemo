import { Component, OnInit } from '@angular/core';
import { Input } from "@angular/core";
import { Subscription } from "rxjs";
import { LoginService } from "../../core/services/login.service";
import { TransactionService } from "../../core/services/transaction.service";
import { PropertyService } from "../../core/services/api-property.service";
import { CommunicationService } from "../../core/services/communication.service";
import { Router } from "@angular/router";
import { EnumCountry } from "../../core/enumerations/country";
import { environment } from "../../../environments/environment";
import { Property } from "../../core/models/Property";
import { SharedDataService } from "../../core/services/shareddata.service";

@Component({
  selector: 'app-leasepindetail',
  templateUrl: './leasepindetail.component.html',
  styleUrls: ['./leasepindetail.component.css']
})
export class LeasepindetailComponent implements OnInit {

  @Input() leasetransaction :any;
  mediaUrl :string;  
  photoUrl: String;
  CountryId: number;
  USCountryCode: number;
  leasetransactionDetail: any;
  leaseInfo: any;
  leaseContacts:any;
  propertyDetails: any;
  singleleaseTransactionSubscription:Subscription;

  constructor(private _loginService: LoginService
    , public transactionService: TransactionService
    , public propertyService: PropertyService
    , private _commService: CommunicationService
    , private _router: Router
    , private _sharedDataService: SharedDataService) {     
    this.photoUrl = '';
    this.CountryId = this._loginService._countryCode;
    this.USCountryCode = EnumCountry.US;
    this.leaseInfo = null;
    this.leaseContacts = null;
    this.propertyDetails = new Property();
    this.mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;

    this.singleleaseTransactionSubscription = this._commService.subscribe("OpenSingleLeaseTransactionModel").subscribe((data) => {
       this.leasetransaction = data.data;
       this.fetchLeaseTransction();
     });
  }

  ngOnInit() {   
    if(this._sharedDataService.IsSinglePin==true && this._sharedDataService.selectedLeaseSingleDetails){
      this.leasetransaction = new Object();
        this.leasetransaction=this._sharedDataService.selectedLeaseSingleDetails;
    }
      this.fetchLeaseTransction();
  }

  fetchLeaseTransction(){
    if (this.leasetransaction.LeaseID) {
      this.transactionService.GetLeaseCompGetDetailsById(this.leasetransaction.LeaseID).subscribe((data => {
        this.leasetransactionDetail = JSON.parse(data['_body']).responseData;
        if (this.leasetransactionDetail.leaseInfo && this.leasetransactionDetail.leaseInfo.length)
          this.leaseInfo = this.leasetransactionDetail.LeaseInfo[0];
        if (this.leasetransactionDetail.LeaseContacts && this.leasetransactionDetail.LeaseContacts.length)
          this.leaseContacts = this.leasetransactionDetail.LeaseContacts;

        this.propertyService.GetPropertyDetailsById(this.leasetransaction.PropertyID).subscribe( prop => {
          this.propertyDetails = JSON.parse(prop['_body']).responseData[0];
          this.photoUrl =(!! this.propertyDetails) ? ( this.mediaUrl + this.propertyDetails.MainPhotoUrl ) : "";
        })
      }))
    }
  }

  ngOnDestroy(){
    this.singleleaseTransactionSubscription.unsubscribe();
  }
  openPropertySummary(PropertyId,transactionId){
    localStorage.setItem('SelectedPropertyLease', JSON.stringify(this.leasetransaction));
    this._router.navigate(['/property/propertySummary', PropertyId,0,0,transactionId,0]); 
  }
}
