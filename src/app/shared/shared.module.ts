import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SafeHtmlPipe} from './pipes/safehtml.pipe';
import { ViewTenantComponent } from './modals/view-tenant/view-tenant.component';
import { ViewSuiteComponent } from './modals/view-suite/view-suite.component';
import { ViewPropertyComponent } from './modals/view-property/view-property.component';
import { ImageViewerComponent } from './modals/image-viewer-modal/image-viewer-modal.component';
import { ViewListingsComponent } from './modals/view-listings/view-listings.component';
import { ViewTransactionComponent } from './modals/view-transaction/view-transaction.component';
import { ViewPropertyTenantsComponent } from './modals/view-property-tenants/view-property-tenants.component';
import { ViewPropertyTransactionsComponent } from './modals/view-property-transactions/view-property-transactions.component';
import {UserPreferencesModalComponent} from './modals/user-preferences-modal/user-preferences-modal.component';
import {FormsModule} from '@angular/forms';
import { UiSwitchModule } from 'ngx-ui-switch';
import {DndModule} from 'ng2-dnd';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewerModalComponent } from './modals/pdf-viewer-modal/pdf-viewer-modal.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarRightComponent } from './components/sidebar-right/sidebar-right.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { PanelComponent } from './components/panel/panel.component';
import { RouterModule } from '@angular/router';
import { TrendModule } from 'ngx-trend';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BarchartComponent } from './components/charts/barchart/barchart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NvD3Module } from 'ng2-nvd3';
import { AskrentcomparisonComponent } from './components/charts/askrentcomparison/askrentcomparison.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { VacantsummarycomparisonComponent } from './components/charts/vacantsummarycomparison/vacantsummarycomparison.component';
import { StackedbarchartComponent } from './components/charts/stackedbarchart/stackedbarchart.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { VacancyratecomparisonComponent } from './components/charts/vacancyratecomparison/vacancyratecomparison.component';
import { AskrentcomparisonweightedComponent } from './components/charts/askrentcomparisonweighted/askrentcomparisonweighted.component';
import { VacancyratecomparisonstackComponent } from './components/charts/vacancyratecomparisonstack/vacancyratecomparisonstack.component';
@NgModule({
  imports: [
    CommonModule, NgxGalleryModule, FormsModule, UiSwitchModule,HttpClientModule,NgxChartsModule, RouterModule,NgbModule, NgxDatatableModule, TrendModule,NvD3Module,NgSelectModule, DndModule.forRoot(),PdfViewerModule
  ],
  exports: [
    VacancyratecomparisonComponent,
    VacantsummarycomparisonComponent,
    AskrentcomparisonComponent,
    AskrentcomparisonweightedComponent,
    VacancyratecomparisonstackComponent,
    BarchartComponent,
    HeaderComponent,
    SidebarComponent,
    SidebarRightComponent,
    TopMenuComponent,
    FooterComponent,
    PanelComponent,
    SafeHtmlPipe,
    ViewTenantComponent,
    ViewSuiteComponent,
    ViewPropertyComponent,
    ImageViewerComponent,
    ViewListingsComponent,
    ViewTransactionComponent,
    ViewPropertyTenantsComponent,
    ViewPropertyTransactionsComponent,
    UserPreferencesModalComponent,
    PdfViewerModalComponent,
    HttpClientModule],
  declarations: [
    HeaderComponent,
    SidebarComponent,
    SidebarRightComponent,
    TopMenuComponent,
    FooterComponent,
    PanelComponent,
    SafeHtmlPipe,
    ViewTenantComponent,
    ViewSuiteComponent,
    ViewPropertyComponent,
    ImageViewerComponent,
    ViewListingsComponent,
    ViewTransactionComponent,
    ViewPropertyTenantsComponent,
    ViewPropertyTransactionsComponent,
    UserPreferencesModalComponent,
    PdfViewerModalComponent,
    BarchartComponent,
    AskrentcomparisonComponent,
    VacantsummarycomparisonComponent,
    StackedbarchartComponent,
    VacancyratecomparisonComponent,
    AskrentcomparisonweightedComponent,
    VacancyratecomparisonstackComponent]
})
export class SharedModule { }
