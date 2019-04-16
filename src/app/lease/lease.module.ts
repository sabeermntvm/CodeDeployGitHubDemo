import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaseRoutingModule } from './lease-routing.module';
import { OwlModule } from 'ngx-owl-carousel';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from './../core/services/map-service.service';
import { CurrencyMaskModule, CurrencyMaskDirective } from "ng2-currency-mask";
import { DndModule } from 'ng2-dnd';
import { LeasemapsearchComponent } from './leasemapsearch/leasemapsearch.component';
import { LeasegridComponent } from './leasegrid/leasegrid.component';
import { LeasepindetailComponent } from './leasepindetail/leasepindetail.component';
import { LeasemultipindetailComponent } from './leasemultipindetail/leasemultipindetail.component';
import { LeaseSettingSearchComponent } from './lease-setting-search/lease-setting-search.component';
import { LeasegalleryComponent } from './leasegallery/leasegallery.component';

@NgModule({
  imports: [
    CommonModule,
    LeaseRoutingModule,
    OwlModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
    CurrencyMaskModule,
    DndModule,
    ReactiveFormsModule
  ],
  declarations: [LeasemapsearchComponent, LeasegridComponent, LeasepindetailComponent, LeasemultipindetailComponent, LeaseSettingSearchComponent, LeasegalleryComponent],
  providers: [MapService],
  exports: [CurrencyMaskDirective]
})
export class LeaseModule { }
