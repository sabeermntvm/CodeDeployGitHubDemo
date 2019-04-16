import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { SharedDataService } from '../../core/services/shareddata.service';
import { Response, Headers, RequestOptions, Http } from '@angular/http';
import { ReportService } from '../../core/services/report.service';
import { Property } from '../../core/models/property';
import { ReportDisplayInfo, ReportInfo } from '../../core/models/ReportInfo';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import 'rxjs/add/operator/distinct';
import { ContactService } from '../../core/services/contact.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
declare var $: any;
declare var require: any;
// const CryptoJS = require('crypto-js');

@Component({
  selector: 'app-reportsort',
  templateUrl: './reportsort.component.html',
  styleUrls: ['./reportsort.component.scss']
})
export class ReportSortComponent implements OnInit {

  selectedPropertyList: Array<any>;
  Property: Property;
  isSelectAll: boolean = false;
  nameOrder: number = 1;
  addrOrder: number = 1;
  cityOrder: number = 1;
  zipOrder: number = 1;
  typeOrder: number = 1;
  sizeOrder: number = 1;
  isGridView: boolean = true;
  isGalleryView: boolean = false;
  isReportView: boolean = false;
  selectedReportList: Array<ReportInfo>;
  headerHTML: string;
  footerHTML: string;
  reportList: Array<ReportInfo>;
  reportDisplayOrderList: Array<ReportDisplayInfo>;
  selectedDisplayList: Array<ReportInfo>;
  sortingOrder: Array<any>;
  loginCompanyId: number;
  loginCompanyDetails: any;
  deleteReportSubscription:Subscription;
  selectReportSubscription:Subscription;

