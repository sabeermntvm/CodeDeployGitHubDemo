import { Component, OnInit, Input } from '@angular/core';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { SharedDataService } from '../../../../core/services/shareddata.service';
import { Observable, Subject } from 'rxjs/Rx';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { LoginService } from '../../../../core/services/login.service';
import { LookupService } from '../../../../core/services/lookup.service';
import { AnalyticsDimentions } from '../../../../core/models/AnalyticsSearchCriteria';

@Component({
  selector: 'app-vacancyratecomparison',
  templateUrl: './vacancyratecomparison.component.html',
  styleUrls: ['./vacancyratecomparison.component.css']
})
export class VacancyratecomparisonComponent implements OnInit {

  SpecificUseList: Array<any> = [];
  specificUseArray: any;
  masterChartdata2: any;
  chartdata2: any;
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
  displaySubLease2: boolean = false;;

  chartHeader = "Vacancy Rate Comparison";
  yAxisLabel = "Average Vecancy Rate";
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


    let result = this._analyticsService.getVacancyRateComparison(dimentions);
    result.subscribe(item => {

      let data = JSON.parse(item['_body']).responseData;
      if (data) {
        this.masterChartdata2 = data.dashboardData[0];
        this.masterChartdata2.forEach(element => {
          element.IsSelected = true;
        });
        this.filterColumns2(null, null);
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

  filterColumns2(event: any, name:string){
    this.dataLoaded = false;
    this.customColors = [];
    if(name)
    this.masterChartdata2.find(x => x.name == name).IsSelected = event.currentTarget.checked;
    if(this.displaySubLease2){
      this.chartdata2 = Object.assign([], this.masterChartdata2.filter(x => x.IsSelected == true));
    }else{
      this.chartdata2 = Object.assign([], this.masterChartdata2.filter(x => x.Type != 'Sublease').filter(x => x.IsSelected == true));
    }
    this.applySubLeaseColors();
    this.dataLoaded = true;
    this.Isloader = false;
    this.isSearchClicked = false;
  }

  displaySubLeaseBars2(event: any) {
    this.displaySubLease2 =event.currentTarget.checked;
    this.filterColumns2(null, null);
  }

  applySubLeaseColors(){
    this.chartdata2.filter(x => x.Type == 'Sublease').forEach(y => {
      this.customColors.push({ "name": y.name, "value": "#0000ff" });
    });
  }






  
  openNav2() {
    this.closeChartNav2();
    this.CloseActionBtn = true;
    document.getElementById("chartNav2").style.width = "100%";
    document.getElementById("chartNavWrap2").style.width = "35%";
    if ($(window).width() < 767) {
      document.getElementById("chartNav2").style.width = "100%";
      document.getElementById("chartNavWrap2").style.width = "70%";
    }
    else {
      document.getElementById("chartNav2").style.width = "100%";
      document.getElementById("chartNavWrap2").style.width = "35%";
    }
  }

  closeNav() {
    this.CloseActionBtn = false;
    document.getElementById("chartNav2").style.width = "100%";
    document.getElementById("chartNavWrap2").style.width = "0";
  }

  openChartNav() {
    this.closeNav();
    this.CloseActionBtnChkBox = true;
    document.getElementById("chartNavChkBox2").style.width = "100%";
    document.getElementById("chartNavWrapChkBox2").style.width = "35%";
    if ($(window).width() < 767) {
      document.getElementById("chartNavChkBox2").style.width = "100%";
      document.getElementById("chartNavWrapChkBox2").style.width = "70%";
    }
    else {
      document.getElementById("chartNavChkBox2").style.width = "100%";
      document.getElementById("chartNavWrapChkBox2").style.width = "35%";
    }
  }

  closeChartNav2() {
    this.CloseActionBtnChkBox = false;
    document.getElementById("chartNavChkBox2").style.width = "100%";
    document.getElementById("chartNavWrapChkBox2").style.width = "0";
  }

}
