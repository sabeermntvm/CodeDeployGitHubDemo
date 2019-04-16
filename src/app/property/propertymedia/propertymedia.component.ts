import { Component, OnInit, Input } from '@angular/core';
import { PropertyService } from '../../core/services/api-property.service';
import { MediaRelationTypeEnum } from '../../core/enumerations/mediaTypes';
import { LoginService } from '../../core/services/login.service';
import { SuiteService } from '../../core/services/suite.service';
import { SortedSuiteList } from '../../core/models/SortedSuiteList';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { environment } from '../../../environments/environment';
import { Media,MediaType } from '../../core/models/MediaType';
import { EnumMediaType } from '../../core/enumerations/propertyMediaType';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import { Subscription } from 'rxjs';

import { SuggestionsService } from '../../core/services/suggestions.service';
import { Suggestion } from '../../core/models/suggestion';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { PopupmodelComponent } from '../popupmodel/popupmodel.component';
import { PropertysummaryComponent } from '../propertysummary/propertysummary.component';
import { NgxGalleryComponent,NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation,NgxGalleryImageSize } from 'ngx-gallery';
@Component({
  selector: 'app-propertymedia',
  templateUrl: './propertymedia.component.html',
  styleUrls: ['./propertymedia.component.css']
})
export class PropertymediaComponent implements OnInit {
  @Input() propertyId;
  @Input() propertyMediaList;
  @Input() propertyNonMediaList;
  @Input() propertyListings;
  mediaData: any[] = [];
  suitListings: any[] = [];
  viewDataMedia: number = 1;
  mediaUrl: any;
  metricUnit: number = 1;
  unitId: number;
  listingMediaNonImageList: Array<any> = [];
  listingMediaImageList: Array<any> = [];
  suiteMediaNonImageList: Array<any> = [];
  suiteMediaImageList: Array<any> = [];
  suiteList: Array<any> = [];
  sortedSuiteListInput: SortedSuiteList;
  selectedListingId: number;
  showSuiteMedia: boolean = false;
  selectedListing: any = new Object;
  showListingImageMedia: boolean = false;
  showListingNonImageMedia: boolean = false;
  mediaList:Array<Media> = [];
  mediaTypeList:Array<any> = [];
  ImageArray:Array<any> = [];
  imageIndex:any = 0;
  display='none';
  nonImageUrl:any;
  imagePathURL:string="";
  getMediaSubscription: Subscription;
  UserID; any;
  PropertyId: number;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  showModal:boolean=false;
  galleryHeight : string = "";
  constructor(private _loginService: LoginService
    , private _propertyService: PropertyService
    , private suiteService: SuiteService
    , private _CommService: CommunicationService
    , private suggestionservice: SuggestionsService,
    public dialog: MatDialog,
    private property: PropertysummaryComponent) {

      this.PropertyId = this.property.propertyDetails.PropertyID;

      const loginData = this._loginService.UserInfo;
      if (loginData) {
        this.UserID = loginData.EntityID;
      }

    this.unitId = this._loginService.UserInfo.UnitId;
    this.metricUnit = UnitConversionEnum.Metric;
    for (var i = 0; i < 15; i++) {
      this.mediaData.push(i);
    }
    for (var i = 0; i < 3; i++) {
      this.suitListings.push(i);
    }
    const excludedMediaTypes = ['Tenant Roster', 'Property Manager', 'Listing']
    this.getMediaSubscription = this._CommService.subscribe("PropertySummaryMedia").subscribe((result) => { 
      result.data.forEach(value => {
        if (value.MediaRelationTypeID == MediaRelationTypeEnum.Property && !value.IsDefault) {
          if (value.Ext === 'pdf' || value.Ext === 'xlsx') {
            this.propertyNonMediaList.push(value);
          } else {
            if (excludedMediaTypes.indexOf(value.MediaTypeName) == -1)
              this.propertyMediaList.push(value);
          }
        }
      });
       this.getImageURL();
});
  }

