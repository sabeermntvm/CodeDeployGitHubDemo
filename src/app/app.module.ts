// Core Module
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule, MatTableModule } from '@angular/material';
import * as global from './config/globals';
import { OwlModule } from 'ngx-owl-carousel';
import { NgSelectModule } from '@ng-select/ng-select';
// Main Component
import { AppComponent } from './app.component';


// Component Module
import { NvD3Module } from 'ng2-nvd3';
import { AgmCoreModule } from '@agm/core';
import { CalendarModule } from 'angular-calendar';
import { FullCalendarModule } from 'ng-fullcalendar';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';

import { HighlightJsModule } from 'ngx-highlight-js'
import { CountdownModule } from 'ngx-countdown';
import { ChartsModule } from 'ng4-charts/ng4-charts';
import { TagsInputModule } from 'ngx-tags-input/dist';
import { Ng2TableModule } from 'ngx-datatable/ng2-table';

import { AuthModule }         from './auth/auth.module';
import { CoreModule }         from './core/core.module';
import { SharedModule }         from './shared/shared.module';
import { HttpModule }         from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import 'hammerjs';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyDZmrl-yvTo0lPf2GtpjiLQaW8qnWCFS94&v=3.33' }),
    BrowserAnimationsModule,
    BrowserModule,
    CalendarModule.forRoot(),
    CountdownModule,
    ChartsModule,
    FullCalendarModule,
    FormsModule,
    HighlightJsModule,
    NgbModule.forRoot(),
    NvD3Module,
    ReactiveFormsModule,
    SlimLoadingBarModule.forRoot(),
    TagsInputModule.forRoot(),
    MatSortModule,
    MatTableModule,
    Ng2TableModule,
    OwlModule,
    AuthModule,
    CoreModule,
    HttpModule,
    SharedModule,
    Ng4LoadingSpinnerModule,
    NgSelectModule,
    NgxChartsModule,
    ToastrModule.forRoot(
      {
        timeOut: 1500,
        preventDuplicates: true,
        closeButton:true
      }
    )
  ],
  providers: [Title,{
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  }],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(private router: Router, private titleService: Title, private route: ActivatedRoute) {
    router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        var title = 'EMPIRICAL CRE';
        this.titleService.setTitle(title);
      }
    });
  }
}
