import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../core/services/analytics.service';
import { SharedDataService } from '../../core/services/shareddata.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  chartdata:any;
  dataLoaded:boolean = false;
  selectedPropertyList:Array<number> = [];
  propertyId:any;

  constructor(private _analyticsService:AnalyticsService, private _sharedDateService:SharedDataService ) { }

  ngOnInit() {

    if(this._sharedDateService.searchProperties){
    this._sharedDateService.searchProperties.forEach(prop => {
      if (prop.isSelected)
        this.selectedPropertyList.push(prop.PropertyId);
    });

    this.propertyId = this.selectedPropertyList.join(',');

    this.dataLoaded = true;
  }
}

}
