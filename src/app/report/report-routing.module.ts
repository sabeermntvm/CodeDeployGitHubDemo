import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportHomeComponent } from './reporthome/reporthome.component';
import { ReportSelectionComponent } from './reportselection/reportselection.component';
import { ReportSortComponent } from './reportsort/reportsort.component';
import { ReportEditComponent } from './reportedit/reportedit.component';
import { ReportMediaComponent } from './reportmedia/reportmedia.component';
import { ReportReviewComponent } from './reportreview/reportreview.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'report'
        },
        children: [
            {
                path: 'reporthome',
                component: ReportHomeComponent,
                data: {
                    title: 'report home'
                }
            },
             {
                path: 'reportselection',
                component: ReportSelectionComponent,
                data: {
                    title: 'report selection'
                }
            },
             {
                path: 'reportsort',
                component: ReportSortComponent,
                data: {
                    title: 'report sort'
                }
            },
             {
                path: 'reportedit',
                component: ReportEditComponent,
                data: {
                    title: 'report edit'
                }
            },
             {
                path: 'reportmedia',
                component: ReportMediaComponent,
                data: {
                    title: 'report media'
                }
            },
             {
                path: 'reportreview',
                component: ReportReviewComponent,
                data: {
                    title: 'report review'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportRoutingModule { }
