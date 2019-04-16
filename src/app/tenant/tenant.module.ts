import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantRoutingModule } from './tenant-routing.module';
import { MatSortModule, MatTableModule } from '@angular/material';
import { Ng2TableModule } from 'ngx-datatable/ng2-table';
import { OwlModule } from 'ngx-owl-carousel';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from './../core/services/map-service.service';
import { AgmCoreModule } from '@agm/core';
import { DndModule } from 'ng2-dnd';
import { TenantmapsearchComponent } from './tenantmapsearch/tenantmapsearch.component';
import { TenantpindetailComponent } from './tenantpindetail/tenantpindetail.component';
import { TenantmultipindetailComponent } from './tenantmultipindetail/tenantmultipindetail.component';
import { TenantgridComponent } from './tenantgrid/tenantgrid.component';
import { TenantsettingsearchComponent } from './tenantsettingsearch/tenantsettingsearch.component';
import { CurrencyMaskModule, CurrencyMaskDirective } from "ng2-currency-mask";
import { TreeModule } from 'angular-tree-component';
@NgModule({
  imports: [
    CommonModule,
    TenantRoutingModule,
    MatSortModule,
    MatTableModule,
    Ng2TableModule,
    NgbModule,
    OwlModule,
    NgSelectModule,
    FormsModule,
    MatSortModule,
    MatTableModule,
    AgmCoreModule,
    DndModule,
    CurrencyMaskModule,
    ReactiveFormsModule,
    TreeModule.forRoot()
  ],
  declarations: [TenantmapsearchComponent, TenantpindetailComponent, TenantmultipindetailComponent, TenantgridComponent, TenantsettingsearchComponent],
  providers: [MapService],
  exports: [CurrencyMaskDirective]
})
export class TenantModule { }
