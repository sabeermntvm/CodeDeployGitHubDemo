import { Component, OnInit, Input } from '@angular/core';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { SharedDataService } from '../../../../core/services/shareddata.service';
import { Observable, Subject } from 'rxjs/Rx';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { LoginService } from '../../../../core/services/login.service';
import { LookupService } from '../../../../core/services/lookup.service';
import { AnalyticsDimentions } from '../../../../core/models/AnalyticsSearchCriteria';

@Component({
  selector: 'app-askrentcomparisonweighted',
  templateUrl: './askrentcomparisonweighted.component.html',
  styleUrls: ['./askrentcomparisonweighted.component.css']
})
export class AskrentcomparisonweightedComponent implements OnInit {

  
  SpecificUseList: Array<any> = [];
  specificUseArray: any;
  masterChartdata3: any;
  chartdata3: any;
  dataLoaded: boolean = false;
  buildingClass: Array<any>;
  classArray: any;
  customColors: any;
  cityInput = new Subject<string>();
  cityLoading: boolean = false;
  CityList: Array<any>;
  cityArray: any;
  zipcodeInput = new Subject<string>();
  zipcodeLoading: boolean = false;
  ZipCodes: Array<any>;
  zipCodeArray: any;
  propertyTypes: any;
  propertyTypeArray: Array<any>;
  searchCriteria: AnalyticsDimentions;
  Isloader: boolean;
  isSearchClicked: boolean;
  isPostalCodeSelected: boolean;
  isCitySelected: boolean;
  isMarketSelected: boolean;
  displaySubLease3: boolean = false;;

  chartHeader = "Asking Rent Comparison Weighted";
  yAxisLabel = "Average Asking Rate";
  CloseActionBtn : boolean = false;
  CloseActionBtnChkBox : boolean = false;
  selectedPropertyList: Array<number> = [];

  @Input() propertyId: any;
  @Input() zipcode: any;

  

  constructor(private _analyticsService: AnalyticsService,
    private _lookupService: LookupService,
    private _loginService: LoginService,
    private _sharedDateService: SharedDataService) { }


