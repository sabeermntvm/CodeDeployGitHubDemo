import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { PropertyService } from '../../core/services/api-property.service';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { LoginService } from '../../core/services/login.service';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import { Subscription } from 'rxjs';
import { LookupService } from '../../core/services/lookup.service';
import { PropertyListing } from '../../core/models/PropertyListing';
import { SharedDataService } from '../../core/services/shareddata.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-propertypindetail',
    templateUrl: './propertypindetail.component.html',
    styleUrls: ['./propertypindetail.component.css']
})
export class PropertyPinDetailComponent implements OnInit {
    property: any;
    @Input() PropertyDetail: any;
    mediaUrl: String;
    listing: any;
    unitId: number;
    metricUnit: number;
    propertyListings: Array<any> = [];
    currentListings: Array<PropertyListing> = [];
    listingDetailSubscription: Subscription;
    listingFilterList = [];
    listingFiltersettings = {
        singleSelection: false,
        text: "Filter",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        badgeShowLimit: 0
    };
    listingFilterselected = [];
    Count: number = 0;
    constructor(private _propertyService: PropertyService
        , private _router: Router
        , private _loginService: LoginService
        , private _CommService: CommunicationService
        , private _sharedDataService: SharedDataService
        , private _lookupService: LookupService
        , private toastr: ToastrService) {
        this.unitId = this._loginService.UserInfo.UnitId;
        this.metricUnit = UnitConversionEnum.Metric;
        this.listingDetailSubscription = this._CommService.subscribe("FromPropertyMapPin").subscribe((data) => {
            this.initializeListingFilter();
            let propertyId = data.data;
            this.getPropertyListingDetails(propertyId);
        });
        this.initializeListingFilter();
        const response_listingStatus = this._lookupService.GetAllListingStatus();
        response_listingStatus.subscribe(result => {
            let listingStatusList = JSON.parse(result['_body']).responseData || [];
            listingStatusList.forEach(element => {
                let item = { "id": element.ListingStatusID, "itemName": element.ListingStatusName };
                this.listingFilterList.push(item);
            });
        });
    }

    ngOnInit() {
        this.listing = new Object;
        this.mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
        if(this._sharedDataService.selectedPropertyPin){
            this.PropertyDetail = new Object();
            this.PropertyDetail=this._sharedDataService.selectedPropertyDetails;
            this.initializeListingFilter();
            let propID = this._sharedDataService.selectedPropertyPin;
            this.getPropertyListingDetails(propID);
        }
    }
    initializeListingFilter() {
        this.listingFilterselected = [{ "id": 1, "item": 'Active' },
        { "id": 2, "item": 'Active - Fully Leased' },
        { "id": 6, "item": 'Pending' }];
        this.listingFiltersettings = {
            singleSelection: false,
            text: "Filter",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: true,
            badgeShowLimit: 0
        };
    }
    getPropertyListingDetails(PropertyId) {
        this.propertyListings = [];
        this.currentListings = [];
        this._propertyService.getListingsByPropertyId(PropertyId).subscribe((data => {
            if (!JSON.parse(data['_body']).error) {
                const includedStatusTypes = [1, 2, 6];
                this.propertyListings = JSON.parse(data['_body']).responseData.propertyListing;
                // this.PropertyOccupancy = JSON.parse(data['_body']).responseData.occupancy.OccupiedPercentage;
                this.propertyListings.forEach(list => {
                    if (includedStatusTypes.indexOf(list.ListingStatusID) > -1)
                        this.currentListings.push(list);
                });
                // this.propertyListings = JSON.parse(data['_body']).responseData;
            }
        }));
    }
    showListingDetails(PropertyId) {
        this._sharedDataService.selectedPropertyPin = PropertyId;
        this._router.navigate(['/property/propertySummary', PropertyId]);
    }
    onListingFilterChange() {
        let selectedList = [];
        this.currentListings = new Array<any>();
        this.listingFilterselected.forEach(element => {
            selectedList.push(element.id);
        });
        this.propertyListings.forEach(list => {
            if (selectedList.includes(list.ListingStatusID)) {
                this.currentListings.push(list);
            }
        });
    }
    ngOnDestroy() {
        this.listingDetailSubscription.unsubscribe();
    }
    Selection(isChecked: boolean) {
        if (isChecked) {
            this.Count = this.Count + 1
        }
        else {
            this.Count = this.Count - 1;
        }
    }
    showReport() {
        let count = 0;
        let listingID = "";
        this.currentListings.forEach(list => {
            if (list.isSelected) {
                listingID = list.ListingID + "," + listingID;
                this._sharedDataService.searchProperties.forEach(prop => {
                    if (prop.PropertyId == this.PropertyDetail.PropertyId) {
                        if (!prop.ListingID || this._sharedDataService.searchProperties.filter(x => x.ListingID == list.ListingID).length <= 0) {
                            prop.ListingID = listingID;
                            prop.isSelected = true;
                            count++;

                        } else if (prop.ListingID == list.ListingID) {
                            prop.isSelected = true;
                            count++;
                        }
                    }
                });
            }
        });

if (count > 0) {
    this._router.navigate(['/report/reporthome']);
}
else {
    // alert("Select Property");
    this.toastr.error('Select Property!');
}
    }
}
