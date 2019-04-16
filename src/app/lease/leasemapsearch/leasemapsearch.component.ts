import { Component, OnInit, ViewChild } from '@angular/core';
import { MapOptions } from '../../core/models/MapOptions';
import { MapService } from '../../core/services/map-service.service';
import * as MapEnum from '../../core/models/MapEnum';
import { MapItem } from '../../core/models/MapItem';
import { MapBound } from '../../core/models/mapBound';
import { MapType, GoogleMapControlPosition, DrawMode } from '../../core/models/MapEnum';
import { LatLng } from '../../core/models/LatLng';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs/Rx';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import pageSettings from '../../config/page-settings';
import { SharedDataService } from '../../core/services/shareddata.service';
import { LoginService } from '../../core/services/login.service';
import { LookupService } from '../../core/services/lookup.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { LeaseSearchCriteria } from '../../core/models/LeaseSearchCriteria';
import { LeaseContactType } from '../../enumerations/leaseContactType';
import { ContactService } from '../../core/services/contact.service';
import { TenantBranch } from '../../core/models/tenantBranch';
import { TransactionService } from '../../core/services/transaction.service';
import { PropertyService } from '../../core/services/api-property.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
declare var google: any;
@Component({
  selector: 'app-leasemapsearch',
  templateUrl: './leasemapsearch.component.html',
  styleUrls: ['./leasemapsearch.component.css']
})
export class LeasemapsearchComponent implements OnInit {
  DateCreatedMinError: boolean = false;
  SignDateMinError: boolean = false;
  ExecutionDateMinError: boolean = false;
  PropertySizeMinError: boolean = false;
  LeasedSqMMinError :boolean =false;
  SideNav: boolean;
  SideDetailNav: boolean;
  SideMultiDetailNav: boolean;
  ExpiryDateMinError:boolean;
  DateOccupiedMinError:boolean=false;
  public map: any;
  private markers: Array<any> = new Array<any>();  
  IsRefreshloader= false;
  CloseActionBtn= false;
  CloseActionBtnDetail= false;
  CloseActionBtnMultiDetail= false;
  leaseSearchCriteria: LeaseSearchCriteria;
  isShapeOnMap= false;
  mapItems: MapItem;
  lastAction: string;
  formatOptions: any;
  leaseCompPins : Array<any>;
  leaseCompList: Array<any>;
  leaseCompCount:number;
  public leaseInfo: any;
  leasePropertyTitle :any;

  Isloader= false;
  isSelectDrawPolyGon= false;
  isSelectDrawCircle= false;
  isPropertyTypeSelected= false;
  isSpecificUseSelected= false; 
  isCitySelected= false;
  //isMarketSelected= false;
  isPostalCodeSelected= false;
  isSearchClicked= false;
  isViewportChange= false;
  isPropertySizeSelected= false;
  isPropertyGradeSelected= false;
  isTenancySelected= false;
  isLeasedSqMSelected= false;
  isSignDateSelected= false;
  isSubleaseFilterSelected= false;
  isLandLordRepCompany= false;
  isTenantRepCompanySelected= false;
  isLandLordnameSelected= false;
  isTenantNameSelected= false;
  isDateCreatedSelected= false;
  isExecutionDateSelected = false;
  isExpiryDateSelected = false;
  isDateOccupiedSelected=false

  propertyTypes: any;
  propertyTypeArray: any;
  SpecificUseList: Array<any>;
  PropertyGradesList: Array<any>;
  TenancyList: Array<any>;
  specificUseArray: any;
  PropertyGradesArray: any;
  TenancyArray: any;  

  CityList: Array<any>;
  cityArray: any;
  cityInput = new Subject<string>();
  cityLoading= false;
  
  ZipCodes: Array<any>;
  zipCodeArray: any;
  zipcodeInput = new Subject<string>();
  zipcodeLoading= false;

  LandLordRepCompanyList: Array<any>;
  landlordRepCompanyArray : any;
  landLordRepCompanyInput = new Subject<string>();
  landlordRepCompanyLoading= false;

  TenantRepCompanyList: Array<any>;
  tenantRepCompanyArray :any;
  tenantRepCompanyInput = new Subject<string>();
  tenantRepCompanyLoading= false;
  
  TenantNameList: Array<any>;
  tenantNameArray: any;
  tenantNameInput = new Subject<string>();
  tenantNameLoading= false;
  
  LandLordNameList: Array<any>;
  landLordNameArray :any;
  landLordNameInput = new Subject<string>();
  landLordNameLoading= false;

  // marketArray: any;
  // subMarketArray: any;
  shapeOnMap: string = '';
  hasSearchResult= false;
  selectedPropertyId:number;
  // selectedSICCode: string;
  // selectedSICCodeList: any;
  SignDateMin :NgbDateStruct;
  SignDateMax :NgbDateStruct;
  ExecutionDateMin :NgbDateStruct;
  ExecutionDateMax :NgbDateStruct;
  DateCreatedMin :NgbDateStruct;
  DateCreatedMax :NgbDateStruct;
  LeasedSqMMin : number = null;
  LeasedSqMMax : number = null;
  legentCloseActionBtn= false;
  pageSettings: any;
  showClearBtn:boolean=false;
  tenantSearchItem: TenantBranch = new TenantBranch();
  lati: any;
  long: any;
  propertyTitle: string;
  showMultipleTransactionDetails= false;
  leaseSearchForm:FormGroup;
  currentDate=new Date;
  ExpiryDateMin:NgbDateStruct;
  ExpiryDateMax:NgbDateStruct;  
  PagerOffset :number;
  DateOccupiedMin:NgbDateStruct;
  DateOccupiedMax:NgbDateStruct; 

  // minDate={year:this.currentDate.getFullYear()-75,month:1,day:1};
  maxDate={year:this.currentDate.getFullYear(),month:this.currentDate.getMonth()+1,day:this.currentDate.getDate()};
  // maxDateExpiry={year:this.currentDate.getFullYear()+25,month:this.currentDate.getMonth()+1,day:this.currentDate.getDate()};
  // minDateExpiry={year:this.currentDate.getFullYear()-20,month:1,day:1};
  constructor(private _mapService: MapService
    , private _lookupService: LookupService
    , private _router: Router
    , private _loginService: LoginService
    , private _sharedDataService: SharedDataService
    , private route: ActivatedRoute
    , private transactionService: TransactionService
    , private propertyService: PropertyService
    , private _CommService: CommunicationService
    , private _contactService: ContactService
    , private toastr: ToastrService) {

    this.formatOptions = { prefix: '', precision: 0 };
    this.mapItems = new MapItem();
    this.SpecificUseList = Array<any>();
    this.specificUseArray = [];    
    this.PropertyGradesList = Array<any>();
    this.PropertyGradesArray = [];
    this.TenancyList = Array<any>();
    this.TenancyArray = [];
    this.propertyTypeArray = [];
    this.cityArray = [];
    this.zipCodeArray = [];
    // this.marketArray = [];
    // this.subMarketArray = [];
    this.leaseSearchCriteria = new LeaseSearchCriteria();
    if (!!localStorage.getItem('allSpecificUses')) {
      this._sharedDataService.specificUses = JSON.parse(localStorage.getItem('allSpecificUses'));
    }
    if (!this._sharedDataService.specificUses) {
      this.getAllSpecificUses();
    }
    if (!!localStorage.getItem('allBuildingClass')) {
      this._sharedDataService.buildingClass = JSON.parse(localStorage.getItem('allBuildingClass'));
      this.PropertyGradesList = this._sharedDataService.buildingClass;
    }
    if (!this._sharedDataService.buildingClass) {
      this.getBuildingClass();
    }
    if (!!localStorage.getItem('allTenancyList')) {
      this._sharedDataService.tenancyList = JSON.parse(localStorage.getItem('allTenancyList'));
      this.TenancyList = this._sharedDataService.tenancyList;
    }
    if (!this._sharedDataService.tenancyList) {
      this.getTenancy();
    }
    
    if (!!this._sharedDataService.propertyTypes && this._sharedDataService.propertyTypes.length > 0) {
      this.propertyTypes = this._sharedDataService.propertyTypes;
    } else {
      this.getPropertyType();
    }

  }