  ngOnInit() {

    this.propertyTypeArray = [];
    this.specificUseArray = [];
    this.cityArray = [];
    this.zipCodeArray = [];
    this.classArray = [1, 2, 3, 4];
    this.buildingClass =[];
    // this.zipCodeArray.push(this.zipcode);

    this.cityInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.cityLoading = true;
      const response_Cities = this._lookupService.CitySearch(value, this._loginService.UserInfo.CountryID);
      response_Cities.subscribe(result => {
        this.CityList = JSON.parse(result['_body']).responseData || [];
        this.cityLoading = false;
      });

    });

    this.zipcodeInput.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.zipcodeLoading = true;
      const response_zipcode = this._lookupService.ZipCodeSearch(value, this._loginService.UserInfo.CountryID);
      response_zipcode.subscribe(result => {
        this.ZipCodes = JSON.parse(result['_body']).responseData || [];
        this.zipcodeLoading = false;
      });

    });

    if (!!this._sharedDateService.propertyTypes && this._sharedDateService.propertyTypes.length > 0) {
      this.propertyTypes = this._sharedDateService.propertyTypes;
    } else {
      this.getPropertyType();
    }

    if (!!this._sharedDateService.buildingClass && this._sharedDateService.buildingClass.length > 0) {
      this.buildingClass = this._sharedDateService.buildingClass;
    } else {
      this.getBuildingClass();
    }

    this.onSearchClick();
  }

  getBuildingClass() {
    const buildingClass = this._lookupService.getBuildingClass();
    buildingClass.subscribe(result => {
      if (!JSON.parse(result['_body']).error) {
        this.buildingClass = JSON.parse(result['_body']).responseData;
        this._sharedDateService.buildingClass = JSON.parse(result['_body']).responseData;
      }
      else
        this._sharedDateService.buildingClass = null;
    });
  }

  getPropertyType() {
    const propertyType = this._lookupService.GetAllPropertyType();
    propertyType.subscribe(result => {
      if (!JSON.parse(result['_body']).error) {
        this.propertyTypes = JSON.parse(result['_body']).responseData;
        this._sharedDateService.propertyTypes = JSON.parse(result['_body']).responseData;
      }
      else
        this._sharedDateService.propertyTypes = null;

    });

  }

  getSpecificUseList(propertyTypeId) {
    this._sharedDateService.specificUses.filter(x=>x.UseTypeID == propertyTypeId).forEach(specific => {
        this.SpecificUseList.push(specific);
    });
  }

  onPropertyTypeSelected(data) {
    this.SpecificUseList = [];
    data.forEach(value => {
      this.getSpecificUseList(value.UseTypeID);
    });
  }

  public onSearchClick() {
    this.dataLoaded = false;
    let dimentions = new AnalyticsDimentions();
    this.Isloader = true;
    this.isSearchClicked = true;
    dimentions.LoginEntityID = this._loginService.UserInfo.EntityID;
    dimentions.PropertyIDs = this.propertyId;
    dimentions.SpecificUseId = this.arrayToString(this.specificUseArray);
    dimentions.PropertyTypeId = this.arrayToString(this.propertyTypeArray);
    dimentions.CityId = this.arrayToString(this.cityArray);
    dimentions.ZipCode = this.arrayToString(this.zipCodeArray);
    dimentions.ClassID = this.arrayToString(this.classArray);


    let result = this._analyticsService.getAskRentComparisonWeighted(dimentions);
    result.subscribe(item => {

      let data = JSON.parse(item['_body']).responseData;
      if (data) {
        this.masterChartdata3 = data.dashboardData[0];
        this.masterChartdata3.forEach(element => {
          element.IsSelected = true;
        });
        this.filterColumns3(null, null);
      }
    });
    localStorage.setItem('PropertySearchCriteria', JSON.stringify(this.searchCriteria));
    sessionStorage.removeItem('page');
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


  onSearchResetClick() {
    this.propertyTypeArray = [];
    this.specificUseArray = [];
    this.cityArray = [];
    this.zipCodeArray = [];
    this.ZipCodes = new Array<any>();
    this.CityList = new Array<any>();
    this.isCitySelected = false;
  }

  filterColumns3(event: any, name:string){
    this.dataLoaded = false;
    this.customColors = [];
    if(name)
    this.masterChartdata3.find(x => x.name == name).IsSelected = event.currentTarget.checked;
    if(this.displaySubLease3){
      this.chartdata3 = Object.assign([], this.masterChartdata3.filter(x => x.IsSelected == true));
    }else{
      this.chartdata3 = Object.assign([], this.masterChartdata3.filter(x => x.Type != 'Sublease').filter(x => x.IsSelected == true));
    }
    this.applySubLeaseColors();
    this.dataLoaded = true;
    this.Isloader = false;
    this.isSearchClicked = false;
  }

  displaySubLeaseBars3(event: any) {
    this.displaySubLease3 =event.currentTarget.checked;
    this.filterColumns3(null, null);
  }

  applySubLeaseColors(){
    this.chartdata3.filter(x => x.Type == 'Sublease').forEach(y => {
      this.customColors.push({ "name": y.name, "value": "#0000ff" });
    });
  }






  
  openNav3() {
    this.closeChartNav3();
    this.CloseActionBtn = true;
    document.getElementById("chartNav3").style.width = "100%";
    document.getElementById("chartNavWrap3").style.width = "35%";
    if ($(window).width() < 767) {
      document.getElementById("chartNav3").style.width = "100%";
      document.getElementById("chartNavWrap3").style.width = "70%";
    }
    else {
      document.getElementById("chartNav3").style.width = "100%";
      document.getElementById("chartNavWrap3").style.width = "35%";
    }
  }

  closeNav() {
    this.CloseActionBtn = false;
    document.getElementById("chartNav3").style.width = "100%";
    document.getElementById("chartNavWrap3").style.width = "0";
  }

  openChartNav() {
    this.closeNav();
    this.CloseActionBtnChkBox = true;
    document.getElementById("chartNavChkBox3").style.width = "100%";
    document.getElementById("chartNavWrapChkBox3").style.width = "35%";
    if ($(window).width() < 767) {
      document.getElementById("chartNavChkBox3").style.width = "100%";
      document.getElementById("chartNavWrapChkBox3").style.width = "70%";
    }
    else {
      document.getElementById("chartNavChkBox3").style.width = "100%";
      document.getElementById("chartNavWrapChkBox3").style.width = "35%";
    }
  }

  closeChartNav3() {
    this.CloseActionBtnChkBox = false;
    document.getElementById("chartNavChkBox3").style.width = "100%";
    document.getElementById("chartNavWrapChkBox3").style.width = "0";
  }

}
