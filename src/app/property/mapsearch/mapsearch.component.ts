import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MapService } from '../../core/services/map-service.service';
import { SharedDataService } from '../../core/services/shareddata.service';
import { LoginService } from '../../core/services/login.service';
import { LookupService } from '../../core/services/lookup.service';
import { PropertyService } from '../../core/services/api-property.service';
import { MapOptions } from '../../core/models/MapOptions';
import { MapType, GoogleMapControlPosition, DrawMode } from '../../core/models/MapEnum';
import { MapItem } from '../../core/models/MapItem';
import { MapBound } from '../../core/models/mapBound';
import { LatLng } from '../../core/models/LatLng';
import * as MapEnum from '../../core/models/MapEnum';
import { PropertySearchCriteria } from '../../core/models/PropertySearchCriteria';
import { Observable, Subject } from 'rxjs/Rx';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import pageSettings from '../../config/page-settings';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';



declare var $: any;
declare var google: any;
@Component({
  selector: 'app-mapsearch',
  templateUrl: './mapsearch.component.html',
  styleUrls: ['./mapsearch.component.css']
})
export class MapsearchComponent implements OnInit {
  BuildingSizeMinError: boolean=false;
  LotSizeSFMinError: boolean=false;
  TotalAvailableMinError: boolean=false;
  LeaseRateMinError: boolean=false;
  SalePriceMinError: boolean=false;
  SalePricePerSFMinError: boolean=false;
  // lat: number = -34.08417788518130 ;
  // lng: number = 150.82839500159000;
  pageSettings;
  SideNav: boolean;
  SideDetailNav: boolean;
  SideMultiDetailNav: boolean;
  map: any;
  UnitId: number;
  searchCriteria: PropertySearchCriteria;
  isSelectDrawPolyGon: boolean = false;
  isSelectDrawCircle: boolean = false;
  isPropertyTypeSelected: boolean = false;
  isListingTypeSelected: boolean = false;
  isAgentSelected: boolean = false;
  isSpecificUseSelected: boolean = false;
  isPropertySizeSelected: boolean = false;
  isAvailableSpaceSelected: boolean = false;
  isLeaseRateSelected: boolean = false;
  isSalePriceSelected: boolean = false;
  isSalePricePerSFSelected: boolean = false;
  isLotizeSelected: boolean = false;
  isClassSelected: boolean = false;
  isTenancySelected: boolean = false;
  isCitySelected: boolean = false;
  isMarketSelected: boolean = false;
  isPostalCodeSelected: boolean = false;

  isShapeOnMap: boolean = false;
  mapItems: MapItem;
  lastAction: string;

  propertyTypes: any;
  propertyTypeArray: any;
  companies: any = [];
  companyInput = new Subject<string>();
  companyLoading = false;
  cityInput = new Subject<string>();
  cityLoading: boolean = false;
  zipcodeInput = new Subject<string>();
  zipcodeLoading: boolean = false;
  companyAgents: any = [];
  agentArray: any;
  selectedCompanyId: number = 0;
  toolTip: string = '';
  SpecificUseList: Array<any>;
  specificUseArray: any;
  formatOptions: any;
  formatOptionsHa: any;
  placeholderMin: string = "Min SqM";
  placeholderMax: string = "Max SqM";
  placeholderMinHa: string = "Min Ha";
  placeholderMaxHa: string = "Max Ha";
  salePricePerSpaceLabel: string = "Sale Price/SqM";
  salePricePerSpacePlaceHolderMin: string = "Min Price/SqM";
  salePricePerSpacePlaceHolderMax: string = "Max Price/SqM";
  BuildingSizeMin: number = null;
  BuildingSizeMax: number = null;
  TotalAvailableMin: number = null;
  TotalAvailableMax: number = null;
  SalePriceMin: number = null;
  SalePriceMax: number = null;
  LeaseRateMin: number = null;
  LeaseRateMax: number = null;
  LotSizeSFMin: number = null;
  LotSizeSFMax: number = null;
  leaseRateTypes: Array<any>;
  leaseTypeArray: any;
  buildingClass: Array<any>;
  classArray: any;
  tenancyList: Array<any>;
  tenancyArray: any;
  isTotalAvail: boolean = true;
  isSuiteLevelSpace: boolean = false;

  displayProperties: Array<any>;
  hasSearchResult: boolean;
  propertyResultCount: number = 0;
  shapeOnMap: string = "";
  isSearchClicked: boolean = false;
  isViewportChange: boolean = false;
  Isloader: boolean = false;
  IsRefreshloader: boolean = false;
  CityList: Array<any>;
  cityArray: any;
  ZipCodes: Array<any>;
  zipCodeArray: any;
  marketArray: any;
  subMarketArray: any;
  propertySearchForm:FormGroup;
  CreatedDateMin:NgbDateStruct;
  CreatedDateMax:NgbDateStruct;  
  CreatedDateMinError:boolean;
  isCreatedDateSelected = false;
  currentDate=new Date;
  maxDate={year:this.currentDate.getFullYear(),month:this.currentDate.getMonth()+1,day:this.currentDate.getDate()};

  listingType: Array<any> = [{ value: 'sale', name: 'For Sale' }
    , { value: 'lease', name: 'For Lease' }
    , { value: 'Lease & Sale', name: 'For Lease & Sale' }
    , { value: 'all', name: 'All Properties' }
  ];
  selectedListingType: any = "all";
  items: Array<string> = ['Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
    'Zagreb', 'Zaragoza', 'Łódź'];
  value: any[];

  PropertyDetailNav: boolean = false;
  propertyInfo: any;
  CloseActionBtn: boolean = false;
  PropertyCloseActionBtn: boolean = false;
  legentCloseActionBtn: boolean = false;
  LegentMedia: boolean = true;
  lat: any;
  long: any;
  showClearBtn:boolean=false;

