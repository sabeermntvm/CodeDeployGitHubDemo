import { Component, OnInit, Input } from '@angular/core';
import { MapOptions } from '../core/models/MapOptions';
import { MapService } from '../core/services/map-service.service';

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss']
})
export class MapComponentComponent implements OnInit {

  @Input()
  public MapOptions: MapOptions;

  private _mapService: MapService;

  public get MapId() {
    if (this.MapOptions != null) {
      return this.MapOptions.MapId;
    } else {
      return "";
    }
  }

  constructor(_mapService: MapService) {
    this._mapService = _mapService;
  }

  ngOnInit() {  }

}