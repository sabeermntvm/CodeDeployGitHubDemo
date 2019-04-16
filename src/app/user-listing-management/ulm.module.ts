import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ULMRoutingModule } from './ulm-routing.module';
import { MatSortModule, MatTableModule } from '@angular/material';
import { Ng2TableModule } from 'ngx-datatable/ng2-table';
import { OwlModule } from 'ngx-owl-carousel';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from './../core/services/map-service.service';
import { AgmCoreModule } from '@agm/core';
import { DndModule } from 'ng2-dnd';
// import {SafeHtmlPipe} from '../shared/pipes/safehtml.pipe';
import { UlmReportGridComponent } from './ulm-report-grid/ulm-report-grid.component';
import { UlmReportViewComponent } from './ulm-report-view/ulm-report-view.component';
import { UlmReportEditComponent } from './ulm-report-edit/ulm-report-edit.component';
import {SharedModule} from '../shared/shared.module';
import {ULMReportUrlGeneratorComponent} from  './ulm-report-url-generator/ulm-report-url-generator.component';

@NgModule({
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    Ng2TableModule,
    NgbModule,
    OwlModule,
    NgSelectModule,
    FormsModule,
    ULMRoutingModule,
    CommonModule,
    MatSortModule,
    MatTableModule,
    Ng2TableModule,
    AgmCoreModule,
    DndModule,
    SharedModule
    // SafeHtmlPipe
  ],
  declarations: [
    UlmReportGridComponent,
    UlmReportViewComponent,
    UlmReportEditComponent,
    ULMReportUrlGeneratorComponent
    // SafeHtmlPipe
  ],
  providers: [MapService],
})
export class ULMModule { }
