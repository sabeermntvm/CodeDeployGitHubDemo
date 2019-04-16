import { Component, OnInit, Input } from '@angular/core';
import { MapOptions } from '../../core/models/MapOptions';
import { MapService } from '../../core/services/map-service.service';
import { Property } from '../../core/models/Property';
import * as MapEnum from '../../core/models/MapEnum';
import { MapType } from '../../core/models/MapEnum';
import { Subscription } from 'rxjs';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
@Component({
  selector: 'app-propertymap',
  templateUrl: './propertymap.component.html',
  styleUrls: ['./propertymap.component.css']
})
export class PropertymapComponent implements OnInit {
  public mapOptions: MapOptions;
  public map: any;
  private _mapService: MapService;
  private propertyDetails: Property = null;
  private markers: Array<any> = new Array<any>();
  @Input() PropertyData;
  getpropertydetailsSubscription: Subscription;

  constructor(mapService: MapService, private _CommService: CommunicationService) {
    this._mapService=mapService;
    this.mapOptions = new MapOptions('PropertyMap');
    this.mapOptions.ZoomLevel = 17;    
    this.getpropertydetailsSubscription = this._CommService.subscribe("Frompropertysummary").subscribe((result) => { 
      this.PropertyData = result.data;
      this.ngAfterViewInit();
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.propertyDetails=null;
       this.mapOptions.RequireCtrlToZoom = false;
       this.mapOptions.MapType=MapType.Hybrid;
          this.mapOptions.FeaturesToHide.push(MapEnum.MapFeatures.Administrative_LandParcel,
      MapEnum.MapFeatures.HighwayRoad,
      MapEnum.MapFeatures.ControlledAccessHighwayRoad,
      MapEnum.MapFeatures.LineTransit, MapEnum.MapFeatures.AirportStation,
      MapEnum.MapFeatures.BusStation, MapEnum.MapFeatures.RailwayStation,
      MapEnum.MapFeatures.AttractionPin, MapEnum.MapFeatures.BusinessPin,
      MapEnum.MapFeatures.GovernmentPin, MapEnum.MapFeatures.MedicalInstitutionPin,
      MapEnum.MapFeatures.ParkPin, MapEnum.MapFeatures.PlaceOfWorkshipPin,
      MapEnum.MapFeatures.ScoolPin, MapEnum.MapFeatures.SportsComplexPin);
    this.map = this._mapService.CreateMap(this.mapOptions);
   
    //set the map pin if the Property data is not null
    if(!!this.PropertyData)
    {
      let data ={data :this.PropertyData};
      this.setMapPinLocation(data);
    }
  }
  
  setMapPinLocation(data){
    this._mapService.MapRefresh(this.map);
    if (this.propertyDetails == null) {
      this.propertyDetails = data.data;
      let marker = this._mapService.PlaceMarker(this.map, this.propertyDetails.Latitude, this.propertyDetails.Longitude);        
      this._mapService.SetCenter(this.map, marker.getPosition().lat(), marker.getPosition().lng());
      this.markers.push(marker);
    }
  }
  ngOnDestroy() {
    this.getpropertydetailsSubscription.unsubscribe();
  }
}
