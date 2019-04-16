import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import { Response, Headers, RequestOptions, Http } from '@angular/http';
import { ReportService } from '../../core/services/report.service';
import { ReportInfo } from '../../core/models/ReportInfo';
import { SharedDataService } from '../../core/services//shareddata.service';
import { Router } from "@angular/router";
import * as MapEnum from '../../core/models/MapEnum';
import { MapOptions } from '../../core/models/MapOptions';
import { MapService } from '../../core/services/map-service.service';
// import jsPDF from 'jspdf';
declare var google: any;
declare var $: any;
/* declare var config: any;
var constants = config.prototype.constants(); */
@Component({
    selector: 'app-reportreview',
    templateUrl: './reportreview.component.html',
    styleUrls: ['./reportreview.component.scss']
})
export class ReportReviewComponent implements OnInit, AfterViewInit {
    selectedReport: ReportInfo;
    reportList: Array<ReportInfo>;
    reviewReport: Array<ReportInfo>;
    mediaList: Array<ReportInfo>;
    public mapOptions: MapOptions;
    public map: any;
    private _mapService: MapService;
    private markers: Array<any> = new Array<any>();
    zoomValue: number = 100;
    zoomMax: number = 300;
    zoomMin: number = 50;
    constructor(private _location: Location
        , private _reportService: ReportService
        , private _sharedDataService: SharedDataService
        , private _CommService: CommunicationService
        , private _http: Http
        , private _router: Router
        , mapService: MapService) {
        this.selectedReport = new ReportInfo();
        this.reportList = new Array<ReportInfo>();
        this.reviewReport = new Array<ReportInfo>();
        this.mediaList = new Array<ReportInfo>();
        this._mapService = mapService;
        this.mapOptions = new MapOptions('map1');
        this.mapOptions.ZoomLevel = 15;
        this.mapOptions.StreetViewControl = false;
    }

