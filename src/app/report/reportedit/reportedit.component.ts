import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Response, Headers, RequestOptions, Http } from '@angular/http';
import { ReportService } from '../../core/services/report.service';
import { ReportInfo } from '../../core/models/ReportInfo';
import { SharedDataService } from '../../core/services//shareddata.service';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import { PropertyService } from '../../core/services/api-property.service';
import { ContactService } from '../../core/services/contact.service';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../core/services';
import { Subscription } from 'rxjs';
declare var $: any;
declare var config: any;
/* declare var require: any;
const constants = config.prototype.constants(); */
// const CryptoJS = require('crypto-js');

@Component({
  selector: 'app-reportedit',
  templateUrl: './reportedit.component.html',
  styleUrls: ['./reportedit.component.scss']
})
export class ReportEditComponent implements OnInit {
  reportFromPrevPage: Array<ReportInfo>;
  editField: boolean;
  headerHTML: string;
  footerHTML: string;
  updatedList: Array<ReportInfo>;
  reportList: Array<ReportInfo>;
  mediaList: Array<any>;

  loginCompanyId: number;
  loginCompanyDetails: any;
  zoomValue: number = 100;
  zoomMax: number = 300;
  zoomMin: number = 50;
  doneEditSubscription: Subscription;
  constructor(private _location: Location
    , private _reportService: ReportService
    , private _http: Http
    , private _sharedDataService: SharedDataService
    , private _CommService: CommunicationService
    , private _propertyService: PropertyService
    , private _contactService: ContactService
    , private _loginService: LoginService
  ) {
    this.reportFromPrevPage = new Array<ReportInfo>();
    this.updatedList = new Array<ReportInfo>();
    this.editField = true;
    this.reportList = new Array<ReportInfo>();

    //const loginData = this._cookieService.get('LogInData');
    /* if (loginData != '' && !!loginData) {
      const bytes = CryptoJS.AES.decrypt(loginData.toString(), constants.EncryptionKey);
      const loggedinData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (loggedinData) {
        this.loginCompanyId = loggedinData.CompanyID;
      }
    } */

    this.loginCompanyId = this._loginService.UserInfo.CompanyID;
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

    this.doneEditSubscription = this._CommService.subscribe("DoneEdit").subscribe((data) => {
      this.onClickDoneEdit();
    });
  }
  ngOnDestroy() {
    this.doneEditSubscription.unsubscribe();
  }
  ngAfterViewInit() {
    this.onZoomChange();
  }


