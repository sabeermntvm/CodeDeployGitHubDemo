import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyRoutingModule } from './property-routing.module';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule, MatFormFieldModule, MatSortModule, MatTableModule} from '@angular/material';
import { Ng2TableModule } from 'ngx-datatable/ng2-table';
import { ChartsModule } from 'ng4-charts/ng4-charts';
import { NvD3Module } from 'ng2-nvd3';
import { AgmCoreModule } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlModule } from 'ngx-owl-carousel';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapsearchComponent } from './mapsearch/mapsearch.component';
import { PropertysummaryComponent } from './propertysummary/propertysummary.component';
import { MapSideBarComponent } from './map-side-bar/map-side-bar.component';
import { PropertygridComponent } from './propertygrid/propertygrid.component';
import { PropertygalleryComponent } from './propertygallery/propertygallery.component';
import { PropertyListingComponent } from './propertylisting/propertylisting.component';
import { SettingsearchComponent } from './settingsearch/settingsearch.component';
import { DndModule } from 'ng2-dnd';
import { PropertydetailsComponent } from './propertydetails/propertydetails.component';
import { PropertytransactionComponent } from './propertytransaction/propertytransaction.component';
import { PropertycontactComponent } from './propertycontact/propertycontact.component';
import { PropertytenantComponent } from './propertytenant/propertytenant.component';
import { PropertymapComponent } from './propertymap/propertymap.component';
import { MapService } from './../core/services/map-service.service';
import { CurrencyMaskModule, CurrencyMaskDirective } from 'ng2-currency-mask';
import { PropertymediaComponent } from './propertymedia/propertymedia.component';
import {PropertyPinDetailComponent} from './propertypindetail/propertypindetail.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { SharedModule } from '../shared/shared.module';
import { PropertyanalyticsComponent } from './propertyanalytics/propertyanalytics.component';
// import { PanelComponent } from '../components/panel/panel.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { PopupmodelComponent } from './popupmodel/popupmodel.component';
import {MatButtonModule, MatInputModule} from '@angular/material';
import { EditSuggestionDirective } from './directives/EditSuggestionDirective/edit-suggestion.directive';
import { FeedbackDirective } from './directives/EditSuggestionDirective/feedback.directive';
import { NgxGalleryModule } from 'ngx-gallery';
import { PropertytenantdetailComponent } from './propertytenantdetail/propertytenantdetail.component';
import { PropertytenantAccordionComponent } from './propertyTenantAccordion/propertytenantaccordion.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
declare const chance;

@NgModule({
  imports: [
    CommonModule,
    PropertyRoutingModule,
    MatSortModule,
    MatTableModule,
    Ng2TableModule,
    ChartsModule,
    NvD3Module,
    AgmCoreModule,
    NgbModule,
    OwlModule,
    NgSelectModule,
    ChartsModule,
    FormsModule,
    CurrencyMaskModule,
    SharedModule,
    DndModule,
    AngularMultiSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    NgxGalleryModule,
    InfiniteScrollModule,
    ReactiveFormsModule
  ],
  declarations: [
    MapsearchComponent,
    PropertysummaryComponent,
    MapSideBarComponent,
    PropertygridComponent,
    PropertygalleryComponent,
    PropertyListingComponent,
    SettingsearchComponent,
    PropertydetailsComponent,
    PropertytransactionComponent,
    PropertycontactComponent,
    PropertytenantComponent,
    PropertymapComponent,
    PropertymediaComponent,
    PropertyPinDetailComponent,
    AnalyticsComponent,
    PropertyanalyticsComponent,

    PopupmodelComponent,
    EditSuggestionDirective,
    FeedbackDirective,
    PropertytenantAccordionComponent,
    PropertytenantdetailComponent
  ],
  providers: [MapService],
  exports: [CurrencyMaskDirective],
  entryComponents: [
    PopupmodelComponent
  ]
})
export class PropertyModule { }
