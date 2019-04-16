import { group, animate, query, style, trigger, transition, state } from '@angular/animations';
import { Component, Input, Output, EventEmitter, ElementRef, HostListener, ViewChild, OnInit, AfterViewChecked } from '@angular/core';
import * as global from '../../../config/globals';
import pageMenus from '../../../config/page-menus';
import pageSettings from '../../../config/page-settings';
import { environment } from '../../../../environments/environment';
import { LoginService } from '../../../core/services/login.service';
import { SharedDataService } from '../../../core/services/shareddata.service';
@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  animations: [
    trigger('expandCollapse', [
      state('expand', style({ height: '*', overflow: 'hidden', display: 'block' })),
      state('collapse', style({ height: '0px', overflow: 'hidden', display: 'block' })),
      state('active', style({ height: '*', overflow: 'hidden', display: 'block' })),
      transition('expand <=> collapse', animate(100)),
      transition('active => collapse', animate(100))
    ])
  ]
})

export class SidebarComponent implements AfterViewChecked {
  navProfileState = 'collapse';
  @ViewChild('sidebarScrollbar') private sidebarScrollbar: ElementRef;
  @Output() toggleSidebarMinified = new EventEmitter<boolean>();
  @Output() hideMobileSidebar = new EventEmitter<boolean>();
  @Input() pageSidebarTransparent;
  @Input() pageSidebarMinified;
  UserName: string;
  RoleName: string;
  UserPhoto: string;
  mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `/Media/Thumbnail/30x30/`;


  menus = pageMenus;
  pageSettings = pageSettings;

  mobileMode;
  desktopMode;
  scrollTop;

  toggleNavProfile() {
    if (this.navProfileState == 'collapse') {
      this.navProfileState = 'expand';
    } else {
      this.navProfileState = 'collapse';
    }
  }

  toggleMinified() {
    this.toggleSidebarMinified.emit(true);
    this.scrollTop = 0;
  }

  expandCollapseSubmenu(currentMenu, allMenu, active) {
    for (let menu of allMenu) {
      if (menu != currentMenu) {
        menu.state = 'collapse';
      }
    }
    if (currentMenu.state == 'expand' || (active.isActive && !currentMenu.state)) {
      currentMenu.state = 'collapse';
    } else {
      currentMenu.state = 'expand';
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.hideMobileSidebar.emit(true);
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    this.scrollTop = (this.pageSettings.pageSidebarMinified) ? event.srcElement.scrollTop + 40 : 0;
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('sidebarScroll', event.srcElement.scrollTop);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }
  }

  ngAfterViewChecked() {
    if (typeof (Storage) !== 'undefined' && localStorage.sidebarScroll) {
      if (this.sidebarScrollbar && this.sidebarScrollbar.nativeElement) {
        this.sidebarScrollbar.nativeElement.scrollTop = localStorage.sidebarScroll;
      }
    }
  }

  constructor(private eRef: ElementRef
    , private _loginService: LoginService
    , private _sharedDataService: SharedDataService) {

    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }

    if (this._loginService.UserInfo) {
      this.UserName = this._loginService.UserInfo.PersonName;
      this.RoleName = this._loginService.UserInfo.RoleName;
      this.UserPhoto = this._loginService.UserInfo.MainPhotoUrl;
    }
  }
  clearSearch() {
    this._sharedDataService.searchCriteria = null;
    this._sharedDataService.searchProperties = [];
    this._sharedDataService.searchResultCount = null;
    // localStorage.removeItem('PropertySearchResultGrid');
		// localStorage.removeItem('PropertySearchResultMap');    
    // localStorage.removeItem('PropertySearchResultCount');
    // localStorage.removeItem('PropertySearchCriteria');
    sessionStorage.removeItem('page');

    this._sharedDataService.transactionSearchCriteria = null;
    this._sharedDataService.searchTransactions = [];
    this._sharedDataService.transactionSearchResultCount = null;
    this._sharedDataService.searchTransactionMap = null;
    // localStorage.removeItem('TransactionSearchResult');
    // localStorage.removeItem('TransactionMapSearchResults');    
    // localStorage.removeItem('TransactionSearchResultCount');
    // localStorage.removeItem('TransactionSearchCriteria');
    // localStorage.removeItem('SelectedPropertyTransactions');
    localStorage.removeItem('transactionpage');

    this._sharedDataService.leaseSearchCriteria = null;
    this._sharedDataService.searchLeaseTransactionList = [];
    this._sharedDataService.searchLeaseTransactionMap = null;
    this._sharedDataService.leaseSearchResultCount = null;
    localStorage.removeItem('LeaseCurrentPage');
    // localStorage.removeItem('LeaseSearchResultList');
    // localStorage.removeItem('LeaseMapSearchResults');
    // localStorage.removeItem('LeaseSearchResultCount');
    // localStorage.removeItem('LeaseSearchCriteria');
    // localStorage.removeItem('SelectedPropertyLease');    

    this._sharedDataService.tenantSearchCriteria = null;
    this._sharedDataService.tenantSearchResult = [];
    this._sharedDataService.tenantSearchResultCount = null;
  //   localStorage.removeItem('TenantSearchResult');
	// //localStorage.removeItem('PropertySearchResultMap');    
  //   localStorage.removeItem('TenantSearchResultCount');
  //   localStorage.removeItem('TenantSearchCriteria');
    sessionStorage.removeItem('page');

    this._sharedDataService.selectedPropertyPin = null;
    this._sharedDataService.selectedLeasePin = null;
    this._sharedDataService.selectedTenantPin = null;
    this._sharedDataService.selectedSalePin = null;
    this._sharedDataService.searchCriteriaMapPin =  null;

    this._sharedDataService.setTenantStageID = "";
    this._sharedDataService.setBranchID = "";
  }
}
