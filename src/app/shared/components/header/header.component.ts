import { Component, Input, Output, EventEmitter, Renderer2, OnDestroy } from '@angular/core';
import pageSettings from '../../../config/page-settings';
import { environment } from '../../../../environments/environment';
import { LoginService } from '../../../core/services/login.service';
import { LookupService } from '../../../core/services/lookup.service';
import { PropertySearchCriteria } from '../../../core/models/PropertySearchCriteria';
import { PropertyService } from '../../../core/services/api-property.service';
import { SharedDataService } from '../../../core/services/shareddata.service';
import { Router } from '@angular/router';
import { CommunicationService, CommunicationModel } from '../../../core/services/communication.service';
@Component({
	selector: 'header',
	templateUrl: './header.component.html'
})
export class HeaderComponent implements OnDestroy {
	@Input() pageSidebarTwo;
	@Output() toggleSidebarRightCollapsed = new EventEmitter<boolean>();
	@Output() toggleMobileSidebar = new EventEmitter<boolean>();
	@Output() toggleMobileRightSidebar = new EventEmitter<boolean>();
	UserName: string;
	RoleName: string;
	UserPhoto: string;
	pageSettings = pageSettings;
	mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `/Media/Thumbnail/30x30/`;
	propertyTypes: any;
	propertyType: string;
	listingType: string = 'Lease & Sale';
	searchValue: string = null;
	searchCriteria: PropertySearchCriteria;
	Isloader: boolean = false;
	mobileSidebarToggle() {
		this.toggleMobileSidebar.emit(true);
	}
	mobileRightSidebarToggle() {
		this.toggleMobileRightSidebar.emit(true);
	}
	toggleSidebarRight() {
		this.toggleSidebarRightCollapsed.emit(true);
	}

	mobileTopMenuToggle() {
		this.pageSettings.pageMobileTopMenuToggled = !this.pageSettings.pageMobileTopMenuToggled;
	}

	mobileMegaMenuToggle() {
		this.pageSettings.pageMobileMegaMenuToggled = !this.pageSettings.pageMobileMegaMenuToggled;
	}

	ngOnDestroy() {
		this.pageSettings.pageMobileTopMenuToggled = false;
		this.pageSettings.pageMobileMegaMenuToggled = false;
	}

	constructor(private renderer: Renderer2
		, private _loginService: LoginService
		, private _lookupService: LookupService
		, private _propertyService: PropertyService
		, private _sharedDataService: SharedDataService
		, private _router: Router
		, private _CommService: CommunicationService) {
		if (this._loginService.UserInfo) {
			this.UserName = this._loginService.UserInfo.PersonName;
			this.RoleName = this._loginService.UserInfo.RoleName;
			this.UserPhoto = this._loginService.UserInfo.MainPhotoUrl;

			this.getPropertyType();
			this.getAllSpecificUses();
		}


	}
	openNav() {
		document.getElementById("mySidenav").style.width = "250px";
	}

	closeNav() {
		document.getElementById("mySidenav").style.width = "0";
	}
	getPropertyType() {
		const propertyType = this._lookupService.GetAllPropertyType();
		propertyType.subscribe(result => {
			if (!JSON.parse(result['_body']).error) {
				this.propertyTypes = JSON.parse(result['_body']).responseData;
				this._sharedDataService.propertyTypes = this.propertyTypes;
			}
			else
				this.propertyTypes = null;

		});
	}
	search() {

		this.Isloader = true;
		this.searchCriteria = new PropertySearchCriteria();
		this.searchCriteria.StartingIndex = 1;
		this.searchCriteria.OffsetValue = 100;
		this.searchCriteria.CountryId = this._loginService.UserInfo.CountryID;
		this.searchCriteria.SortParam = "PropertyName";
		this.searchCriteria.SortDirection = "Ascending";
		this.searchCriteria.IsMapSearch = false;
		this.searchCriteria.PropertyType = this.propertyType;
		this.searchCriteria.ListingType = this.listingType;
		this.searchCriteria.SearchValue = this.searchValue;	
		sessionStorage.removeItem('page');
		this._sharedDataService.selectedPropertyPin = null;
		// localStorage.removeItem('PropertySearchResultGrid');
		// localStorage.removeItem('PropertySearchResultMap');
		// localStorage.removeItem('PropertySearchResultCount');
		// localStorage.removeItem('PropertySearchCriteria');
		// localStorage.removeItem('TenantSearchCriteria');


		this._sharedDataService.tenantSearchCriteria = null;
		this._sharedDataService.searchCriteria = this.searchCriteria;
		
		let searchResult = this._propertyService.propertySearch(this.searchCriteria);
		searchResult.subscribe(item => {
			if (!JSON.parse(item['_body']).error) {
				let props = JSON.parse(item['_body']).responseData;
				this._sharedDataService.searchCriteriaMapPin = props.Property[0];
				this._sharedDataService.searchProperties = props.Property[0];
				this._sharedDataService.searchResultCount = props.Property[2][0].Total_Count;
				// localStorage.setItem('PropertySearchResultMap', JSON.stringify(props.Property[0]));
				// localStorage.setItem('PropertySearchResultGrid', JSON.stringify(props.Property[0]));
				// localStorage.setItem('PropertySearchResultCount', JSON.stringify(props.Property[2][0].Total_Count));
				if (this._router.url == '/property/resultsGrid') {
					let communicationModel = new CommunicationModel();
					communicationModel.Key = "FromGlobalSearch";
					communicationModel.data = true;
					this._CommService.broadcast(communicationModel);

				} else {
					this._router.navigate(['/property/resultsGrid']);
				}
				this.Isloader = false;
				this.closeNav();
			} else {
				this.Isloader = false;
				this.closeNav();
			}
		});
	}
	onClick(event) {
		if (event.keyCode == 13) {
			this.search();
		}
	}

	getAllSpecificUses() {

		const specificUses = this._lookupService.GetAllSpecificUse();
		specificUses.subscribe(result => {
			if (!JSON.parse(result['_body']).error)
				this._sharedDataService.specificUses = JSON.parse(result['_body']).responseData;
			else
				this._sharedDataService.specificUses = null;
			localStorage.setItem('allSpecificUses', JSON.stringify(this._sharedDataService.specificUses));
		});
	}
}
