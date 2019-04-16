import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionRoutingModule } from './transaction-routing.module';
import { MatSortModule, MatTableModule } from '@angular/material';
import { Ng2TableModule } from 'ngx-datatable/ng2-table';
import { OwlModule } from 'ngx-owl-carousel';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { MapService } from './../core/services/map-service.service';
import { AgmCoreModule } from '@agm/core';
import { DndModule } from 'ng2-dnd';
import { CurrencyMaskModule, CurrencyMaskDirective } from "ng2-currency-mask";
import { MyDatePickerModule } from 'mydatepicker';

import { TransactionmapsearchComponent } from './transactionmapsearch/transactionmapsearch.component';
import { TransactiongridComponent } from './transactiongrid/transactiongrid.component';
import { TransactionsettingsearchComponent } from './transactionsettingsearch/transactionsettingsearch.component';
import { TransactiongalleryComponent } from './transactiongallery/transactiongallery.component';
import { TransactionpindetailComponent } from './transactionpindetail/transactionpindetail.component';
import { TransactionmultipindetailComponent } from './transactionmultipindetail/transactionmultipindetail.component';

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
    TransactionRoutingModule,
    CommonModule,
    MatSortModule,
    MatTableModule,
    Ng2TableModule,
    AgmCoreModule,
    DndModule,
    CurrencyMaskModule,
    MyDatePickerModule,
    NgbDatepickerModule,
    ReactiveFormsModule
  ],
  declarations: [
    TransactionmapsearchComponent,
    TransactiongridComponent,
    TransactionsettingsearchComponent,
    TransactiongalleryComponent,
    TransactionpindetailComponent,
    TransactionmultipindetailComponent
  ],
  providers: [MapService],
  exports: [CurrencyMaskDirective]
})
export class TransactionModule { }
