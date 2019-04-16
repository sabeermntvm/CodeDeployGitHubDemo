import { Component, OnInit, Input } from '@angular/core';
import 'rxjs/add/operator/distinct';
import { SharedDataService } from '../../core/services/shareddata.service';
import { ReportService } from '../../core/services/report.service';
import { Router } from '@angular/router';
import { CommunicationModel, CommunicationService } from '../../core/services/communication.service';
import { LoginService } from '../../core/services/login.service';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-ulmreporturlgenerator',
  templateUrl: './ulm-report-url-generator.component.html',
  styleUrls: ['./ulm-report-url-generator.component.scss']
})
export class ULMReportUrlGeneratorComponent implements OnInit {

  selectedPropertyList: any[];
  reportUrl: string;
  UserID: number;
  ulmName: string;
  URLName: any;
  constructor(private _sharedDataService: SharedDataService
    , private _reportService: ReportService
    , private _router: Router
    , private _CommService: CommunicationService
    , private _loginService: LoginService
    , private _location: Location
  ) {
    this.selectedPropertyList = [];
    this.UserID = null;
    this.reportUrl = null;
    this.ulmName = null;

    const loginData = this._loginService.UserInfo;
    if (!!loginData) {
      this.UserID = loginData.EntityID

    }
    this._sharedDataService.searchProperties.forEach(prop => {
      if (prop.isSelected) {
        this.selectedPropertyList.push(prop);
      }
    });
    this._sharedDataService.selectedProperties = this.selectedPropertyList;
  }

  ngOnInit() {
  }

  generateUrl() {
    const key = [];
    const expiryDays = environment.ULMLinkExpiryDays;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    this._sharedDataService.selectedProperties.forEach(prop => {
      const listingId = prop.ListingID ? prop.ListingID : '';
      key.push(prop.PropertyId + '|' + listingId);
    });
    const keyString = key.join(',');
    this._reportService.saveULMDetails({
      Key: Math.random().toString(36).substr(2, 9),
      PropertyList: keyString, Status: 'Sent',
      ListingsSent: this._sharedDataService.selectedProperties.length,
      ListingsUpdated: 0,
      SentByUserID: this.UserID,
      Name: this.ulmName,
      ExpiryDate: expiryDate
    }).subscribe(result => {
      const appDeploymentUrl = window.location.href.split('/#')[0];
      const ulmKey = JSON.parse(result['_body']).responseData[0].ulmKey;
      this.reportUrl = appDeploymentUrl + '/#/ulm/ulmReportEdit/' + ulmKey;
      this.URLName = JSON.parse(result['_body']).responseData[0].URLName;
    })
  }

  backToResults() {
    this._location.back();
    // this._router.navigate(['/property/resultsGrid']);
  }
}
