import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiBaseService } from './services/api-base.service';
import { PropertyService } from './services/api-property.service';
import { DMPService } from './services/dmp.service';
import { TransactionService } from './services/transaction.service';
import { CommunicationService } from './services/communication.service';
import { TenantService } from './services/tenant.service';
import { HistoryService } from './services/history.service';
import { LookupService } from './services/lookup.service';
import { SuiteService } from './services/suite.service';
import { AnalyticsService } from './services/analytics.service';
import { ContactService } from './services/contact.service';
import { PropertySearchService } from './services/api-propertySearch.service';
import { SharedDataService } from './services/shareddata.service';
import { ReportService } from './services/report.service';
import { LoginService } from './services/login.service';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { PagerService } from './services/pager.service';
import { ExcelService} from './services/excel.service';
import { UserPreferencesService} from './services/user-preferences.service';
import { AuthGuard } from '../core/services';
import {SuggestionsService} from './services/suggestions.service';
/* import { UserService } from '../core/services';
import { ApiService } from '../core/services';
import { BasicAuthInterceptor } from './interceptors/basic-auth.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtService  } from '../core/services/jwt.service'; */


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers:[
    ApiBaseService,
    PropertyService,
    DMPService,
    CommunicationService,
    TransactionService,
    TenantService,
    HistoryService,
    LookupService,
    ContactService,
    SuiteService,
    PropertySearchService,
    SharedDataService,
    ReportService,
    PagerService,
    LoginService,
    ExcelService,
    UserPreferencesService,
    AuthGuard,
    AnalyticsService,
    SuggestionsService
  /*   ,
    UserService,
    ApiService,
    JwtService,
     */
   /*  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }, */
  /*   { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true }, */
/*     { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true }, */
/*         { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true } */
  ]
})
export class CoreModule { }
