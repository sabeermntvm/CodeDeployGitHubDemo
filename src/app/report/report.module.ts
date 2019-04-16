import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportRoutingModule } from './report-routing.module';
import { ReportHomeComponent } from './reporthome/reporthome.component';
import { ReportSelectionComponent } from './reportselection/reportselection.component';
import { ReportSortComponent } from './reportsort/reportsort.component';
import { ReportEditComponent } from './reportedit/reportedit.component';
import { ReportMediaComponent } from './reportmedia/reportmedia.component';
import { ReportReviewComponent } from './reportreview/reportreview.component';
import { SafeHtmlPipe } from '../shared/pipes/safehtml.pipe';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { DragDropDirectiveModule} from "angular4-drag-drop";
// import { DndModule } from 'ngx-drag-drop';
import {DndModule} from 'ng2-dnd';
import {MapModule} from '../map/map.module';
import {SharedModule} from '../shared/shared.module';
import {MatSliderModule} from '@angular/material/slider';
import { MapService } from './../core/services/map-service.service';
@NgModule({
    imports: [
        ReportRoutingModule,
        CommonModule,
        FormsModule,
        MapModule,
        Ng2OrderModule,
        //DragDropDirectiveModule
       // DndModule
       DndModule.forRoot(),
      SharedModule,
      MatSliderModule,
      NgbModule
    ],
    providers: [MapService],
    declarations: [ReportHomeComponent
        , ReportSelectionComponent
        , ReportSortComponent
        , ReportEditComponent
        , ReportMediaComponent
        , ReportReviewComponent]

})
export class ReportModule { }
