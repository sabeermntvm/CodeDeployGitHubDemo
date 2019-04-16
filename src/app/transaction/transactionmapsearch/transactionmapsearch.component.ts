import { Component, OnInit } from '@angular/core';
import { MapOptions } from '../../core/models/MapOptions';
import { MapService } from '../../core/services/map-service.service';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import { Property } from '../../core/models/Property';
import { fadeInContent } from '@angular/material';
import * as MapEnum from '../../core/models/MapEnum';
import { MapType } from '../../core/models/MapEnum';
import { LoginService } from '../../core/services/login.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedDataService } from '../../core/services/shareddata.service';
import { LookupService } from '../../core/services/lookup.service';
import { PropertyService } from '../../core/services/api-property.service';
import { MapItem } from '../../core/models/MapItem';
import { DrawMode } from '../../core/models/MapEnum';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionSearchCriteria } from '../../core/models/TransactionSearchCriteria';
import { Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { MapBound } from '../../core/models/mapBound';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import pageSettings from '../../config/page-settings';
import { NullVisitor } from '@angular/compiler/src/render3/r3_ast';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
declare var google: any;
declare var $: any;

@Component({
  selector: 'app-transactionmapsearch',
  templateUrl: './transactionmapsearch.component.html',
  styleUrls: ['./transactionmapsearch.component.css']
})
export class TransactionmapsearchComponent implements OnInit {

  pageSettings;
  SideNav: boolean;
  SideDetailNav: boolean;
  SideMultiDetailNav: boolean;
  value: any[];
  lat: number = -34.08417788518130;
  lng: number = 150.82839500159000;
  items: Array<string> = ['Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
    'Zagreb', 'Zaragoza', 'Łódź'];
  public mapOptions: MapOptions;
  public map: any;
  private _mapService: MapService;
  private mapItems: MapItem;
  private propertyDetails: Property;
  private markers: Array<any> = new Array<any>();
  Isloader: boolean = false;
  IsRefreshloader: boolean = false;
  SaleDateMin: NgbDateStruct;
  SaleDateMax: NgbDateStruct;

  // public isSaleSelected: boolean = false;
  // public isLeaseSelected: boolean = false;
  public isMapSearch: boolean = true;
  public isShapeOnMap: boolean = false;
  public isSelectDrawPolyGon: boolean = false;
  public isSelectDrawCircle: boolean = false; 
  public isPercOccupiedSelected: boolean = false;
  public isNetOperatingIncomeSelected: boolean = false;
  // Location
  public isCountrySelected: boolean = false;
  public isMarketSelected: boolean = false;
  public isSubMarketSelected: boolean = false;
  public isCitySelected: boolean = false;
  public isPostalCodeSelected: boolean = false;
  public isBuyerSelected: boolean = false;
  public isSellerSelected: boolean = false;
  public showCountryEdit: boolean = false;
  public showMarketEdit: boolean = false;
  public showSubMarketEdit: boolean = false;
  public showCityEdit: boolean = false;
  public showPostalCodeEdit: boolean = false;

  public propertyTypes: any;
  public isPropertyTypeSelected: boolean = false;
  public propertyTypeArray: any;

  public specificUseList: Array<any>;
  public isSpecificUseSelected: boolean = false;
  public specificUseArray: any;

  public isSalePriceSelected: boolean = false;
  public isAskingPriceSelected: boolean = false;
  public isSoldSMSelected: boolean = false;
  public isContactSelected: boolean = false;
  public isSaleDateSelected: boolean = false;
  public isCapRateSelected: boolean = false;

  displayProperties: Array<any>;
  propertyResultCount: number = 0;
  public searchCriteria: TransactionSearchCriteria;
  public transactionResultCount: number;
  private transactionList: Array<any>;
  private transactionPins: Array<any>;
  private lastAction: string;
  public shapeOnMap: string = '';
  public showGrid: boolean = false;
  isViewportChange: boolean = false;
  isSearchClicked: boolean = false;

  public transactionInfo: any;
  public transactionTitle: string;

  public propertyTitle: string;
  public testClass: string = 'multiple-transaction';
  public selectedPropertyId: number;
  public showMultipleTransactionDetails: boolean = false;
  selectedListingType: string = "sale"; //sale, lease, all
  formatOptions: any;

  companies: any = [];
  companyInput = new Subject<string>();
  companyLoading = false;

  cityInput = new Subject<string>();
  cityLoading: boolean = false;
  CityList: Array<any>;
  cityArray: any;

  zipcodeInput = new Subject<string>();
  buyerCompanyInput = new Subject<string>();
  sellerCompanyInput = new Subject<string>();
  zipcodeLoading: boolean = false;
  buyerLoading: boolean = false;
  sellerLoading: boolean = false;
  ZipCodes: Array<any>;
  buyerArray: Array<any>;
  sellerArray: Array<any>;
  zipCodeArray: any;
  selectedBuyerArray: any;
  selectedSellerArray: any;
  marketArray: any;
  subMarketArray: any;
  CloseActionBtn: boolean;
  CloseActionBtnDetail: boolean;
  CloseActionBtnMultiDetail: boolean;
  legentCloseActionBtn: boolean = false;
  isDataReady: boolean = false;
  lati: any;
  long: any;
  transactionSearchForm :FormGroup;
  SoldSpaceMin: number = null;
  SoldSpaceMax: number = null;
  showClearBtn: boolean = false;
  saleConditions: Array<any> = [];
  saleTypes: Array<any> = [];
  saleTypeArray: any;
  isSaleTypeSelected: boolean = false;
  saleConditionArray: any;
  isSaleConditionSelected: boolean = false;
  currentDate=new Date;
  SalePriceMinError : boolean = false;
  AskingPriceMinError : boolean = false;
  SoldSpaceMinError: boolean = false;
  SaleDateMinError : boolean = false;
  CapRateMinError: boolean = false;
  NetOperatingIncomeMinError : boolean = false;
  PercentageOccupiedMinError : boolean = false;
  minDate={year:this.currentDate.getFullYear()-75,month:1,day:1};
  maxDate={year:this.currentDate.getFullYear(),month:this.currentDate.getMonth()+1,day:this.currentDate.getDate()};
  PagerOffset :number;
  
  constructor(private _router: Router
    , private _communicationService: CommunicationService
    , private _sharedDataService: SharedDataService
    , private _lookupService: LookupService
    , private route: ActivatedRoute
    , private mapService: MapService
    , private _loginService: LoginService
    , private propertyService: PropertyService
    , private _commService: CommunicationService
    , private transactionService: TransactionService
    , private toastr: ToastrService) {
    this.formatOptions = { prefix: '', precision: 0 };
    this._mapService = mapService;
    this.mapItems = new MapItem();
    this.specificUseList = [];
    this.marketArray = [];
    this.subMarketArray = [];
    this.searchCriteria = new TransactionSearchCriteria();
    this.showGrid = false;
    this.searchCriteria.ListingType = this.selectedListingType;
    

    if (!!localStorage.getItem('allSpecificUses')) {
      this._sharedDataService.specificUses = JSON.parse(localStorage.getItem('allSpecificUses'));
    }
    if (!this._sharedDataService.specificUses) {
      this.getAllSpecificUses();
    }

    if (!!this._sharedDataService.propertyTypes && this._sharedDataService.propertyTypes.length > 0) {
      this.propertyTypes = this._sharedDataService.propertyTypes;
    } else {
      this.getPropertyType();
    }
    if (!!this._sharedDataService.saleConditionsList && this._sharedDataService.saleConditionsList.length > 0) {
      this.saleConditions = this._sharedDataService.saleConditionsList;
    } else {
      this.getSaleCondition();
    }
    if (!!this._sharedDataService.saleTypesList && this._sharedDataService.saleTypesList.length > 0) {
      this.saleTypes = this._sharedDataService.saleTypesList;
    } else {
      this.getSaleType();
    }
  }

  ngOnInit() {
    this.pageSettings = pageSettings;
    this.pageSettings.pageSidebarMinified = true;
    this.openNav();
    this.setMap();
    this.initializeSearchCriteria();

    this.transactionSearchForm = new FormGroup({
      'PropertyType': new FormControl(''),
      'SalePriceMin': new FormControl(''),
      'SalePriceMax': new FormControl(''),
      'AskingPriceMin': new FormControl(''),
      'AskingPriceMax': new FormControl(''),
     'SoldSpaceMin': new FormControl(''),
     'SoldSpaceMax': new FormControl(''),
     'selectedSellerArray': new FormControl(''),
     'selectedBuyerArray':new FormControl(''),
     'SaleDateMin': new FormControl(''),
     'SaleDateMax': new FormControl(''),
     'SaleTypeCondition': new FormControl(''),
     'CapRateMin': new FormControl('',Validators.compose([Validators.min(1),Validators.max(100),Validators.pattern('^[0-9]*$')])),
     'CapRateMax': new FormControl('',Validators.compose([Validators.min(1),Validators.max(100),Validators.pattern('^[0-9]*$')])),
     'NetOperatingIncomeMin': new FormControl(''),
     'NetOperatingIncomeMax': new FormControl(''),
     'PercentageOccupiedMax': new FormControl('',Validators.compose([Validators.min(1),Validators.max(100),Validators.pattern('^[0-9]*$')])),
     'PercentageOccupiedMin': new FormControl('',Validators.compose([Validators.min(1),Validators.max(100),Validators.pattern('^[0-9]*$')])),
     'cityArray': new FormControl(''),
     'zipCodeArray': new FormControl(''),
     'propertyTypeArray': new FormControl(''),
     'specificUseArray': new FormControl(''),
     'saleTypeArray': new FormControl(''),
     'saleConditionArray': new FormControl('')
     
    });

    if (!!this._sharedDataService.searchTransactionMap) {
     // this._sharedDataService.searchTransactionMap = JSON.parse(localStorage.getItem('TransactionMapSearchResults'));
      this.transactionPins = this._sharedDataService.searchTransactionMap;
    }

    this.transactionList = this._sharedDataService.searchTransactions;
    this.transactionResultCount = this._sharedDataService.transactionSearchResultCount;
    if (!!this._sharedDataService.searchTransactionMap) {
      this.setShape();
      this.showMapResults();
    }

    if (this.transactionResultCount) {
      this.isSearchClicked = true;
    }
    this.companyInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.companyLoading = true;
      const response_Companies = this._lookupService.SearchCompanyList(value, this._loginService.UserInfo.EntityID);
      response_Companies.subscribe(result => {
        this.companies = JSON.parse(result['_body']).responseData || [];
        this.companyLoading = false;
      });

    });
    this.cityInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchCriteria.citySearchText = value;
      if (!!this.searchCriteria.citySearchText) {
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
      this.searchCriteria.zipcodeSearchText = value;
      if (!!this.searchCriteria.zipcodeSearchText) {
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
    
    this.buyerCompanyInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
        this.buyerLoading = true;
        const response_buyer = this._lookupService.SearchCompanyList(value, null);
        response_buyer.subscribe(result => {
          this.buyerArray = JSON.parse(result['_body']).responseData || [];
          this.buyerLoading = false;
        });
    });
    
    this.sellerCompanyInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
        this.sellerLoading = true;
        const response_seller = this._lookupService.SearchCompanyList(value, null);
        response_seller.subscribe(result => {
          this.sellerArray = JSON.parse(result['_body']).responseData || [];
          this.sellerLoading = false;
        });
    });
    if(!!this._sharedDataService.selectedSalePin){
      if(this._sharedDataService.IsSinglePin==true){
      this.openDetailNav();
    }
    else{
      this.openMultiDetailNav(this._sharedDataService.selectedSalePin);
    }
  }
  }

  setInitValues() {
    this.searchCriteria.ListingType = this.selectedListingType = "sale";
    // this.isSaleSelected = true;
    // this.isLeaseSelected = false;

    this.searchCriteria.StartingIndex = 1;
    this.searchCriteria.OffsetValue = !this.PagerOffset ? 100 : this.PagerOffset ;
    this.searchCriteria.CountryId = this._loginService.UserInfo.CountryID;
    this.searchCriteria.SortBy = "SaleID";
    this.searchCriteria.SortDirection = "Ascending";
    this.searchCriteria.IsMapSearch = false;
    this.searchCriteria.PolygonText = "";
    this.searchCriteria.CentreLatitude = null;
    this.searchCriteria.CentreLongitude = null;
    this.searchCriteria.CircleRadius = null;

  }
  initializeSearchCriteria() {
    this.setInitValues();

    if (!!this._sharedDataService.transactionSearchCriteria) {
      this.searchCriteria = this._sharedDataService.transactionSearchCriteria;
      if (!!this.searchCriteria.PropertyType) {
        this.isPropertyTypeSelected = true;
        this.propertyTypeArray = this.stringToArray(this.searchCriteria.PropertyType);
        if (this.propertyTypeArray) {
          this.propertyTypeArray.forEach(value => {
            this.getSpecificUseList(value);
          });
          if (!!this.searchCriteria.SpecificUseId) {
            this.specificUseArray = this.stringToArray(this.searchCriteria.SpecificUseId);
            this.isSpecificUseSelected = true;
          }
        }
      }
      else {
        this.isPropertyTypeSelected = false;
        this.isSpecificUseSelected = false;
      }

      if (!!this.searchCriteria.CityId) {
        this.isCitySelected = true;
        this.cityArray = this.stringToArray(this.searchCriteria.CityId);
      }
      if (!!this.searchCriteria.ZipCode) {
        this.isPostalCodeSelected = true;
        this.zipCodeArray = this.stringToArray(this.searchCriteria.ZipCode);
      }
      if (!!this.searchCriteria.buyer) {
        this.isBuyerSelected = true;
        this.selectedBuyerArray = this.stringToArray(this.searchCriteria.buyer);
      }
      if (!!this.searchCriteria.seller) {
        this.isSellerSelected = true;
        this.selectedSellerArray = this.stringToArray(this.searchCriteria.seller);
      }
      if (!!this.searchCriteria.citySearchText) {
        this.getCity(this.searchCriteria.citySearchText);
      }
      if (!!this.searchCriteria.zipcodeSearchText) {
        this.getZipCodes(this.searchCriteria.zipcodeSearchText);
      }
      if (!!this.searchCriteria.SaleDateMin) {
        this.SaleDateMin = this.searchCriteria.SaleDateMinFormat;
      }
      if (!!this.searchCriteria.SaleDateMax) {
        this.SaleDateMax = this.searchCriteria.SaleDateMaxFormat;
      }
      if (this.searchCriteria.SaleDateMin || this.searchCriteria.SaleDateMax) {
        this.isSaleDateSelected = true;
      } else {
        this.isSaleDateSelected = false;
      }
      if (!!this.searchCriteria.SaleType) {
        this.isSaleTypeSelected = true;
        this.saleTypeArray = this.stringToArray(this.searchCriteria.SaleType);
      }
      if (!!this.searchCriteria.SaleCondition) {
        this.isSaleConditionSelected = true;
        this.saleConditionArray = this.stringToArray(this.searchCriteria.SaleCondition);
      }


      if (!!this.searchCriteria.SoldSFMax && (!this.SoldSpaceMax || this.searchCriteria.SoldSFMax == this.SoldSpaceMax))
        this.SoldSpaceMax = this.propertyService.convertUnit(this.searchCriteria.CountryId, 'SF', 'SqM', this.searchCriteria.SoldSFMax);

      if (!!this.searchCriteria.SoldSFMin && (!this.SoldSpaceMin || this.searchCriteria.SoldSFMin == this.SoldSpaceMin))
        this.SoldSpaceMin = this.propertyService.convertUnit(this.searchCriteria.CountryId, 'SF', 'SqM', this.searchCriteria.SoldSFMin);



      this.onBlurMethod();
    }

    if (!!this.SoldSpaceMax)
      this.searchCriteria.SoldSFMax = this.propertyService.convertUnit(this.searchCriteria.CountryId, "SqM", "SF", this.SoldSpaceMax)
    else
      this.searchCriteria.SoldSFMax = null;

    if (!!this.SoldSpaceMin)
      this.searchCriteria.SoldSFMin = this.propertyService.convertUnit(this.searchCriteria.CountryId, "SqM", "SF", this.SoldSpaceMin)
    else
      this.searchCriteria.SoldSFMin = null;
  }

  onDateChanged(field, value) {
    if (field == 'SaleDateMin') {
      if (!value) {
        this.searchCriteria.SaleDateMin = this.searchCriteria.SaleDateMinFormat = null;
      }
      else {
        this.searchCriteria.SaleDateMinFormat = value;
        this.searchCriteria.SaleDateMin = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
      }
    }
    if (field == 'SaleDateMax') {
      if (!value)
        this.searchCriteria.SaleDateMax = this.searchCriteria.SaleDateMinFormat = null;
      else {
        this.searchCriteria.SaleDateMaxFormat = value;
        this.searchCriteria.SaleDateMax = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
      }
    }
    if (this.searchCriteria.SaleDateMin || this.searchCriteria.SaleDateMax) {
      this.isSaleDateSelected = true;
    } else {
      this.isSaleDateSelected = false;
    }
  }

  onBlurMethod() {
    if (this.searchCriteria.SalePriceMin || this.searchCriteria.SalePriceMax) {
      this.isSalePriceSelected = true;
    } else {
      this.isSalePriceSelected = false;
    }
    if (this.searchCriteria.AskingPriceMin || this.searchCriteria.AskingPriceMax) {
      this.isAskingPriceSelected = true;
    } else {
      this.isAskingPriceSelected = false;
    }
    if (this.SoldSpaceMin || this.SoldSpaceMax) {
      this.isSoldSMSelected = true;
    } else {
      this.isSoldSMSelected = false;
    }
    if (!this.SoldSpaceMin) {
      this.SoldSpaceMin = null;
      if (!!this._sharedDataService.transactionSearchCriteria)
        this._sharedDataService.transactionSearchCriteria.SoldSFMin = null;
    }
    if (!this.SoldSpaceMax) {
      this.SoldSpaceMax = null;
      if (!!this._sharedDataService.transactionSearchCriteria)
        this._sharedDataService.transactionSearchCriteria.SoldSFMax = null;
    }

    if (this.searchCriteria.Contacts) {
      this.isContactSelected = true;
    } else {
      this.isContactSelected = false;
    }
    if (this.searchCriteria.CapRateMin || this.searchCriteria.CapRateMax) {
      this.isCapRateSelected = true;
    } else {
      this.isCapRateSelected = false;
    }
    if (this.searchCriteria.SaleCondition) {
      this.isSaleConditionSelected = true;
    }
    else
      this.isSaleConditionSelected = false;

    if (this.searchCriteria.SaleType) {
      this.isSaleTypeSelected = true;
    }
    else
      this.isSaleTypeSelected = false;

    if (this.searchCriteria.PercentageOccupiedMin || this.searchCriteria.PercentageOccupiedMax) {
      this.isPercOccupiedSelected = true;
    } else {
      this.isPercOccupiedSelected = false;
    }
    if (this.searchCriteria.NetOperatingIncomeMax || this.searchCriteria.NetOperatingIncomeMin) {
      this.isNetOperatingIncomeSelected = true;
    } else {
      this.isNetOperatingIncomeSelected = false;
    }

  }

  public getSpecificUseList(propertyTypeId) {
    this._sharedDataService.specificUses.forEach(specific => {
      if (specific.UseTypeID == propertyTypeId) {
        if (!!this.propertyTypes) {
          this.propertyTypes.forEach(prop => {
            if (prop.UseTypeID == propertyTypeId)
              specific.PropertyTypeName = prop.UseTypeName;
          });
        }
        this.specificUseList.push(specific);
      }
    });

  }

  refreshResults() {
    this.IsRefreshloader = true;
    this.setCriteriaLatLng();
    this.fetchViewPortProperties();
  }
  ViewPortChangeCheck() {
    this._mapService.OnMapViewPortChangedOnce(this.map, (boundProperties: MapBound) => {
      if (this.isSearchClicked) {
        this.isViewportChange = true;
      }
      this.ViewPortChangeCheck();
    });
  }
  private setCriteriaLatLng() {
    if (this.map) {
      let boundProps = this._mapService.getBoundary(this.map);
      this.searchCriteria.SWLat = boundProps.SouthWest.Latitude;
      this.searchCriteria.SWLng = boundProps.SouthWest.Longitude;
      this.searchCriteria.NELat = boundProps.NorthEast.Latitude;
      this.searchCriteria.NELng = boundProps.NorthEast.Longitude;
    }
  };
  setMap() {
    const instance = this;
    setTimeout(function () {

      const mapOptions = new MapOptions('mainmap');
      mapOptions.SetBasicOptions(MapEnum.MapType.Roadmap, 14, 7, null, instance._loginService.UserInfo.MetroCentroidLat, instance._loginService.UserInfo.MetroCentroidLong);
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

  setShape() {
    const instance = this;
    setTimeout(function () {
      if (!!instance._sharedDataService.transactionSearchCriteria &&
        !!instance._sharedDataService.transactionSearchCriteria.CircleRadius &&
        !!instance._sharedDataService.transactionSearchCriteria.CentreLatitude &&
        !!instance._sharedDataService.transactionSearchCriteria.CentreLongitude) {

        const circle = instance._mapService.DrawCircle(instance.map,
          instance._mapService.GetLatLng(
            instance._sharedDataService.transactionSearchCriteria.CentreLatitude,
            instance._sharedDataService.transactionSearchCriteria.CentreLongitude),
          (instance._sharedDataService.transactionSearchCriteria.CircleRadius / 0.00062137));

        instance.mapItems.Polygons.push(circle);
        instance.map.fitBounds(circle.getBounds());
        instance.isSelectDrawCircle = true;
      }

      let latlngArray;
      if (!!instance._sharedDataService.transactionSearchCriteria &&
        !!instance._sharedDataService.transactionSearchCriteria.LatlngArray) {
        latlngArray = JSON.parse(instance._sharedDataService.transactionSearchCriteria.LatlngArray);
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
      if (!!instance.transactionPins) {
        instance.placeTransactionPins(instance.transactionPins);
        if (instance.transactionPins.length > 0) {
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

  public GetCentralGeoCoordinate() {
    var x = 0;
    var y = 0;
    var z = 0;
    this.transactionPins.forEach(element => {
      var latitude = element.Latitude * Math.PI / 180;
      var longitude = element.Longitude * Math.PI / 180;
      x += Math.cos(latitude) * Math.cos(longitude);
      y += Math.cos(latitude) * Math.sin(longitude);
      z += Math.sin(latitude);
    });
    var total = this.transactionPins.length;

    x = x / total;
    y = y / total;
    z = z / total;

    var centralLongitude = Math.atan2(y, x);
    var centralSquareRoot = Math.sqrt(x * x + y * y);
    var centralLatitude = Math.atan2(z, centralSquareRoot);
    this.lati = centralLatitude * 180 / Math.PI;
    this.long = centralLongitude * 180 / Math.PI;
  }
  public onSearchClick() {
   if(this.transactionSearchForm.valid && !this.SalePriceMinError && !this.AskingPriceMinError && !this.SoldSpaceMinError && !this.SaleDateMinError && !this.CapRateMinError && !this.NetOperatingIncomeMinError && !this.PercentageOccupiedMinError){
    this.showClearBtn = false;
    this.transactionPins = [];
    this.transactionList = [];
    this.transactionResultCount = 0;

    this._sharedDataService.searchTransactionMap = null;
    this._sharedDataService.searchTransactions = null;
    this._sharedDataService.transactionSearchResultCount = 0;

    // localStorage.removeItem('TransactionSearchResult');
    // localStorage.removeItem('TransactionMapSearchResults');
    // localStorage.removeItem('TransactionSearchResultCount');
    this.clearMarkers();

    this.Isloader = true;
    this.isSearchClicked = true;
    localStorage.setItem('transactionpage', JSON.stringify(1));
    this.searchCriteria.SpecificUseId = this.arrayToString(this.specificUseArray);
    this.searchCriteria.PropertyType = this.arrayToString(this.propertyTypeArray);
    this.searchCriteria.CityId = this.arrayToString(this.cityArray);
    this.searchCriteria.ZipCode = this.arrayToString(this.zipCodeArray);
    this.searchCriteria.SaleType = this.arrayToString(this.saleTypeArray);
    this.searchCriteria.SaleCondition = this.arrayToString(this.saleConditionArray);
    this.searchCriteria.buyer = this.arrayToString(this.selectedBuyerArray);
    this.searchCriteria.seller = this.arrayToString(this.selectedSellerArray);
    this.searchCriteria.IsMapSearch = true;
    this.searchCriteria.OffsetValue =!this.PagerOffset ? 100 : this.PagerOffset;
    if (!!this.SoldSpaceMax)
      this.searchCriteria.SoldSFMax = this.propertyService.convertUnit(this.searchCriteria.CountryId, "SqM", "SF", this.SoldSpaceMax)
    else
      this.searchCriteria.SoldSFMax = null;

    if (!!this.SoldSpaceMin)
      this.searchCriteria.SoldSFMin = this.propertyService.convertUnit(this.searchCriteria.CountryId, "SqM", "SF", this.SoldSpaceMin)
    else
      this.searchCriteria.SoldSFMin = null;

    const instance = this;
    let latlngArray;
    if (this.isMapSearch) {
      this.searchCriteria.IsMapSearch = true;
      if (!!this.SoldSpaceMax)
        this.searchCriteria.SoldSFMax = this.propertyService.convertUnit(this.searchCriteria.CountryId, "SqM", "SF", this.SoldSpaceMax)
      else
        this.searchCriteria.SoldSFMax = null;
  
      if (!!this.SoldSpaceMin)
        this.searchCriteria.SoldSFMin = this.propertyService.convertUnit(this.searchCriteria.CountryId, "SqM", "SF", this.SoldSpaceMin)
      else
        this.searchCriteria.SoldSFMin = null;
   
      const instance = this;
      let latlngArray;
      if (this.isMapSearch) {
        this.searchCriteria.IsMapSearch = true;
  
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
            const result = this.transactionService.saleTransactionSearch(this.searchCriteria);
            result.subscribe(item => {
              if (!JSON.parse(item['_body']).error && JSON.parse(item['_body']).responseData != null) {
                this.transactionPins = JSON.parse(item['_body']).responseData.Transaction[0];
                this.transactionList = JSON.parse(item['_body']).responseData.Transaction[0];
                this.transactionResultCount = JSON.parse(item['_body']).responseData.Transaction[1][0].Total_Count;
                this.PagerOffset = JSON.parse(item['_body']).responseData.Transaction[2][0] ? JSON.parse(item['_body']).responseData.Transaction[2][0].PagerOffset : 0;
                  
                this._sharedDataService.searchTransactionMap = this.transactionPins;
                this._sharedDataService.searchTransactions = this.transactionList;
                this._sharedDataService.transactionSearchResultCount = this.transactionResultCount;
                this._sharedDataService.transactionSearchCriteria.OffsetValue = !this.PagerOffset ? 100 : this.PagerOffset ;
  
              //  localStorage.setItem('TransactionMapSearchResults', JSON.stringify(this.transactionPins));
              //  localStorage.setItem('TransactionSearchResult', JSON.stringify(this.transactionList));
              //  localStorage.setItem('TransactionSearchResultCount', JSON.stringify(this.transactionResultCount));
  
                if (this.transactionPins.length > 0) {
                  this.placeTransactionPins(this.transactionPins);
                  this._mapService.FitMapToMarkers(this.map, this.mapItems.MapPins);
                  this.map.setCenter({
                    lat: this.lati,
                    lng: this.long
                  });
                  var zoomLevel = instance.map.getZoom();
                  instance.map.setZoom(zoomLevel + 1);
                }
                else {
                  this.toastr.error('No result found!');
                }
              }
              else {
                this.toastr.error('No result found!');
              }
              this.Isloader = false;
            });
            break;
          case 'circle':
            this.shapeOnMap = 'circle';
            // To retain search criteria.
            let overlay;
            if (!!this._sharedDataService.transactionSearchCriteria) {
              if (!!this._sharedDataService.transactionSearchCriteria.CircleRadius &&
                !!this._sharedDataService.transactionSearchCriteria.CentreLatitude &&
                !!this._sharedDataService.transactionSearchCriteria.CentreLongitude) {
                overlay = new Object;
                overlay.center = this._mapService.GetLatLng(
                  this._sharedDataService.transactionSearchCriteria.CentreLatitude, this._sharedDataService.transactionSearchCriteria.CentreLongitude)
                overlay.radius = this._sharedDataService.transactionSearchCriteria.CircleRadius / 0.00062137;
  
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
            this.searchCriteria.CentreLatitude = overlay.center.lat();
            this.searchCriteria.CentreLongitude = overlay.center.lng();
  
            this.searchCriteria.CircleRadius = overlay.radius * 0.00062137; // convert meter to miles.
            this.fetchViewPortProperties();
            break;
          case 'polygon':
            this.shapeOnMap = 'polygon';
  
            // To retain search criteria.
            if (!!this._sharedDataService.transactionSearchCriteria) {
              if (!!this._sharedDataService.transactionSearchCriteria.LatlngArray) {
                latlngArray = JSON.parse(this._sharedDataService.transactionSearchCriteria.LatlngArray);
  
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
            this.searchCriteria.LatlngArray = JSON.stringify(latlngArray);
            let polyText = '';
            polyText = 'POLYGON((';
            geoloc.forEach(function (item, index) {
              polyText += (item.lng + ' ' + item.lat + ',');
            });
            polyText += geoloc[0].lng + ' ' + geoloc[0].lat + '))';
  
            this.searchCriteria.PolygonText = polyText;
            this.fetchViewPortProperties();
            break;
        }
        this._sharedDataService.transactionSearchCriteria = this.searchCriteria;
      } else {
        const result = this.transactionService.saleTransactionSearch(this.searchCriteria);
        result.subscribe(item => {
          this.transactionPins = JSON.parse(item['_body']).responseData.Transaction[0];
          this.transactionList = JSON.parse(item['_body']).responseData.Transaction[0];
          this.transactionResultCount = JSON.parse(item['_body']).responseData.Transaction[1][0].Total_Count;
          this.PagerOffset = JSON.parse(item['_body']).responseData.Transaction[2][0] ? JSON.parse(item['_body']).responseData.Transaction[2][0].PagerOffset : 0;
            
          this._sharedDataService.searchTransactionMap = this.transactionPins;
          this._sharedDataService.searchTransactions = this.transactionList;
          this._sharedDataService.transactionSearchResultCount = this.transactionResultCount;
          this._sharedDataService.transactionSearchCriteria.OffsetValue = !this.PagerOffset ? 100 : this.PagerOffset ;

          if (this.transactionList.length > 0)
            this.showGrid = true;
          else
            this.toastr.error('No result found!');
        });
      }
  
      this._sharedDataService.transactionSearchCriteria = this.searchCriteria;
     // localStorage.setItem('TransactionSearchCriteria', JSON.stringify(this.searchCriteria));
    }
    }
  }
  
  fetchViewPortProperties() {
    const searchResult = this.transactionService.saleTransactionSearch(this.searchCriteria);
    searchResult.subscribe(item => {
      if (!JSON.parse(item['_body']).error && JSON.parse(item['_body']).responseData != null) {
        this.transactionPins = JSON.parse(item['_body']).responseData.Transaction[0];
        this.transactionList = JSON.parse(item['_body']).responseData.Transaction[0];
        this.transactionResultCount = JSON.parse(item['_body']).responseData.Transaction[1][0].Total_Count;
        this.PagerOffset = JSON.parse(item['_body']).responseData.Transaction[2][0] ? JSON.parse(item['_body']).responseData.Transaction[2][0].PagerOffset : 0;
          
        this._sharedDataService.searchTransactionMap = this.transactionPins;
        this._sharedDataService.searchTransactions = this.transactionList;
        this._sharedDataService.transactionSearchResultCount = this.transactionResultCount;
        this._sharedDataService.transactionSearchCriteria.OffsetValue = !this.PagerOffset ? 100 : this.PagerOffset ;

       // localStorage.setItem('TransactionMapSearchResults', JSON.stringify(this.transactionPins));
      //  localStorage.setItem('TransactionSearchResult', JSON.stringify(this.transactionList));
       // localStorage.setItem('TransactionSearchResultCount', JSON.stringify(this.transactionResultCount));
        if (this.transactionPins.length > 0) {
          this.placeTransactionPins(this.transactionPins);
        }
        else {
          this.toastr.error('No result found!');
        }
        this.Isloader = false;
      }
      else {
        this.Isloader = false;
        this.toastr.error('No result found!');
      }
      this.Isloader = false;
      this.IsRefreshloader = false;
      this.isViewportChange = false;
    });
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
      return "";
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

  private placeTransactionPins(transactionArray: Array<any>) {
    const instance = this;
    this.clearMarkers();

    if (transactionArray.length > 0) {
      var bounds = new google.maps.LatLngBounds();
      for (const transaction of transactionArray) {
        const marker = this.placeMarker(transaction);

        instance._mapService.OnMarkerClick(marker, function (event, marker1, latlng) {
          instance.SideDetailNav = false;
          instance.transactionInfo = new Object();
          instance.transactionInfo = transaction;
          instance.transactionTitle = transaction.PropertyName;
          let count = 0;
          transactionArray.forEach(item => {
            if (item.PropertyID == transaction.PropertyID) {
              count++;
            }
          });
          if (count > 1) {
            instance.propertyTitle = transaction.PropertyName;
            instance.selectedPropertyId = transaction.PropertyID;
            instance.showMultipleTransactionDetails = true;
            instance._sharedDataService.IsSinglePin=false;
            instance._sharedDataService.selectedSaleMultiDetails=instance.transactionInfo;
            instance.openMultiDetailNav(transaction.PropertyID);
          }
          else{
            instance._sharedDataService.IsSinglePin=true;
            instance._sharedDataService.selectedSaleSingleDetails=instance.transactionInfo;
            instance.openDetailNav();            
          }

          instance._sharedDataService.searchTransactions = instance.transactionList;
          instance._sharedDataService.transactionSearchResultCount = instance.transactionResultCount;
          instance.SideDetailNav = true;
        });
        var markerPos = marker.getPosition()
        bounds.extend(markerPos);
        this.mapItems.MapPins.push(marker);
      }
      if(!this.isSelectDrawPolyGon && !this.isSelectDrawCircle)
      instance.map.fitBounds(bounds);
    } else {
      this.transactionResultCount = 0;
    }
    instance.GetCentralGeoCoordinate();
  }

  DrawShape(shape) {
    this.clearShapes();
    if (!!this._sharedDataService.transactionSearchCriteria) {
      this._sharedDataService.transactionSearchCriteria.PolygonText = null;

      this._sharedDataService.transactionSearchCriteria.LatlngArray = null;

      this._sharedDataService.transactionSearchCriteria.CircleRadius = null;

      this._sharedDataService.transactionSearchCriteria.CentreLatitude = null;

      this._sharedDataService.transactionSearchCriteria.CentreLongitude = null;
    }

    const instance = this;
    this.isShapeOnMap = false;
    const drawingManager = this._mapService.DrawPolygon(this.map, shape);
    google.maps.event.addListener(instance.map, "rightclick", function (event) {
      drawingManager.setMap(null);
      instance.isSelectDrawPolyGon = false;
      instance.isSelectDrawCircle = false;
    });
    if (shape === 'polygon') {
      this.isSelectDrawPolyGon = true;
      this.isSelectDrawCircle = false;
      this._mapService.OnMapOverlayComplete(drawingManager, DrawMode.Polygon, function (event) {
        instance.showClearBtn = true;
        instance.mapItems.Polygons.push(event);
        const latlngArray = event.latLngs.getArray()[0].getArray();
        instance._mapService.FitMapToPolygon(instance.map, event);
        instance.lastAction = 'polygon';
        instance.isShapeOnMap = true;
        drawingManager.setMap(null);
      });
    } else if (shape === 'circle') {
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

        for (const item of instance.mapItems.MapPins) {
          item.setMap(null);
        }
        instance.mapItems.MapPins = new Array<any>();
      }
    });

  }

  onSearchResetClick() {
    this.showClearBtn = false;
    this.Isloader = false;
    this.isSelectDrawCircle = false;
    this.isSelectDrawPolyGon = false;
    this.isCountrySelected = false;
    this.isMarketSelected = false;
    this.isCitySelected = false;
    this.isPostalCodeSelected = false;
    this.isBuyerSelected = false;
    this.isSellerSelected = false;
    this.isPropertyTypeSelected = false;
    this.isSpecificUseSelected = false;
    this.isSaleDateSelected = false;
    this.isAskingPriceSelected = false;
    this.isCapRateSelected = false;
    // this.isSaleSelected = true;
    // this.isLeaseSelected = false;

    this.isPercOccupiedSelected = false;
    this.isNetOperatingIncomeSelected = false;
    this.isContactSelected = false;
    this.isSoldSMSelected = false;
    this.isSalePriceSelected = false;
    this.isSaleTypeSelected = false;
    this.isSaleConditionSelected = false;

    this.isViewportChange = false;
    this.isSearchClicked = false;
    this.propertyTypeArray = [];
    this.specificUseArray = [];
    this.saleTypeArray = [];
    this.saleConditionArray = [];
    this.selectedListingType = "all";
    this.cityArray = [];
    this.zipCodeArray = [];
    this.selectedBuyerArray = [];
    this.selectedSellerArray = [];
    this.ZipCodes = new Array<any>();
    this.CityList = new Array<any>();
    this.PagerOffset = 0;

    this.propertyTypes.forEach(type => {
      type.IsSelected = false;
    });

    this.specificUseList.forEach(type => {
      type.IsSelected = false;
    });

    this.lastAction = null;
    this.SaleDateMin = null;
    this.SaleDateMax = null;


    this.clearShapes();
    this.clearMarkers();
    this.setMap();

    this.transactionPins = [];
    this.transactionList = [];
    this.transactionResultCount = 0;
    this.searchCriteria = new TransactionSearchCriteria();

    this._sharedDataService.searchTransactionMap = null;
    this._sharedDataService.searchTransactions = null;
    this._sharedDataService.transactionSearchResultCount = 0;
    this._sharedDataService.transactionSearchCriteria = new TransactionSearchCriteria();
    this.SoldSpaceMax = null;
    this.SoldSpaceMin = null;
    localStorage.removeItem('transactionpage');
    // localStorage.removeItem('TransactionSearchResult');
    // localStorage.removeItem('TransactionMapSearchResults');
    // localStorage.removeItem('TransactionSearchResultCount');
    // localStorage.removeItem('TransactionSearchCriteria');
    // localStorage.removeItem('SelectedPropertyTransactions');
    this.setInitValues();
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
  onSelectCity(data) {
    if (data.length > 0) {
      this.isCitySelected = true;
    } else {
      this.isCitySelected = false;
    }
  }
  getZipCodes(searchText) {
    this.ZipCodes = new Array<any>();
    if (searchText.length >= 3) {
      let result = this._lookupService.ZipCodeSearch(searchText, this.searchCriteria.CountryId);
      result.subscribe(item => {
        this.ZipCodes = JSON.parse(item['_body']).responseData;
      });
    }
  }
  onSelectZipCode(data) {
    if (data.length > 0) {
      this.isPostalCodeSelected = true;
    } else {
      this.isPostalCodeSelected = false;
    }
  }
  onSelectBuyer(data) {
    if (data.length > 0) {
      this.isBuyerSelected = true;
    } else {
      this.isBuyerSelected = false;
    }
  }
  onSelectSeller(data) {
    if (data.length > 0) {
      this.isSellerSelected = true;
    } else {
      this.isSellerSelected = false;
    }
  }
  onPropertyTypeSelected(data) {
    this.specificUseList = [];
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


  onSpecificUseSelected(data) {
    if (data.length > 0) {
      this.isSpecificUseSelected = true;
    } else {
      this.isSpecificUseSelected = false;
    }
  }

  private clearShapes() {
    this.showClearBtn = false;
    this.isShapeOnMap = true;
    this._mapService.RightClick(this.map);
    for (const item of this.mapItems.Polygons) {
      item.setMap(null);
    }
    this.mapItems.Polygons = new Array<any>();
  }
  private placeMarker(transaction: any, isDraggable: boolean = false) {
    const marker = this._mapService.PlaceMarker(this.map, transaction.Latitude, transaction.Longitude, isDraggable);
    marker.data = transaction;
    this.setMarkerIcon(marker);
    return marker;
  }
  private setMarkerIcon(marker: any) {
    // let propertyDetails: any = marker.data;
    let iconUrl = 'assets/img/GoogleMapImages/MapPin/';
    switch (marker.data.PropertyUse) {
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
  public getPropertyType() {
    const propertyType = this._lookupService.GetAllPropertyType();
    propertyType.subscribe(result => {
      if (!JSON.parse(result['_body']).error) {
        this.propertyTypes = JSON.parse(result['_body']).responseData;
        this._sharedDataService.propertyTypes = JSON.parse(result['_body']).responseData;
      } else {
        this._sharedDataService.propertyTypes = null;
      }
    });
  }
  // ChangeListingType() {
  //   this.isSaleSelected = (this.selectedListingType === 'sale');
  //   this.isLeaseSelected = (this.selectedListingType === 'lease');
  //   this.searchCriteria.ListingType = this.isSaleSelected ? 'sale' : 'lease';
  // }

  public getAllSpecificUses() {
    const specificUses = this._lookupService.GetAllSpecificUse();
    specificUses.subscribe(result => {
      if (!JSON.parse(result['_body']).error) {
        this._sharedDataService.specificUses = JSON.parse(result['_body']).responseData;
      } else {
        this._sharedDataService.specificUses = null;
      }
    });
  }
  private clearMarkers() {
    if (this.mapItems.MapPins.length > 0) {
      for (const pin of this.mapItems.MapPins) {
        pin.setMap(null);
      }
      this.mapItems.MapPins = [];
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
    communicationModel.Key = "OpenSingleTransactionModel";
    communicationModel.data = this.transactionInfo;
    this._commService.broadcast(communicationModel);

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
    this._sharedDataService.selectedSalePin = propertyId;
    let communicationModel = new CommunicationModel();
    communicationModel.Key = "OpenMultiTransactionModel";
    communicationModel.data = propertyId;
    this._commService.broadcast(communicationModel);

    document.getElementById("MapSidenavWrapMultiDetail").style.width = "48%";
    document.getElementById("MapMultiDetailSideBar").style.width = "48%";
    if ($(window).width() < 767) {
      document.getElementById("MapMultiDetailSideBar").style.width = "65%";
      document.getElementById("MapSidenavWrapMultiDetail").style.width = "65%";
    }
    else {
      document.getElementById("MapSidenavWrapMultiDetail").style.width = "48%";
      document.getElementById("MapMultiDetailSideBar").style.width = "48%";
    }
    this.SideMultiDetailNav = true;
  }

  closeMultiDetailNav() {
    this.CloseActionBtnMultiDetail = false;
    document.getElementById("MapMultiDetailSideBar").style.width = "0";
    document.getElementById("MapSidenavWrapMultiDetail").style.width = "0";
    this.SideMultiDetailNav = false;
  }
  openLegent() {
    this.legentCloseActionBtn = true;
    document.getElementById("LegentDetailSideBar").style.width = "200px";
    document.getElementById("LegentSideBar").style.width = "200px";
  }
  closeLegent() {
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
  getSaleCondition() {
    const response_saleCondition = this._lookupService.GetSaleConditions();
    response_saleCondition.subscribe(result => {
      this.saleConditions = JSON.parse(result['_body']).responseData || [];
      this._sharedDataService.saleConditionsList = this.saleConditions;
    });
  }
  getSaleType() {
    const response_saleType = this._lookupService.GetSaleType();
    response_saleType.subscribe(result => {
      this.saleTypes = JSON.parse(result['_body']).responseData || [];;
      this._sharedDataService.saleTypesList = this.saleTypes;
    });
  }
  onSaleTypeSelected(data) {
    if (data.length > 0) {
      this.isSaleTypeSelected = true;
    } else {
      this.isSaleTypeSelected = false;
    }
  }
  onSaleConditionSelected(data) {
    if (data.length > 0) {
      this.isSaleConditionSelected = true;
    } else {
      this.isSaleConditionSelected = false;
    }
  }

  checkValidations() {
    this.SalePriceMinError = false;
    this.AskingPriceMinError = false;
    this.SoldSpaceMinError=false;
    this.SaleDateMinError = false;
    this.CapRateMinError=false;
    this.NetOperatingIncomeMinError =false;
    this.PercentageOccupiedMinError =false;

    if ((this.searchCriteria.SalePriceMin && this.searchCriteria.SalePriceMax) && (this.searchCriteria.SalePriceMin > this.searchCriteria.SalePriceMax)) {
      this.SalePriceMinError = true;
    }
    if ((this.searchCriteria.AskingPriceMin && this.searchCriteria.AskingPriceMax) && (this.searchCriteria.AskingPriceMin > this.searchCriteria.AskingPriceMax)) {
      this.AskingPriceMinError = true;
    }
    if ((this.SoldSpaceMin && this.SoldSpaceMax) && (this.SoldSpaceMin >this.SoldSpaceMax)) {
      this.SoldSpaceMinError = true;
    }
    if ((this.searchCriteria.CapRateMin && this.searchCriteria.CapRateMax) && (this.searchCriteria.CapRateMin > this.searchCriteria.CapRateMax)) {
      this.CapRateMinError = true;
    }
    if ((this.searchCriteria.NetOperatingIncomeMin && this.searchCriteria.NetOperatingIncomeMax) && (this.searchCriteria.NetOperatingIncomeMin > this.searchCriteria.NetOperatingIncomeMax)) {
      this.NetOperatingIncomeMinError = true;
    }
    if ((this.searchCriteria.PercentageOccupiedMin && this.searchCriteria.PercentageOccupiedMax) && (this.searchCriteria.PercentageOccupiedMin >this.searchCriteria.PercentageOccupiedMax)) {
      this.PercentageOccupiedMinError = true;
    }
    if((this.searchCriteria.SaleDateMin && this.searchCriteria.SaleDateMax) && (Date.parse(this.searchCriteria.SaleDateMin) > Date.parse(this.searchCriteria.SaleDateMax))) {
      this.SaleDateMinError = true;
    }


  }
}
