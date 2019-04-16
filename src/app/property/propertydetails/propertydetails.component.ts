import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PropertyService } from '../../core/services/api-property.service';
import { LoginService } from '../../core/services';
import { EnumCountry } from '../../enumerations/country';
import { environment } from '../../../environments/environment';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { Subscription } from 'rxjs';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import { Suggestion } from '../../core/models/suggestion';
import { SuggestionsService } from '../../core/services/suggestions.service';



@Component({
  selector: 'app-propertydetails',
  templateUrl: './propertydetails.component.html',
  styleUrls: ['./propertydetails.component.css']
})
export class PropertydetailsComponent implements OnInit, OnDestroy {

  customOptions = {
    dots: false, navigation: false, nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      740: {
        items: 2
      },
      940: {
        items: 2
      },
      1200: {
        items: 2
      }
    },
  }
  @Input() propertyDetails;
  CountryId: number;
  USCountryCode: number;
  RetailSpaceLabel: string = "Retail SqM ";
  RetailFrontageLabel: string = "Retail Frontage (m) ";
  AvailableSpaceLabel: string = 'Available SqM';
  MinDivSpaceLabel: string = "Minimum SqM";
  SalePriceLabel: string = "Price/SqM";
  OfficeSpaceLabel: string = "Office SqM ";
  AnchorSpaceLabel: string = "Total Anchor SqM ";
  LotSizeLabel:string = "Lot Size (SqM) ";
  lotSizeValue: number;
  unitId: number;
  metricUnit: number = 1;
  getpropertydetailsSubscription: Subscription;
  constructor( private _propertyService: PropertyService
    , private _loginService: LoginService,
     private _CommService: CommunicationService,
     private suggestionservice: SuggestionsService) {

    this.CountryId = this._loginService.UserInfo.CountryID;
    this.unitId = this._loginService.UserInfo.UnitId;
    this.metricUnit = UnitConversionEnum.Metric;
    this.USCountryCode = EnumCountry.US;
    if (this.unitId != UnitConversionEnum.Metric) {
      this.RetailSpaceLabel = "Retail SF";
      this.RetailFrontageLabel = "Retail Frontage (ft)";
      this.AvailableSpaceLabel = 'Available SF';
      this.MinDivSpaceLabel = 'Minimum SF';
      this.SalePriceLabel = "Price/SF";
      this.OfficeSpaceLabel = "Office SF";
      this.LotSizeLabel="Lot Size (SF) "
    }
    this.getpropertydetailsSubscription = this._CommService.subscribe("Frompropertysummary").subscribe((result) => { 
      this.propertyDetails = result.data;
      if (this.propertyDetails.LotSizeSF) {
        if (this.unitId == UnitConversionEnum.Metric) {
          this.lotSizeValue = this._propertyService.convertUnit(this.CountryId, 'SF', 'HA', this.propertyDetails.LotSizeSF);;
        } else
          this.lotSizeValue = this.propertyDetails.LotSizeSF;
      }
      this.getParcelDetailsByPropertyId();

    });
  }


  ngOnInit() {    
    if (!!this.propertyDetails) {
      if (this.propertyDetails.LotSizeSF) {
        if (this.unitId == UnitConversionEnum.Metric) {
          this.lotSizeValue = this._propertyService.convertUnit(this.CountryId, 'SF', 'HA', this.propertyDetails.LotSizeSF);;
        } else
          this.lotSizeValue = this.propertyDetails.LotSizeSF;
      }
      this.propertyDetails.MainPhotoUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}` + this.propertyDetails.MainPhotoUrl;
      this.getParcelDetailsByPropertyId();
    }



  }
  getParcelDetailsByPropertyId() {
    this.propertyDetails.ParcelInformation = "";
    this._propertyService.GetParcelDetailsByPropertyId(this.propertyDetails.PropertyID).subscribe(data => {
      if (!JSON.parse(data['_body']).error) {
        let result = JSON.parse(data['_body']).responseData;
        if (result.length > 0) {
          let parcel = "";
          result.forEach(function (value, index) {
            if (index < 2) {
              parcel += value.ParcelNo;
              if ((index < (result.length) - 1) && (index < 2))
                parcel += ",";
            }
          });
          this.propertyDetails.ParcelInformation = parcel;
        }
      }
    });

  }



  ngOnDestroy() {
    this.getpropertydetailsSubscription.unsubscribe();
  }
}
