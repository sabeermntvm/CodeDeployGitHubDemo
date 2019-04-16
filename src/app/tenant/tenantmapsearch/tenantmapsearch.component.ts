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
import { ITreeOptions, TreeComponent } from 'angular-tree-component';

import { SharedDataService } from '../../core/services/shareddata.service';
import { LoginService } from '../../core/services/login.service';
import { LookupService } from '../../core/services/lookup.service';
import { TenantSearchCriteria } from '../../core/models/TenantSearchCriteria';
import { TenantService } from '../../core/services/tenant.service';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import pageSettings from '../../config/page-settings';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
declare var google: any;
@Component({
  selector: 'app-tenantmapsearch',
  templateUrl: './tenantmapsearch.component.html',
  styleUrls: ['./tenantmapsearch.component.css']
})
export class TenantmapsearchComponent implements OnInit {
  MinCompanySizeError : boolean = false;
  MinAnnualRevenueError : boolean = false;
  SideNav: boolean;
  SideDetailNav: boolean;
  SideMultiDetailNav: boolean;
  items: Array<string> = ['Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
    'Zagreb', 'Zaragoza', 'Łódź'];
  public map: any;
  private markers: Array<any> = new Array<any>();
  Isloader: boolean = false;
  IsRefreshloader: boolean = false;
  CloseActionBtn: boolean = false;
  CloseActionBtnDetail: boolean = false;
  CloseActionBtnMultiDetail: boolean = false;

  isShapeOnMap: boolean = false;
  mapItems: MapItem;
  lastAction: string;
  formatOptions: any;
  searchCriteria: TenantSearchCriteria;
  isSelectDrawPolyGon: boolean = false;
  isSelectDrawCircle: boolean = false;
  isPropertyTypeSelected: boolean = false;
  isSpecificUseSelected: boolean = false;
  isCitySelected: boolean = false;
  isMarketSelected: boolean = false;
  isPostalCodeSelected: boolean = false;
  isSearchClicked: boolean = false;
  isViewportChange: boolean = false;

  propertyTypes: any;
  propertyTypeArray: any;
  SpecificUseList: Array<any>;
  specificUseArray: any;
  CityList: Array<any>;
  cityArray: any;
  cityInput = new Subject<string>();
  cityLoading: boolean = false;
  ZipCodes: Array<any>;
  zipCodeArray: any;
  zipcodeInput = new Subject<string>();
  zipcodeLoading: boolean = false;
  marketArray: any;
  subMarketArray: any;

  tenantList: Array<any>;
  tenantResultCount: number;
  shapeOnMap: string = '';
  hasSearchResult: boolean = false;
  selectedPropertyId:number;

  selectedSICCode: string;
  selectedSICCodeList: any;
  nodes = [];
  options: ITreeOptions = {
    useCheckbox: true
  };
  lat:any;
  long:any;
  @ViewChild(TreeComponent)
  private tree: TreeComponent;
  legentCloseActionBtn: boolean = false;
  pageSettings: any;
  showClearBtn:boolean=false;
  tenantSearchForm :FormGroup;
  

  constructor(private _mapService: MapService
    , private _lookupService: LookupService
    , private _router: Router
    , private _loginService: LoginService
    , private _sharedDataService: SharedDataService
    , private route: ActivatedRoute
    , private _tenantService: TenantService
    , private _CommService: CommunicationService
    , private toastr: ToastrService) {

    this.formatOptions = { prefix: '$', precision: 2 };
    this.mapItems = new MapItem();
    this.searchCriteria = new TenantSearchCriteria();
    this.SpecificUseList = Array<any>();
    this.tenantList = new Array<any>();
    this.specificUseArray = [];
    this.propertyTypeArray = [];
    this.cityArray = [];
    this.zipCodeArray = [];
    this.marketArray = [];
    this.subMarketArray = [];

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


  }