  constructor(private _mapService: MapService
    , private _lookupService: LookupService
    , private _propertyService: PropertyService
    , private _router: Router
    , private _loginService: LoginService
    , private _sharedDataService: SharedDataService
    , private route: ActivatedRoute
    , private _CommService: CommunicationService
    , private toastr: ToastrService) {

    this.formatOptions = { prefix: '', precision: 0 };
    this.formatOptionsHa = { prefix: '', precision: 3 };
    this.mapItems = new MapItem();
    this.searchCriteria = new PropertySearchCriteria();
    this.SpecificUseList = Array<any>();
    this.specificUseArray = [];
    this.leaseRateTypes = Array<any>();
    this.buildingClass = Array<any>();
    this.tenancyList = Array<any>();
    this.propertyTypeArray = [];

    this.agentArray = [];
    this.classArray = [];
    this.tenancyArray = [];
    this.leaseTypeArray = [];
    this.cityArray = [];
    this.zipCodeArray = [];
    this.marketArray = [];
    this.subMarketArray = [];
    this.hasSearchResult = false;
    this.isViewportChange = false;
   

    this.searchCriteria.ListingType = 'all';
    this.UnitId = this._loginService.UserInfo.UnitId;
    if (this.UnitId != UnitConversionEnum.Metric) {
      this.placeholderMin = "Min SF";
      this.placeholderMax = "Max SF";
      this.salePricePerSpaceLabel = "Sale Price/SF";
      this.salePricePerSpacePlaceHolderMin = "Min Price/SF";
      this.salePricePerSpacePlaceHolderMax = "Max Price/SF";
    }

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
    if (!!this._sharedDataService.companies && this._sharedDataService.companies.length > 0) {
      this.companies = this._sharedDataService.companies;
    } else {
      this.getCompanies();
    }
    if (!!this._sharedDataService.buildingClass && this._sharedDataService.buildingClass.length > 0) {
      this.buildingClass = this._sharedDataService.buildingClass;
    } else {
      this.getBuildingClass();
    }
    if (!!this._sharedDataService.tenancyList && this._sharedDataService.tenancyList.length > 0) {
      this.tenancyList = this._sharedDataService.tenancyList;
    } else {
      this.getAllTenancy();
    }
    if (!!this._sharedDataService.leaseRateTypes && this._sharedDataService.leaseRateTypes.length > 0) {
      this.leaseRateTypes = this._sharedDataService.leaseRateTypes;
    } else {
      this.getLeaseRateType();
    }

    this.setTotalAvailSpace();

  }

