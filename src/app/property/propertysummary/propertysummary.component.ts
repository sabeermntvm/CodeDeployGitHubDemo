import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../core/services/api-property.service';
import { EnumCountry } from '../../core/enumerations/country';
import { MediaRelationTypeEnum } from '../../core/enumerations/mediaTypes';
import { LoginService } from '../../core/services/login.service';
import { environment } from '../../../environments/environment';
import { TenantSearchCriteria } from '../../core/models/TenantSearchCriteria';
import { PropertySearchCriteria } from '../../core/models/PropertySearchCriteria';

import { Location } from '@angular/common';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { SharedDataService } from '../../core/services/shareddata.service';
import { UserPreferance } from '../../config/data';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import { Subscription } from 'rxjs/Subscription';
import { NgxGalleryComponent, NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryImageSize } from 'ngx-gallery';
import { PagerService } from '../../core/services/pager.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-propertysummary',
  templateUrl: './propertysummary.component.html',
  styleUrls: ['./propertysummary.component.css']
})
export class PropertysummaryComponent implements OnInit {
  LeaseId: any;
  sheets: Array<any>;
  userId: number;
  userPreferencesId: number;
  Task: any;
  currentRow: number;
  IsDataLoaded: boolean = false;
  contactList: any = new Object;
  PropertyAgentsList: any = new Object;
  allListings: Array<any> = [];
  tenantList: Array<any> = [];
  tenantId: number;
  transactionId: number;  
  lat: number = -34.08417788518130;
  lng: number = 150.82839500159000;
  customOptions = {
    dots: false, navigation: false, nav: true,
    responsive: {
      0: {
        items: 2
      },
      600: {
        items: 3
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      },
      1200: {
        items: 3
      },
      1600: {
        items: 3
      },
      2000: {
        items: 4
      },
      2600: {
        items: 4
      },
      2800: {
        items: 4
      }
    },
  }
  propertyId: number;

  propertyDetails: any = '';
  mediaUrl: any = '';
  mainPhotoMediaUrl: any = '';
  propertyMediaList: Array<any>;
  propertyNonMediaList: Array<any>;
  unitId: number;
  propertyListings: Array<any>;
  currentListings: Array<any> = [];
  MainPhotoUrl: any = '';
  photoPopURL: any = '';
  metricUnit: number = 0;
  CloseActionBtnSet: boolean;
  activeIdString: string = "propertyTab";
  listingId: number;
  listingFilterselected = [];
  lotSizeValue: number;
  imagePathURL: string = "";
  ImageArray: any[] = [];
  imageIndex: any = 0;
  gettransationdetailsSubscription: Subscription;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  showModal:boolean = false;
  selectedListing : any;

  ProviderList: Array<any> = [];
  CompanyList: Array<any> = [];
  ProviderDetailDataList: Array<any> = [];
  loginEntityID: number;

  evCompanyList: Array<any> = [];
  evproviderTenants: Array<any> = [];
  evorginalProviderData: any;
  evpager: any = {};
  evCount: any;

  nevmCompanyList: Array<any> = [];
  nevmproviderTenants: Array<any> = [];
  nevmorginalProviderData: any;
  nevmpager: any = {};
  nevmCount: any;