    ngAfterViewInit() {
        if (document.getElementById('map1')) {
            this.mapOptions.RequireCtrlToZoom = false;
            this.mapOptions.FeaturesToHide.push(MapEnum.MapFeatures.Administrative_LandParcel,
                MapEnum.MapFeatures.HighwayRoad,
                MapEnum.MapFeatures.ControlledAccessHighwayRoad,
                MapEnum.MapFeatures.LineTransit, MapEnum.MapFeatures.AirportStation,
                MapEnum.MapFeatures.BusStation, MapEnum.MapFeatures.RailwayStation,
                MapEnum.MapFeatures.AttractionPin, MapEnum.MapFeatures.BusinessPin,
                MapEnum.MapFeatures.GovernmentPin, MapEnum.MapFeatures.MedicalInstitutionPin,
                MapEnum.MapFeatures.ParkPin, MapEnum.MapFeatures.PlaceOfWorkshipPin,
                MapEnum.MapFeatures.ScoolPin, MapEnum.MapFeatures.SportsComplexPin);
            this.map = this._mapService.CreateMap(this.mapOptions);
            let bounds = new google.maps.LatLngBounds();
            let instance = this;
            let propertyId = 0;
            this._sharedDataService.selectedProperties.forEach((prop, index) => {
                if(propertyId != prop.PropertyId){
                    propertyId = prop.PropertyId;
                    instance._mapService.MapRefresh(instance.map);
                    const marker = instance._mapService.PlaceMarker(instance.map, prop.Latitude, prop.Longitude);
                    //instance._mapService.SetCenter(instance.map, marker.getPosition().lat(), marker.getPosition().lng());
                    marker.setLabel('' + (index + 1) + '');
                    marker.setDraggable(false);
                    const infowindow = new google.maps.InfoWindow({
                        content: prop.PropertyName
                    });
                    marker.addListener('click', function () {
                        infowindow.open(instance.map, marker);
                    });
                    instance.markers.push(marker);
                    const ll = instance._mapService.GetLatLng(prop.Latitude, prop.Longitude);
                    bounds.extend(ll);
                }
            });
            this.map.fitBounds(bounds);
            if(this.map.getZoom()>18){
                this.map.setZoom(18);
            }
        }

        this.onZoomChange();
    }
    ngOnInit() {

        if (!!this._sharedDataService.selectedReportList && this._sharedDataService.selectedReportList.length > 0) {
            this.reportList = this._sharedDataService.selectedReportList;
        }



        // if (!!this._sharedDataService.reportDisplayOrder && this._sharedDataService.reportDisplayOrder.length > 0) {
        //     this.reportList.forEach(rep => {
        //         this._sharedDataService.reportDisplayOrder.forEach(function (order, index) {
        //             if (rep.ReportId == order.ReportId)
        //                 rep.ReportOrder = index + 1;
        //         });

        //     });
        // }

        let count = 0;
        this._sharedDataService.selectedReportSortList.forEach(order => {
          this.reportList.forEach(rep => {
            if (rep.ReportId == order.ReportId || rep.ParentReportId == order.ReportId) {
              count++;
              rep.ReportOrder = count;
            }
          })
        });
      this._sharedDataService.selectedReportList = this.reportList;

        this.reportList.forEach(report => {
            let tempReport = new ReportInfo();
            tempReport.ReportId = report.ReportId;
            tempReport.ReportType = report.ReportType;
            tempReport.ReportName = report.ReportName;
            tempReport.ReportOrder = report.ReportOrder;
            tempReport.ReportUrl = report.ReportUrl;
            tempReport.IsSelected = true;
            tempReport.PreviewImage = report.PreviewImage;
            tempReport.HTML = report.HTML;
            tempReport.reportLayout=report.reportLayout;
            tempReport.reportTitle=report.reportTitle;
            if (report.reportLayout) {
                tempReport.reportLayout = report.reportLayout;
            }

            let htmlElement = document.createElement('div');
            htmlElement.innerHTML = tempReport.HTML;
            const reportTmpl = $(htmlElement);

            if (!!reportTmpl.find('.btn-add-listing')[0])
                reportTmpl.find('.btn-add-listing')[0].remove();
            if (!!reportTmpl.find('.btn-remove-suite'))
                reportTmpl.find('.btn-remove-suite').remove();

            tempReport.HTML = reportTmpl[0].innerHTML;
            //   $('.btn-add-listing').remove();
            this.reviewReport.push(tempReport);
            /* if (report.ReportType != 'media') {
                 this.reviewReport.push(tempReport);
             } else {
                 this._reportService.GetReportList().forEach(report => {
                     if (report.ReportType == 'media')
                         this.mediaList.push(report);
                 });
             }*/
        });


        /*if (this.mediaList.length > 0) {
            let propCount = 0;
          this._sharedDataService.selectedProperties.forEach(prop => {

                let report = this.mediaList[0];
                let updatereport = new ReportInfo();

                this._http.get("assets/templates/mediaReview_1.html")
                    .map(response => response.text())
                    .subscribe(html => {

                        updatereport.ReportId = report.ReportId;
                        updatereport.ReportType = report.ReportType;
                        updatereport.ReportName = report.ReportName;
                        updatereport.ReportOrder = report.ReportOrder;
                        updatereport.ReportUrl = report.ReportUrl;
                        updatereport.IsSelected = true;
                        updatereport.PreviewImage = report.PreviewImage;
                        updatereport.HTML = this._reportService.replaceData(html, prop, null, propCount++);

                        this.reviewReport.push(updatereport);


                    });
            });
        }*/

        //   }


        // });







    }
    replaceData(html, propertyInfo, index): string {

        let newHtml = html.replace(/##Property_Name##/gi, propertyInfo.PropertyName || '');
        newHtml = newHtml.replace(/##Address##/gi, propertyInfo.Address || '');
        newHtml = newHtml.replace(/##City##/gi, propertyInfo.City || '');
        newHtml = newHtml.replace(/##State##/gi, propertyInfo.State || '');
        newHtml = newHtml.replace(/##Zip##/gi, propertyInfo.Zip || '');
        newHtml = newHtml.replace(/##General_Use##/gi, propertyInfo.GeneralUse || '');
        newHtml = newHtml.replace(/##BuildingSize##/gi, propertyInfo.BuildingSize || '');
        newHtml = newHtml.replace(/##Class##/gi, propertyInfo.Class || '');
        newHtml = newHtml.replace(/##Market##/gi, propertyInfo.Market || '');
        newHtml = newHtml.replace(/##AvailableSpace##/gi, propertyInfo.AvailableSpace || '');
        newHtml = newHtml.replace(/##TypicalFloorArea##/gi, propertyInfo.TypicalFloorArea || '');
        newHtml = newHtml.replace(/##YearBuilt##/gi, propertyInfo.YearBuilt || '');
        newHtml = newHtml.replace(/##YearRenovated##/gi, propertyInfo.YearRenovated || '');
        newHtml = newHtml.replace(/##ConstructionStatus##/gi, propertyInfo.ConstructionStatus || '');
        newHtml = newHtml.replace(/##ParkingSpaces##/gi, propertyInfo.ParkingSpaces || '');

        newHtml = newHtml.replace(/##ParkingRatio##/gi, propertyInfo.ParkingRatio || '');
        newHtml = newHtml.replace(/##Tenancy##/gi, propertyInfo.Tenancy || '');
        newHtml = newHtml.replace(/##ParcelNumber##/gi, propertyInfo.ParcelNumber || '');

        newHtml = newHtml.replace(/##OccupancyPercent##/gi, propertyInfo.OccupancyPercent || '');

        newHtml = newHtml.replace(/##Zoning##/gi, propertyInfo.Zoning || '');

        newHtml = newHtml.replace(/##NumberOfElevators##/gi, propertyInfo.NumberOfElevators || '');
        newHtml = newHtml.replace(/##PropertyImage##/gi, propertyInfo.ImageUrl || '');


        newHtml = newHtml.replace(/##PropertyName##/gi, propertyInfo.PropertyName || '');
        newHtml = newHtml.replace(/##Index##/gi, index + 1 || '');
        newHtml = newHtml.replace(/##Floors##/gi, propertyInfo.Floors || '');
        newHtml = newHtml.replace(/##MinDiv##/gi, propertyInfo.MinDivSM || '');
        newHtml = newHtml.replace(/##MaxContig##/gi, propertyInfo.MaxContigSM || '');
        newHtml = newHtml.replace(/##FloorNumber##/gi, propertyInfo.FloorNumber || '');
        newHtml = newHtml.replace(/##AvailableSM##/gi, propertyInfo.AvailableSM || '');
        newHtml = newHtml.replace(/##MinSM##/gi, propertyInfo.MinSM || '');
        newHtml = newHtml.replace(/##AskingRateText##/gi, propertyInfo.AskingRateText || '');
        newHtml = newHtml.replace(/##SpaceTypeName##/gi, propertyInfo.SpaceTypeName || '');
        newHtml = newHtml.replace(/##Vacant##/gi, propertyInfo.Vacant ? 'Yes' : 'No' || '');
        newHtml = newHtml.replace(/##PossessionTypeName##/gi, propertyInfo.PossessionTypeName || '');
        newHtml = newHtml.replace(/##LeaseTerms##/gi, propertyInfo.LeaseTerms || '');
        newHtml = newHtml.replace(/##SuiteNumber##/gi, propertyInfo.SuiteNumber || '');

        let mediaHtml = "";
        if (!!this._sharedDataService.mediaList) {
            if (this._sharedDataService.mediaList.length > 0) {
                this._sharedDataService.mediaList.forEach(item => {
                    if (item.PropertyID == propertyInfo.PropertyId) {
                        if (item.Ext != 'pdf' && item.Ext != 'xlsx') {
                            mediaHtml += '<div class="col-lg-12">   <div class="media-img1"><img class="img-responsive" src="' + item.Path + '" class="img" width="100%"></div>   <p class="center"></p>  </div>';
                        }
                    }
                });
            }
        }

        // propertyInfo.PropertyMedia.forEach(media => {
        //     console.log("media");
        //     mediaHtml += '<div class="col-lg-12">   <div class="media-img1"><img class="img-responsive" src="' + media.url + '" class="img" width="100%"></div>   <p class="center">' + media.Name + ' - 12MB</p>  </div>';
        // });
        newHtml = newHtml.replace(/##PropertyMedia##/gi, mediaHtml);
        newHtml = newHtml.replace(/##Agent_Name##/gi, propertyInfo.PropertyManagerName || '')


        return newHtml;
    }

    print() {

        var divToPrint = document.getElementById('DivContentToprint');

        var newWin = window.open('', 'Print-Window');

        newWin.document.open();

        newWin.document.write('<html><body class="print-media" onload="window.print()">' + divToPrint.innerHTML + '</body></html>');

        newWin.document.close();

        setTimeout(function () { newWin.close(); }, 10);

    }

    printPDF(): void {
        let printContents, popupWin;
        printContents = document.getElementById('DivContentToprint').innerHTML;

        const htmlElement = document.createElement('div');
        htmlElement.innerHTML = printContents;
        const htmlDom = $(htmlElement);

        htmlDom.find('.zoom-out').each((index, value) => {
            value.children[0].style.transform = 'scale(1)';
            value.style.overflow = 'visible';
            value.style.width = 'auto';
            value.style.height = 'auto';
        });
        // let pdf = new jsPDF();

        // let elementToPrint = document.getElementById('DivContentToprint');
        // pdf.addHTML(elementToPrint, () => {

        //       pdf.autoPrint();

        //  window.open(pdf.output('bloburl'), '_blank');
        // });

      this._http.get('assets/css/print.css')
        .map(response => response.text())
        .subscribe(css => {

        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();

        //  <link href="https://fonts.googleapis.com/css?family=Roboto:400,700,900" rel="stylesheet">

        popupWin.document.write(`
      <html>
        <head> 
        <meta http-equiv="content-type" content="text/html;charset=UTF-8" />         
        
        <style type="text/css" media="print, screen">
      </style><style>` + css +
      `</style><link src="assets/css/print.css" rel="stylesheet" media="print"/> 
      <style type="text/css" media="print">
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: #FAFAFA;
        font: 12pt "Tahoma";
    }
    * {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
    }
      @page {
        margin: 0;
        counter-increment: page;
        @bottom-right {
         content: counter(page) " of " counter(pages);
        }
     }
      @media print {
        html, body {
          width: 210mm;
          height: 297mm;
        }
      }
      </style>
       </head>
            <body onload="window.print();window.close()">${htmlDom[0].innerHTML}</body>
      </html>`
        );
        popupWin.document.close();
        });
    }
    changeReortAction(Activity) {
        let communicationModel = new CommunicationModel();
        communicationModel.Key = "ChangeReportPage";
        communicationModel.data = Activity;
        this._CommService.broadcast(communicationModel);
    }

    onZoomChange() {
        $('.zoom-out').each((index, value) => {
            this.zoomValue =  window.innerWidth * 7.50 /100; // inner content height * scale + padding
            const scale = this.zoomValue / 100;
            const width = 795 * scale + 20; // inner content width * scale + padding
            const height = 1124 * scale + 20; // inner content height * scale + padding
            value.children[0].style.transform = 'scale(' + scale + ')';
            if (value.classList.contains('rep-landscape')) {
                if (value.parentElement.clientWidth <= height) {
                    value.style.overflowX = 'auto';
                    value.style.width = value.parentElement.clientWidth + 'px';
                } else {
                    value.style.width = height + 'px';
                    value.style.overflow = 'hidden';
                }
                value.style.height = width + 'px';
            } else {
                if (value.parentElement.clientWidth <= width) {
                    value.style.overflowX = 'auto';
                    value.style.width = value.parentElement.clientWidth + 'px';
                } else {
                    value.style.width = width + 'px';
                    value.style.overflow = 'hidden';
                }
                value.style.height = height + 'px';
            }
        })
    }
}
