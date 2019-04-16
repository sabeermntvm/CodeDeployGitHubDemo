import { Component, OnInit, Input } from '@angular/core';
import { PropertyService } from '../../../core/services/api-property.service';
import { Router } from '@angular/router';
import { CommunicationModel, CommunicationService } from '../../../core/services/communication.service';

@Component({
    selector: 'app-view-property-transactions',
    templateUrl: './view-property-transactions.component.html',
    styleUrls: ['./view-property-transactions.component.scss']
})
export class ViewPropertyTransactionsComponent implements OnInit {
 @Input() PropertyId:number;
 @Input() CountryId:number;
saleCompTransactionList:Array<any>;
    constructor(private propertyService: PropertyService,
        private _router: Router,
        private _CommService: CommunicationService
       ) {

this.saleCompTransactionList=Array<any>();
    }
    ngOnInit() {
this.getTransactionsByPropertyId();
    }

  getTransactionsByPropertyId() {
    const data = this.propertyService.getSaleTransactionsByPropertyId(this.PropertyId);
    data.subscribe(result => {
      if (!JSON.parse(result['_body']).error)
        this.saleCompTransactionList = JSON.parse(result['_body']).responseData;        
    });
  }
 showPropertyDetails(saleId) {  
    localStorage.setItem('SelectedPropertyTransactions', JSON.stringify(this.saleCompTransactionList));   
  //  this._router.navigate(['/property/details', this.PropertyId]);
        this._router.navigate(['/property/details', this.PropertyId, "", "",saleId]);    
  }
}