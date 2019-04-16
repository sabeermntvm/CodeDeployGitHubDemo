import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from '../../core/services/shareddata.service';
import { PagerService } from '../../core/services/pager.service';
import { PropertySearchCriteria } from '../../core/models/PropertySearchCriteria';
import { PropertyService } from '../../core/services/api-property.service';
import { CommunicationModel, CommunicationService } from '../../core/services/communication.service';
import { environment } from '../../../environments/environment';
import { UserPreferance } from './data';
import { LoginService } from '../../core/services';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { TransactionSearchCriteria } from '../../core/models/TransactionSearchCriteria';
import { UserPreferencesService } from '../../core/services/user-preferences.service';
import { TransactionService } from '../../core/services/transaction.service';
import { ExcelService } from '../../core/services/excel.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-transactiongallery',
  templateUrl: './transactiongallery.component.html',
  styleUrls: ['./transactiongallery.component.css']
})
export class TransactiongalleryComponent implements OnInit {
  isSelectAll: boolean = false; 
  searchCriteria: TransactionSearchCriteria;
  TotalResultCount: number;
  UnitId: number;
  metricUnit: number = 1;
  pager: any = {};
  pagedItems: any = [];
  currentPage: number = 1;  
  transactionList: Array<any> = [];
  sheets: Array<any>;
  userId: number;
  userPreferencesId: number;
  Task: any;
  selectedCount: number = 0;
  Isloader: boolean;

  public mediaUrl: any;
  CloseActionBtnSet: boolean;
  CloseActionBtnDetail: boolean;
  closeExportSubscription: Subscription;

