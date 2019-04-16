import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { SharedDataService } from '../../core/services/shareddata.service';
import { Property } from '../../core/models/property';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import { ReportInfo } from '../../core/models/ReportInfo';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportEditComponent } from '../reportedit/reportedit.component';
import { ReportMediaComponent } from '../reportmedia/reportmedia.component';
import { ReportReviewComponent } from '../reportreview/reportreview.component';
import pageSettings from '../../config/page-settings';
import { Subscription } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-reporthome',
  templateUrl: './reporthome.component.html',
  styleUrls: ['./reporthome.component.scss']
})
export class ReportHomeComponent implements OnInit {
  pageSettings;
  selectedPropertyList: Array<Property>;
  isReportSelection: boolean = false;
  isReportSort: boolean = false;
  isReportEdit: boolean = false;
  isReportMedia: boolean = false;
  isReportReview: boolean = false;

  isCoverPageSelected: boolean = false;
  isBrochureSelected: boolean = false;
  isMultiPropertySelected: boolean = false;
  isMapSelected: boolean = false;
  reportList: Array<ReportInfo>;
  selectedReportType: string;

  selectOption: string = 'Sort';
  lastBtnAction: boolean = true;
  @ViewChild(ReportEditComponent)
  private reportEditComponent: ReportEditComponent;

  @ViewChild(ReportMediaComponent)
  private reportMediaComponent: ReportMediaComponent;

  @ViewChild(ReportReviewComponent)
  private reportReviewComponent: ReportReviewComponent;

  selectedReportList: Array<ReportInfo>;
  sideMenuListToggle: boolean = true;
  CloseActionBtn: boolean;
  activeTab: string = "select";
  webView: boolean;
  mobileView: boolean;
  pageSelectionSubscription: Subscription;
  changeReportSubscription: Subscription;
  constructor(private _location: Location
    , public _sharedDataService: SharedDataService
    , private _CommService: CommunicationService
    , private _router: Router) {
    this.selectedPropertyList = new Array<Property>();
    this.reportList = new Array<ReportInfo>();
    this.selectedReportList = new Array<ReportInfo>();
    this._sharedDataService.selectedReportList = [];
    this._sharedDataService.selectedReportSortList = [];
    this._sharedDataService.searchProperties.forEach(prop => {
      if (prop.isSelected)
        this.selectedPropertyList.push(prop);
    });
    this._sharedDataService.selectedProperties = this.selectedPropertyList;

    this.pageSelectionSubscription = this._CommService.subscribe("reportPageSelected").subscribe((data) => {

      this.selectedReportList.push(data.data);
      this._sharedDataService.selectedReportSortList = this.selectedReportList;
      // switch (data.data) {
      //   case 'coverpage':
      //     this.isCoverPageSelected = true;
      //     break;
      //   case 'brochure':
      //     this.isBrochureSelected = true;
      //     break;
      //   case 'multiproperty':
      //     this.isMultiPropertySelected = true;
      //     break;
      //   case 'map':
      //     this.isMapSelected = true;
      //     break;

      // }
    });
    this.changeReportSubscription = this._CommService.subscribe("ChangeReportPage").subscribe((data) => {
      this.changeReportFunction(data.data);
      // switch (data.data) {

      //   case 'media':
      //     this.isCoverPageSelected = true;
      //     this.isBrochureSelected = true;
      //     break;
      //   case 'review':
      //     this.isCoverPageSelected = true;
      //     this.isBrochureSelected = true;
      //     this.isMapSelected = true;
      //     break;
      //  case 'sort':break;
      // }
    });


  }
  ngOnDestroy() {
    this.pageSelectionSubscription.unsubscribe();
    this.changeReportSubscription.unsubscribe();
  }
  toggle() {
    this.sideMenuListToggle = !this.sideMenuListToggle;
  }

