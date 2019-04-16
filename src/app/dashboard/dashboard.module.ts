import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule } from '@angular/forms';
import { OwlModule } from 'ngx-owl-carousel';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule }         from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    CommonModule,
    OwlModule,
    NgxChartsModule,
    SharedModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