  ngOnInit() {

    let x = this._sharedDataService.reportDisplayOrder;


    if (!!this._sharedDataService.selectedReportList && this._sharedDataService.selectedReportList.length > 0)
      this.reportFromPrevPage = this._sharedDataService.selectedReportList;
    // if (!!this._sharedDataService.reportDisplayOrder && this._sharedDataService.reportDisplayOrder.length > 0) {
    //   this.reportFromPrevPage.forEach(rep => {
    //     this._sharedDataService.reportDisplayOrder.forEach(function (order, index) {
    //       if (rep.ReportId == order.ReportId)
    //         rep.ReportOrder = index + 1;
    //     });       
    //     this._sharedDataService.selectedReportList=this.reportFromPrevPage;
    //   });
    // }


    let count = 0;
    this._sharedDataService.selectedReportSortList.forEach(order => {
      this.reportFromPrevPage.forEach(rep => {
        if (rep.ReportId == order.ReportId || rep.ParentReportId == order.ReportId) {
          count++;
          rep.ReportOrder = count;
        }
      })
    });
    this._sharedDataService.selectedReportList = this.reportFromPrevPage;

    var instance = this;
    setTimeout(function () {
      instance.editField = false;
      instance.editFields();
    }, 1000);


  }
  getLoggedInCompanyDetails() {
    this._contactService.getLoggedInCompanyDetailsById(
      this.loginCompanyId
    ).subscribe(resultData => {
      if (!JSON.parse(resultData['_body']).error)
        this.loginCompanyDetails = JSON.parse(resultData['_body']).responseData[0];

    });
  }
  editFields() {

    if (this.editField) {
      this.editField = false;
      $('.edittext').each(function (index, value) {
        value.contentEditable = 'inherit';
      });
    } else {
      //    this.editField = true;
      $('.edittext').each(function (index, value) {
        value.contentEditable = true;
      });
    }
    //$('.btn-add-listing').remove();
    $('.btn-add-listing').each(function (index, value) {
      value.onclick = function (a) {
        let suiteRowHtml = '<tr class="suite-row">';
        const colCount = $(this).closest('.rep-prev-left').find('.em-table thead tr th').length;
        for (let i = 0; i < colCount; i++) {
          suiteRowHtml +='<td><span class="edittext bold" contenteditable="true"></span></td>';
          
        }

        $(this).closest('.rep-prev-left').find('.em-table tbody').append(suiteRowHtml);
       //$( "tbody:nth-last-child(1)" ).appendChild ( "x" );
        $(this).closest('.rep-prev-left').find('.em-table tbody tr td:nth-last-child(1)').html("<i class='btn-remove-suite far fa-trash-alt'></i>");    
        $(".btn-remove-suite").on('click', function(e) {
          $(this).closest("tr").remove();
          });   
      };
    });
    $('.std-btn-add-listing').each(function (index, value) {
      value.onclick = function (a) {
        let suiteRowHtml = '<tr class="suite-row">';
        const colCount = $(this).closest('.rep-prev-left').find('.bru-table thead tr th').length;
        for (let i = 0; i < colCount; i++) {
          suiteRowHtml +='<td><span class="edittext bold" contenteditable="true"></span></td>';
          
        }

        $(this).closest('.rep-prev-left').find('.bru-table tbody').append(suiteRowHtml);
       //$( "tbody:nth-last-child(1)" ).appendChild ( "x" );
        $(this).closest('.rep-prev-left').find('.bru-table tbody tr td:nth-last-child(1)').html("<i class='btn-remove-suite far fa-trash-alt'></i>");    
        $(".btn-remove-suite").on('click', function(e) {
          $(this).closest("tr").remove();
          });   
      };
    });
    $(".btn-remove-suite").on('click', function(e) {
      $(this).closest("tr").remove();
      });

    const preEditRightImg = $('.prev-edit-right-img');
    const instance = this;
    preEditRightImg.each((i, value) => {
      value.children[0].onclick = function () {
        instance._propertyService.GetAllPropertyMediaByPropertyId(value.getAttribute('prop-id')).subscribe((result) => {
          const mediaData = JSON.parse(result['_body']).responseData[0];
          mediaData.forEach((media, index) => {
            mediaData[index].url = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}` + media.Path;
          });
          instance.mediaList = mediaData;
          $('#testmodal').modal('show');
        });
      };
    });
  }

  selectImage(propId, url) {
    $('div[prop-id=' + propId + ']')[0].children[0].src = url;
  }

  saveEditedReport() {   
    this.headerHTML = this._reportService.replaceData(this.headerHTML, this.loginCompanyDetails, null, 0);
    this.footerHTML = this._reportService.replaceData(this.footerHTML, this.loginCompanyDetails, null, 0);

    this.reportList = new Array<ReportInfo>();
    this.reportFromPrevPage.forEach(item => {
      if (!item.isEditable || item.ReportType === 'coverpage')
        this.reportList.push(item);

      this._reportService.GetReportList().forEach(report => {
        if (report.ReportType == item.ReportType && report.ReportId === item.ReportId) {
          this.reportList.push(report);
        }
      });
    });

    let testDisplay = new Array<ReportInfo>();

    this.reportList.forEach(item => {

      if (testDisplay.length > 0) {
        let count = 0;
        testDisplay.forEach(rep => {
          if (rep.ReportType === item.ReportType && rep.ReportId === item.ReportId) {
            count++;
          }

        });
        if (count == 0)
          testDisplay.push(item);

      } else {
        testDisplay.push(item);
      }
    });
    this.reportList = testDisplay;

    this.updatedList = new Array<ReportInfo>();
    this.reportList.forEach(report => {

      if (!report.isEditable) {
        let newReport = new ReportInfo();
        newReport.HTML = report.HTML;
        newReport.ReportId = report.ReportId;
        newReport.ReportType = report.ReportType;
        newReport.ReportName = report.ReportName;
        newReport.ReportOrder = report.ReportOrder;
        newReport.ReportUrl = report.ReportUrl;
        newReport.IsSelected = report.IsSelected;
        newReport.PreviewImage = report.PreviewImage;
        newReport.isEditable = report.isEditable;
        newReport.ParentReportId = report.ParentReportId;
        newReport.reportLayout = report.reportLayout;
        newReport.reportTitle = report.reportTitle;


        this.updatedList.push(newReport);

      } else {

        if (report.ReportType === 'coverpage') {
          const instance = this;
          const newReport = new ReportInfo();
          let reportHTML = '';
          reportHTML = $('[reportid=' + report.ReportId + ']')[0].outerHTML;
          if (report.hasFooter && this.footerHTML)
            reportHTML += this.footerHTML;

          if (report.hasHeader && this.headerHTML)
            reportHTML = this.headerHTML + reportHTML;

          newReport.HTML = reportHTML;
          newReport.ReportId = report.ReportId;
          newReport.ReportType = report.ReportType;
          newReport.ReportName = report.ReportName;
          newReport.ReportOrder = report.ReportOrder;
          newReport.ReportUrl = report.ReportUrl;
          newReport.IsSelected = report.IsSelected;
          newReport.PreviewImage = report.PreviewImage;
          newReport.isEditable = report.isEditable;
          newReport.ParentReportId = report.ParentReportId;
          newReport.reportLayout = report.reportLayout;
          newReport.reportTitle = report.reportTitle;
          instance.updatedList.push(newReport);
        } else {
          if (!report.isMultiProperty) {
            let instance = this;
            this._sharedDataService.selectedPropertListingDetails.forEach(result => {
              let prop = result.allInfo;
              let avl = '[id="' + prop.PropertyID + '-' + prop.ListingID + '"][reportid=' + report.ReportId + ']';
              $(avl).each(function (index, value) {
                let reportHTML = '';
                let newReport = new ReportInfo();
                if (value.getAttribute('reportid') == report.ReportId) {

                  reportHTML = value.outerHTML;
                  if (report.hasFooter && instance.footerHTML)
                    reportHTML += instance.footerHTML;

                  if (report.hasHeader && instance.headerHTML)
                    reportHTML = instance.headerHTML + reportHTML;

                  newReport.HTML = reportHTML
                  newReport.ReportId = report.ReportId;
                  newReport.ReportType = report.ReportType;
                  newReport.ReportName = report.ReportName;
                  newReport.ReportOrder = report.ReportOrder;
                  newReport.ReportUrl = report.ReportUrl;
                  newReport.IsSelected = report.IsSelected;
                  newReport.PreviewImage = report.PreviewImage;
                  newReport.isEditable = report.isEditable;
                  newReport.reportLayout = report.reportLayout;
                  newReport.ParentReportId = report.ParentReportId;
                  newReport.reportTitle = report.reportTitle;


                  instance.updatedList.push(newReport);

                }

              });

            });
          } else {

            let instance = this;
            let count = 0;
            let reportHTML = '';
            this._sharedDataService.selectedPropertListingDetails.forEach((result, i) => {
              let prop = result.allInfo;
              count++;
              let avl = '[id="Multi_' + prop.PropertyID + '-' + prop.ListingID + '"][reportid=' + report.ReportId + ']';
              $(avl).each(function (index, value) {

                let newReport = new ReportInfo();
                if (value.getAttribute('reportid') == report.ReportId) {

                  reportHTML += value.outerHTML;
                  if ((i + 1) === instance._sharedDataService.selectedProperties.length || ((i + 1) % report.pageBreak == 0)) {
                    if (report.hasFooter)
                      reportHTML += instance.footerHTML;

                    if (report.hasHeader)
                      reportHTML = instance.headerHTML + reportHTML;

                    newReport.HTML = reportHTML
                    newReport.ReportId = report.ReportId;
                    newReport.ReportType = report.ReportType;
                    newReport.ReportName = report.ReportName;
                    newReport.ReportOrder = report.ReportOrder;
                    newReport.ReportUrl = report.ReportUrl;
                    newReport.IsSelected = report.IsSelected;
                    newReport.PreviewImage = report.PreviewImage;
                    newReport.isEditable = report.isEditable;
                    newReport.ParentReportId = report.ParentReportId;
                    newReport.reportLayout = report.reportLayout;
                    newReport.reportTitle = report.reportTitle;

                    const newReportCopy = Object.assign({}, newReport);
                    instance.updatedList.push(newReportCopy);
                    reportHTML = '';
                  }
                }

              });

            });


          }
        }
      }

    });
    this._sharedDataService.selectedReportList = this.updatedList;

  }


  onClickDoneEdit() {  
    this.editField = true;
    this.editFields();
    this.saveEditedReport();
  }

  onZoomChange() {
    $('.zoom-out').each((index, value) => {
      this.zoomValue = window.innerWidth * 7.50 / 100;
      const scale = this.zoomValue / 100;
      const width = 795 * scale + 20; // inner content width * scale + padding
      const height = 1124 * scale + 20; // inner content height * scale + padding
      value.children[0].style.transform = 'scale(' + scale + ')';
      value.style.float = "left";
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