  ngOnInit() {
    this.pageSettings = pageSettings;
    this.pageSettings.pageSidebarMinified = true;
    this.openNav();
    this.addSICNode();
    this.setMap();
    this.initializeSearchCriteria();
    if (!!this._sharedDataService.tenantSearchResult && this._sharedDataService.tenantSearchResult.length > 0) {
      this.tenantList = this._sharedDataService.tenantSearchResult;
      this.tenantResultCount = this._sharedDataService.tenantSearchResultCount;
      this.setShape();
      this.showMapResults();
    }
    this.tenantSearchForm = new FormGroup({
      'cityArray': new FormControl(''),
      'zipCodeArray': new FormControl(''),
      'propertyTypeArray': new FormControl(''),
      'specificUseArray': new FormControl(''),
      'CompanyName': new FormControl(''),
     'MinAnnualRevenue': new FormControl(''),
     'MaxAnnualRevenue': new FormControl(''),
     'MinCompanySize': new FormControl('',Validators.pattern('^[0-9]*$')),
     'MaxCompanySize': new FormControl('',Validators.pattern('^[0-9]*$')),
     'nodes':new FormControl('')
    });
    if (this.tenantResultCount) {
      this.isSearchClicked = true;
    }

    this.cityInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchCriteria.citySearchText = value;
      if(!!this.searchCriteria.citySearchText){
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
      if(!!this.searchCriteria.zipcodeSearchText){
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
    if(!!this._sharedDataService.selectedTenantPin){
      if(this._sharedDataService.IsSinglePin==true){
      this.openDetailNav();
      
    }
    else{
      this.openMultiDetailNav(this._sharedDataService.selectedTenantPin);      
    }
  }
  }


  public initializeSearchCriteria() {
    this.searchCriteria.StartingIndex = 1;
    this.searchCriteria.OffsetValue = 100;
    this.searchCriteria.CountryId = this._loginService.UserInfo.CountryID;
    this.searchCriteria.SortParam = "CompanyName";
    this.searchCriteria.SortDirection = "Ascending";
    this.searchCriteria.CountryId=this._loginService.UserInfo.CountryID;

    if (!!this._sharedDataService.tenantSearchCriteria) {
      this.searchCriteria = this._sharedDataService.tenantSearchCriteria;
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

    }
  }
  addSICNode() {
    let result = this._tenantService.getSICCodes();
    result.subscribe(item => {
      let node = JSON.parse(JSON.parse(item['_body']).responseData[0].json);

      let count = 0;
      let children = [];
      let subcategory = []
      node.forEach(item => {
        JSON.parse(item.childern).forEach(child => {
          children.push(child);
        });
        subcategory.push({ id: item.id, name: item.subgroupname, children: children });

        children = [];
        count++;

        if (count >= node.filter(x => x.name == item.name).length) {
          this.nodes.push({ id: item.id+'G', name: item.name, children: subcategory });
          this.tree.treeModel.update();
          subcategory = [];
          count = 0;
        } else {

        }
      });
      this.tree.treeModel.update();
      this.tree.treeModel.collapseAll();
    
    });

  }
  onSelectSIC(event) {
    this.selectedSICCodeList = Object.entries(event.treeModel.selectedLeafNodeIds)
      .filter(([key, value]) => {
        let grpid = event.node.data.grpid;
        return (value === true);
      }).map((node) => node[0]);

      if (this.selectedSICCodeList != null && this.selectedSICCodeList.length > 0)
      this.searchCriteria.ISIC = this.arrayToString(this.selectedSICCodeList);  
      else 
      this.searchCriteria.ISIC = null;
  }
  onDeselectSIC(event) {
    this.selectedSICCodeList = Object.entries(event.treeModel.selectedLeafNodeIds)
      .filter(([key, value]) => {
        let grpid = event.node.data.grpid;
        return (value === true);
      }).map((node) => node[0]);

      if (this.selectedSICCodeList != null && this.selectedSICCodeList.length > 0)
      this.searchCriteria.ISIC = this.arrayToString(this.selectedSICCodeList);  
      else
        this.searchCriteria.ISIC = null;
      
  }
  setShape() {  
    const instance = this;
    setTimeout(function () {
      if (!!instance._sharedDataService.tenantSearchCriteria.CircleRadius &&
        !!instance._sharedDataService.tenantSearchCriteria.CentreLatitude &&
        !!instance._sharedDataService.tenantSearchCriteria.CentreLongitude) {

        const circle = instance._mapService.DrawCircle(instance.map,
          instance._mapService.GetLatLng(
            instance._sharedDataService.tenantSearchCriteria.CentreLatitude,
            instance._sharedDataService.tenantSearchCriteria.CentreLongitude),
          (instance._sharedDataService.tenantSearchCriteria.CircleRadius / 0.00062137));

        instance.mapItems.Polygons.push(circle);
        instance.map.fitBounds(circle.getBounds());
        instance.isSelectDrawCircle = true;
      }

      let latlngArray;
      if (!!instance._sharedDataService.tenantSearchCriteria.LatlngArray) {
        latlngArray = JSON.parse(instance._sharedDataService.tenantSearchCriteria.LatlngArray);
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
      instance.placeTenantPins(instance.tenantList);
      if (instance.tenantList.length > 0) {
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
  public  GetCentralGeoCoordinate()
  {
      var x = 0;
      var y = 0;
      var z = 0;
      this.tenantList.forEach(element => {
        var latitude = element.Latitude * Math.PI / 180;
          var longitude = element.Longitude * Math.PI / 180;
          x += Math.cos(latitude) * Math.cos(longitude);
          y += Math.cos(latitude) * Math.sin(longitude);
          z += Math.sin(latitude);
      });
      var total = this.tenantList.length;

      x = x / total;
      y = y / total;
      z = z / total;

      var centralLongitude = Math.atan2(y, x);
      var centralSquareRoot = Math.sqrt(x * x + y * y);
      var centralLatitude = Math.atan2(z, centralSquareRoot);
      this.lat = centralLatitude * 180 / Math.PI;
      this.long = centralLongitude * 180 / Math.PI;
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
  DrawShape(shape) {
    this.clearShapes();
    if (!!this._sharedDataService.tenantSearchCriteria) {
      this._sharedDataService.tenantSearchCriteria.PolygonText = null;

      this._sharedDataService.tenantSearchCriteria.LatlngArray = null;

      this._sharedDataService.tenantSearchCriteria.CircleRadius = null;

      this._sharedDataService.tenantSearchCriteria.CentreLatitude = null;

      this._sharedDataService.tenantSearchCriteria.CentreLongitude = null;
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
  onSearchClick() {
    if(this.tenantSearchForm.valid && !this.MinAnnualRevenueError && !this.MinCompanySizeError){
      this.showClearBtn = false;
      this.Isloader = true;
      this.isSearchClicked = true;  
      let latlngArray;
      //this.initializeSearchCriteria();
      this.searchCriteria.PropertyType = this.arrayToString(this.propertyTypeArray);
      this.searchCriteria.SpecificUseId = this.arrayToString(this.specificUseArray);
      this.searchCriteria.CityId = this.arrayToString(this.cityArray);
      this.searchCriteria.ZipCode = this.arrayToString(this.zipCodeArray);
  
      if(!this.lastAction && this.mapItems.Polygons.length <= 0)
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
  
          let result = this._tenantService.tenantSearch(this.searchCriteria);
          result.subscribe(item => {
            if (!JSON.parse(item['_body']).error) {
              let responseData = JSON.parse(item['_body']).responseData;
              if (responseData["Tenants"][0].length>0) {         
                this.tenantList = responseData.Tenants[0];
                this._sharedDataService.tenantSearchResult = this.tenantList;
                this.tenantResultCount = responseData.Tenants[1][0].Total_Count;
                this._sharedDataService.tenantSearchResultCount = this.tenantResultCount;
               // localStorage.setItem('TenantSearchResult', JSON.stringify(this.tenantList));
              //  localStorage.setItem('TenantSearchResultCount', JSON.stringify(this._sharedDataService.tenantSearchResultCount));
                this.placeTenantPins(this.tenantList);
                if (this.tenantList.length > 0) {
                  //this._mapService.SetMapZoomLevel(this.map, 12);
                  this._mapService.FitMapToMarkers(this.map, this.mapItems.MapPins);
                  this.map.setCenter({ lat: parseFloat(this.tenantList[0].Latitude.toString()), lng: parseFloat(this.tenantList[0].Longitude.toString()) });
                }
                this.Isloader = false;
              } else{
                this.toastr.error('No result found!');
                  // alert("No result found");
                }
                  this.Isloader = false;
            }
            this.Isloader = false;
          });
  
  
  
          break;
        case 'circle':
          this.shapeOnMap = 'circle';
  
  
          // To retain search criteria.
          let overlay;
          if (!!this._sharedDataService.tenantSearchCriteria) {
            if (!!this._sharedDataService.tenantSearchCriteria.CircleRadius && !!this._sharedDataService.tenantSearchCriteria.CentreLatitude && !!this._sharedDataService.tenantSearchCriteria.CentreLongitude) {
              overlay = new Object;
  
              overlay.center = this._mapService.GetLatLng(this._sharedDataService.tenantSearchCriteria.CentreLatitude, this._sharedDataService.tenantSearchCriteria.CentreLongitude)
              overlay.radius = this._sharedDataService.tenantSearchCriteria.CircleRadius / 0.00062137;
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
  
          let circleSearchResult = this._tenantService.tenantSearch(this.searchCriteria);
          circleSearchResult.subscribe(item => {
            if (!JSON.parse(item['_body']).error) {
              let responseData = JSON.parse(item['_body']).responseData;
              if (!!responseData) {
                this.tenantList = responseData.Tenants[0];
                this._sharedDataService.tenantSearchResult = this.tenantList;
                this.tenantResultCount = responseData.Tenants[1][0].Total_Count;
                this._sharedDataService.tenantSearchResultCount = this.tenantResultCount;
             //   localStorage.setItem('TenantSearchResult', JSON.stringify(this.tenantList));
              //  localStorage.setItem('TenantSearchResultCount', JSON.stringify(this._sharedDataService.tenantSearchResultCount));
  
                this.placeTenantPins(this.tenantList);
              }
            } else{
              this.Isloader = false;
            }
  
              this.Isloader = false;
          });
  
          break;
        case 'polygon':
          this.shapeOnMap = 'polygon';
  
          // To retain search criteria.
          if (!!this._sharedDataService.tenantSearchCriteria) {
            if (!!this._sharedDataService.tenantSearchCriteria.LatlngArray) {
              latlngArray = JSON.parse(this._sharedDataService.tenantSearchCriteria.LatlngArray);
  
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
  
          let polygonSearchResult = this._tenantService.tenantSearch(this.searchCriteria);
          polygonSearchResult.subscribe(item => {
            if (!JSON.parse(item['_body']).error) {
              let responseData = JSON.parse(item['_body']).responseData;
              if (!!responseData) {
                this.tenantList = responseData.Tenants[0];
                this._sharedDataService.tenantSearchResult = this.tenantList;
                this.tenantResultCount = responseData.Tenants[1][0].Total_Count;
                this._sharedDataService.tenantSearchResultCount = this.tenantResultCount;
              //  localStorage.setItem('TenantSearchResult', JSON.stringify(this.tenantList));
              //  localStorage.setItem('TenantSearchResultCount', JSON.stringify(this._sharedDataService.tenantSearchResultCount));
                this.placeTenantPins(this.tenantList);
              }
            } else{
              this.Isloader = false;
            }
            this.Isloader = false;
          });
          break;
  
      }
      this.searchCriteria.OffsetValue = 100;
      this._sharedDataService.tenantSearchCriteria = this.searchCriteria;
     // localStorage.setItem('TenantSearchCriteria', JSON.stringify(this.searchCriteria));
      sessionStorage.removeItem('page');
  }
    
  }
  private placeTenantPins = function (tenantArray) {
    let instance = this;
    this.clearMarkers();
    instance.hasSearchResult = true;
    if (tenantArray.length > 0) {
      var bounds = new google.maps.LatLngBounds();
      for (let tenant of tenantArray) {
        let marker = this.placeMarker(tenant);
        this._mapService.OnMarkerClick(marker, function (event, marker, latlng) {
          instance.selectedTenantInfo = tenant;
          instance.tenantTitle = tenant.TenantName;   
          let count = 0;
          tenantArray.forEach(item => {
            // && item.ConfirmedTenantID != tenant.ConfirmedTenantID
            if (item.PropertyID == tenant.PropertyID) {
              count++;
            }

          });
          if (count > 1) {
            instance.propertyTitle = tenant.PropertyName;
            instance.selectedPropertyId = tenant.PropertyID;
            localStorage.setItem("tenantPropertyName", instance.propertyTitle);
            instance._sharedDataService.IsSinglePin=false;
          instance._sharedDataService.selectedTenantMultiDetails=instance.selectedTenantInfo          
            instance.openMultiDetailNav(tenant.PropertyID); 
          }

          else{
          instance._sharedDataService.IsSinglePin=true;
          instance._sharedDataService.selectedTenantSingleDetails=instance.selectedTenantInfo;          
          instance.openDetailNav();
          }
            

          instance.isBackFromDetails = true;
          instance._sharedDataService.tenantSearchResult = instance.tenantList;
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
  }
  onSearchResetClick() {
    this.showClearBtn = false;
    if(this.tree && this.tree.treeModel && this.tree.treeModel.getFocusedNode()){
    this.tree.treeModel.getFocusedNode().setIsActive(false);
    this.tree.treeModel.selectedLeafNodeIds = {};
    }
    this.selectedSICCodeList = [];

    this.propertyTypeArray = [];
    this.specificUseArray = [];
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
    this.isViewportChange = false;
    this.isSearchClicked = false;
    this.hasSearchResult = false;
    this.searchCriteria = new TenantSearchCriteria();
    this._sharedDataService.tenantSearchCriteria = new TenantSearchCriteria();
    this._sharedDataService.tenantSearchResult = null;
    this.clearBtnClick();
    
  }

  public clearBtnClick() {
    this.clearShapes();
    this.clearMarkers();
    this.setMap();
    this.lastAction = null;
  }
  private clearMarkers() {

    if (this.mapItems.MapPins.length > 0) {
      this.mapItems.MapPins =  this._mapService.ClearMarkers(this.mapItems.MapPins);
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
      this.searchCriteria.SWLat = boundProps.SouthWest.Latitude;
      this.searchCriteria.SWLng = boundProps.SouthWest.Longitude;
      this.searchCriteria.NELat = boundProps.NorthEast.Latitude;
      this.searchCriteria.NELng = boundProps.NorthEast.Longitude;
    }
  };
  fetchViewPortProperties() {
    let searchResult = this._tenantService.tenantSearch(this.searchCriteria);
    searchResult.subscribe(item => {
      if (!JSON.parse(item['_body']).error) {
        let responseData = JSON.parse(item['_body']).responseData;
        if (!!responseData) {
          this.tenantList = responseData.Tenants[0];
          this._sharedDataService.tenantSearchResult = this.tenantList;
          this.tenantResultCount = responseData.Tenants[1][0].Total_Count;
          this._sharedDataService.tenantSearchResultCount = this.tenantResultCount;
          this.placeTenantPins(this.tenantList);
        }
      }
      else {
        this.toastr.error('No result found!');
        // alert("No result found");
      }
      this.Isloader = false;
      this.IsRefreshloader = false;
      this.isViewportChange = false;
    });
  }
  ViewPortChangeCheck() {
    this._mapService.OnMapViewPortChangedOnce(this.map, (boundProperties: MapBound) => {
      if (this.isSearchClicked) {
        this.isViewportChange = true;
      }
      this.ViewPortChangeCheck();
    });
  }
  private placeMarker(tenant: any, isDraggable: boolean = false) {
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
    this.closeMultiDetailNav();
    this.CloseActionBtnDetail = true;
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

  openMultiDetailNav(id) {
    this._sharedDataService.selectedTenantPin = id;
    let communicationModel = new CommunicationModel();
    communicationModel.Key = "FromMultiTenant";
    communicationModel.data = id;
    this._CommService.broadcast(communicationModel);
     
    this.closeDetailNav();
    this.CloseActionBtnMultiDetail = true;
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
    this.MinAnnualRevenueError = false;
    this.MinCompanySizeError = false;
    

    if ((this.searchCriteria.MinAnnualRevenue && this.searchCriteria.MaxAnnualRevenue) && (this.searchCriteria.MinAnnualRevenue > this.searchCriteria.MaxAnnualRevenue)) {
      this.MinAnnualRevenueError = true;
    }
  
    if((this.searchCriteria.MinCompanySize && this.searchCriteria.MaxCompanySize) && (this.searchCriteria.MinCompanySize> this.searchCriteria.MaxCompanySize)) {
      this.MinCompanySizeError = true;
    }


  }
}
