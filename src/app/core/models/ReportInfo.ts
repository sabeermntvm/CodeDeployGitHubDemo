import { NumberSymbol } from "@angular/common/src/i18n/locale_data_api";

export class ReportInfo {

  ReportId: number;
  ReportType: string;
  ReportName: string;
  ReportOrder: number;
  ReportUrl: string;
  IsSelected: Boolean;
  PreviewImage: string = '';
  HTML: string = '';
  isEditable: boolean;
  hasHeader: boolean;
  hasFooter: boolean;
  isMultiProperty: boolean;
  // listingType =lease,sale etc.,
  listingType: string;
  ulmListingId: number;
  hasUserUpdated: boolean;
  reportLayout: string;
  reportTitle: string;

  // entityType = property/tenant/salecomp
  entityType: string;
  // entitySubtype = propertyType(Ind/Office/Retail etc.,)
  entitySubtype: string;
  // to distinguish default template to be displayed on selection page in case of mutiple templates based on propertytype(entitySubtype).
  isDefault:boolean;

  pageBreak: number;
  Index:number;
  ParentReportId:number;

}

export class ReportDisplayInfo {
  Index: number;
  DisplayOrder: number;
  ReportType: string;
  PreviewImage: string;
  ReportId:number;
}