  ngOnInit() {
    
    this.galleryImages = [];
    this.setGalleryOptions(true,0);
    this.getImageURL();


    }
    setGalleryOptions(thumbnail:boolean,index:number)
    {

        var width = $(document).width();
        if(width < 800){
        this.galleryHeight = "calc(54vh - 55px)";
        }
        else{
          this.galleryHeight = "calc(80vh - 55px)";
        }

      this.galleryOptions = [
        {
             startIndex:index,
             thumbnails:true,
             imageSwipe:true,
             width: '100%',
             height: this.galleryHeight,
             thumbnailsColumns: 4,
             imageAnimation: NgxGalleryAnimation.Slide,
             imagePercent: 80,
             thumbnailsPercent: 20,
             thumbnailsMargin: 10,
             thumbnailMargin: 10,
             thumbnailsSwipe:true,
             previewSwipe:true,
             previewFullscreen:true,
             previewZoom:true,
             previewRotate:true,
             previewDownload:true,
             previewZoomStep:0.5,
             previewZoomMax:10,
         },
          { 
             startIndex:index, 
             thumbnails:true,
             imageSwipe:true,
             breakpoint: 800,
             width: '100%',
             height: this.galleryHeight,
             imagePercent: 80,
             thumbnailsPercent: 20,
             thumbnailsMargin: 10,
             thumbnailMargin: 10,
             thumbnailsSwipe:true,
             previewSwipe:true,
             previewFullscreen:true,
             previewZoom:true,
             previewRotate:true,
             previewDownload:true,
             previewZoomStep:0.5,
             previewZoomMax:10,
         },
        {    
             startIndex:index,
             thumbnails:true,
             imageSwipe:true,
             breakpoint: 400,
             height: this.galleryHeight,
             preview: true,
             imagePercent: 80,
             thumbnailsPercent: 20,
             thumbnailsMargin: 10,
             thumbnailMargin: 10,
             thumbnailsSwipe:true,
             previewSwipe:true,
             previewFullscreen:true,
             previewZoom:true,
             previewRotate:true,
             previewDownload:true,
             previewZoomStep:0.5,
             previewZoomMax:10,
         }
     ];
    }
  getImageURL()
  {
    this.imagePathURL = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` +'/Media/';
    this.mediaList = this.propertyMediaList.filter(x=>x.MediaTypeID!=EnumMediaType.PropertyManager).filter(x=>x.MediaTypeID!=EnumMediaType.Listing).filter(x=>x.MediaTypeID!=EnumMediaType.TenantRoster); 
    let allMediaType = Object.keys(EnumMediaType).map(key => (key));
    let selectedMediaType = this.mediaList.map(item => item.MediaTypeName)
    .filter((value, index, self) => self.indexOf(value) === index);
    this.mediaTypeList = allMediaType.filter(x => selectedMediaType.includes(x));
    this.mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
    this.nonImageUrl =`${environment.MediaS3Base}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicMainImageSize}`;
  }
  viewmedia(viewVal: number) {
    this.viewDataMedia = viewVal;
  }
  filterMediaItems(mediaTypeName){   
    return this.mediaList.filter(x => x.MediaTypeName == mediaTypeName);
  }
  viewListingMedia(viewVal: number, listing) {   
    this.selectedListing = listing;
    this.selectedListingId = listing.ListingID;
    this.viewDataMedia = viewVal;   
    this.getListingMedia(listing.ListingID);
    this.getSuiteList(listing.ListingID)
  }
  getListingMedia(listingId) {
    this.showListingImageMedia = false;
    this.showListingNonImageMedia = false;
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
              if (this.listingMediaImageList.filter(x => x.ListingId == listingId).length == 0) {
                this.listingMediaImageList.push({ ListingId: listingId, mediaList: value });
              }
            }
          }
          this.listingMediaImageList = this.listingMediaImageList.filter(x=>x.mediaList.MediaTypeID!=EnumMediaType.PropertyManager).filter(x=>x.mediaList.MediaTypeID!=EnumMediaType.Listing).filter(x=>x.mediaList.MediaTypeID!=EnumMediaType.TenantRoster); 
          if (!!this.listingMediaImageList && this.listingMediaImageList.length > 0)
            this.showListingImageMedia = true;
          else
            this.showListingImageMedia = false;

          if (!!this.listingMediaNonImageList && this.listingMediaNonImageList.length > 0)
            this.showListingNonImageMedia = true;
          else
            this.showListingNonImageMedia = false;
        });

      }
    });
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
            if (!!suiteData && suiteData.length > 0) {
             
              suiteData.forEach(suite => {

                this._propertyService.getMediaByRelation(MediaRelationTypeEnum.Suite, suite.SuiteID).subscribe(result => {
                  if (!!JSON.parse(result['_body']).responseData) {

                    const mediaData = JSON.parse(result['_body']).responseData[0];
                    if(!!mediaData && mediaData.length>0){
                    mediaData.forEach(value => {
                      if (value.Ext === 'pdf' || value.Ext === 'xlsx') {
                        if (!!this.suiteMediaNonImageList) {
                          if (this.suiteMediaNonImageList.filter(x => x.suiteId == suite.SuiteID).length == 0) {
                            this.suiteMediaNonImageList.push({ suiteId: suite.SuiteID, mediaList: value });
                          }
                        }
                      } else {
                        if (!!this.suiteMediaImageList) {
                          if (this.suiteMediaImageList.filter(x => x.suiteId == suite.SuiteID).length == 0) {
                            this.suiteMediaImageList.push({ suiteId: suite.SuiteID, mediaList: value });
                          }
                        }
                      }
                    });
                     this.suiteList.push({ ListingId: listingId, SuiteData: suite });
                     this.showSuiteMedia = true;
                }else{
                  this.showSuiteMedia = false;
                }
                  }
                });
               
              });
            } else {
              this.showSuiteMedia = false;
            }
          }

        });
      }else{
          this.showSuiteMedia = true;
      }
    }
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
              if (this.suiteMediaImageList.filter(x => x.suiteId == suiteId).length == 0) {
                this.suiteMediaImageList.push({ suiteId: suiteId, mediaList: value });
              }
            }
          }
        });
      }
    });
  }
  imageclick(index:any,path:any,suiteid?:any,type?:any)
  {
    this.showModal = true;
    this.galleryImages =[];
    if(this.viewDataMedia ==1)
    {
      this.mediaList.forEach(element => {
        if(element.MediaTypeName==type)
      this.galleryImages.push({big:this.imagePathURL + element.Path,small:this.mediaUrl+element.Path,medium:this.imagePathURL + element.Path});
    });
    }
    else if(suiteid)
    {
      this.suiteMediaImageList.forEach(element => {
        if(element.suiteId == suiteid)
        this.galleryImages.push({big:this.imagePathURL + element.mediaList.Path,small:this.mediaUrl+element.mediaList.Path,medium:this.imagePathURL + element.mediaList.Path});
      });
    }
    else{
      this.listingMediaImageList.forEach(element => {
        if(element.ListingId == this.selectedListingId)
        this.galleryImages.push({big:this.imagePathURL + element.mediaList.Path,small:this.mediaUrl+element.mediaList.Path,medium:this.imagePathURL + element.mediaList.Path});
      });
    }
    this.galleryImages.forEach(element => {
      if(element.big==this.imagePathURL+path)
      this.imageIndex = this.galleryImages.indexOf(element);
    });
     this.setGalleryOptions(true,this.imageIndex);
  }

 downloadFile(PdfUrl) {
  window.open(PdfUrl);
}

onMediaSuggestion(mediadetails: any,event) {
  event.stopPropagation();
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '20%';
  dialogConfig.data = { labelvalue: 'Media'  , value: '' , comment: ''};
  const dialogRef = this.dialog.open(PopupmodelComponent, dialogConfig);

   dialogRef.afterClosed().subscribe( (result)  => {
  if (!!result ) {
    const suggestion = new Suggestion();
    suggestion.FieldName = '';
    suggestion.SuggestedValue = result.value;
    suggestion.SuggestionComment = result.comment;
    suggestion.Type = 'Media';
    suggestion.SuggestionStatus = 'Initiated';
    suggestion.SentByUserID = this.UserID;
    suggestion.details = {
      PropertyId: this.PropertyId,
      PropertyName: this.property.propertyDetails.PropertyName
    };

    if(mediadetails.MediaID){
      suggestion.details.MediaId = mediadetails.MediaID;
    }

    if(mediadetails.MediaTypeName){
      suggestion.details.MediaTypeName = mediadetails.MediaTypeName;
    }

    this.suggestionservice.saveSuggestion(suggestion);

  }
});
}


ngOnDestroy() {
  this.getMediaSubscription.unsubscribe();
}
}
