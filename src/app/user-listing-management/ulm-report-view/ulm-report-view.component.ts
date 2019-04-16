import { Component, OnInit,OnDestroy } from '@angular/core';
import 'rxjs/add/operator/distinct';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportService} from '../../core/services/report.service';
import pageSettings from '../../config/page-settings';

declare var $: any;

@Component({
  selector: 'app-ulm-report-view',
  templateUrl: './ulm-report-view.component.html',
  styleUrls: ['./ulm-report-view.component.css']
})
export class UlmReportViewComponent implements OnInit {

  userListingManagementList: Array<any>;
  pageSettings;

  constructor(private route: ActivatedRoute
    , private _reportService: ReportService
    , private _router: Router) {

  }

  ngOnInit() {
    this.pageSettings = pageSettings;
    pageSettings.pageEmpty = true;
    this.route.params.subscribe(params => {
      const ulmId = params['ulmId'];
      this._reportService.getULMListingsByULMId(ulmId).subscribe( ulmListingData => {
        const reportList = JSON.parse(ulmListingData['_body']).responseData.ulmListings;
        this.userListingManagementList = [];
        reportList.forEach(report => {
          if (report.ReceivedHtml) {
            this.userListingManagementList.push(JSON.parse(report.ReceivedHtml))
          }
        })
      })
    });
  }
  ngOnDestroy()
  {
    pageSettings.pageEmpty = false;
  }
  backToResults() {
    this._router.navigate(['/ulm/ulmGrid']);
  }

}