  ngOnInit() {
    this.pageSettings = pageSettings;
    this.pageSettings.pageSidebarMinified = true;
    this.openNav();
    this.setMap();
    this.initializeSearchCriteria();

    this.propertySearchForm= new FormGroup({
      'cityArray': new FormControl(''),
      'zipCodeArray': new FormControl(''),
      'propertyTypeArray': new FormControl(''),
      'selectedListingType': new FormControl(''),
      'selectedCompanyId': new FormControl(''),
     'agentArray': new FormControl(''),
     'specificUseArray': new FormControl(''),
     'BuildingSizeMin': new FormControl(''),
     'BuildingSizeMax': new FormControl(''),
     'classArray': new FormControl(''),
     'tenancyArray': new FormControl(''),
     'LotSizeSFMin': new FormControl(''),
     'LotSizeSFMax': new FormControl(''),
     'isTotalAvail': new FormControl(''),
     'SuiteLevel': new FormControl(''),
     'IsContiguous': new FormControl(''),
     'TotalAvailableMin': new FormControl(''),
     'TotalAvailableMax': new FormControl(''),
     'LeaseRateMin': new FormControl(''),
     'LeaseRateMax': new FormControl(''),
     'leaseTypeArray': new FormControl(''),
     'SalePriceMin': new FormControl(''),
     'SalePriceMax': new FormControl(''),
     'SalePricePerSFMin': new FormControl(''),
     'SalePricePerSFMax': new FormControl(''),
     'CreatedDateMax': new FormControl(''),
     'CreatedDateMin': new FormControl('')
    });
    if (!!this._sharedDataService.searchCriteriaMapPin) {
      this.displayProperties = this._sharedDataService.searchCriteriaMapPin;
    }
    else{
      this.isViewportChange = false;
    }

    this.propertyResultCount = this._sharedDataService.searchResultCount;
    if (!!this.displayProperties) {
      this.setShape();
      this.showMapResults();
    }
    if(this._sharedDataService.selectedPropertyPin){
      this.openDetailNav(this._sharedDataService.selectedPropertyPin);
    }
    

    //  if (!!this._sharedDataService.searchProperties && this._sharedDataService.searchProperties.length > 0) {
    //      this.displayProperties = this._sharedDataService.searchProperties;
    //      this.propertyResultCount = this._sharedDataService.searchResultCount;
    //      this.setShape();
    //      this.showMapResults();
    //  }


    if (this.propertyResultCount) {
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
  }

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
  DrawShape(shape) {

    this.clearShapes();
    if (!!this._sharedDataService.searchCriteria) {
      this._sharedDataService.searchCriteria.PolygonText = null;

      this._sharedDataService.searchCriteria.LatlngArray = null;

      this._sharedDataService.searchCriteria.CircleRadius = null;

      this._sharedDataService.searchCriteria.CentreLatitude = null;

      this._sharedDataService.searchCriteria.CentreLongitude = null;
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

  private clearShapes() {
    this.showClearBtn = false;
    this.isShapeOnMap = true;
    this._mapService.RightClick(this.map);
    for (let item of this.mapItems.Polygons) {
      item.setMap(null);
    }
    this.mapItems.Polygons = new Array<any>();
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
  getSpecificUseList(propertyTypeId) {

    this._sharedDataService.specificUses.forEach(specific => {
      if (specific.UseTypeID == propertyTypeId) {
        if(!!this.propertyTypes){
        this.propertyTypes.forEach(prop=>{
          if(prop.UseTypeID==propertyTypeId)
           specific.PropertyTypeName=prop.UseTypeName;
        });
        }
       
        this.SpecificUseList.push(specific);
      }

    });

  }

  onPropertyTypeSelected(data) {

    this.SpecificUseList = [];
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
  onListingTypeSelected(data) {

    if (data) {
      this.isListingTypeSelected = true;
    } else {
      this.isListingTypeSelected = false;
    }


  }
  getCompanies() {
    let companySearchData = {
      CompanyId: null,
      SearchId: null,
      EntityId: this._loginService.UserInfo.EntityID
    };
    const companyPromise = this._lookupService.getAllCompany(companySearchData);
    companyPromise.subscribe(result => {
      if (!JSON.parse(result['_body']).error) {
        this.companies = JSON.parse(result['_body']).responseData;
        this._sharedDataService.companies = JSON.parse(result['_body']).responseData;
      }
      else
        this._sharedDataService.companies = null;
    });
  }
  onCompanySelected(data) {

    if (typeof data === "undefined") {
      this.selectedCompanyId = 0;
      this.companyAgents.length = 0;
    }
    else {
      //  this.selectedCompanyId = data.CompanyID;
      this.getAgents(this.selectedCompanyId)
      this.toolTip = data.CompanyName;
    }
  }
  getAgents(companyId: any) {

    this.companyAgents.length = 0;
    const companyAgentsPromise = this._lookupService.getCompanyAgents(companyId);
    companyAgentsPromise.subscribe(result => {

      if (!JSON.parse(result['_body']).error) {
        this.companyAgents = JSON.parse(result['_body']).responseData;
      }
    });
  }


  onSelectingAgent(data) {

    if (data.length > 0) {
      this.isAgentSelected = true;
    } else {
      this.isAgentSelected = false;
    }
    // let agentArray = [];
    // data.forEach(value => {
    //   agentArray.push(value.AgentID);
    // });
    // let selectedAgents = agentArray.join(',');
    // this.searchCriteria.SelectedAgents = selectedAgents;

  }
  changeSpecificUse(data) {

    if (data.length > 0) {
      this.isSpecificUseSelected = true;
    } else {
      this.isSpecificUseSelected = false;
    }

  }
  onBlurMethod() {

    if (this.BuildingSizeMin || this.BuildingSizeMax)
      this.isPropertySizeSelected = true;
    else {
      this.isPropertySizeSelected = false;
    }
    if (!this.BuildingSizeMin) {
      this.BuildingSizeMin = null;
      if (!!this._sharedDataService.searchCriteria)
        this._sharedDataService.searchCriteria.BuildingSizeMin = null;
    }
    if (!this.BuildingSizeMax) {
      this.BuildingSizeMax = null;
      if (!!this._sharedDataService.searchCriteria)
        this._sharedDataService.searchCriteria.BuildingSizeMax = null;
    }


    if (this.TotalAvailableMin || this.TotalAvailableMax)
      this.isAvailableSpaceSelected = true;
    else {
      this.isAvailableSpaceSelected = false;
    }
    if (!this.TotalAvailableMin) {
      this.TotalAvailableMin = null;
      if (!!this._sharedDataService.searchCriteria)
        this._sharedDataService.searchCriteria.TotalAvailableMin = null;
    }
    if (!this.TotalAvailableMax) {
      this.TotalAvailableMax = null;
      if (!!this._sharedDataService.searchCriteria)
        this._sharedDataService.searchCriteria.TotalAvailableMax = null;
    }

    let selectCount = 0;
    this.leaseRateTypes.forEach(type => {
      if (type.IsSelected)
        selectCount++;
    });

    if (selectCount > 0 || this.searchCriteria.LeaseRateMin || this.searchCriteria.LeaseRateMax)
      this.isLeaseRateSelected = true;
    else {
      this.isLeaseRateSelected = false;
    }
    if (!this.searchCriteria.LeaseRateMin) {
      this.searchCriteria.LeaseRateMin = null;
      if (!!this._sharedDataService.searchCriteria)
        this._sharedDataService.searchCriteria.LeaseRateMin = null;
    }
    if (!this.searchCriteria.LeaseRateMax) {
      this.searchCriteria.LeaseRateMax = null;
      if (!!this._sharedDataService.searchCriteria)
        this._sharedDataService.searchCriteria.LeaseRateMaxbleMax = null;
    }

    if (this.searchCriteria.SalePriceMin || this.searchCriteria.SalePriceMax)
      this.isSalePriceSelected = true;
    else {
      this.isSalePriceSelected = false;
    }
    if (!this.searchCriteria.SalePriceMin) {
      this.searchCriteria.SalePriceMin = null;
      if (!!this._sharedDataService.searchCriteria)
        this._sharedDataService.searchCriteria.SalePriceMin = null;
    }
    if (!this.searchCriteria.SalePriceMax) {
      this.searchCriteria.SalePriceMax = null;
      if (!!this._sharedDataService.searchCriteria)
        this._sharedDataService.searchCriteria.SalePriceMax = null;
    }


    if (this.searchCriteria.SalePricePerSFMin || this.searchCriteria.SalePricePerSFMax)
      this.isSalePricePerSFSelected = true;
    else {
      this.isSalePricePerSFSelected = false;
    }
    if (!this.searchCriteria.SalePricePerSFMin) {
      this.searchCriteria.SalePricePerSFMin = null;
      if (!!this._sharedDataService.searchCriteria)
        this._sharedDataService.searchCriteria.SalePricePerSFMin = null;
    }
    if (!this.searchCriteria.SalePricePerSFMax) {
      this.searchCriteria.SalePricePerSFMax = null;
      if (!!this._sharedDataService.searchCriteria)
        this._sharedDataService.searchCriteria.SalePricePerSFMax = null;
    }


    if (this.LotSizeSFMin || this.LotSizeSFMax)
      this.isLotizeSelected = true;
    else {
      this.isLotizeSelected = false;
    }
    if (!this.LotSizeSFMin) {
      this.LotSizeSFMin = null;
      if (!!this._sharedDataService.searchCriteria)
        this._sharedDataService.searchCriteria.LotSizeSFMin = null;
    }
    if (!this.LotSizeSFMax) {
      this.LotSizeSFMax = null;
      if (!!this._sharedDataService.searchCriteria)
        this._sharedDataService.searchCriteria.LotSizeSFMax = null;
    }


  }
  getBuildingClass() {

    const buildingClass = this._lookupService.getBuildingClass();
    buildingClass.subscribe(result => {
      if (!JSON.parse(result['_body']).error) {
        this.buildingClass = JSON.parse(result['_body']).responseData;
        this._sharedDataService.buildingClass = JSON.parse(result['_body']).responseData;
      }
      else
        this._sharedDataService.buildingClass = null;
    });
  }

  changeBuildingClass(data) {

    if (data.length > 0) {
      this.isClassSelected = true;
    } else {
      this.isClassSelected = false;
    }
    // let classArray = [];
    // data.forEach(value => {
    //   classArray.push(value.ClassTypeID);
    // });
    // let selectedClass = classArray.join(',');
    // this.searchCriteria.BuildingClass = selectedClass;

  }
  getAllTenancy() {

    const tenancy = this._lookupService.getAllTenancy();
    tenancy.subscribe(result => {
      if (!JSON.parse(result['_body']).error) {

        this.tenancyList = JSON.parse(result['_body']).responseData;
        this._sharedDataService.tenancyList = JSON.parse(result['_body']).responseData;
      }
      else
        this._sharedDataService.tenancyList = null;
    });

  }
  changeTenancy(data) {


    if (data.length > 0) {
      this.isTenancySelected = true;
    } else {
      this.isTenancySelected = false;
    }

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
  getLeaseRateType() {
    const leaseRateType = this._lookupService.getLeaseRateType();
    leaseRateType.subscribe(result => {
      if (!JSON.parse(result['_body']).error) {
        this.leaseRateTypes = JSON.parse(result['_body']).responseData;
        this._sharedDataService.leaseRateTypes = JSON.parse(result['_body']).responseData;
      }
      else
        this._sharedDataService.leaseRateTypes = null;

    });
  }
  selectAvailableSpace(isSuite) {
    this.isAvailableSpaceSelected = true;
    if (isSuite) {
      this.isSuiteLevelSpace = true;
      this.isTotalAvail = false;
      this.searchCriteria.SuiteLevel = true;
    }
    else {
      this.isSuiteLevelSpace = false;
      this.searchCriteria.SuiteLevel = false;
      this.isTotalAvail = true;
      this.searchCriteria.IsContiguous = false;
    }
  }
  setTotalAvailSpace() {

    if (!this.searchCriteria.SuiteLevel) {
      this.isTotalAvail = true;
      this.searchCriteria.SuiteLevel = false;
    } else {
      this.isAvailableSpaceSelected = true;
      this.isTotalAvail = false;
      this.searchCriteria.SuiteLevel = true;
    }
  }
  changeLeaseRateType(data) {


    if (data.length > 0 || (this.searchCriteria.LeaseRateMin || this.searchCriteria.LeaseRateMax)) {
      this.isLeaseRateSelected = true;
    }
    else {
      this.isLeaseRateSelected = false;
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

  public onSearchClick() {
    if(this.propertySearchForm.valid && !this.SalePriceMinError && !this.LeaseRateMinError && !this.TotalAvailableMinError && !this.LotSizeSFMinError && !this.BuildingSizeMinError && !this.SalePricePerSFMinError && !this.CreatedDateMinError){
         
    this.showClearBtn = false;
    this.Isloader = true;
    let latlngArray;
    let props;
    sessionStorage.setItem('page', JSON.stringify(1));
    this.isSearchClicked = true;
    //  this.initializeSearchCriteria();
    this.initSearchSizeParams();
    this.searchCriteria.SpecificUseId = this.arrayToString(this.specificUseArray);
    this.searchCriteria.PropertyType = this.arrayToString(this.propertyTypeArray);
    this.searchCriteria.ListingType = this.selectedListingType;
    this.searchCriteria.CompanyId = this.selectedCompanyId;
    this.searchCriteria.SelectedAgents = this.arrayToString(this.agentArray);
    this.searchCriteria.BuildingClass = this.arrayToString(this.classArray);
    this.searchCriteria.Tenancy = this.arrayToString(this.tenancyArray);
    this.searchCriteria.LeaseRateType = this.arrayToString(this.leaseTypeArray);
    this.searchCriteria.CityId = this.arrayToString(this.cityArray);
    this.searchCriteria.ZipCode = this.arrayToString(this.zipCodeArray);
    this.searchCriteria.IsMapSearch = true;
    this.searchCriteria.PropertyId = null;
    this.searchCriteria.PropertyName = null;
    this.searchCriteria.SearchValue = null;
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
      case 'search': this.fetchViewPortProperties();

        // let result = this._propertyService.propertySearch(this.searchCriteria);
        // result.subscribe(item => {      
        //   if (!JSON.parse(item['_body']).error) {
        //     let response = JSON.parse(item['_body']).responseData;
        //     if (!!response.Property) {
        //       props = response.Property[1];
        //       if (!!props) {
        //         this.displayProperties = response.Property[0];
        //         this._sharedDataService.searchProperties = this.displayProperties;
        //         this._sharedDataService.searchResultCount = props.length;

        //         this.propertyResultCount = response.Property[2][0].Total_Count;
        //         if (props.length > 0) {
        //           this.placePropertyPins(props);
        //           if (props.length > 0) {
        //             //this._mapService.SetMapZoomLevel(this.map, 12);
        //             this._mapService.FitMapToMarkers(this.map, this.mapItems.MapPins);
        //             this.map.setCenter({ lat: parseFloat(props[0].Latitude.toString()), lng: parseFloat(props[0].Longitude.toString()) });
        //           }
        //           this.Isloader = false;
        //         } else {
        //           this.Isloader = false;
        //           alert("No result found");
        //         }
        //       } else {
        //         this.Isloader = false;
        //         alert("No result found");
        //       }

        //     } else {
        //       this.Isloader = false;
        //       alert("No result found");
        //     }
        //   } else {
        //     this.Isloader = false;
        //     alert("No result found");
        //   }
        // });


        break;
      case 'circle':
        this.shapeOnMap = 'circle';
        // To retain search criteria.
        let overlay;
        if (!!this._sharedDataService.searchCriteria) {
          if (!!this._sharedDataService.searchCriteria.CircleRadius && !!this._sharedDataService.searchCriteria.CentreLatitude && !!this._sharedDataService.searchCriteria.CentreLongitude) {
            overlay = new Object;

            overlay.center = this._mapService.GetLatLng(this._sharedDataService.searchCriteria.CentreLatitude, this._sharedDataService.searchCriteria.CentreLongitude)
            overlay.radius = this._sharedDataService.searchCriteria.CircleRadius / 0.00062137;
            if (!!this.mapItems.Polygons[this.mapItems.Polygons.length - 1].radius) {
              if (this.mapItems.Polygons[this.mapItems.Polygons.length - 1].radius != overlay.radius) {
                overlay = this.mapItems.Polygons[this.mapItems.Polygons.length - 1];
              }
            }
          } else {
            overlay = this.mapItems.Polygons[this.mapItems.Polygons.length - 1];
          }
        }
        else {
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
        if (!!this._sharedDataService.searchCriteria) {
          if (!!this._sharedDataService.searchCriteria.LatlngArray) {
            latlngArray = JSON.parse(this._sharedDataService.searchCriteria.LatlngArray);
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

        let geoloc = JSON.parse(JSON.stringify(latlngArray));
        this.searchCriteria.LatlngArray = JSON.stringify(latlngArray);
        let polyText = "";
        polyText = "POLYGON((";
        geoloc.forEach(function (item, index) {
          polyText += (item.lng + " " + item.lat + ",");
        });
        polyText += geoloc[0].lng + " " + geoloc[0].lat + "))";

        this.searchCriteria.PolygonText = polyText;
        this.fetchViewPortProperties();

        break;

    }

    this._sharedDataService.searchCriteria = this.searchCriteria;
    sessionStorage.removeItem('page');

    }
  }
  initializeSearchCriteria() {
    // this.searchCriteria = new PropertySearchCriteria();
    if ((this.searchCriteria.ListingType == null) || (this.searchCriteria.ListingType == undefined))
      this.searchCriteria.ListingType = 'all';

    if (!this.searchCriteria.SuiteLevel)
      this.searchCriteria.SuiteLevel = false;


    this.searchCriteria.StartingIndex = 1;
    this.searchCriteria.OffsetValue = 100;
    this.searchCriteria.CountryId = this._loginService.UserInfo.CountryID;
    this.searchCriteria.SortParam = "PropertyName";
    this.searchCriteria.SortDirection = "Ascending";
    this.searchCriteria.IsMapSearch = false;
    this.searchCriteria.PolygonText = "";
    this.searchCriteria.CentreLatitude = null;
    this.searchCriteria.CentreLongitude = null;
    this.searchCriteria.CircleRadius = null;
    this.searchCriteria.IsMapSearch = false;




    if (!!this._sharedDataService.searchCriteria) {
       this.searchCriteria = this._sharedDataService.searchCriteria;

      if (!!this.searchCriteria.PropertyType) {
        this.isPropertyTypeSelected = true;
        this.propertyTypeArray = this.stringToArray(this.searchCriteria.PropertyType);
        if (this.propertyTypeArray) {
          let count = 0;
          this.propertyTypeArray.forEach(value => {
            this.getSpecificUseList(value);
          });
          if (!!this.searchCriteria.SpecificUseId) {
            this.specificUseArray = this.stringToArray(this.searchCriteria.SpecificUseId);
            this.isSpecificUseSelected = true;
          }
        }
      }
      if (!!this.searchCriteria.ListingType) {
        this.isListingTypeSelected = true;
        this.selectedListingType = this.searchCriteria.ListingType;
      }

      this.selectedCompanyId = this.searchCriteria.CompanyId;

      if (!!this.searchCriteria.SelectedAgents) {
        this.agentArray = this.stringToArray(this.searchCriteria.SelectedAgents);
        this.isAgentSelected = true;
      }

      if (!!this.searchCriteria.BuildingClass) {
        this.classArray = this.stringToArray(this.searchCriteria.BuildingClass);
        this.isClassSelected = true;
      }

      if (!!this.searchCriteria.Tenancy) {
        this.tenancyArray = this.stringToArray(this.searchCriteria.Tenancy);
        this.isTenancySelected = true;
      }

      if (!!this.searchCriteria.LeaseRateType) {
        let typeArray = this.searchCriteria.LeaseRateType.split(",");
        typeArray.forEach(value => {
          this.leaseTypeArray.push(value);
        });
        this.isLeaseRateSelected = true;
      }


      if (!!this.searchCriteria.CityId) {
        this.isCitySelected = true;
        this.cityArray = this.stringToArray(this.searchCriteria.CityId);
      }
      if (!!this.searchCriteria.ZipCode) {
        this.isPostalCodeSelected = true;
        this.zipCodeArray = this.stringToArray(this.searchCriteria.ZipCode);
      }
      if (!!this.searchCriteria.citySearchText) {
        this.getCity(this.searchCriteria.citySearchText);
      }
      if (!!this.searchCriteria.zipcodeSearchText) {
        this.getZipCodes(this.searchCriteria.zipcodeSearchText);
      }



      this.setTotalAvailSpace();
      if (!!this.searchCriteria.BuildingSizeMax && (!this.BuildingSizeMax || this.searchCriteria.BuildingSizeMax == this.BuildingSizeMax))
        this.BuildingSizeMax = this._propertyService.convertUnit(this.searchCriteria.CountryId, 'SF', 'SqM', this.searchCriteria.BuildingSizeMax);

      if (!!this.searchCriteria.BuildingSizeMin && (!this.BuildingSizeMin || this.searchCriteria.BuildingSizeMin == this.BuildingSizeMin))
        this.BuildingSizeMin = this._propertyService.convertUnit(this.searchCriteria.CountryId, 'SF', 'SqM', this.searchCriteria.BuildingSizeMin);

      if (!!this.searchCriteria.TotalAvailableMin && (!this.TotalAvailableMin || this.searchCriteria.TotalAvailableMin == this.TotalAvailableMin))
        this.TotalAvailableMin = this._propertyService.convertUnit(this.searchCriteria.CountryId, 'SF', 'SqM', this.searchCriteria.TotalAvailableMin);

      if (!!this.searchCriteria.TotalAvailableMax && (!this.TotalAvailableMax || this.searchCriteria.TotalAvailableMax == this.TotalAvailableMax))
        this.TotalAvailableMax = this._propertyService.convertUnit(this.searchCriteria.CountryId, 'SF', 'SqM', this.searchCriteria.TotalAvailableMax);;

      if (!!this.searchCriteria.LotSizeSFMin && (!this.LotSizeSFMin || this.searchCriteria.LotSizeSFMin == this.LotSizeSFMin))
        this.LotSizeSFMin = this._propertyService.convertUnit(this.searchCriteria.CountryId, 'SF', 'HA', this.searchCriteria.LotSizeSFMin);


      if (!!this.searchCriteria.LotSizeSFMax && (!this.LotSizeSFMax || this.searchCriteria.LotSizeSFMax == this.LotSizeSFMax))
        this.LotSizeSFMax = this._propertyService.convertUnit(this.searchCriteria.CountryId, 'SF', 'HA', this.searchCriteria.LotSizeSFMax);


      this.onBlurMethod();
    }
    this.initSearchSizeParams();
  }
  initSearchSizeParams() {
    if (!!this.BuildingSizeMax)
      this.searchCriteria.BuildingSizeMax = this._propertyService.convertUnit(this.searchCriteria.CountryId, "SqM", "SF", this.BuildingSizeMax)
    else
      this.searchCriteria.BuildingSizeMax = null;

    if (!!this.BuildingSizeMin)
      this.searchCriteria.BuildingSizeMin = this._propertyService.convertUnit(this.searchCriteria.CountryId, "SqM", "SF", this.BuildingSizeMin)
    else
      this.searchCriteria.BuildingSizeMin = null;

    if (!!this.TotalAvailableMax)
      this.searchCriteria.TotalAvailableMax = this._propertyService.convertUnit(this.searchCriteria.CountryId, "SqM", "SF", this.TotalAvailableMax)
    else
      this.searchCriteria.TotalAvailableMax = null;

    if (!!this.TotalAvailableMin)
      this.searchCriteria.TotalAvailableMin = this._propertyService.convertUnit(this.searchCriteria.CountryId, "SqM", "SF", this.TotalAvailableMin)
    else
      this.searchCriteria.TotalAvailableMin = null;


    if (!!this.LotSizeSFMin)
      this.searchCriteria.LotSizeSFMin = this._propertyService.convertUnit(this.searchCriteria.CountryId, "HA", "SF", this.LotSizeSFMin)
    else
      this.searchCriteria.LotSizeSFMin = null;


    if (!!this.LotSizeSFMax)
      this.searchCriteria.LotSizeSFMax = this._propertyService.convertUnit(this.searchCriteria.CountryId, "HA", "SF", this.LotSizeSFMax)
    else
      this.searchCriteria.LotSizeSFMax = null;
  }
  fetchViewPortProperties() {
    let searchResult = this._propertyService.propertySearch(this.searchCriteria);
    searchResult.subscribe(item => {
      if (JSON.parse(item['_body']).responseData.Property[0].length>0) {
        let mapPropertyList = JSON.parse(item['_body']).responseData.Property[1];
        this.displayProperties = JSON.parse(item['_body']).responseData.Property[0];
        this._sharedDataService.searchProperties = this.displayProperties;
        this._sharedDataService.searchResultCount = this.displayProperties.length;
        if(this.searchCriteria && this.searchCriteria.ListingType == "Lease & Sale"){
          this.displayProperties.sort(function(a, b){return a.RecordTypeName - b.RecordTypeName});
        }
        if(!mapPropertyList || mapPropertyList.length==0){
          mapPropertyList = this.displayProperties;
        }
        this.propertyResultCount = JSON.parse(item['_body']).responseData.Property[2][0].Total_Count;
        this._sharedDataService.searchResultCount = this.propertyResultCount;
        let offset = JSON.parse(item['_body']).responseData.Property[3][0]; 

        this._sharedDataService.searchCriteria.OffsetValue = 100;
        if(offset)
        this._sharedDataService.searchCriteria.OffsetValue = offset.PagerOffset;
        

        //localStorage.setItem('PropertySearchResultGrid', JSON.stringify(this.displayProperties));
        //localStorage.setItem('PropertySearchResultMap', JSON.stringify(mapPropertyList));
        this._sharedDataService.searchCriteriaMapPin = mapPropertyList;
       // localStorage.setItem('PropertySearchResultCount', JSON.stringify(this._sharedDataService.searchResultCount));

        this.placePropertyPins(mapPropertyList);
      } else {
        this.toastr.error('No Result Found!');
        // alert("No result found");
      }
      this.Isloader = false;
      this.IsRefreshloader = false;
      this.isViewportChange = false;
    });
  }
  private placePropertyPins = function (propertyArray: Array<any>) {
    let instance = this;
    this.clearMarkers();
    instance.hasSearchResult = true;
    if (propertyArray.length > 0) {
      var bounds = new google.maps.LatLngBounds();
      for (let prop of propertyArray) {
        let marker = this.placeMarker(prop);
        this._mapService.OnMarkerClick(marker, function (event, marker, latlng) {
          instance.propertyInfo = new Object();
          instance.propertyInfo = prop;
          instance.propertyTitle = prop.PropertyName;
          // instance.openDetailNav(prop.PropertyId);
          instance._sharedDataService.selectedPropertyDetails=instance.propertyInfo;
          instance.openDetailNav(prop.PropertyId);
          instance._sharedDataService.searchProperties = instance.displayProperties;
        });
        var markerPos = marker.getPosition()
        bounds.extend(markerPos);
        this.mapItems.MapPins.push(marker);
        instance.hasSearchResult = true;
      }
      if(!this.isSelectDrawPolyGon && !this.isSelectDrawCircle)
      instance.map.fitBounds(bounds);
    } else {
      this.hasSearchResult = false;
    }
    instance.GetCentralGeoCoordinate();
  }
  private clearMarkers() {
    if (this.mapItems.MapPins.length > 0) {
      this.mapItems.MapPins = this._mapService.ClearMarkers(this.mapItems.MapPins);
    }
  }
  private placeMarker = function (property: any, isDraggable: boolean = false) {
    var marker = this._mapService.PlaceMarker(this.map, property.Latitude, property.Longitude, isDraggable);
    marker.data = property;
    this.setMarkerIcon(marker);
    return marker;
  }
  private setMarkerIcon(marker: any) {
    // let propertyDetails: any = marker.data;
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
  setShape() {
    const instance = this;
    setTimeout(function () {
      if (!!instance._sharedDataService.searchCriteria.CircleRadius &&
        !!instance._sharedDataService.searchCriteria.CentreLatitude &&
        !!instance._sharedDataService.searchCriteria.CentreLongitude) {

        const circle = instance._mapService.DrawCircle(instance.map,
          instance._mapService.GetLatLng(
            instance._sharedDataService.searchCriteria.CentreLatitude,
            instance._sharedDataService.searchCriteria.CentreLongitude),
          (instance._sharedDataService.searchCriteria.CircleRadius / 0.00062137));

        instance.mapItems.Polygons.push(circle);
        instance.map.fitBounds(circle.getBounds());
        instance.isSelectDrawCircle = true;
      }

      let latlngArray;
      if (!!instance._sharedDataService.searchCriteria.LatlngArray) {
        latlngArray = JSON.parse(instance._sharedDataService.searchCriteria.LatlngArray);
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
      instance.placePropertyPins(instance.displayProperties);
      if (instance.displayProperties.length > 0) {
        instance._mapService.FitMapToMarkers(instance.map, instance.mapItems.MapPins);
        instance.GetCentralGeoCoordinate();
        instance.map.setCenter({
          lat: instance.lat,
          lng: instance.long
        });
        if (instance.map.getZoom() > 17) {
          instance.map.setZoom(17);
        }
      }
    }, 200);
  }
  public GetCentralGeoCoordinate() {
    var x = 0;
    var y = 0;
    var z = 0;
    this.displayProperties.forEach(element => {
      var latitude = element.Latitude * Math.PI / 180;
      var longitude = element.Longitude * Math.PI / 180;
      x += Math.cos(latitude) * Math.cos(longitude);
      y += Math.cos(latitude) * Math.sin(longitude);
      z += Math.sin(latitude);
    });
    var total = this.displayProperties.length;

    x = x / total;
    y = y / total;
    z = z / total;

    var centralLongitude = Math.atan2(y, x);
    var centralSquareRoot = Math.sqrt(x * x + y * y);
    var centralLatitude = Math.atan2(z, centralSquareRoot);
    this.lat = centralLatitude * 180 / Math.PI;
    this.long = centralLongitude * 180 / Math.PI;
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

  onSearchResetClick() {
    this.showClearBtn = false;
    this.Isloader = false;
    this.propertyTypeArray = [];
    this.specificUseArray = [];
    this.selectedListingType = "all";
    this.selectedCompanyId = 0;
    this.agentArray = [];
    this.classArray = [];
    this.tenancyArray = [];
    this.leaseTypeArray = [];
    this.cityArray = [];
    this.zipCodeArray = [];

    this.ZipCodes = new Array<any>();
    this.CityList = new Array<any>();

    this.isPropertyTypeSelected = false;
    this.isCitySelected = false;
    this.isMarketSelected = false;
    this.isPostalCodeSelected = false;
    this.isSelectDrawCircle = false;
    this.isSelectDrawPolyGon = false;
    this.isSpecificUseSelected = false;

    this.isPropertySizeSelected = false;
    this.isAvailableSpaceSelected = false;
    this.isLeaseRateSelected = false;
    this.isSalePriceSelected = false;
    this.isSalePricePerSFSelected = false;
    this.isClassSelected = false;
    this.isTenancySelected = false;
    this.isViewportChange = false;
    this.isSearchClicked = false;

    this.hasSearchResult = false;
    this.searchCriteria = new PropertySearchCriteria();
    this.LeaseRateMax = null;
    this.LeaseRateMin = null;
    this.SalePriceMax = null;
    this.SalePriceMin = null;
    this.BuildingSizeMax = null;
    this.BuildingSizeMin = null;
    this.TotalAvailableMin = null;
    this.TotalAvailableMax = null;
    this.LotSizeSFMin = null;
    this.LotSizeSFMax = null;
    this.clearBtnClick();


    this.displayProperties = [];
    this.propertyResultCount = 0;

    this._sharedDataService.searchProperties = null;
    this._sharedDataService.searchResultCount = 0;
    this._sharedDataService.searchCriteria = new PropertySearchCriteria();
    this._sharedDataService.searchCriteriaMapPin = null;
    sessionStorage.removeItem('page');
    // localStorage.removeItem('PropertySearchResultGrid');
    // localStorage.removeItem('PropertySearchResultMap');
    // localStorage.removeItem('PropertySearchResultCount');
    // localStorage.removeItem('PropertySearchCriteria');
  }
  public clearBtnClick() {
    this.clearShapes();
    this.clearMarkers();   
    this.setMap();
    this.lastAction = null;
  }
  openDetailNav(propId) {
    this._sharedDataService.selectedPropertyPin=propId;
    let communicationModel = new CommunicationModel();
    communicationModel.Key = "FromPropertyMapPin";
    communicationModel.data = propId;
    this._CommService.broadcast(communicationModel);

    this.PropertyCloseActionBtn = true;
    document.getElementById("ProperyMapSidenavWrap").style.width = "30%";
    document.getElementById("PropertyDetailSideBar").style.width = "30%";
    if ($(window).width() < 767) {
      document.getElementById("PropertyDetailSideBar").style.width = "65%";
      document.getElementById("ProperyMapSidenavWrap").style.width = "65%";
    }
    else {
      document.getElementById("PropertyDetailSideBar").style.width = "30%";
      document.getElementById("ProperyMapSidenavWrap").style.width = "30%";
    }
    this.PropertyDetailNav = true;
  }
  closePropertyDetailNav() {
    this.PropertyCloseActionBtn = false;
    document.getElementById("PropertyDetailSideBar").style.width = "0";
    document.getElementById("ProperyMapSidenavWrap").style.width = "0%";
    this.PropertyDetailNav = false;
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

  checkValidations() {
    this.SalePriceMinError = false;
    this.LeaseRateMinError = false;
    this.TotalAvailableMinError=false;
    this.LotSizeSFMinError = false;
    this.BuildingSizeMinError=false;
    this.SalePricePerSFMinError =false;

    if ((this.searchCriteria.SalePriceMin && this.searchCriteria.SalePriceMax) && (this.searchCriteria.SalePriceMin > this.searchCriteria.SalePriceMax)) {
      this.SalePriceMinError = true;
    }
    if ((this.searchCriteria.LeaseRateMin && this.searchCriteria.LeaseRateMax) && (this.searchCriteria.LeaseRateMin > this.searchCriteria.LeaseRateMax)) {
      this.LeaseRateMinError = true;
    }
    if ((this.TotalAvailableMin && this.TotalAvailableMax) && (this.TotalAvailableMin >this.TotalAvailableMax)) {
      this.TotalAvailableMinError = true;
    }
    if ((this.LotSizeSFMin && this.LotSizeSFMax) && (this.LotSizeSFMin > this.LotSizeSFMax)) {
      this.LotSizeSFMinError = true;
    }
    if ((this.BuildingSizeMin && this.BuildingSizeMax) && (this.BuildingSizeMin > this.BuildingSizeMax)) {
      this.BuildingSizeMinError = true;
    }
    if((this.searchCriteria.SalePricePerSFMin && this.searchCriteria.SalePricePerSFMax) && (this.searchCriteria.SalePricePerSFMin > this.searchCriteria.SalePricePerSFMax)) {
      this.SalePricePerSFMinError = true;
    }
    if((this.searchCriteria.CreatedDateMin && this.searchCriteria.CreatedDateMax) && (Date.parse(this.searchCriteria.CreatedDateMin) > Date.parse(this.searchCriteria.CreatedDateMax))) {
      this.CreatedDateMinError = true;
    }


  }

  onDateChanged(field, value)
  {
  if (field == 'CreatedDateMin') {
    if (!value) {
      this.searchCriteria.CreatedDateMin = this.searchCriteria.CreatedDateMinFormat = null;
    }
    else {
      this.searchCriteria.CreatedDateMinFormat = value;
      this.searchCriteria.CreatedDateMin = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
    }
  }
  if (field == 'CreatedDateMax') {
    if (!value)
      this.searchCriteria.CreatedDateMax = this.searchCriteria.CreatedDateMaxFormat = null;
    else {
      this.searchCriteria.CreatedDateMaxFormat = value;
      this.searchCriteria.CreatedDateMax = (new Date(value.year, value.month - 1, value.day)).toLocaleDateString();
    }
  }
  if (this.searchCriteria.CreatedDateMin || this.searchCriteria.CreatedDateMax) {
    this.isCreatedDateSelected = true;
  } else {
    this.isCreatedDateSelected = false;
  }
  }
}

