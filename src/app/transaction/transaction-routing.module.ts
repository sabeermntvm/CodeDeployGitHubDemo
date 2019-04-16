import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { TransactionmapsearchComponent } from './transactionmapsearch/transactionmapsearch.component';
import { TransactiongridComponent } from './transactiongrid/transactiongrid.component';
import { TransactiongalleryComponent } from './transactiongallery/transactiongallery.component';

import { AuthGuard } from '../core/services';

const routes: Routes = [
  {
      path: '',
      data: {
          title: 'transaction'
      },
      children: [
          {
              path: 'mapsearch',
              component: TransactionmapsearchComponent,
              data: {title: 'mapsearch'},
              canActivate: [AuthGuard]
          },
        //   {
        //     path: 'propertySummary/:id',
        //     component: PropertysummaryComponent,
        //     data: {title: 'propertySummary'},
        //     canActivate: [AuthGuard]
        // },
        {
            path: 'resultsGrid',
            component: TransactiongridComponent,
            data: {title: 'resultsGrid'}
        },
        {
            path: 'transactionGallery',
            component: TransactiongalleryComponent,
            data: {title: 'transactionGallery'}
        },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
