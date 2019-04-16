import { Component, OnInit, ViewChild, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { PropertyService } from '../../core/services/api-property.service';
import { EnumCountry } from '../../core/enumerations/country';
import { SuiteService } from '../../core/services/suite.service';
import { SortedSuiteList } from '../../core/models/SortedSuiteList';
import { MediaRelationTypeEnum } from '../../core/enumerations/mediaTypes';
import { LoginService } from '../../core/services/login.service';
import { environment } from '../../../environments/environment';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { LookupService } from '../../core/services/lookup.service';
import { SuggestionsService } from '../../core/services/suggestions.service';
import { Suggestion } from '../../core/models/suggestion';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PopupmodelComponent } from '../popupmodel/popupmodel.component';
import { EnumMediaType } from '../../core/enumerations/propertyMediaType';
import { PropertysummaryComponent } from '../propertysummary/propertysummary.component';
import { NgxGalleryComponent, NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryImageSize } from 'ngx-gallery';
import { SharedDataService } from '../../core/services/shareddata.service';
@Component({
    selector: 'app-propertylisting',
    templateUrl: './propertylisting.component.html',
    styleUrls: ['./propertylisting.component.css']
})
export class PropertyListingComponent implements OnInit, OnDestroy {

    customOptions = {
        dots: false, navigation: false, nav: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            740: {
                items: 2
            },
            940: {
                items: 2
            },
            1200: {
                items: 2
            }
        },
    }
    @Input() propertyListings;
    @Input() propertyName;
    @Input() currentListings;
    @Input() ListingID;
    @Input() PropertyOccupancy;
    @Output() valueChange = new EventEmitter();
    mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;

    LisingAgentsList: Array<any> = [];
    suiteList: Array<any> = [];
    allSuiteList: Array<any> = [];
    sortedSuiteListInput: SortedSuiteList;
    listingMediaImageList: Array<any> = [];
    listingMediaNonImageList: Array<any> = [];
    suiteMediaImageList: Array<any> = [];
    suiteMediaNonImageList: Array<any> = [];
    unitId: number;
    metricUnit: number = 1;

    AvailableSpaceLabel: string = 'Available SqM';
    MinDivSpaceLabel: string = "Minimum SqM";
    AskingRateLabel: string = "Asking Rate/SqM";
    MaxContigLabel: string = "Max Contig SqM";
    SalePriceLabel: string = "Price/SqM";
    // listingFilterList = [];
    // listingFilterArray: any;
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
    imagePath: string = "";
    imageIndex: any = 0;
    UserID: any;
    PropertyId: number;
    nonImageUrl: string = "";
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    showModal: boolean = false;
    Count: number = 0;
    selectedListing: Array<any> = [];
    expandListing: number = 2;
    IsLoader: boolean = false;
    galleryHeight: string;
    constructor(private _propertyService: PropertyService
        , private suiteService: SuiteService
        , private _loginService: LoginService
        , private _lookupService: LookupService
        , private suggestionservice: SuggestionsService,
        public dialog: MatDialog,
        private property: PropertysummaryComponent
        , private _sharedDataService: SharedDataService) {
        this.PropertyId = this.property.propertyDetails.PropertyID;

        const loginData = this._loginService.UserInfo;
        if (loginData) {
            this.UserID = loginData.EntityID;
        }

        this.unitId = this._loginService.UserInfo.UnitId;
        this.metricUnit = UnitConversionEnum.Metric;
        if (this.unitId != UnitConversionEnum.Metric) {
            this.AvailableSpaceLabel = 'Available SF';
            this.MinDivSpaceLabel = 'Minimum SF';
            this.AskingRateLabel = "Asking Rate/SF";
            this.MaxContigLabel = "Max Contig SF";
            this.SalePriceLabel = "Price/SF";
        }
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
        const response_listingStatus = this._lookupService.GetAllListingStatus();
        response_listingStatus.subscribe(result => {
            let listingStatusList = JSON.parse(result['_body']).responseData || [];
            listingStatusList.forEach(element => {
                let item = { "id": element.ListingStatusID, "itemName": element.ListingStatusName };
                this.listingFilterList.push(item);
            });
        });
    }

    showDetailsOnListingDataLoaded() {
        let isDataLoaded = false;
        this.IsLoader = true;
        var instance = this;
        let timer = setTimeout(function run() {
            if (!!instance.currentListings && instance.currentListings.length > 0) {
                instance.expandListing = instance.currentListings.findIndex(x => x.ListingID == instance.ListingID);
                isDataLoaded = true;
                instance.showListingDetails(instance.currentListings[0].ListingID);
                clearTimeout(timer);
            }
            if (!isDataLoaded)
                timer = setTimeout(run, 100);
            else
                clearTimeout(timer);
        }, 0);
    }

    ngOnInit() {
        this.galleryImages = [];
        this.setGalleryOptions(true, 0);
        this.showDetailsOnListingDataLoaded();

        this.imagePath = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + '/Media/';
        this.nonImageUrl = `${environment.MediaS3Base}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicMainImageSize}`;

    }

    setGalleryOptions(thumbnail: boolean, index: number) {
        var width = $(document).width();
        if (width < 800) {
            this.galleryHeight = "calc(54vh - 55px)";
        }
        else {
            this.galleryHeight = "calc(80vh - 55px)";
        }
        this.galleryOptions = [
            {
                startIndex: index,
                thumbnails: true,
                imageSwipe: true,
                width: '100%',
                height: this.galleryHeight,
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 10,
                thumbnailMargin: 10,
                thumbnailsSwipe: true,
                previewSwipe: true,
                previewFullscreen: true,
                previewZoom: true,
                previewRotate: true,
                previewDownload: true,
                previewZoomStep: 0.5,
                previewZoomMax: 10,
            },
            {
                startIndex: index,
                thumbnails: true,
                imageSwipe: true,
                breakpoint: 800,
                width: '100%',
                height: this.galleryHeight,
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 10,
                thumbnailMargin: 10,
                thumbnailsSwipe: true,
                previewSwipe: true,
                previewFullscreen: true,
                previewZoom: true,
                previewRotate: true,
                previewDownload: true,
                previewZoomStep: 0.5,
                previewZoomMax: 10,
            },
            {
                startIndex: index,
                thumbnails: true,
                imageSwipe: true,
                breakpoint: 400,
                preview: true,
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 10,
                thumbnailMargin: 10,
                thumbnailsSwipe: true,
                previewSwipe: true,
                previewFullscreen: true,
                previewZoom: true,
                previewRotate: true,
                previewDownload: true,
                previewZoomStep: 0.5,
                previewZoomMax: 10,
            }
        ];
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


    showListingDetails(listingId) {
        this.getListingAgents(listingId);
        this.getListingMedia(listingId);
        this.getSuiteList(listingId);
    }
    getListingAgents(listingId) {
        if (!!this.LisingAgentsList) {
            if (this.LisingAgentsList.filter(x => x.ListingId == listingId).length == 0) {
                const response = this._propertyService.getListingAgentsByListingId(listingId);
                response.subscribe(result => {
                    if (!JSON.parse(result['_body']).error) {
                        let resultData = JSON.parse(result['_body']).responseData;
                        resultData.forEach((value, index) => {
                            if (index < 3)
                                this.LisingAgentsList.push({ ListingId: listingId, Agent: value });
                        });
                    }
                    this.IsLoader = false;
                });
            }
        }
    }
    getSuiteList(listingId) {
        this.sortedSuiteListInput = new SortedSuiteList();
        this.sortedSuiteListInput.ListingID = listingId;
        this.sortedSuiteListInput.SortBy = "SuiteId";
        this.sortedSuiteListInput.SortDirection = "Ascending";
        if (!!this.suiteList) {
            if (this.suiteList.filter(x => x.ListingId == listingId).length == 0) {
                const data = this.suiteService.getSortedSuiteByListingId(this.sortedSuiteListInput);
                data.subscribe(suiteResults => {
                    if (!!JSON.parse(suiteResults['_body']).responseData) {
                        let suiteData = JSON.parse(suiteResults['_body']).responseData.Suites;
                        suiteData.forEach(suite => {
                            if (suite.SuiteStatusID == 1)
                                this.suiteList.push({ ListingId: listingId, SuiteData: suite });
                        });
                    }
                    this.allSuiteList = this.suiteList;
                    this.onSelectClick(1);
                });
            }
        }
    }
    getListingMedia(listingId) {

        this._propertyService.getMediaByRelation(MediaRelationTypeEnum.Listing, listingId).subscribe(result => {
            if (!!JSON.parse(result['_body']).responseData) {

                const mediaData = JSON.parse(result['_body']).responseData[0];
                mediaData.forEach(value => {
                    if (value.Ext === 'pdf' || value.Ext === 'xlsx') {
                        if (!!this.listingMediaNonImageList) {
                            if (this.listingMediaNonImageList.filter(x => x.ListingId == listingId).length == 0) {
                                this.listingMediaNonImageList.push({ ListingId: listingId, mediaList: value });
                            }
                        }
                    } else {
                        if (!!this.listingMediaImageList) {
                            if ((this.listingMediaImageList.filter(x => x.ListingId == listingId).length == 0) && value.MediaTypeID != EnumMediaType.TenantRoster) {
                                this.listingMediaImageList.push({ ListingId: listingId, mediaList: value });
                            }
                        }
                    }
                });
            }
        });
    }
    getSuiteMedia(suiteId) {

        this._propertyService.getMediaByRelation(MediaRelationTypeEnum.Suite, suiteId).subscribe(result => {
            if (!!JSON.parse(result['_body']).responseData) {

                const mediaData = JSON.parse(result['_body']).responseData[0];
                mediaData.forEach(value => {
                    if (value.Ext === 'pdf' || value.Ext === 'xlsx') {
                        if (!!this.suiteMediaNonImageList) {
                            if (this.suiteMediaNonImageList.filter(x => x.suiteId == suiteId).length == 0) {
                                this.suiteMediaNonImageList.push({ suiteId: suiteId, mediaList: value });
                            }
                        }
                    } else {
                        if (!!this.suiteMediaImageList) {
                            if ((this.suiteMediaImageList.filter(x => x.suiteId == suiteId).length == 0) && (value.MediaTypeID != EnumMediaType.TenantRoster)) {
                                this.suiteMediaImageList.push({ suiteId: suiteId, mediaList: value });
                            }
                        }
                    }
                });
            }
        });
    }

    onSelectClick(value: any) {
        this.suiteList = this.allSuiteList;
        if (this._sharedDataService.searchCriteria && value == 1) {
            if (this._sharedDataService.searchCriteria.TotalAvailableMin && !this._sharedDataService.searchCriteria.TotalAvailableMax) {
                this.suiteList = this.suiteList.filter(item => item.SuiteData.AvailableSF >= this._sharedDataService.searchCriteria.TotalAvailableMin.toFixed(2));
            }
            else if (!this._sharedDataService.searchCriteria.TotalAvailableMin && this._sharedDataService.searchCriteria.TotalAvailableMax) {
                this.suiteList = this.suiteList.filter(item => item.SuiteData.AvailableSF <= this._sharedDataService.searchCriteria.TotalAvailableMax.toFixed(2));
            }
            else if (this._sharedDataService.searchCriteria.TotalAvailableMin && this._sharedDataService.searchCriteria.TotalAvailableMax) {
                this.suiteList = this.suiteList.filter(item => item.SuiteData.AvailableSF >= this._sharedDataService.searchCriteria.TotalAvailableMin.toFixed(2) && item.SuiteData.AvailableSF <= this._sharedDataService.searchCriteria.TotalAvailableMax.toFixed(2));
            }
        }
    }

    imageclick(index: any, path: any, isListing: boolean) {
        this.showModal = true;
        this.galleryImages = [];
        this.setGalleryOptions(true, index);
        if (isListing) {
            this.listingMediaImageList.forEach(element => {
                this.galleryImages.push({ big: this.imagePath + element.mediaList.Path, small: this.mediaUrl + element.mediaList.Path, medium: this.imagePath + element.mediaList.Path });
            });
        }
        else {
            this.suiteMediaImageList.forEach(element => {
                this.galleryImages.push({ big: this.imagePath + element.mediaList.Path, small: this.mediaUrl + element.mediaList.Path, medium: this.imagePath + element.mediaList.Path });
            });
        }
    }
    downloadFile(PdfUrl) {
        window.open(PdfUrl);
    }
    Selection(isChecked: boolean, listing: any) {
        if (isChecked) {
            this.selectedListing.push(listing.ListingID);
            this.Count = this.Count + 1
        }
        else {
            const index = this.selectedListing.indexOf(listing.ListingID, 0);
            if (index > -1) {
                this.selectedListing.splice(index, 1);
            }
            this.Count = this.Count - 1;
        }
        this.valueChange.emit(this.selectedListing);
    }

    ngOnDestroy() {
    }

    goToLink(urlPath: string) {
        let url: string = '';
        if (!/^http[s]?:\/\//.test(urlPath)) {
            url += 'http://';
        }
        url += urlPath;
        window.open(url, '_blank');
    }

}