  constructor(private _location: Location
    , private _sharedDataService: SharedDataService
    , private _CommService: CommunicationService
    , private _http: Http
    , private _reportService: ReportService
    , private _contactService: ContactService) {
    this.selectedPropertyList = new Array<Property>();
    this.selectedReportList = new Array<ReportInfo>();
    this.reportList = new Array<ReportInfo>();

    this.reportDisplayOrderList = Array<ReportDisplayInfo>();
    this.selectedDisplayList = new Array<ReportInfo>();
    this.getLoggedInCompanyDetails();
    // To get footer HTML.
    this._http.get("assets/templates/footer.html")
      .map(response => response.text())
      .subscribe(html => {
        this.footerHTML = html;
      });

    // To get header HTML.
    this._http.get("assets/templates/header.html")
      .map(response => response.text())
      .subscribe(html => {
        this.headerHTML = html;
      });

   this.deleteReportSubscription= this._CommService.subscribe("DeleteReport").subscribe((data) => {
      //  this.reportList = new Array<ReportInfo>();


      this.reportDisplayOrderList = Array<ReportDisplayInfo>();
      this.selectedDisplayList = new Array<ReportInfo>();

      this.getReportOrder();
    });

   this.selectReportSubscription= this._CommService.subscribe("reportPageSelected").subscribe((data) => {

      this.reportDisplayOrderList = Array<ReportDisplayInfo>();
      this.selectedDisplayList = new Array<ReportInfo>();
      this.getReportOrder();
    });

    this.sortingOrder = [];
  }
 ngOnDestroy() {
    this.selectReportSubscription.unsubscribe();
    this.deleteReportSubscription.unsubscribe();  
  }
  ngOnInit() {

    if (!!localStorage.getItem('sortingOrder') && localStorage.getItem('sortingOrder') != "null") {

      JSON.parse(localStorage.getItem('sortingOrder')).forEach(item => {

        this.nameOrder = item.nameOrder;
        this.cityOrder = item.cityOrder;
        this.addrOrder = item.addrOrder;

        this.zipOrder = item.zipOrder;
        this.sizeOrder = item.sizeOrder;
        this.typeOrder = item.typeOrder;

      });
    } else {
      this.sortingOrder.push({
        nameOrder: 1,
        addrOrder: 1,
        cityOrder: 1,
        zipOrder: 1,
        typeOrder: 1,
        sizeOrder: 1
      });
    }


    this._reportService.GetReportList().forEach(report => {
      this.reportList.push(report);
    });

    // this.selectedPropertyList = this._sharedDataService.selectedProperties;
    this.selectedPropertyList = this._sharedDataService.selectedReportProperties;
    this.selectedPropertyList.forEach(function (item, index) {
      item.DisplayOrder = index + 1;
      item.ImageUrl = item.MainPhotoUrl ? `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}` + item.MainPhotoUrl : ''
    });
    this.getReportOrder();

  }
  getLoggedInCompanyDetails() {
    this._contactService.getLoggedInCompanyDetailsById(
      this.loginCompanyId
    ).subscribe(resultData => {
      if (!JSON.parse(resultData['_body']).error)
        this.loginCompanyDetails = JSON.parse(resultData['_body']).responseData[0];

    });
  }
  getReportOrder() {

    if (!!this._sharedDataService.selectedReportList && this._sharedDataService.selectedReportList.length > 0) {
      this.selectedDisplayList = this._sharedDataService.selectedReportList;
    }

    if (this.selectedDisplayList.length > 0) {

      this.selectedDisplayList.forEach((report, index) => {
        if (this.reportDisplayOrderList.filter(x => x.ReportId == report.ReportId).length == 0) {
          let displayOrder = new ReportDisplayInfo();
          displayOrder.Index = index++;
          displayOrder.DisplayOrder = report.ReportOrder;
          displayOrder.PreviewImage = report.PreviewImage;
          displayOrder.ReportType = report.ReportType;
          displayOrder.ReportId = report.ReportId;
          this.reportDisplayOrderList.push(displayOrder);
        }     

      });

    }

    this._sharedDataService.reportDisplayOrder = this.reportDisplayOrderList;

  }
  sortList(type, order) {

    if (order == 1) {

      switch (type) {
        case 'name': this.selectedPropertyList.sort(function (a, b) {
          if (a.PropertyName < b.PropertyName)
            return -1;
          if (a.PropertyName > b.PropertyName)
            return 1;
          return 0;
        });

          this.nameOrder = 0;
          break;
        case 'address': this.selectedPropertyList.sort(function (a, b) {
          if (a.Address < b.Address)
            return -1;
          if (a.Address > b.Address)
            return 1;
          return 0;
        });
          this.addrOrder = 0;
          break;
        case 'city': this.selectedPropertyList.sort(function (a, b) {
          if (a.City < b.City)
            return -1;
          if (a.City > b.City)
            return 1;
          return 0;
        });
          this.cityOrder = 0;
          break;
        case 'zip': this.selectedPropertyList.sort(function (a, b) {
          if (a.ZipCode < b.ZipCode)
            return -1;
          if (a.ZipCode > b.ZipCode)
            return 1;
          return 0;
        });
          this.zipOrder = 0;
          break;
        case 'type': this.selectedPropertyList.sort(function (a, b) {
          if (a.GeneralUse < b.GeneralUse)
            return -1;
          if (a.GeneralUse > b.GeneralUse)
            return 1;
          return 0;
        });
          this.typeOrder = 0;
          break;
        case 'size': this.selectedPropertyList.sort(function (a, b) {
          if (a.BuildingSF < b.BuildingSF)
            return -1;
          if (a.BuildingSF > b.BuildingSF)
            return 1;
          return 0;
        });
          this.sizeOrder = 0;
          break;
      }


    } else if (order == 0) {
      switch (type) {
        case 'name': this.selectedPropertyList.sort(function (a, b) {
          if (a.PropertyName > b.PropertyName)
            return -1;
          if (a.PropertyName < b.PropertyName)
            return 1;
          return 0;
        });
          this.nameOrder = 1;
          break;
        case 'address': this.selectedPropertyList.sort(function (a, b) {
          if (a.Address > b.Address)
            return -1;
          if (a.Address < b.Address)
            return 1;
          return 0;
        });
          this.addrOrder = 1;
          break;
        case 'city': this.selectedPropertyList.sort(function (a, b) {
          if (a.City > b.City)
            return -1;
          if (a.City < b.City)
            return 1;
          return 0;
        });
          this.cityOrder = 1;
          break;
        case 'zip': this.selectedPropertyList.sort(function (a, b) {
          if (a.ZipCode > b.ZipCode)
            return -1;
          if (a.ZipCode < b.ZipCode)
            return 1;
          return 0;
        });
          this.zipOrder = 1;
          break;
        case 'type': this.selectedPropertyList.sort(function (a, b) {
          if (a.GeneralUse > b.GeneralUse)
            return -1;
          if (a.GeneralUse < b.GeneralUse)
            return 1;
          return 0;
        });
          this.typeOrder = 1;
          break;
        case 'size': this.selectedPropertyList.sort(function (a, b) {
          if (a.BuildingSF > b.BuildingSF)
            return -1;
          if (a.BuildingSF < b.BuildingSF)
            return 1;
          return 0;
        });
          this.sizeOrder = 1;
          break;
      }

    }

    this.sortingOrder = [];
    this.sortingOrder.push({
      nameOrder: this.nameOrder,
      addrOrder: this.addrOrder,
      cityOrder: this.cityOrder,
      zipOrder: this.zipOrder,
      typeOrder: this.typeOrder,
      sizeOrder: this.sizeOrder
    });
    localStorage.setItem('sortingOrder', JSON.stringify(this.sortingOrder));

    this._sharedDataService.selectedReportProperties = this.selectedPropertyList;


    if (!!this._sharedDataService.selectedReportList && this._sharedDataService.selectedReportList.length > 0) {
      this._sharedDataService.selectedReportList.forEach(item => {
        if (!item.isEditable) {
          this.selectedReportList.push(item);
        }
      });

      let reportId = 0;
      this._sharedDataService.selectedReportList.forEach(item => {   
        if (item.ReportId != reportId) {
          reportId = item.ReportId;       
            let communicationModel = new CommunicationModel();
            communicationModel.Key = "reportSort";
            communicationModel.data = item.ReportId;
           this._CommService.broadcast(communicationModel);
        }
      });
    }
  }

  onClickSelectAll() {

    if (this.selectedPropertyList.length > 0) {
      this.selectedPropertyList.forEach(prop => {
        prop.isSelected = this.isSelectAll;
      });
    }
  }
  selectView(type) {

    switch (type) {
      case 'grid': this.isGalleryView = false;
        this.isGridView = true;
        this.isReportView = false;
        break;
      case 'gallery': this.isGalleryView = true;
        this.isGridView = false;
        this.isReportView = false;
        break;
      case 'report': this.isGalleryView = false;
        this.isGridView = false;
        this.isReportView = true;
        break;
    }
  }
}
