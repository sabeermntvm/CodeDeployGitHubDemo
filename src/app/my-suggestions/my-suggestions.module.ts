import {NgModule} from '@angular/core';
import {MySuggestionsComponent} from './my-suggestions.component';
import {MysuggestionsRoutingModule} from './my-suggestions-routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2TableModule } from 'ngx-datatable';
import { MatSortModule, MatTableModule } from '@angular/material';
import { NgbPaginationModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports : [
    CommonModule,
    FormsModule,
    MysuggestionsRoutingModule,
    MatSortModule,
    MatTableModule,
    Ng2TableModule,
    NgbPaginationModule,
    SharedModule,
    NgbModule.forRoot()
  ],
  declarations: [
    MySuggestionsComponent
  ],
  providers: []
})
export class MysuggestionsModule { }