  nevsCompanyList: Array<any> = [];
  nevsproviderTenants: Array<any> = [];
  nevsorginalProviderData: any;
  nevspager: any = {};
  nevsCount: any;
  IsEmpiricalUser : boolean = false;
  redirectToGrid : boolean = false;
  PropertyOccupancy:any;
  galleryHeight: string;
  constructor(private _propertyService: PropertyService
    , private _loginService: LoginService
    , private route: ActivatedRoute
    , private _location: Location
    , private _router: Router
    , private _sharedDataService: SharedDataService
    , private _CommService: CommunicationService
    , private pagerService: PagerService
    , private toastr: ToastrService) {

    this.sheets = UserPreferance;
    this.unitId = this._loginService.UserInfo.UnitId;
    this.loginEntityID = this._loginService.UserInfo.EntityID;
    this.metricUnit = UnitConversionEnum.Metric;
    this.propertyListings = new Array<any>();
    this.listingFilterselected = [{ "id": 1, "item": 'Active' },
    { "id": 2, "item": 'Active - Fully Leased' },
    { "id": 6, "item": 'Pending' }];
    this.route.params.subscribe(params => {
      this.propertyId = params["id"];
      this.tenantId = params['tenantId'] ? params['tenantId'] : null;
      this.listingId = params['listingId'] ? params['listingId'] : null;
      this.transactionId = params['transactionId'] ? params['transactionId'] : null;   
      this.LeaseId = params['LeaseID'] ? params['LeaseID'] : 0;
    });
    
    if (this.tenantId)
      this.activeIdString = "tenantTab";
    else if (this.transactionId) {
      let instance = this;
      setTimeout(function () {
        instance.activeIdString = "transactionTab";
      }, 1200);
    }
    else if (this.listingId)
      this.activeIdString = "listingTab";
  }

  EmpiricalUserCheck(){
    const UserCompanyId = this._loginService.UserInfo.CompanyID;
    if(UserCompanyId == 2){
      this.IsEmpiricalUser = true;
    }
  }
  ngOnInit() {
    this.redirectToGrid=false;
    this.EmpiricalUserCheck();
    this.setGalleryOptions(true, 0);
    this.galleryImages = [];
    this.initializeData();
  }
  setGalleryOptions(thumbnail: boolean, index: number) {
    var width = $(document).width();
        if(width < 800){
        this.galleryHeight = "calc(54vh - 55px)";
        }
        else{
          this.galleryHeight = "calc(80vh - 55px)";
        }
    this.galleryOptions = [
      {
        startIndex: index,
        thumbnails: thumbnail,
        imageSwipe: true,
        width: '100%',
        height: this.galleryHeight,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 10,
        thumbnailMargin: 10,
        thumbnailsSwipe: true,
        previewSwipe: true,
        previewFullscreen: true,
        previewZoom: true,
        previewRotate: true,
        previewDownload: true,
        previewZoomStep: 0.5,
        previewZoomMax: 10,
      },
      {
        startIndex: index,
        thumbnails: thumbnail,
        imageSwipe: true,
        breakpoint: 800,
        width: '100%',
        height: this.galleryHeight,
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 10,
        thumbnailMargin: 10,
        thumbnailsSwipe: true,
        previewSwipe: true,
        previewFullscreen: true,
        previewZoom: true,
        previewRotate: true,
        previewDownload: true,
        previewZoomStep: 0.5,
        previewZoomMax: 10,
      },
      {
        startIndex: index,
        thumbnails: thumbnail,
        imageSwipe: true,
        breakpoint: 400,
        preview: true,
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 10,
        thumbnailMargin: 10,
        thumbnailsSwipe: true,
        previewSwipe: true,
        previewFullscreen: true,
        previewZoom: true,
        previewRotate: true,
        previewDownload: true,
        previewZoomStep: 0.5,
        previewZoomMax: 10,
      }
    ];
  }
  clear() {
    this.tenantList = null;
    localStorage.removeItem('SelectedPropertyTransactions');
    localStorage.removeItem('SelectedPropertyLease');
    localStorage.removeItem('selectedPropertyTenants');
  }
  initializeData() {
    this.IsDataLoaded = false;
    this.clear();
    this.getPropertyDetails();
    this.getPropertyMedia();
    this.getPropertyListingDetails();
    this.getPropertyContacts();
    //   this.getAllListings();
    this.getTenantsByPropertyId();

    this.mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
    this.mainPhotoMediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + '/Media/Thumbnail/600x600/';
    this.imagePathURL = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + '/Media/';

  }

