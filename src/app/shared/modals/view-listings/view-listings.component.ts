import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommunicationModel, CommunicationService} from '../../../core/services/communication.service';
import { environment } from '../../../../environments/environment';
import {Router} from '@angular/router';


@Component({
  selector: 'app-view-listings',
  templateUrl: './view-listings.component.html',
  styleUrls: ['./view-listings.component.scss']
})
export class ViewListingsComponent {

  @Input() addListings: Array<any>;
  @Input() property: any;
  @Output() onClose = new EventEmitter();
  preImageUrl: string;

  constructor(private _router: Router, private _CommService: CommunicationService) {
    this.preImageUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
  }


  showListingDetails(PropertyId, ListingID) {  

    if (ListingID === null || ListingID === undefined) {
      this._router.navigate(['/property/details', PropertyId]);
    } else {
      this._router.navigate(['/property/details', PropertyId, ListingID]);
    }
  }
}
