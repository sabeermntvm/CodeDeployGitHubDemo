import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { AllSuggestionsRoutingModule } from './all-suggestions-routing.module';
import { AllSuggestionsComponent } from './all-suggestions.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports : [
    CommonModule,
    FormsModule,
    AllSuggestionsRoutingModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AllSuggestionsComponent
  ],
  providers: []
})
export class AllSuggestionsModule { }
