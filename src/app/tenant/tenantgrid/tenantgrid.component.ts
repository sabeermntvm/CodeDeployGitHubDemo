import { Component, OnInit } from '@angular/core';
import { UserPreferance } from '../../config/data';
import { SharedDataService } from '../../core/services/shareddata.service';
import { PagerService } from '../../core/services/pager.service';
import { LoginService } from '../../core/services';
import { CommunicationService } from '../../core/services/communication.service';
import { Router } from '@angular/router';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { TenantService } from '../../core/services/tenant.service';
import { ReportService } from '../../core/services/report.service';
import { ExcelService } from '../../core/services/excel.service';
import { UserPreferencesService } from '../../core/services/user-preferences.service';
import { TenantSearchCriteria } from '../../core/models/TenantSearchCriteria';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-tenantgrid',
  templateUrl: './tenantgrid.component.html',
  styleUrls: ['./tenantgrid.component.css']
})
export class TenantgridComponent implements OnInit {
  transactionList: Array<any> = [];
  sheets: Array<any>;
  userId: number;
  userPreferencesId: number;
  Task: any;
  UnitId: number;
  tenantResultCount: number;
  pager: any = {};
  pagedItems: any = [];
  currentPage: number = 1;
  tenantSearchCriteria: any;
  tenantList: Array<any> = [];
  isSelectAll: boolean;
  CloseActionBtnDetail: boolean;
  SideDetailNav: boolean;
  CloseActionBtnSet: boolean;
  selectedTenantList: Array<any>;
  Isloader: boolean = false;

