import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Response, Headers, RequestOptions, Http } from '@angular/http';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import { ReportService } from '../../core/services/report.service';
import { ReportInfo } from '../../core/models/ReportInfo';
import { SharedDataService } from '../../core/services//shareddata.service';
import { ContainerEvents, FileObject, FileObjectStatus } from '../../core/models/FileObj';
import { Media } from '../../core/models/MediaType';
import { Observable } from 'rxjs/Rx';
import { PropertyService } from '../../core/services/api-property.service';
import { environment } from '../../../environments/environment';
import { MediaRelationTypeEnum } from '../../core/enumerations/mediaTypes';
import { EnumMediaType } from '../../core/enumerations/propertyMediaType';
declare var $: any;
/* declare var config: any;
var constants = config.prototype.constants(); */
@Component({
  selector: 'app-reportmedia',
  templateUrl: './reportmedia.component.html',
  styleUrls: ['./reportmedia.component.scss']
})
export class ReportMediaComponent implements OnInit {
  selectedPageType: string = "media";
  selectedReport: ReportInfo;
  reportList: Array<ReportInfo>;
  updatedReport: Array<ReportInfo>;
  reportFromPrevPage: Array<ReportInfo>;
  mediaReport: Array<ReportInfo>;
  files: Media[] = [];
  filesel: Media;
  mediaOrder: string = 'end';
  listingMediaImageList: Array<any> = [];
  constructor(private _location: Location
    , private _reportService: ReportService
    , public _sharedDataService: SharedDataService
    , private _CommService: CommunicationService
    , private _propertyService: PropertyService
    , private _http: Http) {
    this.selectedReport = new ReportInfo();
    this.reportList = new Array<ReportInfo>();
    this.updatedReport = new Array<ReportInfo>();
    this.mediaReport = new Array<ReportInfo>();

  }