  getPropertyDetails() {
    this.MainPhotoUrl = '';
    this._propertyService.GetPropertyDetailsById(this.propertyId).subscribe((data => {
      if (!JSON.parse(data['_body']).error) {
        this.propertyDetails = JSON.parse(data['_body']).responseData[0];
        this.IsDataLoaded = true;
        if (this.propertyDetails.LotSizeSF) {
          if (this.unitId == UnitConversionEnum.Metric) {
            this.lotSizeValue = this._propertyService.convertUnit(this._loginService.UserInfo.CountryID, 'SF', 'HA', this.propertyDetails.LotSizeSF);
          } else
            this.lotSizeValue = this.propertyDetails.LotSizeSF;
        }
        let communicationModel = new CommunicationModel();
        communicationModel.Key = "Frompropertysummary";
        communicationModel.data = this.propertyDetails;
        this._CommService.broadcast(communicationModel);
        if (!this.propertyDetails.PropertyName && this.propertyDetails.PropertyName == "")
          this.propertyDetails.PropertyName = this.propertyDetails.Address;
        this.MainPhotoUrl = this.mainPhotoMediaUrl + this.propertyDetails.MainPhotoUrl;
        this.photoPopURL = this.propertyDetails.MainPhotoUrl;
      }
    }));

  }