  CompanyNameSortOrder: string = 'Descending';
  AddressSortOrder: string = 'Ascending';
  CitySortOrder: string = 'Ascending';
  ZipCodeSortOrder: string = 'Ascending';
  PropertyUseSortOrder: string = 'Ascending';
  NAICSSortOrder: string = 'Ascending';
  IndustrySortOrder: string = 'Ascending';
  RevenueSortOrder: string = 'Ascending';
  EmployeesSortOrder: string = 'Ascending';
  OccupiedSortOrder: string = 'Ascending';
  MoveInDateSortOrder: string = 'Ascending';
  ExpiryDateSortOrder: string = 'Ascending';
  PropertyIdSortOrder: string = 'Ascending';
  PropertyNameSortOrder: string = 'Ascending';
  ISICSortOrder: string = 'Ascending';
  selectedTenant: any;
  closeExportSubscription: Subscription;
  selectedCount: number = 0;
  // searchCriteria: TenantSearchCriteria;
  constructor(private _sharedDataService: SharedDataService
    , private pagerService: PagerService
    , private _loginService: LoginService
    , private _CommService: CommunicationService
    , private _router: Router
    , private _tenantService: TenantService
    , private _reportService: ReportService
    , private _excelService: ExcelService
    , private _userPreferencesService: UserPreferencesService
    , private toastr: ToastrService) {
    this.sheets = UserPreferance;
    this.UnitId = this._loginService.UserInfo.UnitId;
    this.selectedTenantList = new Array<any>();
    this.tenantSearchCriteria = new TenantSearchCriteria();

    for (let i = 0; i < 10; i++) {
      this.transactionList.push(i);
    }
    this.closeExportSubscription = this._CommService.subscribe("CloseTenantExportsettings").subscribe((data) => {
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
  }

  
  ngOnDestroy() {
    this.closeExportSubscription.unsubscribe();
  }


  initializeData() {

    this.tenantResultCount = this._sharedDataService.tenantSearchResultCount;
    this.tenantSearchCriteria = this._sharedDataService.tenantSearchCriteria;
    this.tenantList = this._sharedDataService.tenantSearchResult;
    if (!!this.tenantList) {
      this.tenantList.filter(x => x.isSelected == true).forEach(element => {
        this.selectedCount++;
      });

    }

    this.currentPage = sessionStorage.getItem('page') ? JSON.parse(sessionStorage.getItem('page')) : this.currentPage;
    this.pager = this.pagerService.getPager(this._sharedDataService.tenantSearchResultCount, this.currentPage, this.tenantSearchCriteria.OffsetValue);

  }

  setPage(page: number) {

    this.currentPage = page;
    this.tenantSearchCriteria.StartingIndex = page;
    this.isSelectAll = false;
    this.selectedTenantList = this._sharedDataService.tenantSearchResult.filter(x => x.isSelected == true);
    // this._sharedDataService.tenantSearchResult.filter(x => x.isSelected == true).forEach(element => {
    //   if (!!this.selectedTenantList) {
    //     if (this.selectedTenantList.length > 0) {
    //       this.selectedTenantList.forEach(selProp => {
    //         if (selProp.ConfirmedTenantID != element.ConfirmedTenantID)
    //           this.selectedTenantList.push(element);

    //       });
    //     } else
    //       this.selectedTenantList.push(element);
    //   }
    // });


    this.searchTenant();
    sessionStorage.setItem('page', JSON.stringify(this.currentPage));

  }
  searchTenant() {
    this.Isloader = true;
    let result = this._tenantService.tenantSearch(this.tenantSearchCriteria);
    result.subscribe(item => {
      let props = JSON.parse(item['_body']).responseData.Tenants[0];

      if (!!this.selectedTenantList && this.selectedTenantList.length > 0) {
        this.selectedTenantList.forEach(selectedProp => {
          props.forEach(resultProp => {
            if (selectedProp.ConfirmedTenantID == resultProp.ConfirmedTenantID)
              resultProp.isSelected = true;
          })
        });
      }

      this.tenantList = props;
      this._sharedDataService.tenantSearchResult = this.tenantList;
      this.pager = this.pagerService.getPager(this._sharedDataService.tenantSearchResultCount, this.currentPage, this.tenantSearchCriteria.OffsetValue);
      $('.pane-hScroll').scrollLeft(0);
      $('.pane-vScroll').scrollTop(0);
      this.Isloader = false;
    });
  }
  onSelectClick(value) {
    if (value == 1) {
      if (this.tenantList.length > 0) {
        this.tenantList.forEach(prop => {
          prop.isSelected = true;
          this.selectedCount = this.tenantList.length;
        });
      }
    }
    else {
      if (this.tenantList.length > 0) {
        this.tenantList.forEach(prop => {
          prop.isSelected = false;
          this.selectedCount = 0;
        });
      }
    }
  }

  onClickSelectAll(isChecked: boolean) {
    if (this.tenantList.length > 0) {
      this.tenantList.forEach(prop => {
        prop.isSelected = this.isSelectAll;
        if (isChecked) {
          this.selectedCount = this.tenantList.length;
        }
        else {
          this.selectedCount = 0;
        }
      });
    }

  }
  onRemoveClick(value) {

    if (value == 1) {
      this.tenantList.filter(x => x.isSelected == true).forEach(element => {
        const index: number = this.tenantList.indexOf(element);
        this.tenantList.splice(index, 1);
        this.selectedCount = 0;
      });
    } else {
      this.tenantList.filter(x => x.isSelected != true).forEach(element => {
        const index: number = this.tenantList.indexOf(element);
        this.tenantList.splice(index, 1);

      });
    }

  }
  Selection(isChecked: boolean) {
    this._sharedDataService.tenantSearchResult = this.tenantList;
    if (isChecked) {
      this.selectedCount = this.selectedCount + 1
    }
    else {
      this.selectedCount = this.selectedCount - 1;
    }
    this.onAllselectChk();
  }
  onAllselectChk() {
    if (this.tenantList.length > 0) {
      var count = 0;
      this.tenantList.forEach(tenant => {
        if (tenant.isSelected == true) {
          count++
        }
      })
      if (count == this.tenantList.length) {
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

  openDetailNav(tenant) {
    this.selectedTenant = tenant;
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
  }

  closeDetailNav() {
    this.CloseActionBtnDetail = false;
    document.getElementById("MapSidenavWrapDetail").style.width = "0";
    document.getElementById("MapDetailSideBar").style.width = "0";
  }

  sendReport() {

  }
  showUserPreferencesModal(Task: any) {
    let count = 0;
    this.tenantList.forEach(prop => {
      if (prop.isSelected) {
        count++;
      }
    });
    if (count > 0) {
      this.Task = Task;
      this.opensettingsNav();
    } else {
      // alert('Select Tenant');
      this.toastr.error('Select Tenant!');
    }
  }

  showReport() {

  }

  sortTenant(SortParam, sortOrder) {

    this.tenantSearchCriteria.SortParam = SortParam;
    this.tenantSearchCriteria.SortDirection = sortOrder;
    this.searchTenant();

    switch (SortParam) {
      case 'CompanyName':
        if (sortOrder == 'Ascending')
          this.CompanyNameSortOrder = 'Descending';
        else
          this.CompanyNameSortOrder = 'Ascending';
        break;
      case 'Address1':
        if (sortOrder == 'Ascending')
          this.AddressSortOrder = 'Descending';
        else
          this.AddressSortOrder = 'Ascending';
        break;
      case 'CityName':
        if (sortOrder == 'Ascending')
          this.CitySortOrder = 'Descending';
        else
          this.CitySortOrder = 'Ascending';
        break;
      case 'ZipCode':
        if (sortOrder == 'Ascending')
          this.ZipCodeSortOrder = 'Descending';
        else
          this.ZipCodeSortOrder = 'Ascending';
        break;
      case 'PropertyUse':
        if (sortOrder == 'Ascending')
          this.PropertyUseSortOrder = 'Descending';
        else
          this.PropertyUseSortOrder = 'Ascending';
        break;
      case 'NAICSCode':
        if (sortOrder == 'Ascending')
          this.NAICSSortOrder = 'Descending';
        else
          this.NAICSSortOrder = 'Ascending';
        break;

      case 'Industry':
        if (sortOrder == 'Ascending')
          this.IndustrySortOrder = 'Descending';
        else
          this.IndustrySortOrder = 'Ascending';
        break;

      case 'Revenue':
        if (sortOrder == 'Ascending')
          this.RevenueSortOrder = 'Descending';
        else
          this.RevenueSortOrder = 'Ascending';
        break;

      case 'Employees':
        if (sortOrder == 'Ascending')
          this.EmployeesSortOrder = 'Descending';
        else
          this.EmployeesSortOrder = 'Ascending';
        break;

      case 'Occupied':
        if (sortOrder == 'Ascending')
          this.OccupiedSortOrder = 'Descending';
        else
          this.OccupiedSortOrder = 'Ascending';
        break;
      case 'MoveInDate':
        if (sortOrder == 'Ascending')
          this.MoveInDateSortOrder = 'Descending';
        else
          this.MoveInDateSortOrder = 'Ascending';
        break;
      case 'ExpiryDate':
        if (sortOrder == 'Ascending')
          this.ExpiryDateSortOrder = 'Descending';
        else
          this.ExpiryDateSortOrder = 'Ascending';
        break;
      case 'PropertyID':
        if (sortOrder == 'Ascending')
          this.PropertyIdSortOrder = 'Descending';
        else
          this.PropertyIdSortOrder = 'Ascending';
        break;
      case 'PropertyName':
        if (sortOrder == 'Ascending')
          this.PropertyNameSortOrder = 'Descending';
        else
          this.PropertyNameSortOrder = 'Ascending';
        break;
      case 'ISIC':
        if (sortOrder == 'Ascending')
          this.ISICSortOrder = 'Descending';
        else
          this.ISICSortOrder = 'Ascending';
        break;

    }
  }
  showPropertyTenant(PropertyId, TenantId,branchID) {
    let TenantIdValue;
    if(branchID){
      TenantIdValue = branchID;
      localStorage.setItem('BranchID',branchID);
      localStorage.removeItem('TenantID');
    }
    else if(TenantId){
      TenantIdValue = TenantId;
      localStorage.setItem('TenantID',TenantId);
      localStorage.removeItem('BranchID');
    }
    this._router.navigate(['/property/propertySummary', PropertyId, "","", TenantIdValue]);
  //  this._router.navigate(['/property/propertySummary', PropertyId, "", "", TenantId]);
  }
  closeSettingsNav() {
    this.CloseActionBtnSet = false;
    document.getElementById("MapSidenav").style.width = "0";
    document.getElementById("MapSidenavSetting").style.width = "0";
  }
  setDefaultUserPreferences() {
    // User Default Preferences for Property download
    this.sheets = [{
      name: 'Tenant',
      show: true,
      fields: [{
        key: 'CompanyName',
        name: 'CompanyName',
        show: true,
        order: 1
      }, {
        key: 'PropertyID',
        name: 'Property ID',
        show: true,
        order: 2
      }, {
        key: 'PropertyName',
        name: 'Property Name',
        show: true,
        order: 3
      }, {
        key: 'Address1',
        name: 'Address1',
        show: true,
        order: 4
      }, {
        key: 'Address2',
        name: 'Address2',
        show: true,
        order: 5
      }, {
        key: 'AddressStreetName',
        name: 'Address Street Name',
        show: true,
        order: 6
      }, {
        key: 'AddressStreetNumber',
        name: 'Address Street Number',
        show: true,
        order: 7
      }, {
        key: 'AddressText',
        name: 'Address',
        show: true,
        order: 8
      }, {
        key: 'AlternateCompanyName',
        name: 'Alternate Company Name',
        show: true,
        order: 9
      }, {
        key: 'CEOName',
        name: 'CEO Name',
        show: true,
        order: 10
      }, {
        key: 'CEOTitle',
        name: 'CEO Title',
        show: true,
        order: 11
      }, {
        key: 'CityName',
        name: 'City',
        show: true,
        order: 12
      }, {
        key: 'ConfirmedTenantID',
        name: 'Confirmed Tenant ID',
        show: true,
        order: 13
      }, {
        key: 'CountryCode',
        name: 'Country Code',
        show: true,
        order: 14
      }, {
        key: 'CountyName',
        name: 'County',
        show: true,
        order: 15
      }, {
        key: 'DUNS',
        name: 'DUNS',
        show: true,
        order: 16
      }, {
        key: 'EmployeesAtLocation',
        name: 'Employees At Location',
        show: true,
        order: 17
      }, {
        key: 'ExpiryDate',
        name: 'Expiry Date',
        show: true,
        order: 18
      }, {
        key: 'ExtVendorID',
        name: 'Ext Vendor ID',
        show: true,
        order: 19
      }, {
        key: 'Fax',
        name: 'Fax',
        show: true,
        order: 20
      }, {
        key: 'FloorNumber',
        name: 'Floor Number',
        show: true,
        order: 21
      }, {
        key: 'ISIC',
        name: 'ISIC',
        show: true,
        order: 22
      }, {
        key: 'Industry',
        name: 'Industry',
        show: true,
        order: 23
      }, {
        key: 'Latitude',
        name: 'Latitude',
        show: true,
        order: 24
      }, {
        key: 'LegalStatusText',
        name: 'Legal Status',
        show: true,
        order: 25
      }, {
        key: 'LineOfBusiness',
        name: 'Line Of Business',
        show: true,
        order: 26
      }, {
        key: 'LinkedBranchName',
        name: 'Linked Branch',
        show: true,
        order: 27
      }, {
        key: 'LinkedCompanyName',
        name: 'Linked Company',
        show: true,
        order: 28
      }, {
        key: 'Longitude',
        name: 'Longitude',
        show: true,
        order: 29
      }, {
        key: 'MetroName',
        name: 'MetroName',
        show: true,
        order: 30
      }, {
        key: 'MoveInDate',
        name: 'Move In Date',
        show: true,
        order: 31
      }, {
        key: 'NAICSCode',
        name: 'NAICS Code',
        show: true,
        order: 32
      }, {
        key: 'OccupiedSF',
        name: 'Occupied(SF)',
        show: true,
        order: 33
      }, {
        key: 'OccupiedSM',
        name: 'Occupied(SM)',
        show: true,
        order: 34
      }, {
        key: 'OfficePhone',
        name: 'Office Phone',
        show: true,
        order: 35
      }, {
        key: 'PeopleCount',
        name: 'People Count',
        show: true,
        order: 36
      }, {
        key: 'PropertyType',
        name: 'Property Type',
        show: true,
        order: 37
      }, {
        key: 'ProviderName',
        name: 'Provider Name',
        show: true,
        order: 38
      }, {
        key: 'Revenue',
        name: 'Revenue',
        show: true,
        order: 39
      }, {
        key: 'SpecificUseName',
        name: 'Specific Use',
        show: true,
        order: 40
      }, {
        key: 'StateAbbr',
        name: 'State',
        show: true,
        order: 41
      }, {
        key: 'StatusCodeText',
        name: 'Status Code',
        show: true,
        order: 42
      }, {
        key: 'SubsidiaryCodeText',
        name: 'Subsidiary Code',
        show: true,
        order: 43
      }, {
        key: 'TenantName',
        name: 'Tenant',
        show: true,
        order: 44
      }, {
        key: 'TenantPhotoUrl',
        name: 'Tenant Photo Url',
        show: true,
        order: 45
      }, {
        key: 'UseTypeID',
        name: 'Use Type ID',
        show: true,
        order: 46
      }, {
        key: 'Website',
        name: 'Website',
        show: true,
        order: 47
      }, {
        key: 'ZipCode',
        name: 'Zip Code',
        show: true,
        order: 48
      }]
    }];
    this.userPreferencesId = null;
    const loginData = this._loginService.UserInfo;
    if (!!loginData) {
      this.userId = loginData.EntityID;
      this._userPreferencesService.getUserPreferences(this.userId, 'download', 'Tenant').subscribe(result => {
        const response = JSON.parse(result['_body']).responseData[0];
        if (response) {
          this.sheets = JSON.parse(response.Data);
          this.userPreferencesId = response.UserPreferencesID;
        }
      });
    }
  }
  exportToExcel() {
    const searchCriteria = this.tenantSearchCriteria;
    searchCriteria.StartingIndex = 1;
    searchCriteria.OffsetValue = 1000;
    const sheetNames = [];
    const dataArray = [];
    this.sheets.forEach(sheet => {
      if (sheet.show) {
        sheetNames.push(sheet.name);
        sheet.fields.sort((a, b) => a.order - b.order);
        if (sheet.name === 'Tenant') {
          dataArray.push(this.getSelectedFields(this.tenantList.filter(x => x.isSelected == true), sheet.fields));
        }
      }
    });
    this._excelService.exportToExcel(dataArray, sheetNames, 'TenantReport')
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