  ngOnInit() {
    this.pageSettings = pageSettings;
    this.pageSettings.pageSidebarMinified = true;
    this.openReportSelectedView();
    this.showSelectedTab('coverpage');
    if ($(window).width() < 767) {
      this.webView = false;
      this.mobileView = true;
    }
    else {
      this.webView = true;
      this.mobileView = false;
    }
    $(window).resize(function () {
      if ($(window).width() < 767) {
        this.webView = false;
        this.mobileView = true;
      }
      else {
        this.webView = true;
        this.mobileView = false;
      }
    });

  }
  showSelectedTab(tabName) {

    this.isReportSelection = true;
    this.isReportSort = false;
    this.isReportEdit = false;
    this.isReportMedia = false;
    this.isReportReview = false;
    this.selectedReportType = tabName;
    $(".sidebar.innerpages  .nav-link").each((index, elmnt) => {
      if ($(elmnt).attr('id') == tabName) {
        $(elmnt).addClass('active');
      } else {
        $(elmnt).removeClass('active');
      }
    });

    $(".prv-progresbar .progressbar li").each((index, elmnt) => {
      if ($(elmnt).attr('id') == "select") {
        $(elmnt).addClass('active');
      } else {
        $(elmnt).removeClass('active');
      }
    });


    let communicationModel = new CommunicationModel();
    communicationModel.Key = "SelectReportType";
    communicationModel.data = tabName;
    this._CommService.broadcast(communicationModel);

  }

