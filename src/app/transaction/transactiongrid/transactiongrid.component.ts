import { Component, OnInit } from '@angular/core';
import { UserPreferance } from './data';
import { SharedDataService } from '../../core/services/shareddata.service';
import { PagerService } from '../../core/services/pager.service';
import { LoginService } from '../../core/services';
import { CommunicationService,CommunicationModel } from '../../core/services/communication.service';
import { Router } from '@angular/router';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { UserPreferencesService } from '../../core/services/user-preferences.service';
import { TransactionService } from '../../core/services/transaction.service';
import { ExcelService } from '../../core/services/excel.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-transactiongrid',
  templateUrl: './transactiongrid.component.html',
  styleUrls: ['./transactiongrid.component.css']
})
export class TransactiongridComponent implements OnInit {
  transactionList: Array<any> = [];
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
  selectedTransactionList = new Array<any>();
  metricUnit: number = 1;
  public showTransactionDetails: boolean;
  public transactionInfo: any;
  public transactionTitle: string;

  SaleIDSortOrder: string = 'Ascending';
  AddressSortOrder: string = 'Ascending';
  PropertyNameSortOrder: string = 'Ascending';
  CityNameSortOrder: string = 'Ascending';
  ZipCodeSortOrder: string = 'Ascending';
  PropertyUseSortOrder: string = 'Ascending';
  SoldSFSortOrder: string = 'Ascending';
  SoldPriceSortOrder: string = 'Ascending';
  SoldDateSortOrder: string = 'Ascending';
  SalePricePerSMSortOrder: string = 'Ascending';
  BuyerSortOrder: string = 'Ascending';
  SellerSortOrder: string = 'Ascending';
  GeneralUseSortOrder: string = 'Ascending';
  CloseActionBtnSet: boolean;
  CloseActionBtnDetail: boolean;
  Isloader: boolean = false;
  closeExportSubscription: Subscription;
  selectedCount: number = 0;
  constructor(private _sharedDataService: SharedDataService,
    private pagerService: PagerService,
    private _loginService: LoginService,
    private _CommService: CommunicationService,
    private _router: Router,
    private transactionService: TransactionService,
    private _userPreferencesService: UserPreferencesService
    , private _excelService: ExcelService
    , private toastr: ToastrService) {

    this.sheets = UserPreferance;
    this.UnitId = this._loginService.UserInfo.UnitId;
    this.selectedTransactionList = new Array<any>();
    this.metricUnit = UnitConversionEnum.Metric;

    // User Default Preferences for Sale Txn download
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
    this.Isloader = false;
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
    $('.pane-hScroll').scroll(function () {
      $('.pane-vScroll').width($('.pane-hScroll').width() + $('.pane-hScroll').scrollLeft());
    });
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

  setPage(page: number) {

    this.Isloader = true;
    this.currentPage = page;
    this.searchCriteria.StartingIndex = page;
    this.isSelectAll=false;
    this.selectedTransactionList= this._sharedDataService.searchTransactions.filter(x => x.isSelected == true);
    // this._sharedDataService.searchTransactions.filter(x => x.isSelected == true).forEach(element => {
    //   if (!!this.selectedTransactionList) {
    //     if (this.selectedTransactionList.length > 0) {
    //       this.selectedTransactionList.forEach(selProp => {
    //         if (selProp.SaleID != element.SaleID)
    //           this.selectedTransactionList.push(element);

    //       });
    //     } else
    //       this.selectedTransactionList.push(element);
    //   }
    // });

    this.searchTransaction();
    localStorage.setItem('transactionpage', JSON.stringify(this.currentPage));
  }
  searchTransaction() {
    this.Isloader = true;
    let result = this.transactionService.saleTransactionSearch(this.searchCriteria);
    result.subscribe(item => {
      let props = JSON.parse(item['_body']).responseData.Transaction[0];

      if (!!this.selectedTransactionList && this.selectedTransactionList.length > 0) {
        this.selectedTransactionList.forEach(selectedProp => {
          props.forEach(resultProp => {
            if (selectedProp.SaleID == resultProp.SaleID)
              resultProp.isSelected = true;
          })
        });
      }

      this.transactionList = props;
      this.Isloader = false;
      $('.pane-hScroll').scrollLeft(0);
      $('.pane-vScroll').scrollTop(0);
      this._sharedDataService.searchTransactions = this.transactionList;
      this.pager = this.pagerService.getPager(this._sharedDataService.transactionSearchResultCount, this.currentPage, this.searchCriteria.OffsetValue);
    }, error => {
        this.Isloader=false;
    });
  }

  sortTransaction(SortParam, sortOrder) {
    this.Isloader =true;
    this.searchCriteria.SortParam = SortParam;
    this.searchCriteria.SortBy = SortParam;
    this.searchCriteria.SortDirection = sortOrder;
    this.searchTransaction();

    switch (SortParam) {
      case 'SaleID':
        if (sortOrder == 'Ascending')
          this.SaleIDSortOrder = 'Descending';
        else
          this.SaleIDSortOrder = 'Ascending';
        break;
      case 'Address':
        if (sortOrder == 'Ascending')
          this.AddressSortOrder = 'Descending';
        else
          this.AddressSortOrder = 'Ascending';
        break;
      case 'PropertyName':
        if (sortOrder == 'Ascending')
          this.PropertyNameSortOrder = 'Descending';
        else
          this.PropertyNameSortOrder = 'Ascending';
        break;
      case 'CityName':
        if (sortOrder == 'Ascending')
          this.CityNameSortOrder = 'Descending';
        else
          this.CityNameSortOrder = 'Ascending';
        break;
      case 'ZipCode':
        if (sortOrder == 'Ascending')
          this.ZipCodeSortOrder = 'Descending';
        else
          this.ZipCodeSortOrder = 'Ascending';
        break;
      case 'SoldSF':
        if (sortOrder == 'Ascending')
          this.SoldSFSortOrder = 'Descending';
        else
          this.SoldSFSortOrder = 'Ascending';
        break;

      case 'PropertyUse':
        if (sortOrder == 'Ascending')
          this.PropertyUseSortOrder = 'Descending';
        else
          this.PropertyUseSortOrder = 'Ascending';
        break;

      case 'SoldPrice':
        if (sortOrder == 'Ascending')
          this.SoldPriceSortOrder = 'Descending';
        else
          this.SoldPriceSortOrder = 'Ascending';
        break;

      case 'SoldDate':
        if (sortOrder == 'Ascending')
          this.SoldDateSortOrder = 'Descending';
        else
          this.SoldDateSortOrder = 'Ascending';
        break;

      case 'SalePricePerSM':
        if (sortOrder == 'Ascending')
          this.SalePricePerSMSortOrder = 'Descending';
        else
          this.SalePricePerSMSortOrder = 'Ascending';
        break;

      case 'Buyer':
        if (sortOrder == 'Ascending')
          this.BuyerSortOrder = 'Descending';
        else
          this.BuyerSortOrder = 'Ascending';
        break;

        case 'Seller':
        if (sortOrder == 'Ascending')
          this.SellerSortOrder = 'Descending';
        else
          this.SellerSortOrder = 'Ascending';
        break;          
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

  // openDetailNav() {
  //   this.CloseActionBtnDetail = true;
  //   document.getElementById("MapSidenavWrapDetail").style.width = "30%";
  //   document.getElementById("MapDetailSideBar").style.width = "30%";
  //     if ($(window).width() < 767) {
  //       document.getElementById("MapSidenavWrapDetail").style.width = "65%";
  //       document.getElementById("MapDetailSideBar").style.width = "65%";
  //     }
  //     else {
  //       document.getElementById("MapSidenavWrapDetail").style.width = "30%";
  //       document.getElementById("MapDetailSideBar").style.width = "30%";
  //     } 
  // }

  // closeDetailNav() {
  //   this.CloseActionBtnDetail = false;
  //   document.getElementById("MapSidenavWrapDetail").style.width = "0";
  //   document.getElementById("MapDetailSideBar").style.width = "0";
  // }

  openDetailNav(transaction) {
    this.closeNav();
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
    this.openTransactionModal(transaction);
  }

  closeDetailNav() {
    this.CloseActionBtnDetail = false;
    document.getElementById("MapSidenavWrapDetail").style.width = "0";
    document.getElementById("MapDetailSideBar").style.width = "0";
  }

  public showPropertySummary(PropertyId, transactionId) {
   // this._router.navigate(['/property/propertySummary', PropertyId, 0, transactionId]);
    this._router.navigate(['/property/propertySummary', PropertyId,0,0,0,transactionId]); 
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
  public openTransactionModal(transaction) {
    this.showTransactionDetails = true;
    this.transactionInfo = transaction;
    this.transactionTitle = transaction.PropertyName;
    let communicationModel = new CommunicationModel();
    communicationModel.Key = "OpenSingleTransactionModel";
    communicationModel.data = this.transactionInfo;
    this._CommService.broadcast(communicationModel);
  }

  public closeTransactionModal() {
    this.showTransactionDetails = false;
    this.transactionInfo = null;
    this.transactionTitle = null;
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
}
