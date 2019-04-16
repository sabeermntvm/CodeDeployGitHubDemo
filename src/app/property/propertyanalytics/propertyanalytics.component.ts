import { Component, OnInit, Input } from '@angular/core';
import { AnalyticsService } from '../../core/services/analytics.service';
import { SharedDataService } from '../../core/services/shareddata.service';
import { Observable, Subject } from 'rxjs/Rx';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError } from 'rxjs/operators';
import { LoginService } from '../../core/services/login.service';
import { LookupService } from '../../core/services/lookup.service';
import { AnalyticsDimentions } from '../../core/models/AnalyticsSearchCriteria';


@Component({
  selector: 'app-propertyanalytics',
  templateUrl: './propertyanalytics.component.html',
  styleUrls: ['./propertyanalytics.component.css']
})
export class PropertyanalyticsComponent implements OnInit {

  @Input() propertyId: any;
  @Input() zipcode: any;

  constructor(private _analyticsService: AnalyticsService,
    private _lookupService: LookupService,
    private _loginService: LoginService,
    private _sharedDateService: SharedDataService) { }

  ngOnInit() {
  }
}