  deleteSelectedReport(delReport) {

    if (!!this._sharedDataService.selectedReportList && this._sharedDataService.selectedReportList.length > 0) {
      this.reportList = this._sharedDataService.selectedReportList;

      let updatedList = new Array<ReportInfo>();
      this.reportList.forEach(report => {
        if (report.ReportId != delReport.ReportId) {
          report.IsSelected = true;
          updatedList.push(report);
        } else
          report.IsSelected = false;

      });
      let instance = this;
      this.selectedReportList.forEach(function (report, index) {
        if (report.ReportId == delReport.ReportId)
          instance.selectedReportList.splice(index, 1);
        else
          report.IsSelected = true;
      });

      this._sharedDataService.selectedReportList = updatedList;
      this._sharedDataService.selectedReportSortList = this.selectedReportList;

      // switch (report) {
      //   case 'coverpage': this.reportList.forEach(report => {
      //     if (report.ReportType != 'coverpage')
      //       updatedList.push(report);
      //   });

      //     this.isCoverPageSelected = false;
      //     break;
      //   case 'brochure': this.reportList.forEach(report => {
      //     if (report.ReportType != 'brochure')
      //       updatedList.push(report);
      //   });

      //     this.isBrochureSelected = false;
      //     break;
      //   case 'multiproperty': this.reportList.forEach(report => {
      //     if (report.ReportType != 'multiproperty')
      //       updatedList.push(report);
      //   });

      //     this.isMultiPropertySelected = false;
      //     break;
      //   case 'map': this.reportList.forEach(report => {
      //     if (report.ReportType != 'map')
      //       updatedList.push(report);
      //   });

      //     this.isMapSelected = false;
      //     break;
      // }
      if (this.isReportSelection) {
        let communicationModel = new CommunicationModel();
        communicationModel.Key = "DeleteReport";
        communicationModel.data = delReport.ReportType;
        this._CommService.broadcast(communicationModel);
      }
      if (this.isReportSort) {
        let communicationModel = new CommunicationModel();
        communicationModel.Key = "DeleteReport";
        communicationModel.data = this.selectedReportType;
        this._CommService.broadcast(communicationModel);
      }

    }
  }
  changeReportFunction(activity) {
    this.activeTab = activity;
    switch (activity.toLowerCase()) {
      case 'select': this.isReportSelection = true;
        this.isReportSort = false;
        this.isReportEdit = false;
        this.isReportMedia = false;
        this.isReportReview = false;
        this.lastBtnAction = true;
        this.selectOption = 'Sort';
        this.sideMenuListToggle = true;
        this.activeTab = 'select';
        this.openReportSelectedView();
        break;
      case 'sort': this.isReportSelection = false;
        this.isReportSort = true;
        this.isReportEdit = false;
        this.isReportMedia = false;
        this.isReportReview = false;
        this.lastBtnAction = true;
        this.selectOption = 'Edit';
        this.sideMenuListToggle = true;
        this.CloseActionBtn = true;
        this.activeTab = 'sort';
        document.getElementById("reportViewWrap").style.width = "82%";
        document.getElementById("SidenavReport").style.width = "18%";
        document.getElementById("SidenavWrap").style.width = "18%";
        document.getElementById('innerpages-sub-nxt').style.width = "100%";
        if ($(window).width() < 767) {
          document.getElementById("reportViewWrap").style.width = "100%";
          document.getElementById("SidenavReport").style.width = "58%";
          document.getElementById("SidenavWrap").style.width = "58%";
        }
        break;
      case 'edit': this.isReportSelection = false;
        this.isReportSort = false;
        this.isReportEdit = true;
        this.isReportMedia = false;
        this.isReportReview = false;
        this.lastBtnAction = true;
        this.selectOption = 'Media';
        this.sideMenuListToggle = false;
        this.activeTab = 'edit';
        this.closeNav();      
        this.onSortComplete();
        break;
      case 'media': this.isReportSelection = false;
        this.isReportSort = false;
        this.isReportEdit = false;
        this.isReportMedia = true;
        this.isReportReview = false;
        this.selectOption = 'Review';
        this.lastBtnAction = true;
        this.sideMenuListToggle = false;
        this.activeTab = 'media';
        this.closeNav();
        this.onDoneEdit();
        // this.reportEditComponent.onClickDoneEdit();
        break;
      case 'review': this.isReportSelection = false;
        this.isReportSort = false;
        this.isReportEdit = false;
        this.isReportMedia = false;
        this.isReportReview = true;
        this.lastBtnAction = false;
        this.sideMenuListToggle = false;
        this.activeTab = 'review';
        this.closeNav();       
        this.onSortComplete();
        this.onDoneEdit();
        // this.reportEditComponent.onClickDoneEdit();
        break;
    }

    $(".prv-progresbar .progressbar li").each((index, elmnt) => {
      if ($(elmnt).attr('id') == activity.toLowerCase()) {
        $(elmnt).addClass('active');
      } else {
        $(elmnt).removeClass('active');
      }
    });
  }
  onSortComplete() { 
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
  onDoneEdit() {
    let communicationModel = new CommunicationModel();
    communicationModel.Key = "DoneEdit";
    this._CommService.broadcast(communicationModel);
  }
  onClickBackToResults() {
    //this._router.navigate(['/property/resultsGrid']);
    this._location.back();
  }

  onClickDoneEdit() {
    this.onDoneEdit();
    // this.reportEditComponent.onClickDoneEdit();
  }

  printPDF() {
    this.reportReviewComponent.printPDF();
  }

  reportCompleted() {
    localStorage.setItem('sortingOrder', 'null');
    this._sharedDataService.selectedReportList = [];
    this._sharedDataService.selectedReportSortList = [];
    // this._router.navigate(['/property/resultsGrid']);
    this._location.back();
  }

  openReportSelectedView() {
    this.CloseActionBtn = true;
    document.getElementById("reportViewWrap").style.width = "70%";
    document.getElementById("SidenavReport").style.width = "30%";
    document.getElementById("SidenavWrap").style.width = "30%";
    document.getElementById('innerpages-sub-nxt').style.width = "60%";
    if ($(window).width() < 767) {
      document.getElementById("reportViewWrap").style.width = "100%";
      document.getElementById("SidenavReport").style.width = "85%";
      document.getElementById("SidenavWrap").style.width = "85%";
    }
    else {
      document.getElementById("reportViewWrap").style.width = "70%";
      document.getElementById("SidenavReport").style.width = "30%";
      document.getElementById("SidenavWrap").style.width = "30%";
    }
  }

  closeNav() {
    this.CloseActionBtn = false;
    document.getElementById("reportViewWrap").style.width = "100%";
    document.getElementById("SidenavReport").style.width = "0";
    document.getElementById("SidenavWrap").style.width = "0";
  }
}
