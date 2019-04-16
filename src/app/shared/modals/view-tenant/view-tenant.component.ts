import { Component, OnInit, Input } from '@angular/core';
import { EnumCountry } from '../../../core/enumerations/country';
import { PropertyService } from '../../../core/services/api-property.service';
import { Router } from '@angular/router';
import { CommunicationModel, CommunicationService } from '../../../core/services/communication.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-view-tenant',
  templateUrl: './view-tenant.component.html',
  styleUrls: ['./view-tenant.component.scss']
})
export class ViewTenantComponent implements OnInit {

  @Input() tenant: any;
  @Input() CountryId: number;
  OccupiedHeader: string = "Occupied SqM";
  USCountryCode: number; 
  photoUrl: string;

  constructor(private propertyService: PropertyService,
              private _router: Router,
              private _CommService: CommunicationService) {

    this.USCountryCode = EnumCountry.US;  
  }

  ngOnInit() {
  
    this.photoUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}` + this.tenant.TenantPhotoUrl;
    if (this.CountryId == this.USCountryCode) {
      this.OccupiedHeader = "Occupied SF";
    }    
  }
 showPropertyTenant(PropertyId,TenantId) {    
      this._router.navigate(['/property/details', PropertyId,"", TenantId]);
  }
}
