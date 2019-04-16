import { Component, OnInit, Input } from '@angular/core';
import { PagerService } from '../../core/services/pager.service';
import { TenantService } from '../../core/services/tenant.service';
import { LoginService } from '../../core/services';
import { SharedDataService } from '../../core/services/shareddata.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { PopupmodelComponent } from '../popupmodel/popupmodel.component';
import { Suggestion } from '../../core/models/suggestion';
import { SuggestionsService } from '../../core/services/suggestions.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-propertytenantaccordion',
  templateUrl: './propertytenantaccordion.component.html',
  styleUrls: ['./propertytenantaccordion.component.css']
})
export class PropertytenantAccordionComponent implements OnInit {
  objectKeys: any;
  @Input() propertyId;
  @Input() propertyName;
  tenants: any = [];
  tenantsArrayToScroll: any;
  tenantCopy: any = [];
  orginaltenants: any = [];
  pager: any = {};
  pagedTenants: any = [];
  DummypagedTenants: any = [];
  filteredTenants: any = [];
  pageSize: any = 100;
  IsLoader: boolean = false;
  UserID: number = 0;
  sortValue: string = "";
  sortFun: string = "";
  filterInput: string = '';
  filteredItems: any;
  filterCount: boolean = false;
  tenantDataResponse: any = [];
  filterValue: number = 1;
  noOfInitiallyLoadItem: number = 100;
  isFullListDisplayed: boolean = false;
  expandData: number = null;
  tenantId: number = 0;
  count: number = 0;
  constructor(private _tenantService: TenantService,
    private pagerService: PagerService,
    private _loginService: LoginService,
    public dialog: MatDialog,
    private suggestionservice: SuggestionsService,
    private _sharedDataService: SharedDataService, private route: ActivatedRoute, ) {
    const loginData = this._loginService.UserInfo;
    if (loginData) {
      this.UserID = loginData.EntityID;
    }
    this.route.params.subscribe(params => {
      this.tenantId = (params['tenantId']) ? params['tenantId'] : 0;
      // if (this.expandData >= 0) {
      //   this.showDetailsOnTenantDataLoaded();
      // }
    });
  }

  ngOnInit() {
    this.objectKeys = Object.keys;
    this.GetAllTenantsByPropertyID(this.propertyId);
    this.setPage(1);
    $('.pane-hScroll').scroll(function () {
      $('.pane-vScroll').width($('.pane-hScroll').width() + $('.pane-hScroll').scrollLeft());
    });
  }

  getTenantIndexData() {
    if (this._sharedDataService.setBranchID == "BranchID") {
      this.expandData = this.tenants.findIndex(x => x.BranchID == this.tenantId);
    }
    else if (this._sharedDataService.setTenantStageID == "TenantID") {
      this.expandData = this.tenants.findIndex(x => x.Tenant_Stage_ID == this.tenantId);
    }

    if(this.tenantsArrayToScroll.length < this.expandData){
      this.tenantsArrayToScroll = this.tenants.slice(0, this.expandData + 1);
    }

    if (this.expandData >= 0) {
      this.showDetailsOnTenantDataLoaded();
    }
  }

  GetAllTenantsByPropertyID(propertyID: any) {
    this.tenants = [];
    this.tenantsArrayToScroll = [];
    this.IsLoader = true;
    const response_details = this._tenantService.getTenantByPropertyID(propertyID, this._loginService.UserInfo.EntityID);
    response_details.subscribe(result => {
      this.IsLoader = false;
      let data = JSON.parse(result['_body']);
      if (data) {
        this.tenants = data.responseData[0];
        let providers = data.responseData[1];
        if (providers) {
          this.tenants.forEach(tenant => {
            let tenantProviders: any = [];

            if (tenant.BranchID) {
              tenantProviders = providers.filter(x => x.BranchID == tenant.BranchID)
            } else if (tenant.Tenant_Stage_ID) {
              tenantProviders = providers.filter(x => x.Tenant_Stage_ID == tenant.Tenant_Stage_ID)
            }
            if (tenantProviders && tenantProviders.length > 0) {
              tenant.TenantProviders = tenantProviders;
              tenant.ProviderTenantsCount = tenantProviders.length;
            }

          });
        }
        this.orginaltenants = JSON.parse(JSON.stringify(this.tenants));
        //this.filterTenants(1);
        this.applySearchFilter(1);
      }
    });
  }

