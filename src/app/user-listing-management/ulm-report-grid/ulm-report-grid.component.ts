import { Component, OnInit } from '@angular/core';
import {ReportService} from '../../core/services/report.service';
import 'rxjs/add/operator/distinct';
import {ActivatedRoute, Router} from '@angular/router';
import {ULMSummary} from '../../core/models/ulmSummary';
// import {CookieService} from 'ngx-cookie-service';
import {PagerService} from '../../core/services/pager.service';
// import { CryptoJS } from 'crypto-js';
import { LoginService } from '../../core/services/login.service';

declare var config: any;
declare var require: any;
// const constants = config.prototype.constants();
// const CryptoJS = require('crypto-js');

@Component({
  selector: 'app-ulm-report-grid',
  templateUrl: './ulm-report-grid.component.html',
  styleUrls: ['./ulm-report-grid.component.css']
})
export class UlmReportGridComponent implements OnInit {


  userListingManagementList: Array<any>;
  trackData: ULMSummary;
  UserID: number;
  showByUserSelected: boolean;
  currentPage: number;
  pageSize: number;
  searchResultCount: number;
  pager: any = {};
  ExpiryDate:any;
  Isloader: boolean = false;
  constructor(private route: ActivatedRoute
    , private _router: Router
    , private _reportService: ReportService
    , private pagerService: PagerService
    , private _loginService: LoginService) {
    this.trackData = new ULMSummary();

    this.showByUserSelected = true;
    //const loginData = this._cookieService.get('LogInData');
    const loginData = this._loginService.UserInfo;
    // if (!!loginData) {
    //   const bytes = CryptoJS.AES.decrypt(loginData.toString(), constants.EncryptionKey);
    //   const loggedinData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      if (loginData) {
        this.UserID = loginData.EntityID
      }
    //}
    this.currentPage = 1;
    this.pageSize = 10;
    this.searchResultCount = 0;
  }

  ngOnInit() {
    this.getULMList();
    this._reportService.getULMSummary().subscribe(summaryResponse => {
      this.trackData = JSON.parse(summaryResponse['_body']).responseData.ulmSummary[0];
    })
  }

  setDate(date) {
    return new Date(date);
  }

  getProperties(propListString) {
    if (propListString) {
      const propList = propListString.split(',');
      const propIds = [];
      propList.forEach(prop => {
        propIds.push(prop.split('|')[0])
      });
      return propIds.join(',')
    } else {
      return null;
    }

  }

  showReport(ulmId) {
    this._router.navigate(['/ulm/ulmReportView/' + ulmId]);
  }

  editReport(ulmKey) {
    this._router.navigate(['/ulm/ulmReportEdit/' + ulmKey])
  }

  statusChange(ulm) {
    this._reportService.saveULMDetails(ulm).subscribe(result => {
      // console.log('Status Updated');
    })
  }

  reviewStatusChange(ulm) {
    this._reportService.saveULMDetails(ulm).subscribe(result => {
      this._reportService.getULMSummary().subscribe(summaryResponse => {
        this.trackData = JSON.parse(summaryResponse['_body']).responseData.ulmSummary[0];
      })
    });
  }

  showMyLinks() {
    this.currentPage = 1;
    this.searchResultCount = 0;
    this.getULMList();
  }

  getULMList() {
    this.Isloader = true;
    const expiryDays = 30;
    // const expiryDays = constants.ULMLinkExpiryDays;
    this._reportService.searchULM({
      UserID: this.showByUserSelected ? this.UserID : null,
      PageNo: this.currentPage,
      PageSize: this.pageSize
    }).subscribe(result => {
      const response = JSON.parse(result['_body']).responseData.ulmList;
      this.userListingManagementList = response[0];
      /*
      1. Calculating difference between current date and expiry date and
      updating the satus field to 'Expiry' if the differance is 0 or
      negative.
      2. If expiry date is not set, created date + the constant number of
      days is set as the expiry date
      */
     var currentDate = new Date();
     this.userListingManagementList.forEach(element => {
      if(element.ExpiryDate==null){
        this.ExpiryDate = new Date(element.CreateTime);
        this.ExpiryDate.setDate(this.ExpiryDate.getDate() + expiryDays);
      }
      else
      this.ExpiryDate = new Date(element.ExpiryDate);
      var diff = Math.abs(this.ExpiryDate.getTime() - currentDate.getTime());
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
      if((diffDays==0 || diffDays <0) && element.Status != "Expired")
      {
         element.Status = "Expired";
         this._reportService.saveULMDetails(element).subscribe(result => {
         })
      }
     });
      this.searchResultCount = response[1][0].Total_Count;
      this.pager = this.pagerService.getPager(this.searchResultCount, this.currentPage, this.pageSize);
      this.Isloader = false;
    })
  }

  setPage(page: number) {
    this.currentPage = page;
    this.getULMList();
  }

}
