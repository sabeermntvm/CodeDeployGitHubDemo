import { Component, OnInit, Input } from '@angular/core';
import { PropertyMedia } from '../../core/models/MediaType';
import { PropertyService } from '../../core/services/api-property.service';
import { MediaRelationTypeEnum } from '../../core/enumerations/mediaTypes';
import { PagerService } from '../../core/services/pager.service';
import { environment } from '../../../environments/environment';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import { EnumMediaType } from '../../core/enumerations/propertyMediaType';
import { Subscription } from 'rxjs';
import { NgxGalleryComponent,NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation,NgxGalleryImageSize } from 'ngx-gallery';
import { TransactionService } from "../../core/services/transaction.service";
import { SharedDataService } from '../../core/services/shareddata.service';
import { LeaseSearchCriteria } from '../../core/models/LeaseSearchCriteria';
import { ActivatedRoute } from "@angular/router";
import { LoginService } from '../../core/services/login.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-propertytransaction',
  templateUrl: './propertytransaction.component.html',
  styleUrls: ['./propertytransaction.component.css']
})
export class PropertytransactionComponent implements OnInit {
  
  @Input() propertyId;
  pager: any = {};
  leasepager:any={};
  salepager:any={};
  pagedSaleTransactions: any = [];
  pagedLeaseTransactions: any = [];
  transcationList:Array<any> = [];
  ContactData: Array<any> = [];
  leaseArrayToScroll:Array<any> = [];
  leaseArray:Array<any> = [];
  saleArrayToScroll:Array<any>= [];
  saleArray:Array<any>= [];
  saleCompTransactionList: Array<any> = []; 
  saleCompTransactionListCopy: Array<any> = [];
  leaseCompTransactionList: Array<any> = []; 
  leaseCompTransactionListCopy:Array<any> = [];
  saleTransactionId:number;
  //selectedTransaction: any = new Object;
  showTransaction: boolean = false;
  loanInfo: any=new Object;
  BuyerContacts: Array<any> = [];
  SellerContacts: Array<any> = [];
  AllContacts:Array<any> = [];
  LeaseContacts:Array<any> = [];
  LeaseExtensions:Array<any> = [];
  LeaseReviewsAndRents:Array<any> = [];  
  saleCompStageDetails:any = new Object;
  nonmediaList: Array<PropertyMedia> = [];
  mediaList: Array<PropertyMedia> = [];
  preImageUrl: string;
  nonImageUrl: string;
  imagePath:string="";
  imageIndex:any = 0;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  showModal:boolean=false;
  viewTransData: number = 1;
  searchCriteria: LeaseSearchCriteria;
  LeaseId : number = 0;
  SaleId :number = 0;
  leaseLoader:boolean=true;
  saleLoader:boolean=true;
  noOfInitiallyLoadItemLease: number = 100;
  noOfInitiallyLoadItemSale: number = 100;
  // noOfScrollitemsToLoad: number = 5;
  isFullListDisplayed: boolean = false;
  customOptions = {
    dots: false, navigation: false, nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
  }
  LeaseIDOrder: string = 'Ascending';
  TransactionOrginationOrder: string = 'Ascending';
  ExecutionDateOrder: string = 'Descending';
  TenantNameOrder: string = 'Ascending';
  ExpirationDateOrder: string = 'Ascending';
  FloorNumberOrder: string = 'Ascending';
  SuiteNumberOrder: string = 'Ascending';
  AskingRateHighOrder: string = 'Ascending';
  LeaseTermsOrder: string = 'Ascending';
  TenantRepOrder: string = 'Ascending';
  LandLordRepOrder: string = 'Ascending';
  sortValue : string = "";
  sortFun : string = "";
  pageSize:any=100;
  pageSizeSale:any=100;
  sortValueSale : string = "";
  sortFunSale : string = "";
  expandData : number = null;
  expandDataSale : number = null;
  filterValue: number = 1;
  galleryHeight: string;
  constructor( private _propertyService: PropertyService, private _pagerService: PagerService, private _CommService: CommunicationService,private _transactionservice:TransactionService,private _sharedDataService: SharedDataService,private route: ActivatedRoute, private _loginService: LoginService) {    
    this.preImageUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
    this.imagePath = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` +'/Media/';
    this.nonImageUrl =  `${environment.MediaS3Base}`+ `${environment.MediaS3Path}` + '/Media/';
    this.route.params.subscribe(params => {
      this.LeaseId = (params['LeaseID']) ? params['LeaseID'] : 0;
      if(this.LeaseId>0){
        this.viewTransData = 1;
       // this.showDetailsOnLeaseDataLoaded();
      }
    });
    this.route.params.subscribe(params => {
      this.SaleId = (params['SaleID']) ? params['SaleID'] : 0;
      if(this.SaleId > 0){
        this.viewTransData = 2;
       // this.showDetailsOnSaleDataLoaded();
      }
    });
  }

  ngOnInit() {
    this.galleryImages = [];
    this.setGalleryOptions(true,0);
    this.getPropertyLeaseTransactions();
    this.getPropertySaleTransactions();
    $('.pane-hScroll').scroll(function () {
      $('.pane-vScroll').width($('.pane-hScroll').width() + $('.pane-hScroll').scrollLeft());
    });

    $('.pane-hScrollSale').scroll(function () {
      $('.pane-vScrollSale').width($('.pane-hScrollSale').width() + $('.pane-hScrollSale').scrollLeft());
    });


   // this.viewTransData = 1;
    // if(this.LeaseId){
    //   this.viewTransData = 2;
    // }
    // else if(this.SaleId){
    //   this.viewTransData = 1;
    // }
  }
  setGalleryOptions(thumbnail:boolean,index:number)
  {
    var width = $(document).width();
        if(width < 800){
        this.galleryHeight = "calc(54vh - 55px)";
        }
        else{
          this.galleryHeight = "calc(80vh - 55px)";
        }
    this.galleryOptions = [
      {
           startIndex:index,
           thumbnails:true,
           imageSwipe:true,
           width: '100%',
           height: this.galleryHeight,
           thumbnailsColumns: 4,
           imageAnimation: NgxGalleryAnimation.Slide,
           imagePercent: 80,
           thumbnailsPercent: 20,
           thumbnailsMargin: 10,
           thumbnailMargin: 10,
           thumbnailsSwipe:true,
           previewSwipe:true,
           previewFullscreen:true,
           previewZoom:true,
           previewRotate:true,
           previewDownload:true,
           previewZoomStep:0.5,
           previewZoomMax:10,
       },
        { 
           startIndex:index, 
           thumbnails:true,
           imageSwipe:true,
           breakpoint: 800,
           width: '100%',
           height: this.galleryHeight,
           imagePercent: 80,
           thumbnailsPercent: 20,
           thumbnailsMargin: 10,
           thumbnailMargin: 10,
           thumbnailsSwipe:true,
           previewSwipe:true,
           previewFullscreen:true,
           previewZoom:true,
           previewRotate:true,
           previewDownload:true,
           previewZoomStep:0.5,
           previewZoomMax:10,
       },
      {    
           startIndex:index,
           thumbnails:true,
           imageSwipe:true,
           breakpoint: 400,
           preview: true,
           imagePercent: 80,
           thumbnailsPercent: 20,
           thumbnailsMargin: 10,
           thumbnailMargin: 10,
           thumbnailsSwipe:true,
           previewSwipe:true,
           previewFullscreen:true,
           previewZoom:true,
           previewRotate:true,
           previewDownload:true,
           previewZoomStep:0.5,
           previewZoomMax:10,
       }
   ];
  }
  viewTransactions(viewVal: number) {
    this.viewTransData = viewVal;
  }
  viewSelectedTransaction(saleId, index) { 
    if(!this.saleCompTransactionList[index].IsSaleDetailsExpanded){
      this.saleCompTransactionList[index].IsSaleDetailsExpanded = true;
      let buyerContacts :any = [];
      let sellerContacts :any =[];
      this.saleCompTransactionList[index].AllContacts =[];

      const data = this._propertyService.getSaleTransactionBySaleId(saleId);
      data.subscribe(result => {  
        
        if (!JSON.parse(result['_body']).error) {
          
          let saleTransaction = JSON.parse(result['_body']).responseData;
          if (saleTransaction) {    
            if (saleTransaction.SaleInfo && saleTransaction.SaleInfo.length>0)
              this.saleCompTransactionList[index].TransactionDetails = saleTransaction.SaleInfo[0];    
            else
              this.saleCompTransactionList[index].TransactionDetails =[];
              
            if (saleTransaction.SaleLoanInfo && saleTransaction.SaleLoanInfo.length>0)
              this.saleCompTransactionList[index].LoanInfo =saleTransaction.SaleLoanInfo[0];
            else
              this.saleCompTransactionList[index].LoanInfo =[];
              
            if (saleTransaction.BuyerContacts && saleTransaction.BuyerContacts.length>0)              
              buyerContacts = saleTransaction.BuyerContacts;
            if (saleTransaction.SellerContacts && saleTransaction.SellerContacts.length>0)            
              sellerContacts = saleTransaction.SellerContacts;
            if (saleTransaction.SaleCompStageDetails && saleTransaction.SaleCompStageDetails.length>0)
              this.saleCompTransactionList[index].SaleCompStageDetails = saleTransaction.SaleCompStageDetails[0];
            else
              this.saleCompTransactionList[index].SaleCompStageDetails =[];                        
          
            this.saleCompTransactionList[index].AllContacts = this.saleCompTransactionList[index].AllContacts.concat(buyerContacts,sellerContacts);
            //get media records 
            this.saleCompTransactionList[index].NonMediaList =[];
            this.saleCompTransactionList[index].MediaList=[];
            this._propertyService.getSaleListingMedia(MediaRelationTypeEnum.Sale,saleId).subscribe((result) => {
              const mediaData = JSON.parse(result['_body']).responseData[0];
              
              mediaData.forEach(value => {
                if (value.Ext === 'pdf' || value.Ext === 'xlsx') {
                  this.saleCompTransactionList[index].NonMediaList.push(value);
                } else {
                  value.MediaTypeID!=EnumMediaType.TenantRoster?this.saleCompTransactionList[index].MediaList.push(value):null;
                }
              })
            });
          }
        }          
      });
    }  
  }

  viewSelectedLeaseTransaction(LeaseID, index) {
    if(!this.leaseCompTransactionList[index].IsLeaseDetailsExpanded){
      this.leaseCompTransactionList[index].IsLeaseDetailsExpanded = true;
    // let leaseContacts :any = [];
     // this.leaseCompTransactionList[index].AllContacts =[];

      const data = this._transactionservice.GetLeaseCompGetDetailsById(LeaseID);
      data.subscribe(result => {  
        if (!JSON.parse(result['_body']).error) {  
          let leaseTransaction = JSON.parse(result['_body']).responseData;
          if (leaseTransaction) {    
            if (leaseTransaction.LeaseInfo && leaseTransaction.LeaseInfo.length>0)              
              this.leaseCompTransactionList[index].TransactionDetails = leaseTransaction.LeaseInfo[0];          
            else
              this.leaseCompTransactionList[index].TransactionDetails =[];
              
            if (leaseTransaction.LeaseContacts && leaseTransaction.LeaseContacts.length>0) 
              this.leaseCompTransactionList[index].LeaseContacts = leaseTransaction.LeaseContacts;        
             //this.LeaseContacts = leaseTransaction.LeaseContacts;
             
            if(leaseTransaction.LeaseExtensions && leaseTransaction.LeaseExtensions.length>0)
              leaseTransaction.LeaseExtensions.forEach(x => x.LesseeName = leaseTransaction.LeaseInfo[0].TenantName);           
            this.leaseCompTransactionList[index].LeaseExtensions = leaseTransaction.LeaseExtensions || [];
            
            this.leaseCompTransactionList[index].LeaseReviewsAndRents = leaseTransaction.LeaseReviewsAndRents || [];
            
            //get media records 
            this.leaseCompTransactionList[index].NonMediaList =[];
            this.leaseCompTransactionList[index].MediaList=[];
            this._propertyService.getSaleListingMedia(MediaRelationTypeEnum.Lease,LeaseID).subscribe((result) => {  
              const mediaData = JSON.parse(result['_body']).responseData[0];
              mediaData.forEach(value => {
                if (value.Ext === 'pdf' || value.Ext === 'xlsx') {
                  this.leaseCompTransactionList[index].NonMediaList.push(value);
                } else {
                  value.MediaTypeID!=EnumMediaType.TenantRoster?this.leaseCompTransactionList[index].MediaList.push(value):null;
                }
              })
            });
          }
        }          
      });
    }  
  }
  searchLease() {
      let leaseCompItem ={ SortBy : this.searchCriteria.SortParam,SortDirection:this.searchCriteria.SortDirection};
      let relationData = { RelationID: this.propertyId };
      const data = this._propertyService.getLeaseTransactionsByPropertyId(relationData,leaseCompItem);
      data.subscribe(result => {
        if (!JSON.parse(result['_body']).error)
          this.leaseCompTransactionList = JSON.parse(result['_body']).responseData;
      });
  }

    getPropertySaleTransactions() {
      this.saleLoader = true;
      const data = this._propertyService.getSaleTransactionsByPropertyId(this.propertyId);
      data.subscribe(result => {
        if (!JSON.parse(result['_body']).error)
          this.saleCompTransactionList = JSON.parse(result['_body']).responseData;
          this.saleCompTransactionListCopy = JSON.parse(result['_body']).responseData;
          if(this.saleCompTransactionList && this.saleCompTransactionList.length>0){
        //  this.setPage(1);
          this.saleLoader = false;
          this.saleArrayToScroll = this.saleCompTransactionList.slice(0, this.noOfInitiallyLoadItemSale);
          this.saleArray = this.saleArrayToScroll;
          this.applySearchFilter(1);
          if(this.SaleId > 0){
            this.getSaleIndexData();
          }
          }
          else{
            this.saleLoader = false;
          }
      });
  }
  getSaleIndexData() {
    this.expandDataSale = this.saleCompTransactionList.findIndex(x => x.SaleID == this.SaleId);
    if(this.saleArrayToScroll.length < this.expandDataSale){
      this.saleArrayToScroll = this.saleCompTransactionList.slice(0, this.expandDataSale + 1);
    }
    if (this.expandDataSale >= 0) {
      this.showDetailsOnSaleDataLoaded();
    }
    this.applySearchFilter(1);
  }
  getPropertyLeaseTransactions() {
    this.leaseLoader = true;
      let relationData = { RelationID: this.propertyId };
      const data = this._propertyService.getLeaseTransactionsByPropertyId(relationData,this._loginService.UserInfo.EntityID);
      data.subscribe(result => {
        if (!JSON.parse(result['_body']).error)
          this.leaseCompTransactionList = JSON.parse(result['_body']).responseData;
          this.leaseCompTransactionListCopy= JSON.parse(result['_body']).responseData;
          if(this.leaseCompTransactionList && this.leaseCompTransactionList.length>0){
          this.sort();
          this.leaseLoader = false;     
          this.leaseArrayToScroll = this.leaseCompTransactionList.slice(0, this.noOfInitiallyLoadItemLease);
          this.leaseArray = this.leaseArrayToScroll;
          if(this.LeaseId > 0) {
          this.getLeaseIndexData();  
          }
          }
          else{
            this.leaseLoader = false;   
          }
      });
  }

  getLeaseIndexData() {
    this.expandData = this.leaseCompTransactionList.findIndex(x => x.LeaseID == this.LeaseId);
    if(this.leaseArrayToScroll.length < this.expandData){
      this.leaseArrayToScroll = this.leaseCompTransactionList.slice(0, this.expandData + 1);
    }
    if (this.expandData >= 0) {
      this.showDetailsOnLeaseDataLoaded();
    }
  }
  
  sortSale(field:string, sortOrder:string, sortType:number=0){
    this.sortValueSale = field;
    this.sortFunSale = sortOrder;
    if(sortType){
      this.saleCompTransactionList = this.saleCompTransactionList.sort(this.dynamicIntegerSort(field, sortOrder));
    }else {
      this.saleCompTransactionList = this.saleCompTransactionList.sort(this.dynamicSort(field, sortOrder));
    }
   this.filterSale(null);
  }

  setSalePage(page: number) {
    this.filterSale(page);
    if (page < 1 || page > this.salepager.totalPages || page >this.salepager.totalPages) {
      return;
    }
    // this.pager = this._pagerService.getPager(this.saleCompTransactionList.length, page, 50);
    // this.pagedSaleTransactions = this.saleCompTransactionList.slice(this.pager.startIndex, this.pager.endIndex + 1); 
    // window.scrollTo(0,0);
  }
  // filterSale(page : number){
  //   if(this.saleCompTransactionList.length < parseInt(this.pageSizeSale)){
  //     this.salepager.currentPage = 1;
  //     page = 1;
  //   }
  //   page =  page||this.salepager.currentPage;
  //   this.salepager = this._pagerService.getPager(this.saleCompTransactionList.length, page, parseInt(this.pageSizeSale));
  //   this.pagedSaleTransactions = this.saleCompTransactionList.slice(this.salepager.startIndex, this.salepager.endIndex + 1);
  //   window.scrollTo(0,0);
  //  }

  sortLease(field:string, sortOrder:string, sortType:number=0){
    this.sortValue = field;
    this.sortFun = sortOrder;
    if(sortType){
      this.leaseCompTransactionList = this.leaseCompTransactionList.sort(this.dynamicIntegerSort(field, sortOrder));
    }else {
    this.leaseCompTransactionList = this.leaseCompTransactionList.sort(this.dynamicSort(field, sortOrder));
    }
    this.filterLease(null);
  }

  sort()
  {
    this.leaseCompTransactionList = this.leaseCompTransactionList.sort(this.dynamicSort('TenantName', 'Ascending'));
    this.leaseCompTransactionList = this.leaseCompTransactionList.sort(this.dynamicIntegerSort('SuiteNumber', 'Ascending'));
    this.leaseCompTransactionList = this.leaseCompTransactionList.sort(this.dynamicSort('FloorNumber', 'Descending'));
    this.leaseCompTransactionList = this.leaseCompTransactionList.sort(this.dynamicIntegerSort('FloorNumber', 'Descending'));
    // this.setLeasePage(1);
  }

  filterLease(page : number){
    this.noOfInitiallyLoadItemLease=this.pageSize;
    this.leaseArrayToScroll = this.leaseCompTransactionList.slice(0, this.noOfInitiallyLoadItemLease);
    $('.pane-hScroll').scrollLeft(0);
    $('.pane-vScroll').scrollTop(0);
    // if(this.leaseCompTransactionList.length < parseInt(this.pageSize)){
    //   this.leasepager.currentPage = 1;
    //   page = 1;
    // }
    // page =  page||this.leasepager.currentPage;
    // this.leasepager = this._pagerService.getPager(this.leaseCompTransactionList.length, page, parseInt(this.pageSize));
    // this.pagedLeaseTransactions = this.leaseCompTransactionList.slice(this.leasepager.startIndex, this.leasepager.endIndex + 1);
    // window.scrollTo(0,0);
   }

   filterSale(page : number){
    this.noOfInitiallyLoadItemSale=this.pageSizeSale;
    this.saleArrayToScroll = this.saleCompTransactionList.slice(0, this.noOfInitiallyLoadItemSale);
    $('.pane-hScrollSale').scrollLeft(0);
    $('.pane-vScrollSale').scrollTop(0);
   }

   setLeasePage(page: number) {
    this.filterLease(page); 
    if (page < 1 || page >this.leasepager.totalPages) {
      return;
    }
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

  imageclick(mediaList:any,index:any,path:any)
  {
    this.showModal=true;
    this.galleryImages =[];
    this.setGalleryOptions(true,index);
    mediaList.forEach(element => {
      this.galleryImages.push({big:this.preImageUrl + element.Path,small:this.preImageUrl+element.Path,medium:this.preImageUrl + element.Path});
    });    
  }

  onScroll() {
    if(this.noOfInitiallyLoadItemLease <= this.leaseCompTransactionList.length) {
      this.noOfInitiallyLoadItemLease = Number(this.pageSize)+Number(this.noOfInitiallyLoadItemLease);
      this.leaseArrayToScroll = this.leaseCompTransactionList.slice(0, this.noOfInitiallyLoadItemLease);
    } else {
     // this.isFullListDisplayed = true;
    }
  }


  onScrollSale() {
    if(this.noOfInitiallyLoadItemSale <= this.saleCompTransactionList.length) {
      this.noOfInitiallyLoadItemSale = Number(this.pageSizeSale)+Number(this.noOfInitiallyLoadItemSale);
      this.saleArrayToScroll = this.saleCompTransactionList.slice(0, this.noOfInitiallyLoadItemSale);
    } else {
     // this.isFullListDisplayed = true;
    }

}

showDetailsOnLeaseDataLoaded(){
  this.applySearchFilter(1);
  let isDataLoaded =false;
  var instance = this;
  let timer = setTimeout(function run() {
  if (!!instance.leaseArrayToScroll && instance.leaseArrayToScroll.length > 0) {
      //instance.expandData = instance.leaseArrayToScroll.findIndex(x=>x.LeaseID == instance.LeaseId);
      isDataLoaded = true;
      var container = $('.pane-vScroll'),
      scrollTo = $('#valueRow'+instance.expandData);
      container.animate({
      scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
       });
      instance.viewSelectedLeaseTransaction(instance.leaseArrayToScroll[instance.expandData].LeaseID,instance.expandData);
      clearTimeout(timer);
  } 
  if(!isDataLoaded) 
      timer = setTimeout(run, 100); 
  else
      clearTimeout(timer); 
  },0); 
}

showDetailsOnSaleDataLoaded(){
  let isDataLoaded =false;
  var instance = this;
  let timer = setTimeout(function run() {
  if (!!instance.saleArrayToScroll && instance.saleArrayToScroll.length > 0) {
    //  instance.expandDataSale = instance.saleArrayToScroll.findIndex(x=>x.SaleID == instance.SaleId);
      isDataLoaded = true;
      var container = $('.pane-vScrollSale'),
      scrollTo = $('#valueSaleRow'+instance.expandDataSale);
      container.animate({
      scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
       });
      instance.viewSelectedTransaction(instance.saleArrayToScroll[instance.expandDataSale].SaleID,instance.expandDataSale);
      clearTimeout(timer);
  } 
  if(!isDataLoaded) 
      timer = setTimeout(run, 100); 
  else
      clearTimeout(timer); 
  },0); 
}

  applySearchFilter(value: any) {
    if(this.viewTransData==1){
    let leaseComp = JSON.parse(JSON.stringify(this.leaseArray));
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
   // this.leaseArrayToScroll = leaseComp;
  }
  else if(this.viewTransData ==2)
  {
    let saleComp = JSON.parse(JSON.stringify(this.saleArray));
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
    //  this.saleArrayToScroll = saleComp;
  }
  }
  goToLink(urlPath: string) {
    let url: string = '';
    if (!/^http[s]?:\/\//.test(urlPath)) {
        url += 'http://';
    }
    url += urlPath;
    window.open(url, '_blank');
}

downloadFile(PdfUrl) {
  window.open(PdfUrl);
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



