import { Component, OnInit, Input } from '@angular/core';
import { Property } from '../../../core/models/Property';
import { PropertyService } from '../../../core/services/api-property.service';
import { Router } from '@angular/router';
import { CommunicationModel, CommunicationService } from '../../../core/services/communication.service';
import { Listing } from '../../../core/models/Listing';
import { LoginService } from '../../../core/services/login.service';
import { EnumCountry } from '../../../core/enumerations/country';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-view-property',
  templateUrl: './view-property.component.html',
  styleUrls: ['./view-property.component.scss']
})
export class ViewPropertyComponent implements OnInit {

  property: any;
  @Input() PropertyDetail: any;
  photoUrl: String;
  listing: any;
  CountryId:number;
  USCountryCode:number;

  constructor(private _propertyService: PropertyService,
    private _router: Router,
    private _CommService: CommunicationService
    ,private _loginService: LoginService) {
    this.property = new Property();
    this.CountryId=this._loginService._countryCode;
    this.USCountryCode=EnumCountry.US;
  }
  ngOnInit() {

    this.listing = new Listing();
    // this.photoUrl=constants.MediaS3Base + `${environment.MediaS3Path}` + '/Media/' +  this.PropertyDetail.MainPhotoUrl;
    this.photoUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}` + this.PropertyDetail.MainPhotoUrl;
    if (this.PropertyDetail.ListingID) {
      this._propertyService.getListingByListingId(this.PropertyDetail.ListingID).subscribe((data => {
        this.listing = JSON.parse(data['_body']).responseData[0];
      }))
    }
    // this._propertyService.GetPropertyDetailsById(this.PropertyDetail.PropertyId).subscribe((data => {
    //   const result = JSON.parse(data['_body']).responseData[0];
    //   this.property.YearBuilt = result.YearBuilt;
    //   this.property.GeneralUse = result.PropertyUse;
    //   this.property.NumberOfFloor = result.NumberOfFloor;
    //   this.property.Market = result.MarketName;
    //   this.property.Address = result.Address;
    //   this.property.PropertyName = result.PropertyName;
    //   this.property.BuildingSize = result.BuildingSizeSM;
    //   this.property.City = result.CityName;
    //   this.property.State = result.StateName;
    //   this.property.Zip = result.ZipCode;
    //   this.property.ImageUrl = constants.MediaS3Base + `${environment.MediaS3Path}` + '/Media/' + result.MainPhotoUrl;
    //   this.property.NumberOfFloor = result.Floors;
    //   this.property.Country = result.CountyName;
    // }))
  }

  showListingDetails(PropertyId, ListingID) {
  
    this._router.navigate(['/property/details', PropertyId]);
    
    /*if (ListingID === null || ListingID === undefined) {
      this._router.navigate(['/property/details', PropertyId]);
    } else {
      this._router.navigate(['/property/details', PropertyId, ListingID]);
    }*/
  }

}
