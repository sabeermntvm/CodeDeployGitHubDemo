import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../core/services';
import { Routes,RouterModule } from '@angular/router';

import { TenantmapsearchComponent } from './tenantmapsearch/tenantmapsearch.component';
import { TenantgridComponent } from './tenantgrid/tenantgrid.component';
const routes: Routes = [
  {
      path: '',
      data: {
          title: 'tenant'
      },
      children: [
          {
              path: 'mapsearch',
              component: TenantmapsearchComponent,
              data: {title: 'mapsearch'},
              canActivate: [AuthGuard]
          },
          {
            path: 'resultsGrid',
            component: TenantgridComponent,
            data: {title: 'resultsGrid'},
            canActivate: [AuthGuard]
        },
      ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantRoutingModule { }
