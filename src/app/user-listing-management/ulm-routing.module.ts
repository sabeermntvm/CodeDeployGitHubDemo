import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { UlmReportGridComponent } from './ulm-report-grid/ulm-report-grid.component';
import { UlmReportViewComponent } from './ulm-report-view/ulm-report-view.component';
import { UlmReportEditComponent } from './ulm-report-edit/ulm-report-edit.component';
import { AuthGuard } from '../core/services';
import { ULMReportUrlGeneratorComponent } from './ulm-report-url-generator/ulm-report-url-generator.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'ULM'
    },
    children: [
      {
        path: 'ulmGrid',
        component: UlmReportGridComponent,
        data: { title: 'ulmGrid' },
        canActivate: [AuthGuard]
      },
      {
        path: 'ulmReportView/:ulmId',
        component: UlmReportViewComponent,
        data: { title: 'ulmReportView' },
        canActivate: [AuthGuard]
      },
      {
        path: 'ulmReportEdit/:key',
        component: UlmReportEditComponent,
        data: { title: 'ulmReportEdit' }
      },
      {
        path: 'ulmreportedit/:key',
        component: UlmReportEditComponent,
        data: { title: 'ulmReportEdit' }
      },
      {
        path: 'ulmreporturlgenerator',
        component: ULMReportUrlGeneratorComponent,
        data: {
          title: 'report generate'
        },
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ULMRoutingModule { }
