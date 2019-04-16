import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { MapsearchComponent } from './mapsearch/mapsearch.component';
import { PropertysummaryComponent } from './propertysummary/propertysummary.component';
import { AuthGuard } from '../core/services';
import { PropertygridComponent } from './propertygrid/propertygrid.component';
import { PropertygalleryComponent } from './propertygallery/propertygallery.component';
import { AnalyticsComponent } from './analytics/analytics.component';
const routes: Routes = [
  {
      path: '',
      data: {
          title: 'property'
      },
      children: [
          {
              path: 'mapsearch',
              component: MapsearchComponent,
              data: {title: 'mapsearch'},
              canActivate: [AuthGuard]
          },
          {
            path: 'propertySummary/:id',
            component: PropertysummaryComponent,
            data: {title: 'propertySummary'},
            canActivate: [AuthGuard]
        },
        {
            path: 'resultsGrid',
            component: PropertygridComponent,
            data: {title: 'resultsGrid'}
        },
        {
            path: 'propertyGallery',
            component: PropertygalleryComponent,
            data: {title: 'propertyGallery'}
        },
        {
            path: 'analytics',
            component: AnalyticsComponent,
            data: {title: 'propertyGallery'}
        },
        {
            path: 'propertySummary/:id/:listingId',
            component: PropertysummaryComponent,
            data: {title: 'propertySummary'},
            canActivate: [AuthGuard]
        },
        {
            path: 'propertySummary/:id/:listingId/:transactionId',
            component: PropertysummaryComponent,
            data: {title: 'propertySummary'},
            canActivate: [AuthGuard]
        },
         {
            path: 'propertySummary/:id/:listingId/:transactionId/:tenantId',
            component: PropertysummaryComponent,
            data: {title: 'propertySummary'},
            canActivate: [AuthGuard]
        },
        {
           path: 'propertySummary/:id/:listingId/:transactionId/:LeaseID/:SaleID',
           component: PropertysummaryComponent,
           data: {title: 'propertySummary'},
           canActivate: [AuthGuard]
       }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
