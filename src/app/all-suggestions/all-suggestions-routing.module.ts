import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllSuggestionsComponent } from './all-suggestions.component';
import { AuthGuard } from '../core/services';
const routes: Routes = [
    {path : '',
      data : {
      title: 'all-suggestions'
      },
      component: AllSuggestionsComponent,
      canActivate:[AuthGuard]
    }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AllSuggestionsRoutingModule {}
