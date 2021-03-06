import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserPreferance } from '../../config/data';
import { SharedDataService } from '../../core/services/shareddata.service';
import { PagerService } from '../../core/services/pager.service';
import { PropertySearchCriteria } from '../../core/models/PropertySearchCriteria';
import { PropertyService } from '../../core/services/api-property.service';
import { CommunicationModel, CommunicationService } from '../../core/services/communication.service';
import { environment } from '../../../environments/environment';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { LoginService } from '../../core/services';
import { ExcelService } from '../../core/services/excel.service';
import { UserPreferencesService } from '../../core/services/user-preferences.service';
import { Subscription } from 'rxjs';
import { ReportService } from '../../core/services/report.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-propertygallery',
  templateUrl: './propertygallery.component.html',
  styleUrls: ['./propertygallery.component.css']
})
export class PropertygalleryComponent implements OnInit {

  isSelectAll: boolean = false;
  propertyList: Array<any> = [];
  searchCriteria: PropertySearchCriteria;
  TotalResultCount: number;
  UnitId: number;
  pager: any = {};
  pagedItems: any = [];
  currentPage: number = 1;
  selectedPropertyList: Array<any>;
  public mediaUrl: any;
  metricUnit:number=1;
  CloseActionBtnSet: boolean;
  sheets: Array<any>;
  userId: number;
  userPreferencesId: number;
  Task: any;
  closeExportSubscription: Subscription;
  Count: number = 0;
  IsEmpiricalUser:boolean=false;
  constructor(private _router: Router,
    private _sharedDataService: SharedDataService,
    private pagerService: PagerService,
    private _propertyService: PropertyService,
    private _CommService: CommunicationService
    , private _loginService: LoginService
    , private _excelService: ExcelService
    , private _userPreferencesService: UserPreferencesService
    , private _reportService: ReportService
    , private toastr: ToastrService) {
    this.propertyList = this._sharedDataService.searchProperties;
    this.propertyList.filter(x => x.isSelected == true).forEach(element => {
      this.Count++;
    });
    this.mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
    this.searchCriteria = new PropertySearchCriteria();
    this.UnitId=this._loginService.UserInfo.UnitId;
    this.metricUnit = UnitConversionEnum.Metric;
    this.sheets = UserPreferance;
    this.closeExportSubscription = this._CommService.subscribe("ClosePropertyExportsettings").subscribe((data) => {
      if (data.data == 'Download')
      this.exportToExcel();
    });
    this.setDefaultUserPreferences();
  }