  ngOnInit() {
    this.pageSettings = pageSettings;
    this.pageSettings.pageSidebarMinified = true;
    this.setMap();
    this.openNav();
    this.initializeleaseSearchCriteria();

    this.leaseSearchForm = new FormGroup({
      'DateCreatedMax': new FormControl(''),
      'DateCreatedMin': new FormControl(''),
      'landLordNameArray': new FormControl(''),
      'tenantRepCompanyArray': new FormControl(''),
      'landlordRepCompanyArray': new FormControl(''),
     'SubLeaseFilter': new FormControl(''),
     'SignDateMax': new FormControl(''),
     'SignDateMin': new FormControl(''),
     'ExecutionDateMax': new FormControl(''),
     'ExecutionDateMin': new FormControl(''),
     'TenancyArray': new FormControl(''),
     'PropertyGradesArray': new FormControl(''),
     'PropertySizeMax': new FormControl(''),
     'PropertySizeMin': new FormControl(''),
     'specificUseArray': new FormControl(''),
     'propertyTypeArray': new FormControl(''),
     'zipCodeArray': new FormControl(''),
     'cityArray': new FormControl(''),
     'ExpiryDateMin':new FormControl(''),
     'ExpiryDateMax':new FormControl(''),
     'LeasedSqMMin' : new FormControl(''),
     'LeasedSqMMax' : new FormControl(''),
     'DateOccupiedMin':new FormControl(''),
     'DateOccupiedMax':new FormControl(''),
     
    });
  
    if (!!this._sharedDataService.searchLeaseTransactionMap) {
     // this._sharedDataService.searchLeaseTransactionMap = JSON.parse(localStorage.getItem('LeaseMapSearchResults'));
      this.leaseCompPins = this._sharedDataService.searchLeaseTransactionMap;
    }
    this.leaseCompList = this._sharedDataService.searchLeaseTransactionList;
    this.leaseCompCount = this._sharedDataService.leaseSearchResultCount;
    if (!!this._sharedDataService.searchLeaseTransactionMap) {
      this.setShape();
      this.showMapResults();
    }
    if (this.leaseCompCount) {
      this.isSearchClicked = true;
    }
    this.cityInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {      
      if (!!value) {
        this.cityLoading = true;
        const response_Cities = this._lookupService.CitySearch(value, this._loginService.UserInfo.CountryID);
        response_Cities.subscribe(result => {
          this.CityList = JSON.parse(result['_body']).responseData || [];
          this.cityLoading = false;
        });
      }
      else
        this.CityList = [];
    });