  ngOnInit() {
    this._sharedDataService.selectedPropertListingDetails.forEach((property, index, array) => {
      let prop = property.allInfo;  
      this._propertyService.GetAllPropertyMediaByPropertyId(prop.PropertyID).subscribe((result) => {
        const mediaData = JSON.parse(result['_body']).responseData[0];
        let meadiaList = [];
        mediaData.forEach((media, i) => {
          if (media.Ext !== 'pdf' && media.Ext !== 'xlsx'&&media.MediaTypeID!=EnumMediaType.TenantRoster) {
            mediaData[i].isSelected = false;
            mediaData[i].url = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}` + media.Path;
            meadiaList.push(media);
          }
        });
        //  this.getListingMedia(prop.ListingID);
        if (!!prop.ListingID) {
          this._propertyService.getMediaByRelation(MediaRelationTypeEnum.Listing, prop.ListingID).subscribe(result => {
            if (!!JSON.parse(result['_body']).responseData) {
              const listmediaData = JSON.parse(result['_body']).responseData[0];
              this.listingMediaImageList=[];
              listmediaData.forEach((value, i) => {
                if (value.Ext === 'pdf' || value.Ext === 'xlsx') {
                } else {
                  if (!!this.listingMediaImageList) {
                    listmediaData[i].isSelected = false;
                    listmediaData[i].url = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}` + value.Path;
                 
                    value.MediaTypeID!=EnumMediaType.TenantRoster?this.listingMediaImageList.push(value):null;
                  }
                }
              });
            }

            this._sharedDataService.selectedPropertListingDetails[index].PropertyMedia = meadiaList;
            this._sharedDataService.selectedPropertListingDetails[index].ListingMedia = this.listingMediaImageList;          
            if (index === array.length - 1) {
              this.makeReport();
            }
          });
        } else {
          this._sharedDataService.selectedPropertListingDetails[index].PropertyMedia = meadiaList;
          this._sharedDataService.selectedPropertListingDetails[index].ListingMedia = this.listingMediaImageList;       
          if (index === array.length - 1) {
            this.makeReport();
          }
        }
      });
    });
  }
  makeReport() {  
    this.updatedReport = new Array<ReportInfo>();
    this.mediaReport = new Array<ReportInfo>();

    if (!!this._sharedDataService.selectedReportList && this._sharedDataService.selectedReportList.length > 0)
      this.reportFromPrevPage = this._sharedDataService.selectedReportList;

    if (this.selectedPageType == 'media') {
      this._reportService.GetReportList().forEach(report => {
        if (report.ReportType == 'media')
          this.reportList.push(report);
      });
    }

    let report = this.reportList[0];
    this._http.get(report.ReportUrl)
      .map(response => response.text())
      .subscribe(html => {
        let propCount = 0;
        this._sharedDataService.selectedPropertListingDetails.forEach(prop => {
          let updatereport = new ReportInfo();

          updatereport.ReportId = report.ReportId;
          updatereport.ReportType = report.ReportType;
          updatereport.ReportName = report.ReportName;
          updatereport.ReportOrder = report.ReportOrder;
          updatereport.ReportUrl = report.ReportUrl;
          updatereport.IsSelected = true;
          updatereport.PreviewImage = report.PreviewImage;
          updatereport.ParentReportId = report.ParentReportId;
          updatereport.reportLayout = report.reportLayout;
          updatereport.reportTitle = report.reportTitle;
          let mediaData = [];
          prop.PropertyMedia.forEach(media => {
            if (media.isSelected)
              mediaData.push(media)
          });
          prop.ListingMedia.forEach(media => {
            if (media.isSelected)
              mediaData.push(media)
          });
          updatereport.HTML = this._reportService.replaceData(html, prop.allInfo, mediaData, propCount++);
          if (mediaData.length > 0) {
            if (report.ReportType == 'media')
              this.mediaReport[propCount - 1] = updatereport;
          }
        });


        if (!!this._sharedDataService.selectedReportList && this._sharedDataService.selectedReportList.length > 0) {
          if (this.mediaOrder === 'end') {
            this.reportFromPrevPage.forEach(item => {
              if (item.ReportType !== 'media') {
                item.ReportOrder = this.updatedReport.length + 1;
                this.updatedReport.push(item);
              }
            });
            this.mediaReport.forEach(media => {
              if (media) {
                media.ReportOrder = this.updatedReport.length + 1;
                this.updatedReport.push(media)
              }
            })
          } else {
            let brochureCount = 0;
            this.reportFromPrevPage.forEach(item => {
              if (item.ReportType !== 'media') {
                item.ReportOrder = this.updatedReport.length + 1;
                this.updatedReport.push(item);
              }
              if (item.ReportType === 'brochure') {
                if (this.mediaReport[brochureCount]) {
                  const media = this.mediaReport[brochureCount];
                  media.ReportOrder = this.updatedReport.length + 1;
                  this.updatedReport.push(this.mediaReport[brochureCount])
                }
                brochureCount++;
              }
            });
          }
          this._sharedDataService.selectedReportList = this.updatedReport;
        }
      });
  }


  onSave() {
    let communicationModel = new CommunicationModel();
    communicationModel.Key = "ChangeReportPage";
    communicationModel.data = 'review';
    this._CommService.broadcast(communicationModel);
  }


  fileChangeEvent(fileInput: any, index) {

    if (fileInput.target.files && fileInput.target.files.length) {
      for (let i = 0; i < fileInput.target.files.length; i++) {
        const fileObject = new FileObject(fileInput.target.files[i]);
        const media = new Media();
        media.File = fileInput.target.files[i];
        if (fileInput.target.files && fileInput.target.files[0]) {

          var reader = new FileReader();
          reader.onload = (event: any) => {
            media.URL = event.target.result;
            var img = new Image;
            img.onload = function () {

              media.Height = img.height;
              media.Width = img.width;
            };
            img.src = reader.result;

          }
          reader.readAsDataURL(fileInput.target.files[0]);
        }
        this.files.push(media);

        let instance = this;
        setTimeout(function () {

          instance.uploadImage(index, media);
        }, 100);


      }
    }
    fileInput.target.value = null;



  }

  uploadImage(index, media) {

    let count = index;
    this._sharedDataService.selectedPropertListingDetails[index].PropertyMedia.push({ url: media.URL, Name: "media image", Ext: media.File.name.split('.').pop(), isSelected: false });
    this.updatedReport = new Array<ReportInfo>();
    this.mediaReport = new Array<ReportInfo>();
    this.makeReport();
  }

  selectMedia(event, mediaIndex, propIndex, media) {  
    if (event.target.tagName === 'INPUT') {
      // this._sharedDataService.selectedProperties[propIndex].PropertyMedia[mediaIndex].isSelected = !this._sharedDataService.selectedProperties[propIndex].PropertyMedia[mediaIndex].isSelected;
      this.makeReport();
    }
  }
}