  EmpiricalUserCheck(){
    const UserCompanyId = this._loginService.UserInfo.CompanyID;
    if(UserCompanyId == 2){
      this.IsEmpiricalUser = true;
    }
  }
  ngOnDestroy() {
    this.closeExportSubscription.unsubscribe();
  }
  ngOnInit() {
    this.onAllselectChk();
    this.TotalResultCount = this._sharedDataService.searchResultCount;
    this.searchCriteria = this._sharedDataService.searchCriteria;
    this.currentPage = JSON.parse(sessionStorage.getItem('page'));
    this.pager = this.pagerService.getPager(this._sharedDataService.searchResultCount, this.currentPage,this.searchCriteria.OffsetValue||100);
   this. EmpiricalUserCheck();
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
  setPage(page: number) {
    this.currentPage = page;
    this.searchCriteria.StartingIndex = page;
    this.searchProperty();
    sessionStorage.setItem('page', JSON.stringify(this.currentPage));
  }
  searchProperty() {
    const result = this._propertyService.propertySearch(this.searchCriteria);
    result.subscribe(item => {
      let props = JSON.parse(item['_body']).responseData.Property[0];
      this.propertyList = props;
      this.pager = this.pagerService.getPager(this._sharedDataService.searchResultCount, this.currentPage, this.searchCriteria.OffsetValue||100);
    });
  }

   onClickSelectAll() {
    if (this.propertyList.length > 0) {
      this.propertyList.forEach(prop => {
        prop.isSelected = this.isSelectAll;
      });
    }
  }
  onRemoveClick(value) {
    if (value == 1) {
      this.propertyList.filter(x => x.isSelected == true).forEach(element => {
        const index: number = this.propertyList.indexOf(element);
        this.propertyList.splice(index, 1);
         this.Count=0;
      });
    } else {
      
      this.propertyList.filter(x => x.isSelected != true).forEach(element => {
        const index: number = this.propertyList.indexOf(element);
        this.propertyList.splice(index, 1);
       
      });
    }
  }
  onSelectClick(isChecked: boolean) {
    if (isChecked) {
      if (this.propertyList.length > 0) {
        this.propertyList.forEach(prop => {
          prop.isSelected = true;
            this.Count = this.propertyList.length;
        });
      }
    }
    else {
      if (this.propertyList.length > 0) {
        this.propertyList.forEach(prop => {
          prop.isSelected = false;
           this.Count=0;
        });
      }
    }
  }

  onAllselectChk(){
    if (this.propertyList.length > 0) {
      var count = 0;
      this.propertyList.forEach(prop => {
        if(prop.isSelected == true){
          count++
        }
      })
      if(count == this.propertyList.length){
        this.isSelectAll = true;
      }
      else{
        this.isSelectAll = false;
      }
    }
  }


 Selection(isChecked: boolean) {
    if (isChecked) {
      this.Count= this.Count + 1
    }
    else {
      this.Count = this.Count - 1;
    }
    this.onAllselectChk();
  }
   public showListingDetails(PropertyId, ListingID) { 
       this._router.navigate(['/property/propertySummary', PropertyId]); 
  //   if (ListingID === null || ListingID === undefined) {   
  //     this._router.navigate(['/property/propertySummary', PropertyId]);
  //   } else {
  //     this._router.navigate(['/property/propertySummary', PropertyId, ListingID]);
  //   }
  // }
   }
   setDefaultUserPreferences() {
    // User Default Preferences for Property download
    this.sheets = [{
      name: 'Property',
      show: true,
      fields: [{
        key: 'PropertyID',
        name: 'Property ID',
        show: true,
        order: 1
      }, {
        key: 'PropertyName',
        name: 'Property Name',
        show: true,
        order: 2
      }, {
        key: 'MainPhotoUrl',
        name: 'Main Photo Url',
        show: true,
        order: 3
      }, {
        key: 'Address',
        name: 'Address',
        show: true,
        order: 4
      }, {
        key: 'CityName',
        name: 'City',
        show: true,
        order: 5
      }, {
        key: 'StateAbbr',
        name: 'State',
        show: true,
        order: 6
      }, {
        key: 'ZipCode',
        name: 'Zip Code',
        show: true,
        order: 7
       }, 
       {
        key: 'BuildingSizeSM',
        name: 'Building Size(SqM)',
        show: true,
        order: 9
      }, {
        key: 'ClassTypeName',
        name: 'Class Type',
        show: true,
        order: 10
      }, {
        key: 'PropertyUse',
        name: 'Property Type',
        show: true,
        order: 11
      },
      {
        key: 'LotSizeAC',
        name: 'Lot Size AC(SqM)',
        show: true,
        order: 13
      },
       {
        key: 'LotSizeSM',
        name: 'Lot Size(SM)',
        show: true,
        order: 15
      }, {
        key: 'SpecificUseName',
        name: 'Specific Use',
        show: true,
        order: 16
      }, {
        key: 'Floors',
        name: 'Floors',
        show: true,
        order: 17
      }, {
        key: 'YearBuilt',
        name: 'Year Built',
        show: true,
        order: 18
      }, {
        key: 'YearRenovated',
        name: 'Year Renovated',
        show: true,
        order: 19
      }, {
        key: 'CoreFactor',
        name: 'Core Factor',
        show: true,
        order: 20
      }, {
        key: 'PassengerElevators',
        name: 'Passenger Elevators',
        show: true,
        order: 21
      }, {
        key: 'DockHigh',
        name: 'Dock High',
        show: true,
        order: 22
      }, {
        key: 'GradeLevelDriveIn',
        name: 'Grade Level DriveIn',
        show: true,
        order: 23
      }, {
        key: 'SprinklerTypeName',
        name: 'Sprinkler Type',
        show: true,
        order: 24
      }, {
        key: 'ClearHeightMin',
        name: 'Clear Height Min',
        show: true,
        order: 25
      }, {
        key: 'ClearHeightMax',
        name: 'Clear Height Max',
        show: true,
        order: 26
      }, {
        key: 'NoOfOffices',
        name: 'No Of Offices',
        show: true,
        order: 27
      }, 
       {
        key: 'OfficeSM',
        name: 'Office(SqM)',
        show: true,
        order: 29
      }, {
        key: 'ParkingSpaces',
        name: 'Parking Spaces',
        show: true,
        order: 30
      }, {
        key: 'ParkingRatio',
        name: 'Parking Ratio',
        show: true,
        order: 31
      }, {
        key: 'TenancyName',
        name: 'Tenancy',
        show: true,
        order: 32
      }, {
        key: 'ZoningCode',
        name: 'Zoning Code',
        show: true,
        order: 33
      }, {
        key: 'ConstructionStatusName',
        name: 'Construction Status',
        show: true,
        order: 34
      }, {
        key: 'ParcelInfo',
        name: 'Parcel Info',
        show: true,
        order: 35
      }]
    }, {
      name: 'Listing',
      show: true,
      fields: [{
        key: 'PropertyID',
        name: 'Property ID',
        show: true,
        order: 1
      }, {
        key: 'ListingID',
        name: 'Listing ID',
        show: true,
        order: 2
      }, {
        key: 'GeneralUse',
        name: 'General Use',
        show: true,
        order: 3
      }, {
        key: 'RecordTypeID',
        name: 'Record Type ID',
        show: true,
        order: 4
      }, {
        key: 'ListingTypeName',
        name: 'Listing Type',
        show: true,
        order: 5
      }, {
        key: 'MinDiv',
        name: 'Min Div',
        show: true,
        order: 6
      }, {
        key: 'MinDivSM',
        name: 'Min Div(SqM)',
        show: true,
        order: 7
      }, {
        key: 'TotalAvailable',
        name: 'Total Available',
        show: true,
        order: 8
      }, {
        key: 'TotalAvailableSM',
        name: 'Total Available(SM)',
        show: true,
        order: 9
      }, {
        key: 'NoOfSpaces',
        name: 'No Of Spaces',
        show: true,
        order: 10
      }, {
        key: 'AskingLeaseRatePerYrText',
        name: 'Asking Lease Rate/Yr',
        show: true,
        order: 11
      }, {
        key: 'LeaseTypeName',
        name: 'Lease Type',
        show: true,
        order: 12
      }, {
        key: 'ListingStatusName',
        name: 'Listing Status',
        show: true,
        order: 13
      }, {
        key: 'AskingSalePrice',
        name: 'Asking Sale Price',
        show: true,
        order: 14
      }, 
       {
        key: 'SalePricePerSM',
        name: 'Sale Price/SqM',
        show: true,
        order: 16
      }, {
        key: 'CAPRate',
        name: 'CAP Rate',
        show: true,
        order: 17
      }, {
        key: 'ListingNotes',
        name: 'Listing Notes',
        show: true,
        order: 18
      }, {
        key: 'ListingCompanyName',
        name: 'Listing Company',
        show: true,
        order: 19
      }, {
        key: 'SuiteCount',
        name: 'Suite Count',
        show: true,
        order: 20
      }]
    }, {
      name: 'Suite',
      show: true,
      fields: [{
        key: 'ListingID',
        name: 'Listing ID',
        show: true,
        order: 1
      }, {
        key: 'FloorNumber',
        name: 'Floor Number',
        show: true,
        order: 2
      }, {
        key: 'SuiteNumber',
        name: 'Suite Number',
        show: true,
        order: 3
      },
       {
        key: 'AvailableSM',
        name: 'Available(SqM)',
        show: true,
        order: 5
      },
       {
        key: 'MinSM',
        name: 'Min SqM',
        show: true,
        order: 7
      }, {
        key: 'AskingRateText',
        name: 'Asking Rate',
        show: true,
        order: 8
      }, {
        key: 'SpaceTypeName',
        name: 'Space Type',
        show: true,
        order: 9
      }, {
        key: 'IsVacant',
        name: 'Vacant',
        show: true,
        order: 10
      }, {
        key: 'PossessionTypeName',
        name: 'Possession Type',
        show: true,
        order: 11
      }, {
        key: 'LeaseTerms',
        name: 'Lease Terms',
        show: true,
        order: 12
      }, {
        key: 'SuiteComments',
        name: 'Suite Comments',
        show: true,
        order: 13
      }, 
      {
        key: 'OfficeSpaceSM',
        name: 'Office Space(SqM)',
        show: true,
        order: 15
      }, {
        key: 'DockHighDoors',
        name: 'Dock High Doors',
        show: true,
        order: 16
      }, {
        key: 'GradeLevelDoorsTypeID',
        name: 'Grade Level Doors Type ID',
        show: true,
        order: 17
      }, 
      // {
      //   key: 'ClearHeightMin',
      //   name: 'Clear Height Min',
      //   show: true,
      //   order: 18
      // }, {
      //   key: 'ClearHeightMax',
      //   name: 'Clear Height Max',
      //   show: true,
      //   order: 19
      // }, 
      {
        key: 'ClearHeightMinM',
        name: 'Clear Height Min(SqM)',
        show: true,
        order: 20
      }, {
        key: 'ClearHeightMaxM',
        name: 'Clear Height Max(SqM)',
        show: true,
        order: 21
      }]
    }];
    this.userPreferencesId = null;
    const loginData = this._loginService.UserInfo;
    if (!!loginData) {
      this.userId = loginData.EntityID;
      this._userPreferencesService.getUserPreferences(this.userId, 'download', 'Property').subscribe(result => {
        const response = JSON.parse(result['_body']).responseData[0];
        if (response) {
          this.sheets = JSON.parse(response.Data);
          this.sheets[0].fields = this.sheets[0].fields.filter(x => x.key != 'BuildingSF').filter(x => x.key != 'LotSizeAC').filter(x => x.key != 'LotSizeSF').filter(x => x.key != 'OfficeSF');
          this.sheets[1].fields = this.sheets[1].fields.filter(x => x.key != 'SalePricePerSF').filter(x => x.key != 'MinDiv').filter(x => x.key != 'TotalAvailable').filter(x => x.key != 'SuiteCount');
          this.sheets[2].fields = this.sheets[2].fields.filter(x => x.key != 'AvailableSF').filter(x => x.key != 'MinSF').filter(x => x.key != 'OfficeSpaceSF').filter(x => x.key != 'ClearHeightMin').filter(x => x.key != 'ClearHeightMax');
          var data = [
            ["BuildingSizeSM","Building Size(SqM)"],
            ["LotSizeAC","Lot Size(Ha)"],
            ["OfficeSM","Office(SqM)"],
            ["MinDivSM","Min Div(SqM)"],
            ["TotalAvailableSM","Total Available(SqM)"],
            ["SalePricePerSM","Sale Price/SqM"],
            ["AvailableSM","Available(SqM)"],
            ["MinSM","Min(SqM)"],
            ["OfficeSpaceSM","Office Space(SqM)"],
            ["LotSizeSM","Lot Size(SqM)"],
            ["ClearHeightMaxM","Clear Height Max(SqM)"],
            ["ClearHeightMinM","Clear Height Min(SqM)"]
          ];
          data.forEach(element => {
            let a=  this.sheets[0].fields.findIndex(x => x.key == element[0]);
            a!=-1?this.sheets[0].fields[a].name = element[1]:null;
            let   b=  this.sheets[1].fields.findIndex(x => x.key == element[0]);
            b!=-1?this.sheets[1].fields[b].name = element[1]:null;
            let c=  this.sheets[2].fields.findIndex(x => x.key == element[0]);
            c!=-1?this.sheets[2].fields[c].name = element[1]:null;
          });
          this.userPreferencesId = response.UserPreferencesID;
        }
      });
    }
  }
  showUserPreferencesModal(Task: any) {  
    let count = 0;
    this.propertyList.forEach(prop => {
      if (prop.isSelected) {
        count++;
      }
    });
    if (count > 0) {
      this.Task = Task;
      this.opensettingsNav();
    } else {
      this.toastr.error('Select Property!');
      // alert('Select Property');
    }

  }

  exportToExcel() {  
    const searchCriteria = this.searchCriteria;
    searchCriteria.StartingIndex = 1;
    searchCriteria.OffsetValue = 1000;
    // this._propertyService.propertySearch(searchCriteria).subscribe(item => {
    //   const props = JSON.parse(item['_body']).responseData.Property[0];
    const propertyIdArray = [];
    const listingIdArray = [];
    this.propertyList.forEach(prop => {
      if (prop.isSelected) {
        // props.forEach(prop => {
        if (propertyIdArray.indexOf(prop.PropertyId) === -1) {
          propertyIdArray.push(prop.PropertyId);
        }
        if (prop.ListingID && (listingIdArray.indexOf(prop.ListingID) === -1)) {
          listingIdArray.push(prop.ListingID);
        }
      }
    });
    this._reportService.getListingsWithSuiteReport({
      PropertyID: propertyIdArray.join(','),
      ListingID: listingIdArray.join(',')
    }).subscribe(result => {
      const responseData = JSON.parse(result['_body']).responseData;
      const propertyList = responseData.Property;
      const listingList = responseData.Listing;
      const suiteList = responseData.Suite;

      const sheetNames = [];
      const dataArray = [];

      this.sheets.forEach(sheet => {
        if (sheet.show) {
          sheetNames.push(sheet.name);
          sheet.fields.sort((a, b) => a.order - b.order);
          if (sheet.name === 'Property') {
            dataArray.push(this.getSelectedFields(propertyList, sheet.fields));
          }
          if (sheet.name === 'Listing') {
            dataArray.push(this.getSelectedFields(listingList, sheet.fields));
          }
          if (sheet.name === 'Suite') {
            dataArray.push(this.getSelectedFields(suiteList, sheet.fields));
          }
        }
      });

      this._excelService.exportToExcel(dataArray, sheetNames, 'PropertyReport');
      this.closeSettingsNav();
    });

  }

  getSelectedFields(values, fieldList) {
    const newValues = [];
    values.forEach(value => {
      const newObj = {};
      fieldList.forEach(field => {
        if (field.show) {
          newObj[field.name] = value[field.key]
        }
      });
      newValues.push(newObj);
    });
    return newValues;
  }
   sendReport() {
    let count = 0;
    this.propertyList.forEach(prop => {
      if (prop.isSelected) {
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
    this.propertyList.forEach(prop => {
      if (prop.isSelected)
        count++;

    });

    if (count > 0) {
      this._router.navigate(['/report/reporthome']);
    }
    else {
      this.toastr.error('Select Property!');
      // alert("Select Property");
    }
  }
}