    this.zipcodeInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      if (!!value) {
        this.zipcodeLoading = true;
        const response_zipcode = this._lookupService.ZipCodeSearch(value, this._loginService.UserInfo.CountryID);
        response_zipcode.subscribe(result => {
          this.ZipCodes = JSON.parse(result['_body']).responseData || [];
          this.zipcodeLoading = false;
        });
      }
      else
        this.ZipCodes = [];
    });

    this.landLordRepCompanyInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {      
      if (!!value) {
        this.landlordRepCompanyLoading = true;
        const response_companies = this._lookupService.GetLeaseContactCompany(value, LeaseContactType.LandlordRep);
        response_companies.subscribe(result => {
          this.LandLordRepCompanyList = JSON.parse(result['_body']).responseData || [];
          this.landlordRepCompanyLoading = false;
        });
      }
      else
        this.LandLordRepCompanyList = [];
    });

    this.tenantRepCompanyInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {      
      if (!!value) {
        this.tenantRepCompanyLoading = true;
        const response_companies = this._lookupService.GetLeaseContactCompany(value, LeaseContactType.TenantRep);
        response_companies.subscribe(result => {
          this.TenantRepCompanyList = JSON.parse(result['_body']).responseData || [];
          this.tenantRepCompanyLoading = false;
        });
      }
      else
        this.TenantRepCompanyList = [];
    });

    this.landLordNameInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {      
      if (!!value) {
        this.landLordNameLoading = true;
        const response_companies = this._lookupService.GetLeaseContactCompany(value, LeaseContactType.Landlord);
        response_companies.subscribe(result => {
          this.LandLordNameList = JSON.parse(result['_body']).responseData || [];
          this.landLordNameLoading = false;
        });
      }
      else
        this.LandLordNameList = [];
    });

    this.tenantNameInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {      
      if (!!value) {
        this.tenantNameLoading = true;
        this.tenantSearchItem.CompanyName = value;
        const response_companies = this._contactService.GetTenantSearchList(this.tenantSearchItem);
        response_companies.subscribe(result => {
          if(JSON.parse(result['_body']).responseData){
            this.TenantNameList = JSON.parse(result['_body']).responseData.tenantList || [];
          }
          this.tenantNameLoading = false;
        });
      }
      else
        this.TenantNameList = [];
    });

    if(!!this._sharedDataService.selectedLeasePin){
      if(this._sharedDataService.IsSinglePin==true){
      this.openDetailNav();
    }
    else{
      this.openMultiDetailNav(this._sharedDataService.selectedLeasePin);
    }
  }  
  }

  public initializeleaseSearchCriteria() {
    this.setInitValues();

    this.leaseSearchCriteria.PageNo = 1;
    this.leaseSearchCriteria.PageSize = !this.PagerOffset ? 100 : this.PagerOffset;
    this.leaseSearchCriteria.CountryId = this._loginService.UserInfo.CountryID;
    this.leaseSearchCriteria.SortBy = "Address";
    this.leaseSearchCriteria.SortDirection = "Ascending";
    this.leaseSearchCriteria.CountryId=this._loginService.UserInfo.CountryID;

    if (!!this._sharedDataService.leaseSearchCriteria) {
      this.leaseSearchCriteria = this._sharedDataService.leaseSearchCriteria;
      this.ExecutionDateMax = this._sharedDataService.leaseSearchCriteria.ExecutionDateMaxFormat;
      this.ExecutionDateMin = this._sharedDataService.leaseSearchCriteria.ExecutionDateMinFormat;
      this.ExpiryDateMin = this._sharedDataService.leaseSearchCriteria.ExpiryDateMinFormat;
      this.ExpiryDateMax = this._sharedDataService.leaseSearchCriteria.ExpiryDateMaxFormat;
      this.DateCreatedMin = this._sharedDataService.leaseSearchCriteria.DateCreatedMinFormat;
      this.DateCreatedMax = this._sharedDataService.leaseSearchCriteria.DateCreatedMaxFormat;
      if (!!this.leaseSearchCriteria.PropertyTypes) {
        this.isPropertyTypeSelected = true;
        this.propertyTypeArray = this.stringToArray(this.leaseSearchCriteria.PropertyTypes);
        if (this.propertyTypeArray) {
          let count = 0;
          this.propertyTypeArray.forEach(value => {
            this.getSpecificUseList(value);
          });
          if (!!this.leaseSearchCriteria.SpecificUseId) {
            this.specificUseArray = this.stringToArray(this.leaseSearchCriteria.SpecificUseId);
            this.isSpecificUseSelected = true;
          }
        }
      }
      if (!!this.leaseSearchCriteria.CityIDs) {
        this.isCitySelected = true;
        this.cityArray = this.stringToArray(this.leaseSearchCriteria.CityIDs);
      }
      if (!!this.leaseSearchCriteria.ZipCodes) {
        this.isPostalCodeSelected = true;
        this.zipCodeArray = this.stringToArray(this.leaseSearchCriteria.ZipCodes);
      }
      if (!!this.leaseSearchCriteria.citySearchText) {
        this.getCity(this.leaseSearchCriteria.citySearchText);
      }
      if (!!this.leaseSearchCriteria.zipcodeSearchText) {
        this.getZipCodes(this.leaseSearchCriteria.zipcodeSearchText);
      }
      if (!!this.leaseSearchCriteria.PropertyGrades) {
        this.isPropertyGradeSelected = true;
        this.PropertyGradesArray = this.stringToArray(this.leaseSearchCriteria.PropertyGrades);
      }
      if (!!this.leaseSearchCriteria.Tenancys) {
        this.isTenancySelected = true;
        this.TenancyArray = this.stringToArray(this.leaseSearchCriteria.Tenancys);
      }
    }

    this.onBlurMethod();
  }
 
  getAllSpecificUses() {

    const specificUses = this._lookupService.GetAllSpecificUse();
    specificUses.subscribe(result => {
      if (!JSON.parse(result['_body']).error)
        this._sharedDataService.specificUses = JSON.parse(result['_body']).responseData;
      else
        this._sharedDataService.specificUses = null;

    });
  }

  getPropertyType() {
    const propertyType = this._lookupService.GetAllPropertyType();
    propertyType.subscribe(result => {
      if (!JSON.parse(result['_body']).error) {
        this.propertyTypes = JSON.parse(result['_body']).responseData;
        this._sharedDataService.propertyTypes = JSON.parse(result['_body']).responseData;
      }
      else
        this._sharedDataService.propertyTypes = null;

    });
  }

  setInitValues() {  
    this.leaseSearchCriteria.PageNo = 1;
    this.leaseSearchCriteria.PageSize = 100;
    this.leaseSearchCriteria.CountryId = this._loginService.UserInfo.CountryID;
    this.leaseSearchCriteria.SortBy = "PropertyName";
    this.leaseSearchCriteria.SortDirection = "Ascending";
    this.leaseSearchCriteria.PolygonText = "";
    this.leaseSearchCriteria.CentreLatitude = null;
    this.leaseSearchCriteria.CentreLongitude = null;
    this.leaseSearchCriteria.CircleRadius = null;
  }

  onBlurMethod(SubLeaseFilter?) {
    if (this.leaseSearchCriteria.PropertySizeMin || this.leaseSearchCriteria.PropertySizeMax) {
      this.isPropertySizeSelected = true;
    } else {
      this.isPropertySizeSelected = false;
    }
    if (this.LeasedSqMMin || this.LeasedSqMMax) {
      this.isLeasedSqMSelected = true;
    } else {
      this.isLeasedSqMSelected = false;
    }  
    if(this.leaseSearchCriteria.SubLeaseFilter !=null || SubLeaseFilter !=null) 
      this.isSubleaseFilterSelected = true;
    else
      this.isSubleaseFilterSelected= false;
  }

  onPropertyTypeSelected(data) {
    this.SpecificUseList = [];
    this.specificUseArray = [];
    if (data.length > 0) {
      this.isPropertyTypeSelected = true;
    } else {
      this.isPropertyTypeSelected = false;
      this.isSpecificUseSelected = false;
    }
    data.forEach(value => {
      this.getSpecificUseList(value.UseTypeID);
    });
  }
  getSpecificUseList(propertyTypeId) {

    this._sharedDataService.specificUses.forEach(specific => {
      if (specific.UseTypeID == propertyTypeId) {
        this.SpecificUseList.push(specific);
      }

    });

  }

  changeSpecificUse(data) {

    if (data.length > 0) {
      this.isSpecificUseSelected = true;
    } else {
      this.isSpecificUseSelected = false;
    }

  }
  getCity(searchText) {
    if (!searchText)
      searchText = "";
    this.CityList = new Array<any>();
    if (searchText.length >= 3) {
      let result = this._lookupService.CitySearch(searchText, this._loginService.UserInfo.CountryID);
      result.subscribe(item => {
        this.CityList = JSON.parse(item['_body']).responseData;
      });
    }
  }

  onSelectBuildingClass(data) {
    if (data.length > 0) {
      this.isPropertyGradeSelected = true;
    } else {
      this.isPropertyGradeSelected = false;
    }   
  }
  onSelectTenancy(data) {
    if (data.length > 0) {
      this.isTenancySelected = true;
    } else {
      this.isTenancySelected = false;
    }   
  }

  getBuildingClass() {
    this.PropertyGradesList=[];
    const propertyGradesList = this._lookupService.getBuildingClass();
    propertyGradesList.subscribe(result => {
      if (!JSON.parse(result['_body']).error){
        this._sharedDataService.buildingClass = JSON.parse(result['_body']).responseData;
        this.PropertyGradesList = JSON.parse(result['_body']).responseData;
        localStorage.setItem('allBuildingClass',JSON.stringify(this.PropertyGradesList));
      }
      else
        this._sharedDataService.buildingClass = null;

    });
  }

  getTenancy() {
    this.TenancyList=[];
    const TenancyList = this._lookupService.getAllTenancy();
    TenancyList.subscribe(result => {
      if (!JSON.parse(result['_body']).error){
        this._sharedDataService.tenancyList = JSON.parse(result['_body']).responseData;
        this.TenancyList = JSON.parse(result['_body']).responseData;
        localStorage.setItem('allTenancyList',JSON.stringify(this.TenancyList));
      }
      else
        this._sharedDataService.tenancyList = null;

    });
  }
  
  onSelectCity(data) {
    if (data.length > 0) {
      this.isCitySelected = true;
    } else {
      this.isCitySelected = false;
    }
  }

  onLandLordRepCompanySelect(data){
    if (data.length > 0) {
      this.isLandLordRepCompany = true;
    } else {
      this.isLandLordRepCompany = false;
    }
  }
  onTenantRepCompanySelect(data){
    if (data.length > 0) {
      this.isTenantRepCompanySelected = true;
    } else {
      this.isTenantRepCompanySelected = false;
    }
  }
  onLandLordNameSelect(data){
    if (data.length > 0) {
      this.isLandLordnameSelected = true;
    } else {
      this.isLandLordnameSelected = false;
    }
  }
  onTenantNameSelect(data){
    if (data.length > 0) {
      this.isTenantNameSelected = true;
    } else {
      this.isTenantNameSelected = false;
    }
  }
  getZipCodes(searchText) {
    this.ZipCodes = new Array<any>();
    if (searchText.length >= 3) {
      // let result = this._lookupService.ZipCodeSearch(searchText, this.leaseSearchCriteria.CountryId);
      // result.subscribe(item => {
      //   this.ZipCodes = JSON.parse(item['_body']).responseData;
      // });
    }
  }
  onSelectZipCode(data) {
    if (data.length > 0) {
      this.isPostalCodeSelected = true;
    } else {
      this.isPostalCodeSelected = false;
    }
  }
  arrayToString(List: any) {
    let saleCon = '';
    if (List) {
      if (List.length > 0) {
        for (let con of List) {
          saleCon = saleCon + con + ",";
        }
        return saleCon.slice(0, -1);
      }
    }
    else {
      return null;
    }
  }
  stringToArray(strValue) {
    let returnArray = [];
    if (strValue) {
      let array = strValue.split(',');
      array.forEach(value => {
        returnArray.push(parseInt(value));
      });
      return returnArray;
    } else {
      return null;
    }
  }

  setMap() {
    const instance = this;
    setTimeout(function () {

      const mapOptions = new MapOptions('mainmap');
      mapOptions.SetBasicOptions(MapEnum.MapType.Roadmap, 14, 7, null,instance._loginService.UserInfo.MetroCentroidLat, instance._loginService.UserInfo.MetroCentroidLong);
      mapOptions.RequireCtrlToZoom = false;
      mapOptions.FeaturesToHide.push(MapEnum.MapFeatures.Administrative_LandParcel,
        MapEnum.MapFeatures.HighwayRoad,
        MapEnum.MapFeatures.ControlledAccessHighwayRoad,
        MapEnum.MapFeatures.LineTransit, MapEnum.MapFeatures.AirportStation,
        MapEnum.MapFeatures.BusStation, MapEnum.MapFeatures.RailwayStation,
        MapEnum.MapFeatures.AttractionPin, MapEnum.MapFeatures.BusinessPin,
        MapEnum.MapFeatures.GovernmentPin, MapEnum.MapFeatures.MedicalInstitutionPin,
        MapEnum.MapFeatures.ParkPin, MapEnum.MapFeatures.PlaceOfWorkshipPin,
        MapEnum.MapFeatures.ScoolPin, MapEnum.MapFeatures.SportsComplexPin);
      instance.map = instance._mapService.CreateMap(mapOptions);
      instance._mapService.ClearViewPortChangeListener(instance.map);
      instance.ViewPortChangeCheck();

    }, 100);
  }

  ViewPortChangeCheck() {
    this._mapService.OnMapViewPortChangedOnce(this.map, (boundProperties: MapBound) => {
      if (this.isSearchClicked) {
        this.isViewportChange = true;
      }
      this.ViewPortChangeCheck();
    });
  }

  private placeMarker(tenant: any, isDraggable= false) {
    const marker = this._mapService.PlaceMarker(this.map, tenant.Latitude, tenant.Longitude, isDraggable);
    marker.data = tenant;
    this.setMarkerIcon(marker);
    return marker;
  }

  private setMarkerIcon(marker: any) {
    let iconUrl = 'assets/img/GoogleMapImages/MapPin/';
    switch (marker.data.PropertyType) {
      case 'Industrial':
        iconUrl += 'marker_red.png'; // Red
        break;
      case 'Office':
        // Blue
        iconUrl += 'marker_blue.png'; // blue
        break;
      case 'Retail':
        // Yellow
        iconUrl += 'marker_orange.png'; // Yellow
        break;
      case 'Multi-Family Housing':
        // Brown
        iconUrl += 'DarkBrownPin.png'; // Brown
        break;
      case 'Land':
        // Green
        iconUrl += 'marker_green.png'; // Green
        break;
      case 'Special Use':
        iconUrl += 'marker_pink.png'; // pink
        break;

      default:
        iconUrl += 'marker_red.png'; // Red
        break;
    }
    marker.setIcon(iconUrl);
  }

  DrawShape(shape) {
    this.clearShapes();
    if (!!this._sharedDataService.leaseSearchCriteria) {
      this._sharedDataService.leaseSearchCriteria.PolygonText = null;

      this._sharedDataService.leaseSearchCriteria.LatlngArray = null;

      this._sharedDataService.leaseSearchCriteria.CircleRadius = null;

      this._sharedDataService.leaseSearchCriteria.CentreLatitude = null;

      this._sharedDataService.leaseSearchCriteria.CentreLongitude = null;
      
    }

    let instance = this;
    this.isShapeOnMap = false;
    let propCount = 0;
    let drawingManager = this._mapService.DrawPolygon(this.map, shape);
    google.maps.event.addListener(instance.map, "rightclick", function (event) {
      drawingManager.setMap(null);
      instance.isSelectDrawPolyGon = false;
      instance.isSelectDrawCircle = false;
    });
    if (shape == "polygon") {
      this.isSelectDrawPolyGon = true;
      this.isSelectDrawCircle = false;
      this._mapService.OnMapOverlayComplete(drawingManager, DrawMode.Polygon, function (event) {
        instance.showClearBtn = true;
        instance.mapItems.Polygons.push(event);
        let latlngArray = event.latLngs.getArray()[0].getArray();
        instance._mapService.FitMapToPolygon(instance.map, event);
        instance.lastAction = 'polygon';
        instance.isShapeOnMap = true;
        drawingManager.setMap(null);
      });
    } else if (shape == 'circle') {
      this.isSelectDrawPolyGon = false;
      this.isSelectDrawCircle = true;
      this._mapService.OnMapOverlayComplete(drawingManager, DrawMode.Circle, function (overlay) {
        instance.showClearBtn = true;
        instance.mapItems.Polygons.push(overlay);
        instance.map.fitBounds(overlay.getBounds());
        instance.lastAction = 'circle';
        instance.isShapeOnMap = true;
        drawingManager.setMap(null);
      });
    }
    this._mapService.OnDrawingModeChange(drawingManager, function () {
      if (instance.mapItems.DrawingOptions.drawingMode != null) {
        instance.clearShapes();

        for (let item of instance.mapItems.MapPins) {
          item.setMap(null);
        }
        instance.mapItems.MapPins = new Array<any>();
      }
    });

  }
  public onSearchClick() {
    if(this.leaseSearchForm.valid && !this.PropertySizeMinError && !this.ExecutionDateMinError && !this.SignDateMinError && !this.DateCreatedMinError && !this.ExpiryDateMinError && !this.LeasedSqMMinError  && !this.DateOccupiedMinError){
      this.showClearBtn = false;
      this.leaseCompPins = [];
      this.leaseCompList = [];
      this.leaseCompCount = 0;
      this._sharedDataService.leaseSearchCriteria = null;
      this._sharedDataService.searchLeaseTransactionList = null;
      this._sharedDataService.searchLeaseTransactionMap = null;
      this._sharedDataService.leaseSearchResultCount = 0;
  
      // localStorage.removeItem('LeaseSearchResultList');
      // localStorage.removeItem('LeaseSearchResultCount');
      // localStorage.removeItem('leaseSearchCriteria');
      // localStorage.removeItem('LeaseMapSearchResults');
  
      this.clearMarkers();
  
      this.Isloader = true;
      this.isSearchClicked = true;
      localStorage.setItem('LeaseCurrentPage', JSON.stringify(1));
      this.leaseSearchCriteria.SpecificUseId = this.arrayToString(this.specificUseArray);
      this.leaseSearchCriteria.PropertyTypes = this.arrayToString(this.propertyTypeArray);
      this.leaseSearchCriteria.CityIDs = this.arrayToString(this.cityArray);
      this.leaseSearchCriteria.PropertyGrades = this.arrayToString(this.PropertyGradesArray);
      this.leaseSearchCriteria.Tenancys = this.arrayToString(this.TenancyArray);
      this.leaseSearchCriteria.ZipCodes = this.arrayToString(this.zipCodeArray);
      this.leaseSearchCriteria.TenantNames = this.arrayToString(this.tenantNameArray);
      this.leaseSearchCriteria.LandlordNames = this.arrayToString(this.landLordNameArray);
      this.leaseSearchCriteria.TenantRepCompanys = this.arrayToString(this.tenantRepCompanyArray);
      this.leaseSearchCriteria.LandlordRepCompanys = this.arrayToString(this.landlordRepCompanyArray);
      this.leaseSearchCriteria.PageSize =!this.PagerOffset ? 100 : this.PagerOffset;
      this.leaseSearchCriteria.PageNo = 1;

      if (!!this.LeasedSqMMax)
        this.leaseSearchCriteria.LeasedSFMax = this.propertyService.convertUnit(this.leaseSearchCriteria.CountryId, "SqM", "SF", this.LeasedSqMMax)
      else
        this.leaseSearchCriteria.LeasedSFMax = null;
  
      if (!!this.LeasedSqMMin)
        this.leaseSearchCriteria.LeasedSFMin = this.propertyService.convertUnit(this.leaseSearchCriteria.CountryId, "SqM", "SF", this.LeasedSqMMin)
      else
        this.leaseSearchCriteria.LeasedSFMin = null;
   
      const instance = this;
      let latlngArray;
        if (!this.lastAction && this.mapItems.Polygons.length <= 0)
        {
          this.lastAction = 'search';
          this._mapService.RightClick(this.map);
        }
        else if (this.mapItems.Polygons.length > 0 && !!this.mapItems.Polygons[this.mapItems.Polygons.length - 1].radius)
          this.lastAction = 'circle';
        else if (this.mapItems.Polygons.length > 0 && !!this.mapItems.Polygons[this.mapItems.Polygons.length - 1].latLngs)
          this.lastAction = 'polygon';
        else
          this._mapService.RightClick(this.map);
        
        switch (this.lastAction) {
          case 'search':
            const result = this.transactionService.LeaseTransactionSearch(this.leaseSearchCriteria);
            result.subscribe(item => {
              if (!JSON.parse(item['_body']).error && JSON.parse(item['_body']).responseData != null) {
                this.leaseCompPins = JSON.parse(item['_body']).responseData.LeaseTransaction[0];
                this.leaseCompList = JSON.parse(item['_body']).responseData.LeaseTransaction[0];
                this.leaseCompCount = JSON.parse(item['_body']).responseData.LeaseTransaction[1][0] ? JSON.parse(item['_body']).responseData.LeaseTransaction[1][0].Total_Count : 0;
                this.PagerOffset = JSON.parse(item['_body']).responseData.LeaseTransaction[2][0] ? JSON.parse(item['_body']).responseData.LeaseTransaction[2][0].PagerOffset : 0;
                
                this._sharedDataService.searchLeaseTransactionMap = this.leaseCompPins;
                this._sharedDataService.searchLeaseTransactionList = this.leaseCompList;
                this._sharedDataService.leaseSearchResultCount = this.leaseCompCount;
                this._sharedDataService.leaseSearchCriteria.PageSize = !this.PagerOffset ? 100 : this.PagerOffset ;
  
             //   localStorage.setItem('LeaseMapSearchResults', JSON.stringify(this.leaseCompPins));
             //   localStorage.setItem('LeaseSearchResultList', JSON.stringify(this.leaseCompList));
              //  localStorage.setItem('LeaseSearchResultCount', JSON.stringify(this.leaseCompCount));
  
                if (this.leaseCompPins.length > 0) {
                  this.placeTransactionPins(this.leaseCompPins);
                  this._mapService.FitMapToMarkers(this.map, this.mapItems.MapPins);
                  this.map.setCenter({
                    lat: this.lati,
                    lng: this.long
                  });
                  var zoomLevel = instance.map.getZoom();
                  instance.map.setZoom(zoomLevel + 1);
                }
                else {
                  this.toastr.error('No Result Found!');
                  // alert("No result found");
                }
              }
              else {
                this.toastr.error('No Result Found!');
                // alert("No result found");
              }
              this.Isloader = false;
            });
            break;
          case 'circle':
            this.shapeOnMap = 'circle';
            // To retain search criteria.
            let overlay;
            if (!!this._sharedDataService.leaseSearchCriteria) {
              if (!!this._sharedDataService.leaseSearchCriteria.CircleRadius &&
                !!this._sharedDataService.leaseSearchCriteria.CentreLatitude &&
                !!this._sharedDataService.leaseSearchCriteria.CentreLongitude) {
                overlay = new Object;
                overlay.center = this._mapService.GetLatLng(
                  this._sharedDataService.leaseSearchCriteria.CentreLatitude, this._sharedDataService.leaseSearchCriteria.CentreLongitude)
                overlay.radius = this._sharedDataService.leaseSearchCriteria.CircleRadius / 0.00062137;
  
                if (!!this.mapItems.Polygons[this.mapItems.Polygons.length - 1].radius) {
                  if (this.mapItems.Polygons[this.mapItems.Polygons.length - 1].radius != overlay.radius) {
                    overlay = this.mapItems.Polygons[this.mapItems.Polygons.length - 1];
                  }
                }
              } else {
                overlay = this.mapItems.Polygons[this.mapItems.Polygons.length - 1];
              }
            } else {
              overlay = this.mapItems.Polygons[this.mapItems.Polygons.length - 1];
            }
            this.leaseSearchCriteria.PolygonText = null;
            this.leaseSearchCriteria.CentreLatitude = overlay.center.lat();
            this.leaseSearchCriteria.CentreLongitude = overlay.center.lng();
  
            this.leaseSearchCriteria.CircleRadius = overlay.radius * 0.00062137; // convert meter to miles.
            this.fetchViewPortProperties();
            break;
          case 'polygon':
            this.shapeOnMap = 'polygon';
            // To retain search criteria.
            if (!!this._sharedDataService.leaseSearchCriteria) {
              if (!!this._sharedDataService.leaseSearchCriteria.LatlngArray) {
                latlngArray = JSON.parse(this._sharedDataService.leaseSearchCriteria.LatlngArray);
  
                if (!!this.mapItems.Polygons[this.mapItems.Polygons.length - 1].latLngs.getArray()[0].getArray()) {
                  if (this.mapItems.Polygons[this.mapItems.Polygons.length - 1].latLngs.getArray()[0].getArray() != latlngArray) {
                    latlngArray = this.mapItems.Polygons[this.mapItems.Polygons.length - 1].latLngs.getArray()[0].getArray();
                  }
                }
              } else
                latlngArray = this.mapItems.Polygons[this.mapItems.Polygons.length - 1].latLngs.getArray()[0].getArray();
  
            }
            else
              latlngArray = this.mapItems.Polygons[this.mapItems.Polygons.length - 1].latLngs.getArray()[0].getArray();
  
            const geoloc = JSON.parse(JSON.stringify(latlngArray));
            this.leaseSearchCriteria.LatlngArray = JSON.stringify(latlngArray);
            let polyText = '';
            polyText = 'POLYGON((';
            geoloc.forEach(function (item, index) {
              polyText += (item.lng + ' ' + item.lat + ',');
            });
            polyText += geoloc[0].lng + ' ' + geoloc[0].lat + '))';
  
            this.leaseSearchCriteria.PolygonText = polyText;
            this.leaseSearchCriteria.CentreLatitude = null;
            this.leaseSearchCriteria.CentreLongitude = null;
            this.leaseSearchCriteria.CircleRadius = null; // convert meter to miles.
  
            this.fetchViewPortProperties();
            break;
        }

        this._sharedDataService.leaseSearchCriteria = this.leaseSearchCriteria;
      // } else {
      //   const result = this.transactionService.saleTransactionSearch(this.leaseSearchCriteria);
      //   result.subscribe(item => {
      //     this.leaseCompList = this.leaseCompPins = JSON.parse(item['_body']).responseData.Transaction[0];
      //     this._sharedDataService.searchTransactions = this._sharedDataService.searchLeaseTransactionMap = this.leaseCompList;
  
      //     if (!!JSON.parse(item['_body']).responseData.Transaction[1])
      //       this._sharedDataService.transactionSearchResultCount = JSON.parse(item['_body']).responseData.Transaction[1][0].Total_Count;
  
      //     if (this.leaseCompList.length > 0)
      //       this.showGrid = true;
      //     else
      //       alert('No result found');
      //   });
      //}
  
    //  this._sharedDataService.leaseSearchCriteria = this.leaseSearchCriteria;
    //  localStorage.setItem('leaseSearchCriteria', JSON.stringify(this.leaseSearchCriteria));
    }
    
  }

  
  refreshResults() {
    this.IsRefreshloader = true;
    this.setCriteriaLatLng();
    this.fetchViewPortProperties();
  }
  private setCriteriaLatLng() {
    if (this.map) {
      let boundProps = this._mapService.getBoundary(this.map);
      this.leaseSearchCriteria.SWLat = boundProps.SouthWest.Latitude;
      this.leaseSearchCriteria.SWLng = boundProps.SouthWest.Longitude;
      this.leaseSearchCriteria.NELat = boundProps.NorthEast.Latitude;
      this.leaseSearchCriteria.NELng = boundProps.NorthEast.Longitude;
    }
  };
  private placeTransactionPins(leaseArray: Array<any>) {
    const instance = this;
    this.clearMarkers();

    if (leaseArray.length > 0) {
      var bounds = new google.maps.LatLngBounds();
      for (const transaction of leaseArray) {
        const marker = this.placeMarker(transaction);

        instance._mapService.OnMarkerClick(marker, function (event, marker1, latlng) {
          instance.SideDetailNav = false;
          instance.leaseInfo = new Object();
          instance.leaseInfo = transaction;
          instance.leasePropertyTitle = transaction.PropertyName;
          let count = 0;
          leaseArray.forEach(item => {
            if (item.PropertyID == transaction.PropertyID) {
              count++;
            }
          });
          if (count > 1) {
            instance.propertyTitle = transaction.PropertyName;
            instance.selectedPropertyId = transaction.PropertyID;
            instance.showMultipleTransactionDetails = true;
            instance._sharedDataService.IsSinglePin=false;
            instance._sharedDataService.selectedLeaseMultiDetails=instance.leaseInfo;
            instance.openMultiDetailNav(transaction.PropertyID);
          }
          else
            {
              instance._sharedDataService.IsSinglePin=true;
              instance._sharedDataService.selectedLeaseSingleDetails=instance.leaseInfo;
              instance.openDetailNav();
            
            }
        
          instance._sharedDataService.searchLeaseTransactionMap = instance.leaseCompPins;
          instance._sharedDataService.searchLeaseTransactionList = instance.leaseCompList;
          instance._sharedDataService.leaseSearchResultCount = instance.leaseCompCount;

          instance.SideDetailNav = true;
        });
        var markerPos = marker.getPosition()
        bounds.extend(markerPos);
        this.mapItems.MapPins.push(marker);
      }
      if(!this.isSelectDrawPolyGon && !this.isSelectDrawCircle)
      instance.map.fitBounds(bounds);
    } else {
      this.leaseCompCount = 0;
    }
    instance.GetCentralGeoCoordinate();
  }
  
  fetchViewPortProperties() {
    this.leaseSearchCriteria.Cur_Latitude = this.leaseSearchCriteria.CentreLatitude;
    this.leaseSearchCriteria.Cur_Longitude = this.leaseSearchCriteria.CentreLongitude;
    this.leaseSearchCriteria.Radius = this.leaseSearchCriteria.CircleRadius;
    const searchResult = this.transactionService.LeaseTransactionSearch(this.leaseSearchCriteria);
    searchResult.subscribe(item => {
      if (!JSON.parse(item['_body']).error && JSON.parse(item['_body']).responseData != null) {
        this.leaseCompPins = JSON.parse(item['_body']).responseData.LeaseTransaction[0];
        this.leaseCompList = JSON.parse(item['_body']).responseData.LeaseTransaction[0];
        this.leaseCompCount = JSON.parse(item['_body']).responseData.LeaseTransaction[1][0] ? JSON.parse(item['_body']).responseData.LeaseTransaction[1][0].Total_Count : 0;
        this.PagerOffset = JSON.parse(item['_body']).responseData.LeaseTransaction[2][0] ? JSON.parse(item['_body']).responseData.LeaseTransaction[2][0].PagerOffset : 0;
                
        this._sharedDataService.searchLeaseTransactionMap = this.leaseCompPins;
        this._sharedDataService.searchLeaseTransactionList = this.leaseCompList;
        this._sharedDataService.leaseSearchResultCount = this.leaseCompCount;
        this._sharedDataService.leaseSearchCriteria.PageSize = !this.PagerOffset ? 100 : this.PagerOffset ;
  
      //  localStorage.setItem('LeaseMapSearchResults', JSON.stringify(this.leaseCompPins));
      //  localStorage.setItem('LeaseSearchResultList', JSON.stringify(this.leaseCompList));
      //  localStorage.setItem('LeaseSearchResultCount', JSON.stringify(this.leaseCompCount));
        if (this.leaseCompPins.length > 0) {
          this.placeTransactionPins(this.leaseCompPins);
        }
        else {
          this.toastr.error('No Result Found!');
          // alert("No result found");
        }
        this.Isloader = false;
      }
      else {
        this.Isloader = false;
        this.toastr.error('No Result Found!');
        // alert("No result found");
      }
      this.Isloader = false;
      this.IsRefreshloader = false;
      this.isViewportChange = false;
    });
  }
  setShape() {
    const instance = this;
    setTimeout(function () {
      if (!!instance._sharedDataService.leaseSearchCriteria &&
        !!instance._sharedDataService.leaseSearchCriteria.CircleRadius &&
        !!instance._sharedDataService.leaseSearchCriteria.CentreLatitude &&
        !!instance._sharedDataService.leaseSearchCriteria.CentreLongitude) {

        const circle = instance._mapService.DrawCircle(instance.map,
          instance._mapService.GetLatLng(
            instance._sharedDataService.leaseSearchCriteria.CentreLatitude,
            instance._sharedDataService.leaseSearchCriteria.CentreLongitude),
          (instance._sharedDataService.leaseSearchCriteria.CircleRadius / 0.00062137));

        instance.mapItems.Polygons.push(circle);
        instance.map.fitBounds(circle.getBounds());
        instance.isSelectDrawCircle = true;
      }

      let latlngArray;
      if (!!instance._sharedDataService.leaseSearchCriteria &&
        !!instance._sharedDataService.leaseSearchCriteria.LatlngArray) {
        latlngArray = JSON.parse(instance._sharedDataService.leaseSearchCriteria.LatlngArray);
        const polygon = instance._mapService.DrawPoly(instance.map, latlngArray);
        instance.mapItems.Polygons.push(polygon);
        instance._mapService.FitMapToPolygon(instance.map, polygon);
        instance.isSelectDrawPolyGon = true;
      }
    }, 2500);
  }
  showMapResults() {
    const instance = this;
    setTimeout(function () {
      if (!!instance.leaseCompPins) {
        instance.placeTransactionPins(instance.leaseCompPins);
        if (instance.leaseCompPins.length > 0) {
          instance._mapService.FitMapToMarkers(instance.map, instance.mapItems.MapPins);
          instance.GetCentralGeoCoordinate();
          instance.map.setCenter({
            lat: instance.lati,
            lng: instance.long
          });
          var zoomLevel = instance.map.getZoom();
          instance.map.setZoom(zoomLevel + 1);
          if (instance.map.getZoom() > 17) {
            instance.map.setZoom(17);
          }
        }
      }
    }, 200);
  }

  private clearShapes() {
    this.showClearBtn = false;
    this.isShapeOnMap = true;
    this._mapService.RightClick(this.map);
    for (let item of this.mapItems.Polygons) {
      item.setMap(null);
    }
    this.mapItems.Polygons = new Array<any>();
  }
  private clearMarkers() {
    if (this.mapItems.MapPins.length > 0) {
      for (const pin of this.mapItems.MapPins) {
        pin.setMap(null);
      }
      this.mapItems.MapPins = [];
    }
  }
  public GetCentralGeoCoordinate() {
    var x = 0;
    var y = 0;
    var z = 0;
    this.leaseCompPins.forEach(element => {
      var latitude = element.Latitude * Math.PI / 180;
      var longitude = element.Longitude * Math.PI / 180;
      x += Math.cos(latitude) * Math.cos(longitude);
      y += Math.cos(latitude) * Math.sin(longitude);
      z += Math.sin(latitude);
    });
    var total = this.leaseCompPins.length;

    x = x / total;
    y = y / total;
    z = z / total;

    var centralLongitude = Math.atan2(y, x);
    var centralSquareRoot = Math.sqrt(x * x + y * y);
    var centralLatitude = Math.atan2(z, centralSquareRoot);
    this.lati = centralLatitude * 180 / Math.PI;
    this.long = centralLongitude * 180 / Math.PI;
  }
   onSpecificUseSelected(data) {
    if (data.length > 0) {
      this.isSpecificUseSelected = true;
    } else {
      this.isSpecificUseSelected = false;
    }
  }

  onSearchResetClick(){
    this.showClearBtn = false;
    this.Isloader = false;
    this.isSelectDrawPolyGon= false;
    this.isSelectDrawCircle= false;
    this.isPropertyTypeSelected= false;
    this.isSpecificUseSelected= false; 
    this.isCitySelected= false;
    this.isPostalCodeSelected= false;
    this.isSearchClicked= false;
    this.isViewportChange= false;
    this.isPropertySizeSelected= false;
    this.isPropertyGradeSelected= false;
    this.isTenancySelected= false;
    this.isLeasedSqMSelected= false;
    this.isSignDateSelected= false;
    this.isSubleaseFilterSelected= false;
    this.isLandLordRepCompany= false;
    this.isTenantRepCompanySelected= false;
    this.isLandLordnameSelected= false;
    this.isTenantNameSelected= false;
    this.isDateCreatedSelected= false;
    this.isExecutionDateSelected = false;
    this.isExpiryDateSelected = false;
    this.isLeasedSqMSelected = false;
  
    this.isViewportChange = false;

    this.propertyTypes.forEach(type => {
      type.IsSelected = false;
    });

    this.SpecificUseList.forEach(type => {
      type.IsSelected = false;
    });
   
    this.propertyTypeArray= new Array<any>();
    this.specificUseArray= [];      
    this.PropertyGradesArray= [];      
    this.TenancyArray= [];      
    this.CityList= new Array<any>();
    this.cityArray= [];  
    this.ZipCodes= new Array<any>();
    this.zipCodeArray= []; 
    this.LandLordRepCompanyList= new Array<any>();
    this.landlordRepCompanyArray= [];  
    this.TenantRepCompanyList= new Array<any>();
    this.tenantRepCompanyArray = [];    
    this.TenantNameList= new Array<any>();
    this.tenantNameArray= [];       
    this.LandLordNameList= new Array<any>();
    this.landLordNameArray = [];    
  
    this.shapeOnMap = '';
    this.hasSearchResult= false;
    this.selectedPropertyId = 0;
    this.lastAction = null;
    this.SignDateMin = null;
    this.SignDateMax = null;
    this.ExecutionDateMin =null;
    this.ExecutionDateMax = null;
    this.DateCreatedMin = null;
    this.DateCreatedMax = null;
    this.ExpiryDateMin = null;
    this.ExpiryDateMax = null;
    this.LeasedSqMMax =null;
    this.LeasedSqMMin =null;
    this.PagerOffset =0;
    this.DateOccupiedMin=null;
    this.DateOccupiedMax=null;

    this.clearShapes();
    this.clearMarkers();
    this.setMap();
    
    this.leaseCompPins = [];
    this.leaseCompList = [];
    this.leaseCompCount = 0;
    this.leaseSearchCriteria = new LeaseSearchCriteria();

    this._sharedDataService.searchLeaseTransactionMap = null;
    this._sharedDataService.searchLeaseTransactionList = null;
    this._sharedDataService.leaseSearchResultCount = 0;
    this._sharedDataService.searchLeaseTransactionMap = null;
    this._sharedDataService.leaseSearchCriteria = new LeaseSearchCriteria();
    localStorage.removeItem('LeaseCurrentPage');
    // localStorage.removeItem('LeaseSearchResultList');
    // localStorage.removeItem('LeaseMapSearchResults');
    // localStorage.removeItem('LeaseSearchResultCount');
    // localStorage.removeItem('LeaseSearchCriteria');
    // localStorage.removeItem('SelectedPropertyLease');
    
    this.setInitValues();
  }
  closeLeaseModal()
  {

  }
  onDateChanged(field, value) {
    if (field == 'SignDateMin') {
      if (!value) {
        this.leaseSearchCriteria.SignDateMin = this.leaseSearchCriteria.SignDateMinFormat = null;
      }
      else {
        this.leaseSearchCriteria.SignDateMinFormat = value;
        this.leaseSearchCriteria.SignDateMin = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
      }
    }
    if (field == 'SignDateMax') {
      if (!value)
        this.leaseSearchCriteria.SignDateMax = this.leaseSearchCriteria.SignDateMaxFormat = null;
      else {
        this.leaseSearchCriteria.SignDateMaxFormat = value;
        this.leaseSearchCriteria.SignDateMax = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
      }
    }
    if (this.leaseSearchCriteria.SignDateMin || this.leaseSearchCriteria.SignDateMax) {
      this.isSignDateSelected = true;
    } else {
      this.isSignDateSelected = false;
    }

    if (field == 'ExecutionDateMin') {
      if (!value) {
        this.leaseSearchCriteria.ExecutionDateMin = this.leaseSearchCriteria.ExecutionDateMinFormat = null;
      }
      else {
        this.leaseSearchCriteria.ExecutionDateMinFormat = value;
        this.leaseSearchCriteria.ExecutionDateMin = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
      }
    }
    if (field == 'ExecutionDateMax') {
      if (!value)
        this.leaseSearchCriteria.ExecutionDateMax = this.leaseSearchCriteria.ExecutionDateMaxFormat = null;
      else {
        this.leaseSearchCriteria.ExecutionDateMaxFormat = value;
        this.leaseSearchCriteria.ExecutionDateMax = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
      }
    }
    if (this.leaseSearchCriteria.ExecutionDateMin || this.leaseSearchCriteria.ExecutionDateMax) {
      this.isExecutionDateSelected = true;
    } else {
      this.isExecutionDateSelected = false;
    }

    if (field == 'DateCreatedMin') {
      if (!value) {
        this.leaseSearchCriteria.DateCreatedMin = this.leaseSearchCriteria.DateCreatedMinFormat = null;
      }
      else {
        this.leaseSearchCriteria.DateCreatedMinFormat = value;
        this.leaseSearchCriteria.DateCreatedMin = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
      }
    }
    if (field == 'DateCreatedMax') {
      if (!value)
        this.leaseSearchCriteria.DateCreatedMax = this.leaseSearchCriteria.DateCreatedMaxFormat = null;
      else {
        this.leaseSearchCriteria.DateCreatedMaxFormat = value;
        this.leaseSearchCriteria.DateCreatedMax = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
      }
    }
    if (this.leaseSearchCriteria.DateCreatedMin || this.leaseSearchCriteria.DateCreatedMax) {
      this.isDateCreatedSelected = true;
    } else {
      this.isDateCreatedSelected = false;
    }

    if (field == 'ExpiryDateMin') {
      if (!value) {
        this.leaseSearchCriteria.ExpiryDateMin = this.leaseSearchCriteria.ExpiryDateMinFormat = null;
      }
      else {
        this.leaseSearchCriteria.ExpiryDateMinFormat = value;
        this.leaseSearchCriteria.ExpiryDateMin = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
      }
    }
    if (field == 'ExpiryDateMax') {
      if (!value)
        this.leaseSearchCriteria.ExpiryDateMax = this.leaseSearchCriteria.ExpiryDateMaxFormat = null;
      else {
        this.leaseSearchCriteria.ExpiryDateMaxFormat = value;
        this.leaseSearchCriteria.ExpiryDateMax = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
      }
    }
    if (this.leaseSearchCriteria.ExpiryDateMin || this.leaseSearchCriteria.ExpiryDateMax) {
      this.isExpiryDateSelected = true;
    } else {
      this.isExpiryDateSelected = false;
    }

    if (field == 'DateOccupiedMin') {
      if (!value) {
        this.leaseSearchCriteria.DateOccupiedMin = this.leaseSearchCriteria.DateOccupiedMinFormat = null;
      }
      else {
        this.leaseSearchCriteria.DateOccupiedMinFormat = value;
        this.leaseSearchCriteria.DateOccupiedMin = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
      }
    }
    if (field == 'DateOccupiedMax') {
      if (!value)
        this.leaseSearchCriteria.DateOccupiedMax = this.leaseSearchCriteria.DateOccupiedMaxFormat = null;
      else {
        this.leaseSearchCriteria.DateOccupiedMaxFormat = value;
        this.leaseSearchCriteria.DateOccupiedMax = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
      }
    }
    if (this.leaseSearchCriteria.DateOccupiedMin || this.leaseSearchCriteria.DateOccupiedMax) {
      this.isDateOccupiedSelected = true;
    } else {
      this.isDateOccupiedSelected = false;
    }
  }

  openNav() {
    this.CloseActionBtn = true;
    document.getElementById("MapSidenav").style.width = "30%";
    document.getElementById("MapSidenavWrap").style.width = "30%";
    if ($(window).width() < 767) {
      document.getElementById("MapSidenav").style.width = "65%";
      document.getElementById("MapSidenavWrap").style.width = "65%";
    }
    else {
      document.getElementById("MapSidenav").style.width = "30%";
      document.getElementById("MapSidenavWrap").style.width = "30%";
    }
    this.SideNav = true;
  }

  closeNav() {
    this.CloseActionBtn = false;
    document.getElementById("MapSidenav").style.width = "0";
    document.getElementById("MapSidenavWrap").style.width = "0";
    this.SideNav = false;
  }

  openDetailNav() {
    this.CloseActionBtnDetail = true;
    this.closeMultiDetailNav();
    let communicationModel = new CommunicationModel();
    communicationModel.Key = "OpenSingleLeaseTransactionModel";
    communicationModel.data = this.leaseInfo;
    this._CommService.broadcast(communicationModel);    

    document.getElementById("MapSidenavWrapDetail").style.width = "30%";
    document.getElementById("MapDetailSideBar").style.width = "30%";
    if ($(window).width() < 767) {
      document.getElementById("MapSidenavWrapDetail").style.width = "65%";
      document.getElementById("MapDetailSideBar").style.width = "65%";
    }
    else {
      document.getElementById("MapSidenavWrapDetail").style.width = "30%";
      document.getElementById("MapDetailSideBar").style.width = "30%";
    }
    this.SideDetailNav = true;
  }

  closeDetailNav() {
    this.CloseActionBtnDetail = false;
    document.getElementById("MapSidenavWrapDetail").style.width = "0";
    document.getElementById("MapDetailSideBar").style.width = "0";
    this.SideDetailNav = false;
  }

  openMultiDetailNav(propertyId) {
    this.closeDetailNav();
    this.CloseActionBtnMultiDetail = true;
    this._sharedDataService.selectedLeasePin = propertyId;
    let communicationModel = new CommunicationModel();
    communicationModel.Key = "OpenMultiLeaseTransactionModel";
    communicationModel.data = propertyId;
    this._CommService.broadcast(communicationModel);

    document.getElementById("MapSidenavWrapMultiDetail").style.width = "75%";
    document.getElementById("MapMultiDetailSideBar").style.width = "75%";
    if ($(window).width() < 767) {
      document.getElementById("MapMultiDetailSideBar").style.width = "75%";
      document.getElementById("MapSidenavWrapMultiDetail").style.width = "75%";
    }
    else {
      document.getElementById("MapMultiDetailSideBar").style.width = "48%";
      document.getElementById("MapSidenavWrapMultiDetail").style.width = "48%";
    }
    this.SideMultiDetailNav = true;
    
  }

  closeMultiDetailNav() {
    this.CloseActionBtnMultiDetail = false;
    document.getElementById("MapMultiDetailSideBar").style.width = "0";
    document.getElementById("MapSidenavWrapMultiDetail").style.width = "0";
    this.SideMultiDetailNav = false;
  }
  openLegent(){
    this.legentCloseActionBtn = true;
    document.getElementById("LegentDetailSideBar").style.width = "200px";
    document.getElementById("LegentSideBar").style.width = "200px";
  }
  closeLegent(){
    this.legentCloseActionBtn = false;
    document.getElementById("LegentDetailSideBar").style.width = "0";
    document.getElementById("LegentSideBar").style.width = "0";
  }
  showResultGrid() {

  }

  showGalleryView() {

  }
  clearPolygon() {
    this.showClearBtn = false;
    this.isShapeOnMap = true;
    for (let item of this.mapItems.Polygons) {
      item.setMap(null);
    }
    this.mapItems.Polygons = new Array<any>();
    this.DrawShape(this.lastAction);
  }

  checkValidations() {
    this.PropertySizeMinError = false;
    this.ExecutionDateMinError = false;
    this.SignDateMinError=false;
    this.DateCreatedMinError = false;
    this.ExpiryDateMinError = false;
    this.LeasedSqMMinError = false;
    this.DateOccupiedMinError = false;

    if ((this.leaseSearchCriteria.PropertySizeMin && this.leaseSearchCriteria.PropertySizeMax) && (this.leaseSearchCriteria.PropertySizeMin > this.leaseSearchCriteria.PropertySizeMax)) {
      this.PropertySizeMinError = true;
    }
    
    if((this.leaseSearchCriteria.ExecutionDateMin && this.leaseSearchCriteria.ExecutionDateMax) && (Date.parse(this.leaseSearchCriteria.ExecutionDateMin) > Date.parse(this.leaseSearchCriteria.ExecutionDateMax))) {
      this.ExecutionDateMinError = true;
    }
    if((this.leaseSearchCriteria.SignDateMin && this.leaseSearchCriteria.SignDateMax) && (Date.parse(this.leaseSearchCriteria.SignDateMin) > Date.parse(this.leaseSearchCriteria.SignDateMax))) {
      this.SignDateMinError = true;
    }
    if((this.leaseSearchCriteria.DateCreatedMin && this.leaseSearchCriteria.DateCreatedMax) && (Date.parse(this.leaseSearchCriteria.DateCreatedMin) > Date.parse(this.leaseSearchCriteria.DateCreatedMax))) {
      this.DateCreatedMinError = true;
    }
    if((this.leaseSearchCriteria.ExpiryDateMin && this.leaseSearchCriteria.ExpiryDateMax) && (Date.parse(this.leaseSearchCriteria.ExpiryDateMin) > Date.parse(this.leaseSearchCriteria.ExpiryDateMax))) {
      this.ExpiryDateMinError = true;
    }
    if((this.LeasedSqMMin && this.LeasedSqMMax) && (Math.trunc(this.LeasedSqMMin) > Math.trunc(this.LeasedSqMMax))){
      this.LeasedSqMMinError = true;
    }
    if((this.leaseSearchCriteria.DateOccupiedMin && this.leaseSearchCriteria.DateOccupiedMax) && (Date.parse(this.leaseSearchCriteria.DateOccupiedMin) > Date.parse(this.leaseSearchCriteria.DateOccupiedMax))) {
      this.DateOccupiedMinError = true;
    }

  }

}
