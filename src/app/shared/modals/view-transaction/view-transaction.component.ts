import {Component, OnInit, Input} from '@angular/core';
import {EnumCountry} from '../../../core/enumerations/country';
import {LoginService} from '../../../core/services/login.service';
import {TransactionService} from '../../../core/services/transaction.service';
import {PropertyService} from '../../../core/services/api-property.service';
import {Property} from '../../../core/models/Property';
import {Router} from '@angular/router';
import {CommunicationService, CommunicationModel} from '../../../core/services/communication.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss']
})
export class ViewTransactionComponent implements OnInit {

  @Input() transaction: any;
  photoUrl: String;
  CountryId: number;
  USCountryCode: number;
  transactionDetail: any;
  saleInfo: any;
  saleCompProperties: any;
  sellerContacts: any;
  buyerContacts: any;
  propertyDetails: any;

  constructor(private _loginService: LoginService
    , public transactionService: TransactionService
    , public propertyService: PropertyService
    , private _commService: CommunicationService
    , private _router: Router) {
    this.photoUrl = '';
    this.CountryId = this._loginService._countryCode;
    this.USCountryCode = EnumCountry.US;
    this.saleInfo = null;
    this.saleCompProperties = null;
    this.sellerContacts = null;
    this.buyerContacts = null;
    this.propertyDetails = new Property();
  }

  ngOnInit() {
    if (this.transaction.SaleID) {
      this.transactionService.GetSaleCompGetDetailsById(this.transaction.SaleID).subscribe((data => {
        this.transactionDetail = JSON.parse(data['_body']).responseData;
        if (this.transactionDetail.SaleInfo && this.transactionDetail.SaleInfo.length)
          this.saleInfo = this.transactionDetail.SaleInfo[0];
        if (this.transactionDetail.SaleCompProperties && this.transactionDetail.SaleCompProperties.length)
          this.saleCompProperties = this.transactionDetail.SaleCompProperties[0];
        if (this.transactionDetail.SellerContacts && this.transactionDetail.SellerContacts.length)
          this.sellerContacts = this.transactionDetail.SellerContacts[0];
        if (this.transactionDetail.BuyerContacts && this.transactionDetail.BuyerContacts.length)
          this.buyerContacts = this.transactionDetail.BuyerContacts[0];

        this.propertyService.GetPropertyDetailsById(this.transaction.PropertyID).subscribe( prop => {
          this.propertyDetails = JSON.parse(prop['_body']).responseData[0];
          this.photoUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}` + this.propertyDetails.MainPhotoUrl;
        })
      }))
    }
  }

  showSaleDetails(transactionId) {

  }

  showPropertyDetails() {     
    this._router.navigate(['/property/details', this.transaction.PropertyID]);
  }
}