  getPropertyMedia() {
    this.propertyMediaList = [];
    this.propertyNonMediaList = [];
    this._propertyService.GetAllPropertyMediaByPropertyId(this.propertyId).subscribe((result) => {
      const excludedMediaTypes = ['Tenant Roster', 'Property Manager', 'Listing'];
      const mediaData = JSON.parse(result['_body']).responseData[0];
      mediaData.forEach(value => {
        if (value.MediaRelationTypeID == MediaRelationTypeEnum.Property && !value.IsDefault) {
          if (value.Ext === 'pdf' || value.Ext === 'xlsx') {
            this.propertyNonMediaList.push(value);
          } else {
            if (excludedMediaTypes.indexOf(value.MediaTypeName) == -1)
              this.propertyMediaList.push(value);
          }
        }
      });
      let communicationModel = new CommunicationModel();
      communicationModel.Key = "PropertySummaryMedia";
      communicationModel.data = mediaData;
      this._CommService.broadcast(communicationModel);
    });
  }
  toggleTable(index) {
    this.currentRow = index;
  }
  getPropertyListingDetails() {
    this.currentListings = [];
    this._propertyService.getListingsByPropertyId(this.propertyId).subscribe((data => {

      if (!JSON.parse(data['_body']).error) {
        this.propertyListings = JSON.parse(data['_body']).responseData.propertyListing;
        this.PropertyOccupancy = JSON.parse(data['_body']).responseData.occupancy.OccupiedPercentage;
        if (!!this.propertyListings && this.propertyListings.length > 0) {
          this.propertyListings.forEach(list => {
            this.listingFilterselected.forEach(element => {
              if (element.id == list.ListingStatusID) {
                this.currentListings.push(list);
              }
            });
          });
          this.getListingAgentsByProperty();
        }
      }
    }));
  }
  getPropertyContacts() {
    this.contactList = new Object;
    this._propertyService.GetContactsByPropertyId(this.propertyId).subscribe(result => {
      let contacts = JSON.parse(result['_body']).responseData;
      let trueOwnerList = [];
      let recordedOwnerList = [];
      let propertyManagerList = [];
      contacts.forEach(contact => {
        if (contact.RoleName == "True Owner")
          trueOwnerList.push(contact);
        if (contact.RoleName == "Recorded Owner")
          recordedOwnerList.push(contact);
        if (contact.RoleName == "Property Manager")
          propertyManagerList.push(contact);

        this.contactList = { trueOwnerList: trueOwnerList, recordedOwnerList: recordedOwnerList, propertyManagerList: propertyManagerList };
      });
    });
  }
  getListingAgentsByProperty() {
    const response = this._propertyService.getListingAgentsByPropertyId(this.propertyId);
    response.subscribe(result => {
      this.PropertyAgentsList = new Object;
      var propAgentIds = [];
      let leaseAgentList = [];
      let saleAgentList = [];
      let subLeaseAgentList = [];
      if (!JSON.parse(result['_body']).error) {
        let resultData = JSON.parse(result['_body']).responseData;
        let listingDetails;
        resultData.forEach((value, index) => {
          listingDetails = this.currentListings.find(listing => {
            return listing.ListingID === value.ListingID;
          });
          if (listingDetails) {
            if (listingDetails.RecordTypeName === 'Sale') {
              value.ListingTypeDisplayName = 'Sale Listing';
              saleAgentList.push(value);
            }
            if (listingDetails.RecordTypeName === 'Lease' && listingDetails.ListingTypeName === 'Direct') {
              value.ListingTypeDisplayName = 'Direct Leasing';
              leaseAgentList.push(value);
            }

            if (listingDetails.RecordTypeName === 'Lease' && listingDetails.ListingTypeName !== 'Direct') {
              value.ListingTypeDisplayName = 'Sublease';
              subLeaseAgentList.push(value);
            }

            if (!propAgentIds.includes(value.AgentID)) {
              // this.PropertyAgentsList.push(value);
              this.PropertyAgentsList = { leaseAgentList: leaseAgentList, saleAgentList: saleAgentList, subLeaseAgentList: subLeaseAgentList };
              propAgentIds.push(value.AgentID)
            }

          }

        });
      }
    });
  }
  getAllListings() {
    const response = this._propertyService.getListingsByPropertyId(this.propertyId);
    response.subscribe(result => {
      if (!JSON.parse(result['_body']).error) {
        this.allListings = JSON.parse(result['_body']).responseData;
        if (this.allListings && this.allListings.length > 0) {
          let self = this;
          this.allListings.forEach(function (aListing, index) {
            self.setListingTypeDisplayName(aListing);
          });
          this.getListingAgentsByProperty();
        }

      }

    });
  }
  setListingTypeDisplayName(aListing) {
    aListing.ListingTypeDisplayName = aListing.RecordTypeName;
    if (aListing.RecordTypeName == 'Lease' && aListing.ListingTypeName != 'Direct') {
      aListing.ListingTypeDisplayName = aListing.ListingTypeName;
    }
  }
  getTenantsByPropertyId() {
    if (!this.tenantId) {
      localStorage.setItem('selectedPropertyTenants', "null");

    }
    if (!!localStorage.getItem('selectedPropertyTenants') && localStorage.getItem('selectedPropertyTenants') != "null") {
      this.tenantList = JSON.parse(localStorage.getItem('selectedPropertyTenants'));
    }
    if (!this.tenantList || this.tenantList.length <= 0) {
      const tenantSearchCriteria = new TenantSearchCriteria();
      tenantSearchCriteria.StartingIndex = 1;
      tenantSearchCriteria.OffsetValue = 100;
      tenantSearchCriteria.CountryId = this._loginService.UserInfo.CountryID;
      tenantSearchCriteria.SortParam = 'CompanyName';
      tenantSearchCriteria.SortDirection = 'Ascending';
      tenantSearchCriteria.PropertyId = +this.propertyId;

      const tenant = this._propertyService.getTenantsByPropertyId(this.propertyId);
      tenant.subscribe(result => {
        if (!JSON.parse(result['_body']).error) {
          const responseData = JSON.parse(result['_body']).responseData;
          this.tenantList = responseData;
        }
      });
    }
  }



