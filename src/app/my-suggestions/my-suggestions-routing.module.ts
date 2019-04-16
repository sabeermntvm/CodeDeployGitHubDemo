
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MySuggestionsComponent} from './my-suggestions.component';
import { AuthGuard } from '../core/services';

const routes: Routes = [
  {path : '',
    data : {
    title: 'my-suggestions'
    },
    component: MySuggestionsComponent,
    canActivate:[AuthGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MysuggestionsRoutingModule {}
