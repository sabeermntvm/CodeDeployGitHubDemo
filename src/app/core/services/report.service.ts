import { Injectable } from '@angular/core';
import { ApiBaseService } from './api-base.service';
import { ReportInfo, ReportDisplayInfo } from '../models/ReportInfo';
import { environment } from '../../../environments/environment';

@Injectable()
export class ReportService extends ApiBaseService {

  public GetReportList(): ReportInfo[] {
    const response: Array<ReportInfo> = new Array<ReportInfo>();
    let report = new ReportInfo();
    report.ReportId = 101;
    report.reportTitle = "Standard Cover";
    report.ReportType = 'coverpage';
    report.ReportName = "StandardCover.html";
    report.ReportUrl = "assets/templates/StandardCover.html";
    // report.ReportOrder = 1;
    report.PreviewImage = "assets/templates/StandardCover.jpg";
    report.reportLayout = 'portrait';
    report.IsSelected = false;
    report.isEditable = true;
    report.hasFooter = false;
    report.hasHeader = false;
    report.isMultiProperty = false;
    report.entityType = "Property";
    report.entitySubtype = "";
    report.isDefault = true;
    response.push(report);

    // report = new ReportInfo();
    // report.ReportId = 102;
    // report.ReportType = 'coverpage';
    // report.ReportName = "coverpage_2.html";
    // report.ReportUrl = "assets/templates/coverpage_2.html";
    // report.ReportOrder = 1;
    // report.PreviewImage = "assets/templates/cover-img.jpg";
    // report.IsSelected = false;
    // report.isEditable = true;
    // report.hasFooter = false;
    // report.hasHeader = false;
    // report.isMultiProperty = false;
    // response.push(report);

    /*report = new ReportInfo();
    report.ReportId = 104;
    report.ReportType = 'brochure';
    report.ReportName = "brochure_1.html";
    report.ReportUrl = "assets/templates/brochure_1.html";
    report.PreviewImage = "assets/templates/brochure-img.jpg";
    report.ReportOrder = 2;
    report.IsSelected = false;
    report.isEditable = true;
    report.hasFooter = true;
    report.hasHeader = false;
    report.isMultiProperty = false;
    response.push(report);*/

    report = new ReportInfo();
    report.ReportId = 102;
    report.ReportType = 'brochure';
    report.reportTitle = "Landscape Suites";
    report.ReportName = 'LandscapeSuites_industrial.html';
    report.ReportUrl = 'assets/templates/LandscapeSuites_industrial.html';
    report.PreviewImage = 'assets/templates/LandscapeSuites.jpg';
    report.listingType = '';
    report.reportLayout = 'landscape';
    // report.ReportOrder = 2;
    report.IsSelected = false;
    report.isEditable = true;
    report.hasFooter = true;
    report.hasHeader = true;
    report.isMultiProperty = false;
    report.entityType = "Property";
    report.entitySubtype = "Industrial";
    report.isDefault = true;
    response.push(report);

    report = new ReportInfo();
    report.ReportId = 103;
    report.ReportType = 'brochure';
    report.reportTitle = "Landscape Suites";
    report.ReportName = 'LandscapeSuites_office.html';
    report.ReportUrl = 'assets/templates/LandscapeSuites_office.html';
    report.PreviewImage = 'assets/templates/LandscapeSuites.jpg';
    report.listingType = '';
    report.reportLayout = 'landscape';
    // report.ReportOrder = 2;
    report.IsSelected = false;
    report.isEditable = true;
    report.hasFooter = true;
    report.hasHeader = true;
    report.isMultiProperty = false;
    report.entityType = "Property";
    report.entitySubtype = "Office";
    report.isDefault = false;
    report.ParentReportId = 102;
    response.push(report);

    report = new ReportInfo();
    report.ReportId = 104;
    report.ReportType = 'brochure';
    report.reportTitle = "Landscape Suites";
    report.ReportName = 'LandscapeSuites_retail.html';
    report.ReportUrl = 'assets/templates/LandscapeSuites_retail.html';
    report.PreviewImage = 'assets/templates/LandscapeSuites.jpg';
    report.listingType = '';
    report.reportLayout = 'landscape';
    // report.ReportOrder = 2;
    report.IsSelected = false;
    report.isEditable = true;
    report.hasFooter = true;
    report.hasHeader = true;
    report.isMultiProperty = false;
    report.entityType = "Property";
    report.entitySubtype = "Retail";
    report.isDefault = false;
    report.ParentReportId = 102;
    response.push(report);

    report = new ReportInfo();
    report.ReportId = 105;
    report.ReportType = 'brochure';
    report.reportTitle = "Brochure Standard";
    report.ReportName = 'BrochureStandard.html';
    report.ReportUrl = 'assets/templates/BrochureStandard.html';
    report.PreviewImage = 'assets/templates/BrochureStandard.jpg';
    report.reportLayout = 'portrait';
    // report.ReportOrder = 2;
    report.IsSelected = false;
    report.isEditable = true;
    report.hasFooter = true;
    report.hasHeader = false;
    report.isMultiProperty = false;
    report.entityType = "Property";
    report.entitySubtype = "";
    report.isDefault = true;
    response.push(report);

    report = new ReportInfo();
    report.ReportId = 106;
    report.ReportType = 'media';
    report.ReportName = "media_1.html";
    report.ReportUrl = "assets/templates/media_1.html";
    // report.ReportOrder = 3;
    report.IsSelected = false;
    report.isEditable = false;
    report.hasFooter = false;
    report.hasHeader = false;
    report.isMultiProperty = false;
    report.entityType = "Property";
    report.entitySubtype = "";
    report.isDefault = true;
    response.push(report);

    report = new ReportInfo();
    report.ReportId = 107;
    report.ReportType = 'multiproperty';
    report.reportTitle = "Tour Standard";
    report.ReportName = "TourStandard.html";
    report.ReportUrl = "assets/templates/TourStandard.html";
    report.PreviewImage = "assets/templates/TourStandard.jpg";
    // report.ReportOrder = 4;
    report.reportLayout = 'portrait';
    report.IsSelected = false;
    report.isEditable = true;
    report.hasFooter = true;
    report.hasHeader = true;
    report.isMultiProperty = true;
    report.entityType = "Property";
    report.entitySubtype = "";
    report.isDefault = true;
    report.pageBreak = 3;
    response.push(report);

    report = new ReportInfo();
    report.ReportId = 108;
    report.ReportType = 'map';
    report.ReportName = "map_1.html";
    report.ReportUrl = "assets/templates/map_1.html";
    report.PreviewImage = "assets/templates/map-img.jpg";
    report.reportLayout = 'landscape';
    // report.ReportOrder = 5;
    report.IsSelected = false;
    report.isEditable = false;
    report.hasFooter = true;
    report.hasHeader = true;
    report.isMultiProperty = false;
    report.entityType = "Property";
    report.entitySubtype = "";
    report.isDefault = true;
    response.push(report);


    report = new ReportInfo();
    report.ReportId = 109;
    report.ReportType = 'multiproperty';
    report.reportTitle = "Tour 4";
    report.ReportName = "Tour4.html";
    report.ReportUrl = "assets/templates/Tour4.html";
    report.PreviewImage = "assets/templates/Tour4.jpg";
    report.reportLayout = 'portrait';
    // report.ReportOrder = 4;
    report.IsSelected = false;
    report.isEditable = true;
    report.hasFooter = true;
    report.hasHeader = true;
    report.isMultiProperty = true;
    report.entityType = "Property";
    report.entitySubtype = "";
    report.isDefault = true;
    report.pageBreak = 4;
    response.push(report);

    // report = new ReportInfo();
    // report.ReportId = 110;
    // report.ReportType = 'multiproperty';
    // report.ReportName = "multi-property_3.html";
    // report.ReportUrl = "assets/templates/multi-property_3.html";
    // report.PreviewImage = "assets/templates/multiproperty_report1.jpg";
    // report.ReportOrder = 4;
    // report.IsSelected = false;
    // report.isEditable = true;
    // report.hasFooter = false;
    // report.hasHeader = true;
    // report.isMultiProperty = true;
    // response.push(report);

    report = new ReportInfo();
    report.ReportId = 110;
    report.ReportType = 'coverpage';
    report.reportTitle = "Landscape Cover";
    report.ReportName = "LandscapeCover.html";
    report.ReportUrl = "assets/templates/LandscapeCover.html";
    // report.ReportOrder = 1;
    report.PreviewImage = "assets/templates/LandscapeCover.jpg";
    report.reportLayout = 'landscape';
    report.IsSelected = false;
    report.isEditable = true;
    report.hasFooter = false;
    report.hasHeader = false;
    report.entityType = "Property";
    report.entitySubtype = "";
    report.isMultiProperty = false;
    report.isDefault = true;
    response.push(report);


    report = new ReportInfo();
    report.ReportId = 111;
    report.ReportType = 'brochure';
    report.reportTitle = "Brochure Landscape";
    report.ReportName = 'BrochureLandscape.html';
    report.ReportUrl = 'assets/templates/BrochureLandscape.html';
    report.PreviewImage = 'assets/templates/BrochureLandscape.jpg';
    report.listingType = '';
    report.reportLayout = 'landscape';
    // report.ReportOrder = 2;
    report.IsSelected = false;
    report.isEditable = true;
    report.hasFooter = true;
    report.hasHeader = false;
    report.isMultiProperty = false;
    report.entityType = "Property";
    report.entitySubtype = "";
    report.isDefault = true;
    response.push(report);

    return response;
  }


