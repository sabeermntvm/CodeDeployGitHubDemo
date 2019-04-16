import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '../core/services';
import { Routes,RouterModule } from '@angular/router';
import { LeasemapsearchComponent } from './leasemapsearch/leasemapsearch.component';
import { LeasegridComponent } from './leasegrid/leasegrid.component';
import { LeasegalleryComponent } from './leasegallery/leasegallery.component';
const routes: Routes = [
  {
      path: '',
      data: {
          title: 'lease'
      },
      children: [
          {
              path: 'mapsearch',
              component: LeasemapsearchComponent,
              data: {title: 'mapsearch'},
              canActivate: [AuthGuard]
          },
          {
            path: 'leasegallery',
            component: LeasegalleryComponent,
            data: {title: 'leasegallery'},
            canActivate: [AuthGuard]
        },
          {
            path: 'resultsGrid',
            component: LeasegridComponent,
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
export class LeaseRoutingModule { }