  constructor(private _router: Router,
    private _sharedDataService: SharedDataService,
    private pagerService: PagerService,
    private _propertyService: PropertyService,
    private _CommService: CommunicationService,
    private _loginService: LoginService,
    private transactionService: TransactionService,
    private _userPreferencesService: UserPreferencesService
    , private _excelService: ExcelService
    , private toastr: ToastrService) {
    this.sheets = UserPreferance;
    this.UnitId = this._loginService.UserInfo.UnitId;
    this.metricUnit = UnitConversionEnum.Metric;

    this.mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
    // User Default Preferences for Sale Txn download
    this.Isloader = false;
    this.sheets = [{
      name: 'Sale Transactions',
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
        order: 3
      }, {
        key: 'BuildingSF',
        name: 'Building Size(SF)',
        show: true,
        order: 2
      }, {
        key: 'BuildingSizeSMFormatted',
        name: 'Building Size(SM)',
        show: true,
        order: 4
      }, {
        key: 'Buyer',
        name: 'Buyer',
        show: true,
        order: 5
      }, {
        key: 'CityName',
        name: 'City',
        show: true,
        order: 6
      }, {
        key: 'DeedOrSaleDate',
        name: 'Sale Date',
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
        name: 'Main Photo Url',
        show: true,
        order: 10
      }, {
        key: 'PropertyID',
        name: 'Property ID',
        show: true,
        order: 11
      }, {
        key: 'PropertyName',
        name: 'Property Name',
        show: true,
        order: 12
      }, {
        key: 'PropertyUse',
        name: 'Type',
        show: true,
        order: 13
      }, {
        key: 'SaleID',
        name: 'Sale ID',
        show: true,
        order: 14
      }, {
        key: 'SalePricePerSF',
        name: 'Sale Price/SF',
        show: true,
        order: 15
      }, {
        key: 'SalePricePerSM',
        name: 'Sale Price/SM',
        show: true,
        order: 16
      }, {
        key: 'Seller',
        name: 'Seller',
        show: true,
        order: 17
      }, {
        key: 'SoldPrice',
        name: 'Sold Price',
        show: true,
        order: 18
      }, {
        key: 'SoldSF',
        name: 'Sold(SF)',
        show: true,
        order: 19
      }, {
        key: 'SoldSM',
        name: 'Sold(SM)',
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
      }
      ]
    }];
    this.userPreferencesId = null;
    this.userId = this._loginService.UserInfo.EntityID;
    this._userPreferencesService.getUserPreferences(this.userId, 'download', 'Sale Transaction').subscribe(result => {
      const response = JSON.parse(result['_body']).responseData[0];
      if (response) {
        this.sheets = JSON.parse(response.Data);
        this.userPreferencesId = response.UserPreferencesID;
      }
    });
    this.closeExportSubscription = this._CommService.subscribe("CloseTransactionExportsettings").subscribe((data) => {
      if (data.data == 'Download')
        this.exportToExcel();
    });
    this.setDefaultUserPreferences();
  }
  ngOnInit() {
    this.initializeData();
    this.onAllselectChk();
  }

  ngOnDestroy() {
    this.closeExportSubscription.unsubscribe();
  }

  initializeData() {
   
    this.TotalResultCount = this._sharedDataService.transactionSearchResultCount;
    this.searchCriteria = this._sharedDataService.transactionSearchCriteria;
    this.transactionList = this._sharedDataService.searchTransactions;
    if (!!this.transactionList) {
      this.transactionList.filter(x => x.isSelected == true).forEach(element => {
        this.selectedCount++;
      });

    }
    this.currentPage = localStorage.getItem('transactionpage') ? JSON.parse(localStorage.getItem('transactionpage')) : this.currentPage;
    this.pager = this.pagerService.getPager(this._sharedDataService.transactionSearchResultCount, this.currentPage, this.searchCriteria.OffsetValue);
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

  onSelectClick(value) {
    if (value == 1) {
      if (this.transactionList.length > 0) {
        this.transactionList.forEach(txn => {
          txn.isSelected = true;
          this.selectedCount = this.transactionList.length;
        });
      }
    } else {
      if (this.transactionList.length > 0) {
        this.transactionList.forEach(txn => {
          txn.isSelected = false;
          this.selectedCount = 0;
        });
      }
    }
  }

  onRemoveClick(value) {

    if (value == 1) {
      // this.transactionList.forEach((txn, index) => {
      //   if (txn.isSelected)
      //     this.transactionList.splice(index, 1);
      //   this.Count=0;
      // });
      this.transactionList.filter(x => x.isSelected == true).forEach(element => {
        const index: number = this.transactionList.indexOf(element);
        this.transactionList.splice(index, 1);
        this.selectedCount = 0;
      });
    } else {
      // this.transactionList.forEach((txn, index) => {
      //   if (!txn.isSelected)
      //     this.transactionList.splice(index, 1);
      // });
      this.transactionList.filter(x => x.isSelected != true).forEach(element => {
        const index: number = this.transactionList.indexOf(element);
        this.transactionList.splice(index, 1);

      });
    }
  }

  onClickSelectAll(isChecked: boolean) {
    if (this.transactionList.length > 0) {
      this.transactionList.forEach(txn => {
        txn.isSelected = this.isSelectAll;
        if (isChecked) {
          this.selectedCount = this.transactionList.length;
        }
        else {
          this.selectedCount = 0;
        }

      });
    }
  }

  Selection(isChecked: boolean) {
    this._sharedDataService.searchTransactions = this.transactionList;
    if (isChecked) {
      this.selectedCount = this.selectedCount + 1
    }
    else {
      this.selectedCount = this.selectedCount - 1;
    }
    this.onAllselectChk();
  }
  onAllselectChk() {
    if (this.transactionList.length > 0) {
      var count = 0;
      this.transactionList.forEach(trans => {
        if (trans.isSelected == true) {
          count++
        }
      })
      if (count == this.transactionList.length) {
        this.isSelectAll = true;
      }
      else {
        this.isSelectAll = false;
      }
    }
  }
  setPage(page: number) {
    this.Isloader = true;
    this.currentPage = page;
    this.searchCriteria.StartingIndex = page;
    this.searchTransaction();
    localStorage.setItem('transactionpage', JSON.stringify(this.currentPage));

  }
  searchTransaction() {

    let result = this.transactionService.saleTransactionSearch(this.searchCriteria);
    result.subscribe(item => {
      if (JSON.parse(item['_body']).responseData) {
        let props = JSON.parse(item['_body']).responseData.Transaction[0];
        this.transactionList = props;
        this._sharedDataService.searchTransactions = this.transactionList;
        this.pager = this.pagerService.getPager(this._sharedDataService.transactionSearchResultCount, this.currentPage, this.searchCriteria.OffsetValue);
      }
      else {
        this.toastr.error('No result found!');
        // alert("No result found");
      }
      this.Isloader = false;
    });
  }

  public showListingDetails(PropertyId, ListingID) {

  }


  sendReport() {

  }
  showUserPreferencesModal(Task: any) {
    let count = 0;
    this.transactionList.forEach(prop => {
      if (prop.isSelected) {
        count++;
      }
    });
    if (count > 0) {
      this.Task = Task;
      this.opensettingsNav();
    } else {
      this.toastr.error('Select Transaction!');
      // alert('Select Transaction');
    }
  }

  showReport() {

  }

  sortProperty(name: any, sort: any) {

  }
  closeSettingsNav() {
    this.CloseActionBtnSet = false;
    document.getElementById("MapSidenav").style.width = "0";
    document.getElementById("MapSidenavSetting").style.width = "0";
  }
  setDefaultUserPreferences() {
    // User Default Preferences for Property download
    this.sheets = [{
      name: 'Sale Transactions',
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
        order: 3
      }, {
        key: 'BuildingSF',
        name: 'Building Size(SF)',
        show: true,
        order: 2
      }, {
        key: 'BuildingSizeSMFormatted',
        name: 'Building Size(SM)',
        show: true,
        order: 4
      }, {
        key: 'Buyer',
        name: 'Buyer',
        show: true,
        order: 5
      }, {
        key: 'CityName',
        name: 'City',
        show: true,
        order: 6
      }, {
        key: 'DeedOrSaleDate',
        name: 'Sale Date',
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
        name: 'Main Photo Url',
        show: true,
        order: 10
      }, {
        key: 'PropertyID',
        name: 'Property ID',
        show: true,
        order: 11
      }, {
        key: 'PropertyName',
        name: 'Property Name',
        show: true,
        order: 12
      }, {
        key: 'PropertyUse',
        name: 'Type',
        show: true,
        order: 13
      }, {
        key: 'SaleID',
        name: 'Sale ID',
        show: true,
        order: 14
      }, {
        key: 'SalePricePerSF',
        name: 'Sale Price/SF',
        show: true,
        order: 15
      }, {
        key: 'SalePricePerSM',
        name: 'Sale Price/SM',
        show: true,
        order: 16
      }, {
        key: 'Seller',
        name: 'Seller',
        show: true,
        order: 17
      }, {
        key: 'SoldPrice',
        name: 'Sold Price',
        show: true,
        order: 18
      }, {
        key: 'SoldSF',
        name: 'Sold(SF)',
        show: true,
        order: 19
      }, {
        key: 'SoldSM',
        name: 'Sold(SM)',
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
      }
      ]
    }];
    this.userPreferencesId = null;
    const loginData = this._loginService.UserInfo;
    if (!!loginData) {
      this.userId = loginData.EntityID;
      this._userPreferencesService.getUserPreferences(this.userId, 'download', 'Transaction').subscribe(result => {
        const response = JSON.parse(result['_body']).responseData[0];
        if (response) {
          this.sheets = JSON.parse(response.Data);
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
        if (sheet.name === 'Sale Transactions') {
          dataArray.push(this.getSelectedFields(this.transactionList.filter(x => x.isSelected == true), sheet.fields));
        }
      }
    });
    this._excelService.exportToExcel(dataArray, sheetNames, 'TransactionReport')
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

  public showTransactionDetails(PropertyId,SaleId) { 
    this._router.navigate(['/property/propertySummary', PropertyId,0,0,0,SaleId]);
    //this._router.navigate(['/property/propertySummary',PropertyId,0,SaleId], { queryParams: { 'SaleId': SaleId } });   
    
  }
}