  onScroll() {
    if (this.noOfInitiallyLoadItem <= this.tenants.length) {
      this.noOfInitiallyLoadItem = Number(this.pageSize) + Number(this.noOfInitiallyLoadItem);
      this.tenantsArrayToScroll = this.tenants.slice(0, this.noOfInitiallyLoadItem);
    } 
  }
  showDetailsOnTenantDataLoaded() {
    let isDataLoaded = false;
    let data;
    var instance = this;
    let timer = setTimeout(function run() {
      if (!!instance.tenants && instance.tenants.length > 0) {
        if (instance._sharedDataService.setBranchID == "BranchID") {
          data = instance.tenants.find(x => x.BranchID == instance.tenantId);
        }
        else if (instance._sharedDataService.setTenantStageID == "TenantID") {
          data = instance.tenants.find(x => x.Tenant_Stage_ID == instance.tenantId);
        }
        isDataLoaded = true;
        var container = $('.pane-vScroll'),
        scrollTo = $('#valueTenantRow' + instance.expandData);
        container.animate({
          scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
        });
        instance.getTenantDetails(data);
        clearTimeout(timer);

      }
      if (!isDataLoaded)
        timer = setTimeout(run, 100);
      else {
        clearTimeout(timer);
      }
    }, 0);
  }

  getTenantDetails(tenant: any) {
    if (!tenant.TenantData) {
      const response_details = this._tenantService.getTenantDetails(tenant.BranchID, tenant.Tenant_Stage_ID, this._loginService.UserInfo.EntityID);
      response_details.subscribe(result => {
        let data = JSON.parse(result['_body']);
        if (data) {
          if (tenant.Tenant_Stage_ID)
            this.tenants.find(x => x.Tenant_Stage_ID == tenant.Tenant_Stage_ID).TenantData = data.responseData[0];
          else
            this.tenants.find(x => x.BranchID == tenant.BranchID).TenantData = data.responseData[0];
        }
      });
    }

  }


  filterItem(value) {
    if (value.length >= 3) {
      this.tenants = Object.assign([], this.tenantCopy).filter(item => item.TenantName.toLowerCase().indexOf(value.toLowerCase()) > -1);
      this.tenantsArrayToScroll = this.tenants.slice(0, this.noOfInitiallyLoadItem);
    }
    else {
      this.clearFun();
    }
    $('.pane-hScroll').scrollLeft(0);
    $('.pane-vScroll').scrollTop(0);
  }

  clearSearchFilter() {
    this.filterInput = '';
    this.clearFun();
    // this.applySearchFilter(this.filterValue);
  }

  clearFun() {
    this.tenants = this.tenantCopy;
     this.tenantsArrayToScroll = this.tenantCopy.slice(0, this.noOfInitiallyLoadItem);
    if (this.tenants.length > 0) {
      if (this.tenantId > 0) {
        this.getTenantIndexData();
      }
    }
    $('.pane-hScroll').scrollLeft(0);
    $('.pane-vScroll').scrollTop(0);
  }

  filterTenants(page: number) {
    this.noOfInitiallyLoadItem = this.pageSize;
    this.applySearchFilter(1);
    // if(this.tenants.length < (parseInt(this.pageSize)*(page-1))){
    //   this.pager.currentPage = 1;
    //   page = 1;
    // }
    // page =  page||this.pager.currentPage;
    // this.pager = this.pagerService.getPager(this.tenants.length, page, parseInt(this.pageSize));
    // this.pagedTenants = this.tenants.slice(this.pager.startIndex, this.pager.endIndex + 1);
    // window.scrollTo(0,0);
  }

  setPage(page: number) {
    this.filterTenants(page);
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
  }

  sortTenants(field: string, sortOrder: string, sortType: number = 0) {
    this.sortValue = field;
    this.sortFun = sortOrder;
    let dataset = 0;
    if (sortType) {
      this.tenants = this.tenants.sort(this.dynamicIntegerSort(field, sortOrder));
      dataset++;
    } else {
      this.tenants = this.tenants.sort(this.dynamicSort(field, sortOrder));
      dataset++;
    }
    if (dataset > 0) {
      this.tenantsArrayToScroll = this.tenants.slice(0, this.noOfInitiallyLoadItem);
    }
    // this.filterTenants(null);
  }


