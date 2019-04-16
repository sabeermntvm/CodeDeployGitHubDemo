import { Component, OnInit } from '@angular/core';
import { UserPreferance } from './data';
import { SharedDataService } from '../../core/services/shareddata.service';
import { PagerService } from '../../core/services/pager.service';
import { LoginService } from '../../core/services';
import { CommunicationService } from '../../core/services/communication.service';
import { Router } from '@angular/router';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { UserPreferencesService } from '../../core/services/user-preferences.service';
import { ExcelService } from '../../core/services/excel.service';
import { Subscription } from 'rxjs';
import { TransactionService } from "../../core/services/transaction.service";
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-leasegallery',
  templateUrl: './leasegallery.component.html',
  styleUrls: ['./leasegallery.component.css']
})
export class LeasegalleryComponent implements OnInit {
  CloseActionBtnDetail: boolean;
  SideDetailNav: boolean;
  sheets: Array<any>;
  userId: number;
  userPreferencesId: number;
  Task: any;
  UnitId: number;
  TotalResultCount: number;
  pager: any = {};
  pagedItems: any = [];
  currentPage: number = 1;
  searchCriteria: any;
  isSelectAll: boolean;
  Isloader: boolean;
  metricUnit: number = 1;
  CloseActionBtnSet: boolean;
  LeaseList : any[] = [];
  leaseSelectedCount: number = 0;
  selectedLeaseTransactionList = new Array<any>();
  closeExportSubscription: Subscription;
  public mediaUrl: any;
  
  
  constructor(private _sharedDataService: SharedDataService,
    private pagerService: PagerService,
    private _loginService: LoginService,
    private _CommService: CommunicationService,
    private _router: Router,
    private _userPreferencesService: UserPreferencesService
    , private _excelService: ExcelService,
    private _transactionService: TransactionService
    , private toastr: ToastrService) {
      this.sheets = UserPreferance;
    this.UnitId = this._loginService.UserInfo.UnitId;
    this.metricUnit = UnitConversionEnum.Metric;
   
    this.sheets = [{
      name: 'Lease Transactions',
      show: true,
      fields: [{
        key: 'Address',
        name: 'Address',
        show: true,
        order: 1
      }, {
        key: 'AskingPrice',
        name: 'Asking Price',
        show: true,
        order: 2
      }, {
        key: 'BuildingSF',
        name: 'Building Size(SF)',
        show: true,
        order: 3
      }, {
        key: 'BuildingSizeSMFormatted',
        name: 'Building Size(SM)',
        show: true,
        order: 4
      }, {
        key: 'LeaseID',
        name: 'LeaseID',
        show: true,
        order: 5
      }, {
        key: 'ExecutionDate',
        name: 'ExecutionDate',
        show: true,
        order: 6
      }, {
        key: 'ExpiryDate',
        name: 'ExpiryDate',
        show: true,
        order: 7
      }, {
        key: 'Latitude',
        name: 'Latitude',
        show: true,
        order: 8
      }, {
        key: 'Longitude',
        name: 'Longitude',
        show: true,
        order: 9
      }, {
        key: 'MainPhotoUrl',
        name: 'MainPhotoUrl',
        show: true,
        order: 10
      }, {
        key: 'PropertyID',
        name: 'PropertyID',
        show: true,
        order: 11
      }, {
        key: 'PropertyName',
        name: 'PropertyName',
        show: true,
        order: 12
      }, {
        key: 'PropertyUse',
        name: 'Type',
        show: true,
        order: 13
      }, {
        key: 'TenantName',
        name: 'Tenant',
        show: true,
        order: 14
      }, {
        key: 'LeaseTypeName',
        name: 'Lease Type',
        show: true,
        order: 15
      }, {
        key: 'LeasedSM',
        name: 'Leased SM',
        show: true,
        order: 16
      }, {
        key: 'Floor',
        name: 'FloorNumber',
        show: true,
        order: 17
      }, {
        key: 'SuiteID',
        name: 'Suite',
        show: true,
        order: 18
      }, {
        key: 'ListingTypeID',
        name: 'Direct/Sublease',
        show: true,
        order: 19
      }, {
        key: 'DealingNumber',
        name: 'Dealing#',
        show: true,
        order: 20
      }, {
        key: 'SpecificUseName',
        name: 'Specific Use',
        show: true,
        order: 21
      }, {
        key: 'ZipCode',
        name: 'Zip Code',
        show: true,
        order: 22
      },{
        key: 'LeaseFolio',
        name: 'Folio',
        show: true,
        order: 23
      },{
        key: 'TransactionOrigination',
        name: 'TransactionOrigination',
        show: true,
        order: 24
      },{
        key: 'SpaceTypeName',
        name: 'Space Type',
        show: true,
        order: 25
      },{
        key: 'IsCondo',
        name: 'Condo',
        show: true,
        order: 26
      },{
        key: 'LeaseRateType',
        name: 'Lease Rate Type',
        show: true,
        order: 27
      },{
        key: 'SuiteComments',
        name: 'SuiteComments',
        show: true,
        order: 28
      },{
        key: 'TransactionComments',
        name: 'TransactionComments',
        show: true,
        order: 29
      },{
        key: 'LeaseTerms',
        name: 'Term',
        show: true,
        order: 30
      }
      ]
    }];
    this.Isloader = false;
    this.userPreferencesId = null;
    this.userId = this._loginService.UserInfo.EntityID;

  for(var i = 0; i < 10; i++){
    this.LeaseList.push(i);
  }
  this._userPreferencesService.getUserPreferences(this.userId, 'download', 'Lease Transaction').subscribe(result => {
    const response = JSON.parse(result['_body']).responseData[0];
    if (response) {
      this.sheets = JSON.parse(response.Data);
      this.userPreferencesId = response.UserPreferencesID;
    }
  });
  this.closeExportSubscription = this._CommService.subscribe("CloseLeaseTransactionExportsettings").subscribe((data) => {
    if (data.data == 'Download')
      this.exportToExcel();
  });
  this.setDefaultUserPreferences();
  this.mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
}