  opensettingsNav() {
    this.CloseActionBtnSet = true;
    document.getElementById("MapSidenavSetting").style.width = "40%";
    document.getElementById("MapSidenav").style.width = "40%";
    if ($(window).width() < 767) {
      document.getElementById("MapSidenav").style.width = "50%";
      document.getElementById("MapSidenavSetting").style.width = "50%";
    }
    else {
      document.getElementById("MapSidenav").style.width = "40%";
      document.getElementById("MapSidenavSetting").style.width = "40%";
    }
  }
  closeSettingsNav() {
    this.CloseActionBtnSet = false;
    document.getElementById("MapSidenav").style.width = "0";
    document.getElementById("MapSidenavSetting").style.width = "0";
  }
  BackToResults() {
    if(this.redirectToGrid)
     this._router.navigate(['/property/resultsGrid']);
     else
     this._location.back();
  }
  public showPrev(propId) {
    let resultData = [];
    let currentProp = new Object;
    if (!!this._sharedDataService.searchProperties)
      resultData = this._sharedDataService.searchProperties;
    currentProp = resultData.find(x => x.PropertyId == this.propertyId);


    let index = resultData.indexOf(currentProp);
    if (index === 0) {
      index = resultData.length - 1;
      this.redirectToGrid=true;
    } else {

      do {
        index--;
        if (index < 0){
          this.redirectToGrid=false;
          index = resultData.length - 1;
        }
        else
          this.redirectToGrid=true;
      } while (resultData[index].PropertyId == this.propertyId);

    }
    this.propertyId = resultData[index].PropertyId;
    this.initializeData();
    this._router.navigate(['/property/propertySummary', resultData[index].PropertyId]);


  }
  public showNext(propId) {
    let resultData = [];
    let currentProp = new Object;
    if (!!this._sharedDataService.searchProperties)
      resultData = this._sharedDataService.searchProperties;
    if(resultData && resultData.length>0){
      currentProp = resultData.find(x => x.PropertyId == this.propertyId);


      let index = resultData.indexOf(currentProp);
      if (index === resultData.length - 1) {
        index = 0;
        this.redirectToGrid=false;
      } else {
        do {
          this.redirectToGrid=true;
          index++;
          if (index > resultData.length - 1)
            index = 0;
          
        } while (resultData[index].PropertyId == this.propertyId);

      }
      this.propertyId = resultData[index].PropertyId;
      this.initializeData();
      this._router.navigate(['/property/propertySummary', resultData[index].PropertyId]);
    }
  }

  sendReport() {
    let count = 0;
    this._sharedDataService.searchProperties.forEach(prop => {
      if (prop.PropertyId == this.propertyId) {
        prop.isSelected = true;
        count++;
      }
    });

    if (count > 0) {
      this._router.navigate(['/ulm/ulmreporturlgenerator']);
    } else {
      this.toastr.error('Select Property!');
      // alert('Select Property');
    }
  }
  showReport() {
    let count = 0;
    let listingID="";
    if(this.selectedListing&&this.selectedListing.length>0)
    {
      this.selectedListing.forEach(element => {
        listingID = element+","+listingID;


        this._sharedDataService.searchProperties.forEach(prop => {
          if (prop.PropertyId == this.propertyId) {
            if (!prop.ListingID || this._sharedDataService.searchProperties.filter(x => x.ListingID == element).length <= 0) {
              prop.ListingID = listingID;
              prop.isSelected = true;
              count++;
    
          } else if (prop.ListingID == element) {
              prop.isSelected = true;
              count++;
          }
          }
        });


      });
    }else{
    this._sharedDataService.searchProperties.forEach(prop => {
      if (prop.PropertyId == this.propertyId) {
         prop.isSelected = true;
         count++;
      }
    });
  }
    if (count > 0) {
      this._router.navigate(['/report/reporthome']);
    }
    else {
      this.toastr.error('Select Property!');
      // alert("Select Property");
    }
  }
  imageclick(index: any, path: any, mainPhoto: boolean) {
    this.showModal = true;
    this.galleryImages = [];
    if (mainPhoto) {
      this.setGalleryOptions(false, 0);
      this.imageIndex = 0;
      this.galleryImages.push({ big: this.imagePathURL + this.photoPopURL, small: path, medium: this.imagePathURL + this.photoPopURL });
    }
    else {
      this.imageIndex = index;
      this.setGalleryOptions(true, index);
      this.propertyMediaList.forEach(element => {
        this.galleryImages.push({ big: this.imagePathURL + element.Path, small: this.mediaUrl + element.Path, medium: this.imagePathURL + element.Path });
      });
    }
  }
  valueChanged(event)
  {
    this.selectedListing = event;
  }
}
