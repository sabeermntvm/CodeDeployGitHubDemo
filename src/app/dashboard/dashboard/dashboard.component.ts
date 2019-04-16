import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as global from '../../config/globals';
import { PropertyService } from '../../core/services/api-property.service';
import { LoginService } from '../../core/services/login.service';
import { EnumCountry } from '../../core/enumerations/country';
import { environment } from '../../../environments/environment';
import { UnitConversionEnum } from '../../core/enumerations/unitConversion';
import { Router } from '@angular/router';
import { SharedDataService } from '../../core/services/shareddata.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    '../../../../node_modules/nvd3/build/nv.d3.css',
    '../../../../node_modules/angular-calendar/css/angular-calendar.css',
    './dashboard.component.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  global = global;

  chartData;
  chartColor;
  barChartData;
  innerPadding = 20;
  barPadding = 8;
  margin = [10, 20, 10, 20];

  dataList: any[] = [];
  customOptions = {
    dots: false, navigation: false, nav: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      700: {
        items: 2
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      },
      1100: {
        items: 4
      },
      1600: {
        items: 5
      },
      2000: {
        items: 6
      },
      2600: {
        items: 7
      },
      2800: {
        items: 8
      }
    },
  }

  public recentActivityCounts: any = {
    'NewLease': { 'Category': "", 'Count': 0, 'Total': null },
    'NewSale': { 'Category': "", 'Count': 0, 'Total': null },
    'Leased': { 'Category': "", 'Count': 0, 'Total': null },
    'Sold': { 'Category': "", 'Count': 0, 'Total': null },
    'NewSubLease': { 'Category': "", 'Count': 0, 'Total': null }
  };
  public spaceBreakDown: any = {
    'TotalOfficeSpace': 0,
    'OfficeSpace': [],
    'TotalRetailSpace': 0,
    'RetailSpace': [],
    'TotalIndustrialSpace': 0,
    'IndustrialSpace': [],
  };
  public recentOfficeProperties: Array<any> = [];
  public recentRetailProperties: Array<any> = [];
  public recentIndustrialProperties: Array<any> = [];
  public propertyStatusCounts: Array<any>;
  public recentProperties: Array<any> = [];
  public myListingsOffice: Array<any> = [];
  public myListingsRetail: Array<any> = [];
  public myListingsIndustrial: Array<any> = [];
  public myAllListings: Array<any> = [];
  public propertyCount: number = 0;
  public activeListingCount: number = 0;
  public mediaUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `${environment.MediaS3DynamicImageSize}`;
  public CountryId: number;
  public recentPropertyTabName: string = "office";
  public myListingTabName: string = "office";
  public unitId: number;
  officePropertyCount: string;
  officePropertySize: string;
  retailPropertyCount: string;
  retailPropertySize: string;
  industrialPropertyCount: string;
  industrialPropertySize: string;
  landPropertyCount: string;
  landPropertySize: string;
  onlPropertyCount: number;
  onlPropertySize: number;



  metricUnit: number = 1;
  RecentMarketActivityCounts: any = '';
  constructor(private _propertyService: PropertyService
    , private _loginService: LoginService
    , private _router: Router, private _sharedDataService: SharedDataService) {
    for (let i = 0; i < 8; i++) {

      this.dataList.push(i);
      this.CountryId = this._loginService.UserInfo.CountryID;
      this.unitId = this._loginService.UserInfo.UnitId;
      this.metricUnit = UnitConversionEnum.Metric;
    }
  }
  ngOnInit() {
    this.chartColor = { domain: [global.COLOR_BLUE, global.COLOR_GREEN, global.COLOR_PURPLE, global.COLOR_BLACK] };
    this.barChartData = [{ name: "Germany", value: 40632 }, { name: "United States", value: 49737 }, { name: "France", value: 36745 }, { name: "United Kingdom", value: 36240 }];
    this.getRecentPropertiesStatistics();
    this.getRecentPropertiesAdded();
    this.getMyListing();
    this.getRecentMarketActivityCounts('Today');
    this.RecentMarketActivityCounts = "Today";
    this.getSpaceBreakDown();
    
  }

  getRecentPropertiesStatistics() {
    this._propertyService.GetRecentPropertiesStatistics().subscribe((data => {
      if (!JSON.parse(data['_body']).error) {
        let property = JSON.parse(data['_body']).responseData; 
         this.propertyStatusCounts = property[0];
        this.officePropertyCount = this.propertyStatusCounts.find(p => p.UseTypeID == 5).PropertyCount;
        this.officePropertySize = this.propertyStatusCounts.find(p => p.UseTypeID == 5).TotalSize;
        this.retailPropertyCount = this.propertyStatusCounts.find(p => p.UseTypeID == 2).PropertyCount;
        this.retailPropertySize = this.propertyStatusCounts.find(p => p.UseTypeID == 2).TotalSize;
        this.industrialPropertyCount = this.propertyStatusCounts.find(p => p.UseTypeID == 3).PropertyCount;
        this.industrialPropertySize = this.propertyStatusCounts.find(p => p.UseTypeID == 3).TotalSize;
        this.landPropertyCount = this.propertyStatusCounts.find(p => p.UseTypeID == 7).PropertyCount;
        this.landPropertySize = this.propertyStatusCounts.find(p => p.UseTypeID == 7).TotalSize;
        this.onlPropertyCount = +this.propertyStatusCounts.find(p => p.UseTypeID == 4).PropertyCount + +this.propertyStatusCounts.find(p => p.UseTypeID == 9).PropertyCount;
        this.onlPropertySize = +this.propertyStatusCounts.find(p => p.UseTypeID == 4).TotalSize + +this.propertyStatusCounts.find(p => p.UseTypeID == 9).TotalSize;
      }
    }));
  }


  getRecentPropertiesAdded() {
    this._propertyService.GetRecentPropertiesAdded().subscribe((data => {
      if (!JSON.parse(data['_body']).error) {
        let property = JSON.parse(data['_body']).responseData; 
        this.recentOfficeProperties = property[0];
        this.recentRetailProperties = property[1];
        this.recentIndustrialProperties = property[2];
        this.recentProperties = this.recentProperties.concat(property[0]);
        this.recentProperties = this.recentProperties.concat(property[1]);
        this.recentProperties = this.recentProperties.concat(property[2]);
        this._sharedDataService.searchProperties = this.recentProperties;
      }
    }));
  }

  getMyListing(){
    this._propertyService.GetMyListing(this._loginService.UserInfo.EntityID).subscribe((data => {
      if (!JSON.parse(data['_body']).error) {
        let myListings=JSON.parse(data['_body']).responseData;
        this.myListingsIndustrial = myListings.myListingsIndustrial;  
        this.myListingsOffice = myListings.myListingsOffice;
        this.myListingsRetail = myListings.myListingsRetail;
       this.myAllListings = this.myAllListings.concat(this.myListingsIndustrial);
       this.myAllListings = this.myAllListings.concat(this.myListingsOffice);
       this.myAllListings = this.myAllListings.concat(this.myListingsRetail);
      }})
    );
  }
  getRecentMarketActivityCounts(param: any) {
    this.RecentMarketActivityCounts = param;
    this._propertyService.getRecentMarketActivityCounts(param).subscribe(result => {
      if (!JSON.parse(result['_body']).error) {
        var data = JSON.parse(result['_body']).responseData;
        this.recentActivityCounts.NewLease = data[0];
        this.recentActivityCounts.NewSale = data[1];
        this.recentActivityCounts.Leased = data[2];
        this.recentActivityCounts.Sold = data[3];
        this.recentActivityCounts.NewSubLease = data[4];
      }
    });
  }

  getSpaceBreakDown() {
    this._propertyService.getSpaceBreakDown(this._loginService.UserInfo.EntityID).subscribe(result => {
      if (!JSON.parse(result['_body']).error) {
        var data = JSON.parse(result['_body']).responseData;
        this.spaceBreakDown.TotalOfficeSpace = data[0][0].Total;
        //  this.spaceBreakDown.OfficeSpace = data[1];
        this.spaceBreakDown.TotalIndustrialSpace = data[2][0].Total;
        //  this.spaceBreakDown.IndustrialSpace = data[3];
        this.spaceBreakDown.TotalRetailSpace = data[4][0].Total;
        //    this.spaceBreakDown.RetailSpace = data[5];

        this.spaceBreakDown.OfficeSpace = [];
        this.spaceBreakDown.IndustrialSpace = [];
        this.spaceBreakDown.RetailSpace = [];
        if (!!data[1] && data[1].length > 0) {
          data[1].forEach(item => {
            if (!item.Total)
              item.Total = 0;
            this.spaceBreakDown.OfficeSpace.push({ name: item.RangeTypeName + " SqM", value: item.Total });
          });
        }

        if (!!data[3] && data[3].length > 0) {
          data[3].forEach(item => {
            if (!item.Total)
              item.Total = 0;
            this.spaceBreakDown.IndustrialSpace.push({ name: item.RangeTypeName + " SqM", value: item.Total });
          });
        }

        if (!!data[5] && data[5].length > 0) {
          data[5].forEach(item => {
            if (!item.Total)
              item.Total = 0;
            this.spaceBreakDown.RetailSpace.push({ name: item.RangeTypeName + " SqM", value: item.Total });
          });
        }
      }
    });
  }
  showRecentProperties(tabName) {
    switch (tabName) {
      case 'office': this.recentPropertyTabName = "office";
        break;
      case 'retail': this.recentPropertyTabName = "retail";
        break;
      case 'industrial': this.recentPropertyTabName = "industrial";
        break;
      case 'all': this.recentPropertyTabName = "all";
        break;
    }
  }
  showMyListings(tabName) {
    switch (tabName) {
      case 'office': this.myListingTabName = "office";
        break;
      case 'retail': this.myListingTabName = "retail";
        break;
      case 'industrial': this.myListingTabName = "industrial";
        break;
      case 'all': this.myListingTabName = "all";
        break;
    }
  }
  showPropertySummary(PropertyId) {
    this._router.navigate(['/property/propertySummary', PropertyId]);
  }
}