  public replaceData(html, propertyInfo, mediaList, index): string {
    propertyInfo.ImageUrl = propertyInfo.MainPhotoUrl ? `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}` + propertyInfo.MainPhotoUrl : '';

    let newHtml = html.replace(/##Property_Name##/gi, propertyInfo.PropertyName || '');
    newHtml = newHtml.replace(/##Address##/gi, propertyInfo.Address || '');
    newHtml = newHtml.replace(/##City##/gi, propertyInfo.City || propertyInfo.CityName || '');
    newHtml = newHtml.replace(/##State##/gi, propertyInfo.StateAbbr || propertyInfo.State || '');
    newHtml = newHtml.replace(/##Zip##/gi, propertyInfo.ZipCode || '');
    newHtml = newHtml.replace(/##General_Use##/gi, propertyInfo.PropertyType || propertyInfo.PropertyUse || 'prop');
    newHtml = newHtml.replace(/##General_Use_Listing##/gi, propertyInfo.GeneralUse || '');
    // newHtml = newHtml.replace(/##RecordTypeName##/gi, (propertyInfo.ListingTypeName != 'Sublease') ? propertyInfo.RecordTypeName : 'Sublease' || (propertyInfo.RecordTypeID && propertyInfo.RecordTypeID === 1 ? (propertyInfo.ListingTypeName != 'Sublease') ? 'Lease' : '' : 'Sale') || '');
    // newHtml = newHtml.replace(/##RecordTypeName##/gi, (propertyInfo.ListingTypeName != 'Sublease') ? (propertyInfo.RecordTypeID && propertyInfo.RecordTypeID === 1 ? (propertyInfo.ListingTypeName != 'Sublease') ? 'Lease' : '' : 'Sale') || '' : 'Sublease' );
    newHtml = newHtml.replace(/##RecordTypeName##/gi,(propertyInfo.ListingTypeName != 'Sublease') ? (propertyInfo.RecordTypeID && propertyInfo.RecordTypeID === 1 ? (propertyInfo.ListingTypeName != 'Sublease') ? 'Lease' : '' :(propertyInfo.RecordTypeID && propertyInfo.RecordTypeID === 2 ? 'Sale':'')) || '' : 'Sublease' );
    newHtml = newHtml.replace(/##ListingType##/gi, propertyInfo.RecordTypeName || (propertyInfo.RecordTypeID && propertyInfo.RecordTypeID == 1 ? 'Lease' : 'Sale') || '');
    newHtml = newHtml.replace(/##BuildingSize##/gi, propertyInfo.BuildingSizeSM || propertyInfo.BuildingSize || '');
    newHtml = newHtml.replace(/##Class##/gi, propertyInfo.ClassTypeName || '');
    newHtml = newHtml.replace(/##Market##/gi, propertyInfo.MarketName || '');
    newHtml = newHtml.replace(/##AvailableSpace##/gi, propertyInfo.TotalAvailableSM || '');
    newHtml = newHtml.replace(/##TypicalFloorArea##/gi, propertyInfo.TypicalFloorSizeSM || propertyInfo.TypicalFloorArea || '');
    newHtml = newHtml.replace(/##YearBuilt##/gi, propertyInfo.YearBuilt || '');
    newHtml = newHtml.replace(/##YearRenovated##/gi, propertyInfo.YearRenovated || '');
    newHtml = newHtml.replace(/##YearRenovatedFormatted##/gi, propertyInfo.YearRenovatedFormatted || '');
    newHtml = newHtml.replace(/##ConstructionStatus##/gi, propertyInfo.ConstructionStatusName || '');
    newHtml = newHtml.replace(/##ParkingSpaces##/gi, propertyInfo.ParkingSpaces || '');
    newHtml = newHtml.replace(/##ParkingRatio##/gi, propertyInfo.ParkingRatio ? ((+propertyInfo.ParkingRatio).toFixed(2)) : '');
    newHtml = newHtml.replace(/##ParkingRatioFormatted##/gi, propertyInfo.ParkingRatioFormatted || '');
    
    newHtml = newHtml.replace(/##Tenancy##/gi, propertyInfo.TenancyName || '');
    newHtml = newHtml.replace(/##ParcelNumber##/gi, propertyInfo.ParcelInfo || '');

    newHtml = newHtml.replace(/##OccupancyPercent##/gi, propertyInfo.OccupancyPercent || '');

    newHtml = newHtml.replace(/##Zoning##/gi, propertyInfo.Zoning || '');

    newHtml = newHtml.replace(/##NumberOfElevators##/gi, propertyInfo.NumberOfElevators || '');
    newHtml = newHtml.replace(/##PropertyImage##/gi, propertyInfo.ImageUrl || '');


    newHtml = newHtml.replace(/##Index##/gi, index + 1);
    newHtml = newHtml.replace(/##Floors##/gi, propertyInfo.Floors || '');
    newHtml = newHtml.replace(/##MinDiv##/gi, propertyInfo.MinDivSM || '');
    newHtml = newHtml.replace(/##MaxContig##/gi, propertyInfo.MaxContigSM || '');
    newHtml = newHtml.replace(/##ListingCompanyName##/gi, propertyInfo.ListingCompanyName || '');
    newHtml = newHtml.replace(/##ListingTypeName##/gi, propertyInfo.ListingTypeName || '');
    newHtml = newHtml.replace(/##AgentName##/gi, propertyInfo.AgentName || '');
    newHtml = newHtml.replace(/##MarketName##/gi, propertyInfo.MarketName || propertyInfo.CityName || '');
    newHtml = newHtml.replace(/##AskingRate##/gi, propertyInfo.AskingRate || 'Not Disclosed');
    newHtml = newHtml.replace(/##FloorNumber##/gi, propertyInfo.FloorNumber || '');
    newHtml = newHtml.replace(/##AvailableSM##/gi, propertyInfo.AvailableSM || '');
    newHtml = newHtml.replace(/##TotalAvailableSM##/gi, propertyInfo.TotalAvailableSM + ' SqM' || '');
    newHtml = newHtml.replace(/##SuiteCount##/gi, propertyInfo.SuiteCount || '');
    newHtml = newHtml.replace(/##LeaseTypeName##/gi, propertyInfo.LeaseTypeName || '');
    newHtml = newHtml.replace(/##AskingLeaseRatePerYrText##/gi, propertyInfo.AskingLeaseRatePerYrText || '');
    newHtml = newHtml.replace(/##PassengerElevators##/gi, propertyInfo.PassengerElevators || '');
    newHtml = newHtml.replace(/##MinSM##/gi, propertyInfo.MinSM || '');
    newHtml = newHtml.replace(/##AskingRateText##/gi, propertyInfo.AskingRateText || '');
    newHtml = newHtml.replace(/##SpaceTypeName##/gi, propertyInfo.SpaceTypeName || '');
    newHtml = newHtml.replace(/##Vacant##/gi, propertyInfo.IsVacant != null ? propertyInfo.IsVacant ? 'Yes' : 'No' : '' || '');
    newHtml = newHtml.replace(/##PossessionTypeName##/gi, propertyInfo.PossessionTypeName === 'Date'
      ? propertyInfo.DateAvailable : (propertyInfo.PossessionTypeName || ''));
    newHtml = newHtml.replace(/##LeaseTerms##/gi, propertyInfo.LeaseTerms || '');
    newHtml = newHtml.replace(/##SuiteNumber##/gi, propertyInfo.SuiteNumber || '');
    newHtml = newHtml.replace(/##BuildingComments##/gi, propertyInfo.BuildingComments || '');
    newHtml = newHtml.replace(/##FullName##/gi, propertyInfo.FullName || '');
    newHtml = newHtml.replace(/##PhoneNumber##/gi, propertyInfo.PhoneNumber || '');
    newHtml = newHtml.replace(/##CompanyName##/gi, propertyInfo.CompanyName || '');
    newHtml = newHtml.replace(/##Email##/gi, propertyInfo.Email || '');
    newHtml = newHtml.replace(/##NoOfSpaces##/gi, propertyInfo.NoOfSpaces || '');
    newHtml = newHtml.replace(/##OperatingExpensesPerSM##/gi, propertyInfo.OperatingExpensesPerSM || '');
    newHtml = newHtml.replace(/##TaxesPerSM##/gi, propertyInfo.FS_TaxesPerSM || '');
    newHtml = newHtml.replace(/##TaxYear##/gi, propertyInfo.TaxYear || '');
    newHtml = newHtml.replace(/##AskingSalePrice##/gi, propertyInfo.AskingSalePrice || 'Not For Sale');
    newHtml = newHtml.replace(/##LotSizeAC##/gi, propertyInfo.LotSizeAC || '');
    newHtml = newHtml.replace(/##SalePricePerSF##/gi, propertyInfo.SalePricePerSF || '');
    newHtml = newHtml.replace(/##FloorLoading##/gi, propertyInfo.FloorLoading || '');
    newHtml = newHtml.replace(/##SpecificUseName##/gi, propertyInfo.SpecificUseName || '');
    newHtml = newHtml.replace(/##SprinklerTypeName##/gi, propertyInfo.SprinklerTypeName || '');
    newHtml = newHtml.replace(/##ClearHeightMinM##/gi, propertyInfo.ClearHeightMinM || '');
    newHtml = newHtml.replace(/##ClearHeightMaxM##/gi, propertyInfo.ClearHeightMaxM || '');
    newHtml = newHtml.replace(/##DockHigh##/gi, propertyInfo.DockHigh || '');
    newHtml = newHtml.replace(/##GradeLevelIn##/gi, propertyInfo.GradeLevelIn || '');
    newHtml = newHtml.replace(/##GradeLevelDriveIn##/gi, propertyInfo.GradeLevelDriveIn || '');
    newHtml = newHtml.replace(/##NoOfOffices##/gi, propertyInfo.NoOfOffices || '');
    newHtml = newHtml.replace(/##OfficeSM##/gi, propertyInfo.OfficeSM || '');
    newHtml = newHtml.replace(/##HasYardFenced##/gi, propertyInfo.HasYardFenced || '');
    newHtml = newHtml.replace(/##ZoningCode##/gi, propertyInfo.ZoningCode || '');
    newHtml = newHtml.replace(/##SalePricePerSM##/gi, propertyInfo.SalePricePerSM || '');
    newHtml = newHtml.replace(/##CAPRate##/gi, propertyInfo.CAPRate || '');
    newHtml = newHtml.replace(/##OfficeSpaceSM##/gi, propertyInfo.OfficeSpaceSM || '');
    newHtml = newHtml.replace(/##DockHighDoors##/gi, propertyInfo.DockHighDoors || '');
    newHtml = newHtml.replace(/##GradeLevelDoorsTypeID##/gi, propertyInfo.GradeLevelDoorsTypeID || '');
    newHtml = newHtml.replace(/##DriveInDoors##/gi, propertyInfo.DriveInDoors || '');
    newHtml = newHtml.replace(/##OfficeMobile##/gi, propertyInfo.OfficeMobile || '');
    newHtml = newHtml.replace(/##ListingAgentName##/gi, propertyInfo.FullName || '');
    newHtml = newHtml.replace(/##ListingAgentCompanyName##/gi, propertyInfo.CompanyName || '');
    newHtml = newHtml.replace(/##ListingNotes##/gi, propertyInfo.ListingNotes || '');
    let mediaHtml = "";

    if (!!mediaList) {
      if (mediaList && mediaList.length > 0) {
        mediaList.forEach(item => {
          if (item.Ext != 'pdf' && item.Ext != 'xlsx') {
            mediaHtml += '<div class="col-lg-3"><div class="media-img1"><img class="img-responsive img" src="' + item.url + '" width="100%" ></div><p class="center"></p></div>';
          }
        });
      }

    }
    /*if (!!mediaList || !!propertyInfo.PropertyMedia) {
      if (mediaList && mediaList.length > 0) {
        mediaList.forEach(item => {
          if (item.PropertyID == propertyInfo.PropertyId) {
            if (item.Ext != 'pdf' && item.Ext != 'xlsx') {
              mediaHtml += '<div class="col-lg-3"><div class="media-img1"><img class="img-responsive img" src="' + constants.MediaS3Base + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}` + item.Path + '" width="100%" ></div><p class="center"></p></div>';
            }
          }
        });
      }
      if (propertyInfo.PropertyMedia && propertyInfo.PropertyMedia.length > 0) {
         propertyInfo.PropertyMedia.forEach(( media, i) => {
           mediaHtml += '<div class="col-lg-3"><div class="media-img1"><img class="img-responsive img" src="' + media.url + '" width="100%" (click)="selectMedia($event, i)"></div><p class="center"></p></div>';
         });
       }
    }*/


    newHtml = newHtml.replace(/##PropertyMedia##/gi, mediaHtml);
    newHtml = newHtml.replace(/##PropertyId##/gi, propertyInfo.PropertyID || '');
    newHtml = newHtml.replace(/##ListingID##/gi, propertyInfo.ListingID || '');

    // let http:Http;
    //    http.get("assets/templates/header.html")
    //         .map(response => response.text())
    //         .subscribe(html => {
    //           newHtml = newHtml.replace(/##header_template##/gi, html);
    //         });

    //          http.get("assets/templates/footer.html")
    //         .map(response => response.text())
    //         .subscribe(html => {
    //           newHtml = newHtml.replace(/##footer_template##/gi, html);
    //         });
    let type = "";
    if (propertyInfo.PropertyType == "Office" || propertyInfo.PropertyUse == "Office") {

      type += `<div class="col-lg-6 no-padding txt-rit_4">Building Class :</div>
        <div class="col-lg-6 p-0 txt-right_4 edittext" >` + propertyInfo.ClassTypeName + `</div>`;

    }
    else {
      type += `<div class="col-lg-6 no-padding txt-rit">Specific Use :</div>
        <div class="col-lg-6 p-0 txt-right_4 edittext">` + propertyInfo.SpecificUseName + `</div>`
    }
    newHtml = newHtml.replace(/##template##/gi, type);

    let lasndcapeImage = propertyInfo.MainPhotoUrl ? `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + '/Media/Thumbnail/500x600/' + propertyInfo.MainPhotoUrl : '';
    newHtml = newHtml.replace(/##PropertyLandscapeImage##/gi, lasndcapeImage || '');


    newHtml = newHtml.replace(/##CompanyAddress##/gi, propertyInfo.AddressText || '');
    newHtml = newHtml.replace(/##CompanyCity##/gi, propertyInfo.CityName || '');
    newHtml = newHtml.replace(/##CompanyState##/gi, propertyInfo.StateAbbr || '');
    newHtml = newHtml.replace(/##CompanyZip##/gi, propertyInfo.ZipCode || '');
    let companyLogo = propertyInfo.MainPhotoUrl ? `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + '/Media/' + propertyInfo.MainPhotoUrl : '';

    newHtml = newHtml.replace(/##CompanyLogo##/gi, companyLogo || '');
    var displayDate = new Date().toLocaleDateString();
    newHtml = newHtml.replace(/##Date##/gi, displayDate || '');


    return newHtml;
  }


  public GetReportDisplayOrder(): ReportDisplayInfo[] {
    const response: Array<ReportDisplayInfo> = new Array<ReportDisplayInfo>();

    let dispaly = new ReportDisplayInfo();
    dispaly.DisplayOrder = 1;
    dispaly.Index = 1;
    dispaly.PreviewImage = "assets/images/select-img1.jpg";
    dispaly.ReportType = "coverpage";
    response.push(dispaly);

    dispaly = new ReportDisplayInfo();
    dispaly.DisplayOrder = 2;
    dispaly.Index = 2;
    dispaly.PreviewImage = "assets/images/select-img2.jpg";
    dispaly.ReportType = "brochure";
    response.push(dispaly);

    dispaly = new ReportDisplayInfo();
    dispaly.DisplayOrder = 3;
    dispaly.Index = 3;
    dispaly.PreviewImage = "assets/images/select-img3.jpg";
    dispaly.ReportType = "multiproperty";
    response.push(dispaly);

    dispaly = new ReportDisplayInfo();
    dispaly.DisplayOrder = 4;
    dispaly.Index = 4;
    dispaly.PreviewImage = "assets/images/select-img4.jpg";
    dispaly.ReportType = "map";
    response.push(dispaly);

    return response;

  }

  public saveULMDetails(UserListingManagement): any {
    return this.httpPost(this._serviceURL + 'user-listing-management/', JSON.stringify(UserListingManagement), true);
    // return this.httpPost('http://localhost:3000/api/user-listing-management/', JSON.stringify(UserListingManagement), true);
  }

  public searchULM(searchData): any {
    return this.httpPost(this._serviceURL + 'user-listing-management/search/', searchData, true)
    // return this.httpPost('http://localhost:3000/api/user-listing-management/search/', searchData, true);
  }

  public getULMDetailsById(ULMId): any {
    return this.httpGet(this._serviceURL + 'user-listing-management/ulm-details/' + ULMId)
    // return this.httpGet('http://localhost:3000/api/user-listing-management/ulm-details/' + ULMId);
  }

  public getULMDetailsByKey(ULMKey): any {
    return this.httpGet(this._serviceURL + 'user-listing-management/ulm-details-byKey/' + ULMKey)
    // return this.httpGet('http://localhost:3000/api/user-listing-management/ulm-details-byKey/' + ULMKey);
  }

  public saveULMListing(ULMListing): any {
    return this.httpPost(this._serviceURL + 'user-listing-management/listing/', JSON.stringify(ULMListing), true);
    // return this.httpPost('http://localhost:3000/api/user-listing-management/listing/', JSON.stringify(ULMListing), true);
  }

  public getULMListingsByULMId(ULMId): any {
    return this.httpGet(this._serviceURL + 'user-listing-management/listing/' + ULMId)
    // return this.httpGet('http://localhost:3000/api/user-listing-management/listing/' + ULMId);
  }

  public getULMSummary(): any {
    return this.httpGet(this._serviceURL + 'user-listing-management/summary/')
    // return this.httpGet('http://localhost:3000/api/user-listing-management/summary/');
  }

  public getListingsWithSuiteReport(data): any {
    return this.httpPost(this._serviceURL + 'listing/Report/ListingWithSuite/', JSON.stringify(data), true);
  }

  // public getHeaderFooterHTML(template,loginCompanyId): any {
  //   let loginCompanyDetails: any;

  //   this.httpGet(template)
  //     .map(response => response.text())
  //     .subscribe(html => {

  //       let headerHTML = html;
  //       this.getLoggedInCompanyDetailsById(
  //         loginCompanyId
  //       ).subscribe(resultData => {
  //         if (!JSON.parse(resultData['_body']).error) {
  //           loginCompanyDetails = JSON.parse(resultData['_body']).responseData[0];
  //           return this.replaceData(headerHTML, loginCompanyDetails, null, 0);
  //         }

  //       });
  //     });
  // }

  // public getLoggedInCompanyDetailsById(contactId): any {
  //   return this.httpGet(this._serviceURL + 'contacts/company/' + contactId)
  // }

}