  dynamicSort(property: string, sortDirection: string) {
    let sortOrder = 1;
    sortOrder = sortDirection === "Ascending" ? 1 : -1;
    return function (a, b) {
      let result = (TryParseInt(a[property], a[property]) < TryParseInt(b[property], b[property])) ? -1 : (TryParseInt(a[property], a[property]) > TryParseInt(b[property], b[property])) ? 1 : 0;
      return result * sortOrder;
    }
  }

  dynamicIntegerSort(property: string, sortDirection: string) {
    let sortOrder = 1;
    sortOrder = sortDirection === "Ascending" ? 1 : -1;
    return function (a, b) {
      let result = (getInt(a[property]) < getInt(b[property])) ? -1 : (getInt(a[property]) > getInt(b[property])) ? 1 : 0;
      return result * sortOrder;
    }
  }

  applySearchFilter(value: any) {
    this.filterValue = value;
    let tenants = JSON.parse(JSON.stringify(this.orginaltenants));
    if (this._sharedDataService.tenantSearchCriteria && value == 1) {
      let minRevenue = this._sharedDataService.tenantSearchCriteria.MinAnnualRevenue || 0;
      let maxRevenue = this._sharedDataService.tenantSearchCriteria.MaxAnnualRevenue || Number.MAX_SAFE_INTEGER;
      let minCompanySize = this._sharedDataService.tenantSearchCriteria.MinCompanySize || 0;
      let maxCompanySize = this._sharedDataService.tenantSearchCriteria.MaxCompanySize || Number.MAX_SAFE_INTEGER;
      let siccodes = this._sharedDataService.tenantSearchCriteria.ISIC ? this._sharedDataService.tenantSearchCriteria.ISIC.split(',') : [];


      tenants = tenants.filter(x => (x.Revenue = x.Revenue || 0) >= minRevenue && (x.Revenue = x.Revenue || 0) <= maxRevenue && (x.EmployeeCount = x.EmployeeCount || 0) >= minCompanySize && (x.EmployeeCount = x.EmployeeCount || 0) <= maxCompanySize);
      if (siccodes.length > 0) tenants = tenants.filter(x => siccodes.includes(x.SICCode));
    }

    this.tenants = tenants;
    this.tenantCopy = tenants;

    this.tenants = this.tenants.sort(this.dynamicSort('TenantName', 'Ascending'));
    this.tenants = this.tenants.sort(this.dynamicIntegerSort('Address2', 'Descending'));
    this.tenants = this.tenants.sort(this.dynamicIntegerSort('FloorNumber', 'Descending'));
    this.filterItem(this.filterInput);
    //this.filterTenants(null);
  }


  onTenantSuggestion(filedname, tenantName, tenantStageId, branchId, confirmedTenantId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '20%';
    dialogConfig.data = { labelvalue: filedname, value: '', comment: '', showSuggestedValue: true };
    const dialogRef = this.dialog.open(PopupmodelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        const suggestion = new Suggestion();
        suggestion.FieldName = result.labelvalue;
        suggestion.SuggestedValue = result.value;
        suggestion.SuggestionComment = result.comment;
        suggestion.Type = 'Tenant';
        suggestion.SuggestionStatus = 'Initiated';
        suggestion.SentByUserID = this.UserID;
        suggestion.details = {
          PropertyId: this.propertyId,
          PropertyName: this.propertyName,
          TenantId: confirmedTenantId,
          TenantName: tenantName,
          BranchId: branchId,
          TenantStageId: tenantStageId
        };

        this.suggestionservice.saveSuggestion(suggestion);

      }
    });

  }

}

function TryParseInt(str: any, defaultValue: any): any {
  var retValue = defaultValue;
  if (str !== null) {
    if (str.length > 0) {
      if (!isNaN(str)) {
        retValue = parseInt(str);
      } else {
        retValue = str.toLowerCase();
      }
    }
  } else {
    retValue = "";
  }
  return retValue;
}


function getInt(value) {
  if (value) {
    let match = value.match(/\d+/);
    if (match && match.length > 0 && match[0]) {
      return TryParseInt(match[0], match[0]);
    }
  }
  return 0;
}



