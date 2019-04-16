import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import {LoginService} from '../../core/services/login.service';
import {TransactionService} from '../../core/services/transaction.service';
import {PropertyService} from '../../core/services/api-property.service';
import {Property} from '../../core/models/Property';
import { CommunicationService } from '../../core/services/communication.service';
import { EnumCountry } from '../../core/enumerations/country';
import { Subscription } from 'rxjs';
import { SharedDataService } from "../../core/services/shareddata.service";

@Component({
  selector: 'app-transactionpindetail',
  templateUrl: './transactionpindetail.component.html',
  styleUrls: ['./transactionpindetail.component.css']
})
export class TransactionpindetailComponent implements OnInit {

  @Input() transaction :any;
  mediaUrl :string;  
  photoUrl: String;
  CountryId: number;
  USCountryCode: number;
  transactionDetail: any;
  saleInfo: any;
  saleCompProperties: any;
  sellerContacts: any;
  buyerContacts: any;
  propertyDetails: any;
  singleTransactionSubscription:Subscription;

  constructor(private _loginService: LoginService
    , public transactionService: TransactionService
    , public propertyService: PropertyService
    , private _commService: CommunicationService
    , private _router: Router
    , private _sharedDataService:SharedDataService) {
    this.photoUrl = '';
    this.CountryId = this._loginService._countryCode;
    this.USCountryCode = EnumCountry.US;
    this.saleInfo = null;
    this.saleCompProperties = null;
    this.sellerContacts = null;
    this.buyerContacts = null;
    this.propertyDetails = new Property();
    this.mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;

    this.singleTransactionSubscription = this._commService.subscribe("OpenSingleTransactionModel").subscribe((data) => {
      this.transaction = data.data;
      this.fetchTransction();
    });

  }

  ngOnInit() {   
    if(!!this._sharedDataService.selectedSaleSingleDetails && this._sharedDataService.IsSinglePin==true){
      this.transaction = new Object();
        this.transaction=this._sharedDataService.selectedSaleSingleDetails;
       this.fetchTransction();
    }
    this.fetchTransction();
  }

  fetchTransction(){
    if (this.transaction && this.transaction.SaleID) {
      this.transactionService.GetSaleCompGetDetailsById(this.transaction.SaleID).subscribe((data => {
        this.transactionDetail = JSON.parse(data['_body']).responseData;
        if (this.transactionDetail.SaleInfo && this.transactionDetail.SaleInfo.length)
          this.saleInfo = this.transactionDetail.SaleInfo[0];
        if (this.transactionDetail.SaleCompProperties && this.transactionDetail.SaleCompProperties.length)
          this.saleCompProperties = this.transactionDetail.SaleCompProperties[0];
        if (this.transactionDetail.SellerContacts && this.transactionDetail.SellerContacts.length)
          this.sellerContacts = this.transactionDetail.SellerContacts[0];
        if (this.transactionDetail.BuyerContacts && this.transactionDetail.BuyerContacts.length)
          this.buyerContacts = this.transactionDetail.BuyerContacts[0];

        this.propertyService.GetPropertyDetailsById(this.transaction.PropertyID).subscribe( prop => {
          this.propertyDetails = JSON.parse(prop['_body']).responseData[0];
          this.photoUrl =(!! this.propertyDetails) ? ( this.mediaUrl + this.propertyDetails.MainPhotoUrl ) : "";
        })
      }))
    }
  }

  ngOnDestroy(){
    this.singleTransactionSubscription.unsubscribe();
  }

  openPropertySummary(PropertyId,SaleId){
    localStorage.setItem('SelectedPropertyTransactions', null);
    this._router.navigate(['/property/propertySummary', PropertyId,0,0,0,SaleId]); 
  }

}
