import { Component, OnInit, Input } from '@angular/core';
import { PropertyService } from '../../core/services/api-property.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommunicationService } from '../../core/services/communication.service';
import {Property} from '../../core/models/Property';
import { environment } from '../../../environments/environment';
import { SharedDataService } from "../../core/services/shareddata.service";
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-transactionmultipindetail',
  templateUrl: './transactionmultipindetail.component.html',
  styleUrls: ['./transactionmultipindetail.component.css']
})
export class TransactionmultipindetailComponent implements OnInit {
  @Input() transaction :any;
  @Input() PropertyId:number;
  @Input() CountryId:number;
  transactionList:Array<any>;
  allTransactionList:Array<any>;
  Isloader:boolean = false;
  multiTransactionSubscription:Subscription;
  propertyDetails: any;
  mediaUrl :string = "";  
  photoUrl: String = "";
  
 constructor(private propertyService: PropertyService,
      private _router: Router   , private _CommService: CommunicationService   ,private _sharedDataService:SharedDataService
  ) { 
    this.transactionList=Array<any>();
    this.multiTransactionSubscription = this._CommService.subscribe("OpenMultiTransactionModel").subscribe((data) => {
      this.PropertyId = data.data;
    this.getPropertyDetails();
    this.getTransactionsByPropertyId();
    });
    this.mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
    this.propertyDetails = new Property();
    }

  ngOnInit() {
    if(!!this.PropertyId){      
      this.getTransactionsByPropertyId();
    } 
    if(this._sharedDataService.selectedSalePin && this._sharedDataService.IsSinglePin==false){
      this.transaction = new Object();
      this.transaction = this._sharedDataService.selectedSaleMultiDetails;
      this.PropertyId = this._sharedDataService.selectedSalePin;
      this.getPropertyDetails();
      this.getTransactionsByPropertyId();
  }
  else{
    this.getPropertyDetails();
  }
  }
  ngOnDestroy(){
    this.multiTransactionSubscription.unsubscribe();
  }
  getPropertyDetails()
  {
    this.propertyService.GetPropertyDetailsById(this.PropertyId).subscribe( prop => {
      this.propertyDetails = JSON.parse(prop['_body']).responseData[0];
      this.photoUrl =(!! this.propertyDetails) ? ( this.mediaUrl + this.propertyDetails.MainPhotoUrl ) : "";
    });
  }
  getTransactionsByPropertyId() {
    this.Isloader = true;
    const data = this.propertyService.getSaleTransactionsByPropertyId(this.PropertyId);
    data.subscribe(result => {
      if (!JSON.parse(result['_body']).error)
        this.transactionList = JSON.parse(result['_body']).responseData; 
        this.allTransactionList = this.transactionList;
        this.Isloader =false; 
        this.applySearchFilter(1);
    });    
  }
  showPropertyTransaction(SaleId) {
    localStorage.setItem('SelectedPropertyTransactions', JSON.stringify(this.transactionList));
    //this._router.navigate(['/property/propertySummary', this.PropertyId,0,SaleId]);  
    this._router.navigate(['/property/propertySummary', this.PropertyId,0,0,0,SaleId]);    
    }
    openPropertySummary(PropertyId,SaleId){
      localStorage.setItem('SelectedPropertyTransactions', JSON.stringify(this.transactionList));
      this._router.navigate(['/property/propertySummary', PropertyId,0,0,0,SaleId]); 
     // this._router.navigate(['/property/propertySummary', PropertyId,0,transactionId]); 
    }

    applySearchFilter(value: any) {
      let saleComp = JSON.parse(JSON.stringify(this.allTransactionList));
      var datePipe = new DatePipe('en-US');
      if (this._sharedDataService.transactionSearchCriteria && value == 1) {
        let buyerContacts = this._sharedDataService.transactionSearchCriteria.buyer ? this._sharedDataService.transactionSearchCriteria.buyer.split(',') : [];
        let sellerContacts = this._sharedDataService.transactionSearchCriteria.seller ? this._sharedDataService.transactionSearchCriteria.seller.split(',') : [];
        let saleTypes = this._sharedDataService.transactionSearchCriteria.seller ? this._sharedDataService.transactionSearchCriteria.SaleType.split(',') : [];
        let saleConditions = this._sharedDataService.transactionSearchCriteria.seller ? this._sharedDataService.transactionSearchCriteria.SaleCondition.split(',') : [];
        let minSaleDate = datePipe.transform(this._sharedDataService.transactionSearchCriteria.SaleDateMin, 'MM/dd/yyyy') || null;
        let maxSaleDate = datePipe.transform(this._sharedDataService.transactionSearchCriteria.SaleDateMax, 'MM/dd/yyyy') || null;

        minSaleDate?
        saleComp = saleComp.filter(x => x.DeedOrSaleDate?new Date(x.DeedOrSaleDate)>=new Date(minSaleDate):null):null;
  
        maxSaleDate?
        saleComp = saleComp.filter(x => x.DeedOrSaleDate?new Date(x.DeedOrSaleDate)<=new Date(maxSaleDate):null):null;

        if (buyerContacts.length > 0) saleComp = saleComp.filter(x => buyerContacts.includes(x.Buyer));
        if (sellerContacts.length > 0) saleComp = saleComp.filter(x => sellerContacts.includes(x.Seller));
        if (saleTypes.length > 0) saleComp = saleComp.filter(x => saleTypes.includes(x.SaleTypeName));
        if (saleConditions.length > 0) saleComp = saleComp.filter(x => saleConditions.includes(x.SaleConditionTypeName));

        this._sharedDataService.transactionSearchCriteria.CapRateMin?
        saleComp = saleComp.filter(x => x.CapRatePercentage?x.CapRatePercentage>=this._sharedDataService.transactionSearchCriteria.CapRateMin:null):null;
        
        this._sharedDataService.transactionSearchCriteria.CapRateMax?
        saleComp = saleComp.filter(x => x.CapRatePercentage?x.CapRatePercentage<=this._sharedDataService.transactionSearchCriteria.CapRateMax:null):null;

        this._sharedDataService.transactionSearchCriteria.PercentageOccupiedMin?
        saleComp = saleComp.filter(x => x.PercentageOccuppied?x.PercentageOccuppied>=this._sharedDataService.transactionSearchCriteria.PercentageOccupiedMin:null):null;
        
        this._sharedDataService.transactionSearchCriteria.PercentageOccupiedMax?
        saleComp = saleComp.filter(x => x.PercentageOccuppied?x.PercentageOccuppied<=this._sharedDataService.transactionSearchCriteria.PercentageOccupiedMax:null):null;
      }
      this.transactionList = saleComp;
    }
}