  ngOnInit() {
    this.initializeData();
    this.onAllselectChk();
  }

  ngOnDestroy() {
    this.closeExportSubscription.unsubscribe();
  }
  
  initializeData() {
    
    this.TotalResultCount = this._sharedDataService.leaseSearchResultCount;
    this.searchCriteria = this._sharedDataService.leaseSearchCriteria;
    this.LeaseList = this._sharedDataService.searchLeaseTransactionList;
     if (!!this.LeaseList) {
       this.LeaseList.filter(x => x.isSelected == true).forEach(element => {
         this.leaseSelectedCount++;
       });
 
     }
     this.currentPage = localStorage.getItem('LeaseCurrentPage') ? JSON.parse(localStorage.getItem('LeaseCurrentPage')) : this.currentPage;
     this.pager = this.pagerService.getPager(this._sharedDataService.leaseSearchResultCount, this.currentPage, this.searchCriteria.PageSize || 100);
   }

  openDetailNav() {
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
  onClickSelectAll(isChecked: boolean) {

    if (this.LeaseList.length > 0) {
      this.LeaseList.forEach(txn => {
        txn.isSelected = this.isSelectAll;
        if (isChecked) {
          this.leaseSelectedCount = this.LeaseList.length;
        }
        else {
          this.leaseSelectedCount = 0;
        }

      });
    }
  }

  Selection(isChecked: boolean) {
     this._sharedDataService.searchLeaseTransactionList = this.LeaseList;
    if (isChecked) {
      this.leaseSelectedCount = this.leaseSelectedCount + 1
    }
    else {
      this.leaseSelectedCount = this.leaseSelectedCount - 1;
    }
    this.onAllselectChk();
  }
  onAllselectChk() {
    if (this.LeaseList.length > 0) {
      var count = 0;
      this.LeaseList.forEach(trans => {
        if (trans.isSelected == true) {
          count++
        }
      })
      if (count == this.LeaseList.length) {
        this.isSelectAll = true;
      }
      else {
        this.isSelectAll = false;
      }
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
  closeNav() {
    this.CloseActionBtnSet = false;
    document.getElementById("MapSidenav").style.width = "0";
    document.getElementById("MapSidenavSetting").style.width = "0";
  }
  onRemoveClick(value) {
    
        if (value == 1) {
          // this.transactionList.forEach((txn, index) => {
          //   if (txn.isSelected)
          //     this.transactionList.splice(index, 1);
          //   this.Count=0;
          // });
          this.LeaseList.filter(x => x.isSelected == true).forEach(element => {
            const index: number = this.LeaseList.indexOf(element);
            this.LeaseList.splice(index, 1);
            this.leaseSelectedCount = 0;
          });
        } else {
          // this.transactionList.forEach((txn, index) => {
          //   if (!txn.isSelected)
          //     this.transactionList.splice(index, 1);
          // });
          this.LeaseList.filter(x => x.isSelected != true).forEach(element => {
            const index: number = this.LeaseList.indexOf(element);
            this.LeaseList.splice(index, 1);
    
          });
        }
      }
  showUserPreferencesModal(Task: any) {
    let count = 0;
    this.LeaseList.forEach(prop => {
      if (prop.isSelected) {
        count++;
      }
    });
    if (count > 0) {
      this.Task = Task;
      this.opensettingsNav();
    } else {
      this.toastr.error('Select Lease Transaction');
      // alert('Select Lease Transaction');
    }
  
  }
  setPage(page: number) {
    this.Isloader = true;
    this.currentPage = page;
    this.searchCriteria.PageNo = page;
    this.searchTransaction();
    localStorage.setItem('LeaseCurrentPage', JSON.stringify(this.currentPage));

  }
  searchTransaction() {
    let result = this._transactionService.LeaseTransactionSearch(this.searchCriteria);
    result.subscribe(item => {
      let props = JSON.parse(item['_body']).responseData.LeaseTransaction[0];

      if (!!this.selectedLeaseTransactionList && this.selectedLeaseTransactionList.length > 0) {
        this.selectedLeaseTransactionList.forEach(selectedProp => {
          props.forEach(resultProp => {
            if (selectedProp.LeaseID == resultProp.LeaseID)
              resultProp.isSelected = true;
          })
        });
      }

      this.LeaseList = props;
      this.Isloader = false;
      this._sharedDataService.searchLeaseTransactionList = this.LeaseList;
      this.pager = this.pagerService.getPager(this._sharedDataService.leaseSearchResultCount, this.currentPage, this.searchCriteria.PageSize ||100);
    });
  }
        closeSettingsNav() {
        this.CloseActionBtnSet = false;
        document.getElementById("MapSidenav").style.width = "0";
        document.getElementById("MapSidenavSetting").style.width = "0";
      }
       setDefaultUserPreferences() {
        // User Default Preferences for Property download
        
        this.sheets = [{
          name: 'Lease Transactions',
          show: true,
          fields: [{
            key: 'Address',
            name: 'Address',
            show: true,
            order: 1
          }, {
            key: 'AskingRateText',
            name: 'Asking Price',
            show: true,
            order: 2
          },
          // {
          //   key: 'BuildingSizeSF',
          //   name: 'Building Size(SF)',
          //   show: true,
          //   order: 3
          // }, 
          {
            key: 'BuildingSizeSM',
            name: 'Building Size(SqM)',
            show: true,
            order: 4
          }, {
            key: 'LeaseID',
            name: 'LeaseID',
            show: true,
            order: 5
          }, {
            key: 'ExecutionDate',
            name: 'ExecutionDate',
            show: true,
            order: 6
          }, {
            key: 'ExpirationDate',
            name: 'ExpiryDate',
            show: true,
            order: 7
          }, {
            key: 'Latitude',
            name: 'Latitude',
            show: true,
            order: 8
          }, {
            key: 'Longitude',
            name: 'Longitude',
            show: true,
            order: 9
          }, {
            key: 'MainPhotoUrl',
            name: 'MainPhotoUrl',
            show: true,
            order: 10
          }, {
            key: 'PropertyID',
            name: 'PropertyID',
            show: true,
            order: 11
          }, {
            key: 'PropertyName',
            name: 'PropertyName',
            show: true,
            order: 12
          }, {
            key: 'PropertyUse',
            name: 'Type',
            show: true,
            order: 13
          }, {
            key: 'TenantName',
            name: 'Tenant',
            show: true,
            order: 14
          }, {
            key: 'LeaseTypeName',
            name: 'Lease Type',
            show: true,
            order: 15
          }, {
            key: 'LeasedSM',
            name: 'Leased SqM',
            show: true,
            order: 16
          }, {
            key: 'FloorNumber',
            name: 'FloorNumber',
            show: true,
            order: 17
          }, {
            key: 'SuiteNumber',
            name: 'Suite',
            show: true,
            order: 18
          }, {
            key: 'ListingTypeName',
            name: 'Direct/Sublease',
            show: true,
            order: 19
          }, {
            key: 'DealingNumber',
            name: 'Dealing#',
            show: true,
            order: 20
          }, {
            key: 'SpecificUsesName',
            name: 'Specific Use',
            show: true,
            order: 21
          }, {
            key: 'ZipCode',
            name: 'Zip Code',
            show: true,
            order: 22
          },{
            key: 'LeaseFolio',
            name: 'Folio',
            show: true,
            order: 23
          },{
            key: 'TransactionOriginationTypeName',
            name: 'TransactionOrigination',
            show: true,
            order: 24
          },{
            key: 'SpaceTypeName',
            name: 'Space Type',
            show: true,
            order: 25
          },{
            key: 'IsCondo',
            name: 'Condo',
            show: true,
            order: 26
          },{
            key: 'LeaseTypeName',
            name: 'Lease Rate Type',
            show: true,
            order: 27
          },{
            key: 'SuiteComments',
            name: 'SuiteComments',
            show: true,
            order: 28
          },{
            key: 'TransactionComments',
            name: 'TransactionComments',
            show: true,
            order: 29
          },{
            key: 'LeaseTerms',
            name: 'Term',
            show: true,
            order: 30
          }
          ]
        }];    
        this.userPreferencesId = null;
        const loginData = this._loginService.UserInfo;
        if (!!loginData) {
          this.userId = this._loginService.UserInfo.EntityID;
          this._userPreferencesService.getUserPreferences(this._loginService.UserInfo.EntityID, 'download', 'Lease Transactions').subscribe(result => {
            const response = JSON.parse(result['_body']).responseData;
            if (response) {
              this.sheets = JSON.parse(response.Data);
              this.sheets[0].fields = this.sheets[0].fields.filter(x => x.key != 'BuildingSizeSF');
              var data = [
                ["BuildingSizeSM","Building Size SqM"],
                ["LeasedSM","Leased SqM"]];
              data.forEach(element => {
                let a=  this.sheets[0].fields.findIndex(x => x.key == element[0]);
                a!=-1?this.sheets[0].fields[a].name = element[1]:null;
              });
              this.userPreferencesId = response.UserPreferencesID;
            }
          });
        }
      }
      exportToExcel() {
        const searchCriteria = this.searchCriteria;
        searchCriteria.StartingIndex = 1;
        searchCriteria.OffsetValue = 1000;
        const sheetNames = [];
        const dataArray = [];
        this.sheets.forEach(sheet => {
          if (sheet.show) {
            sheetNames.push(sheet.name);
            sheet.fields.sort((a, b) => a.order - b.order);
            if (sheet.name === 'Lease Transactions') {
              dataArray.push(this.getSelectedFields(this.LeaseList.filter(x => x.isSelected == true), sheet.fields));
            }
          }
        });
        this._excelService.exportToExcel(dataArray, sheetNames, 'LeaseTransactionReport')
        this.closeSettingsNav();
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
      public showTransactionDetails(PropertyId,leaseId) {
     //   this._router.navigate(['/property/propertySummary',PropertyId,0,0,leaseId,0]);
     this._router.navigate(['/property/propertySummary', PropertyId,0,0,leaseId,0]);
   
    }

}
