import { Injectable, NgZone } from '@angular/core';
import { MapOptions } from '../models/MapOptions';
import * as MapEnum from '../models/MapEnum';
import { LatLng } from '../models/LatLng';
import { FormattedAddress } from '../models/FormattedAddress';
import { MapBound } from '../models/MapBound';
import { PolygonStyleOption } from '../models/PolygonSyleOption';

declare var google: any;
declare var jquery: any;
declare var $: any;
@Injectable()
export class MapService {
  private _zone: NgZone;

  constructor(zone: NgZone) {
    this._zone = zone;
  }
  // #Region Private functions

  private getPositionValue(position: MapEnum.GoogleMapControlPosition): any {
    let googlePosition = google.maps.ControlPosition.TOP_RIGHT;
    switch (position) {
      case MapEnum.GoogleMapControlPosition.Top_Center:
        googlePosition = google.maps.ControlPosition.TOP_CENTER;
        break;
      case MapEnum.GoogleMapControlPosition.Top_Left:
        googlePosition = google.maps.ControlPosition.TOP_LEFT;
        break
      case MapEnum.GoogleMapControlPosition.Top_Right:
        googlePosition = google.maps.ControlPosition.TOP_RIGHT;
        break;
      case MapEnum.GoogleMapControlPosition.LEFT_Top:
        googlePosition = google.maps.ControlPosition.LEFT_TOP;
        break;
      case MapEnum.GoogleMapControlPosition.Right_Top:
        googlePosition = google.maps.ControlPosition.RIGHT_TOP;
        break;
      case MapEnum.GoogleMapControlPosition.Left_Center:
        googlePosition = google.maps.ControlPosition.LEFT_CENTER;
        break;
      case MapEnum.GoogleMapControlPosition.Right_Center:
        googlePosition = google.maps.ControlPosition.RIGHT_CENTER;
        break;
      case MapEnum.GoogleMapControlPosition.Left_Bottom:
        googlePosition = google.maps.ControlPosition.LEFT_BOTTOM;
        break;
      case MapEnum.GoogleMapControlPosition.Right_Bottom:
        googlePosition = google.maps.ControlPosition.RIGHT_BOTTOM;
        break;
      case MapEnum.GoogleMapControlPosition.Bottom_Center:
        googlePosition = google.maps.ControlPosition.BOTTOM_CENTER;
        break;
      case MapEnum.GoogleMapControlPosition.Bottom_Left:
        googlePosition = google.maps.ControlPosition.BOTTOM_LEFT;
        break;
      case MapEnum.GoogleMapControlPosition.Bottom_Right:
        googlePosition = google.maps.ControlPosition.BOTTOM_RIGHT;
        break;
      default:
        googlePosition = google.maps.ControlPosition.TOP_RIGHT;
        break;
    }
    return googlePosition;
  }

  private getFeatureText(feature: MapEnum.MapFeatures) {
    let featureText = '';
    switch (feature) {
      case MapEnum.MapFeatures.Administrative_Country:
        featureText = 'administrative.country';
        break;
      case MapEnum.MapFeatures.Administrative_LandParcel:
        featureText = 'administrative.land_parcel';
        break;
      case MapEnum.MapFeatures.Administrative_Locality:
        featureText = 'administrative.locality';
        break;
      case MapEnum.MapFeatures.Administrative_Neighborhood:
        featureText = 'administrative.neighborhood';
        break;
      case MapEnum.MapFeatures.Administrative_Province:
        featureText = 'administrative.province';
        break;
      case MapEnum.MapFeatures.ManMadeLandscape:
        featureText = 'administrative.province';
        break;
      case MapEnum.MapFeatures.NaturalLandscape_Landcover:
        featureText = 'landscape.natural.landcover';
        break;
      case MapEnum.MapFeatures.NaturalLandscape_Terrain:
        featureText = 'landscape.natural.terrain';
        break;
      case MapEnum.MapFeatures.AttractionPin:
        featureText = 'poi.attraction';
        break;
      case MapEnum.MapFeatures.BusinessPin:
        featureText = 'poi.business';
        break;
      case MapEnum.MapFeatures.GovernmentPin:
        featureText = 'poi.government';
        break;
      case MapEnum.MapFeatures.MedicalInstitutionPin:
        featureText = 'poi.medical';
        break;
      case MapEnum.MapFeatures.ParkPin:
        featureText = 'poi.park';
        break;
      case MapEnum.MapFeatures.PlaceOfWorkshipPin:
        featureText = 'poi.place_of_worship';
        break;
      case MapEnum.MapFeatures.ScoolPin:
        featureText = 'poi.school';
        break;
      case MapEnum.MapFeatures.SportsComplexPin:
        featureText = 'poi.sports_complex';
        break;
      case MapEnum.MapFeatures.ArterialRoad:
        featureText = 'road.arterial';
        break;
      case MapEnum.MapFeatures.HighwayRoad:
        featureText = 'road.highway';
        break;
      case MapEnum.MapFeatures.ControlledAccessHighwayRoad:
        featureText = 'road.highway.controlled_access';
        break;
      case MapEnum.MapFeatures.LocalRoad:
        featureText = 'road.local';
        break;
      case MapEnum.MapFeatures.LineTransit:
        featureText = 'transit.line';
        break;
      case MapEnum.MapFeatures.AirportStation:
        featureText = 'transit.station.airport';
        break;
      case MapEnum.MapFeatures.BusStation:
        featureText = 'transit.station.bus';
        break;
      case MapEnum.MapFeatures.RailwayStation:
        featureText = 'transit.station.rail';
        break;
      case MapEnum.MapFeatures.Water:
        featureText = 'water';
        break;
    }
    return featureText;
  }

  private displayInfoWindow(map: any, marker: any, content: string, isAutoPan: boolean = false) {
    let infowindow = new google.maps.InfoWindow({ content: content, disableAutoPan: !isAutoPan });
    infowindow.open(map, marker);

    $('.gm-style-iw').next().css({ 'height': '0px' }); //remove arrow bottom inforwindow
    $('.gm-style-iw').prev().html('');
    $('.gm-style-iw').css({ 'background': 'rgba(1, 82, 167, .4)' });
    return infowindow;
  };

  private setDisplay(map, place) {
    if (!map)
      return;
    let bounds = new google.maps.LatLngBounds();
    if (place.geometry.viewport) {
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
  };


  public getBoundary(map: any): MapBound {
    let bounds = map.getBounds();
    return this.getBoundPropertyObject(bounds);
  }


  private getBoundPropertyObject(bounds: any): MapBound {
    var boundProperties: MapBound = new MapBound();
    boundProperties.Center = bounds.getCenter();
    boundProperties.SouthWest = this.getLatLngObject(bounds.getSouthWest());
    boundProperties.NorthEast = this.getLatLngObject(bounds.getNorthEast());
    return boundProperties;
  };

  private getLatLngObject(latlng): LatLng {
    let obj = new LatLng();
    obj.Latitude = latlng.lat();
    obj.Longitude = latlng.lng();
    return obj;
  };

  private getStyleObj(feature: string) {
    return ({
      featureType: feature,
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    });
  }

  private getMapFeatures(features: MapEnum.MapFeatures[]) {
    let styles = [];

    for (const feature of features) {
      styles.push(this.getStyleObj(this.getFeatureText(feature)));
    }
    return styles;
  }

  private generateMapOptionsForGoogle(mapOptions: MapOptions): any {
    let result: any = {};
    result.center = this.GetLatLng(mapOptions.CenterLat, mapOptions.CenterLng);
    result.draggable = mapOptions.IsDraggable;
    if (mapOptions.FullscreenControl != null) {
      result.fullscreenControl = mapOptions.FullscreenControl;
      result.fullscreenControlOptions = { position: google.maps.ControlPosition.LEFT_BOTTOM }
    }

    result.mapTypeId = this.GetMapTypeId(mapOptions.MapType);
    result.zoom = mapOptions.ZoomLevel || 17;
    result.maxZoom = mapOptions.MaxZoom;
    result.minZoom = mapOptions.MinZoom;
    result.streetViewControl = mapOptions.StreetViewControl;
    result.streetViewControlOptions = { position: google.maps.ControlPosition.LEFT_BOTTOM },
      // result.mapTypeControlOptions = { position: google.maps.ControlPosition.LEFT_BOTTOM };
      result.zoomControlOptions = {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.LEFT_BOTTOM
      };
    result.mapTypeControl = true,
      result.mapTypeControlOptions = {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    //TOP_CENTER
    if (!mapOptions.RequireCtrlToZoom) {
      result.gestureHandling = 'greedy';
    } else {
      result.gestureHandling = 'cooperative';
    }
    return result;
  }

  // #endRegion Private Functions

  CreateMap(mapOptions: MapOptions): any {
    let mapOpts = this.generateMapOptionsForGoogle(mapOptions);
    mapOpts.styles = this.getMapFeatures(mapOptions.FeaturesToHide);
    mapOpts.mapTypeId = google.maps.MapTypeId.HYBRID;
    //mapOpts.position = google.maps.ControlPosition.TOP_CENTER
    let map = new google.maps.Map(document.getElementById(mapOptions.MapId), mapOpts);
    this.TiltMap(map, 0);
    return map;
  };

  OnMapZoomChange(map, callback: (boundProperties: MapBound) => any) {
    google.maps.event.addListener(map, 'zoom_changed', () => {
      let bounds = map.getBounds();
      let boundProps = this.getBoundPropertyObject(bounds);
      if (!!callback)
        this._zone.run(() => callback(boundProps));
    });
  };

  OnMapViewPortChangedOnce(map: any, callback: (boundProperties: MapBound) => any): void {
    google.maps.event.addListenerOnce(map, 'idle', () => {
      var bounds = map.getBounds();
      var boundProps = this.getBoundPropertyObject(bounds);
      if (!!callback)
        this._zone.run(() => callback(boundProps));
    });
  };

  GetMapZoomLevel(map: any): number {
    return map.getZoom();
  }

  SetMapZoomLevel(map: any, zoomLevel: number): any {
    map.setZoom(zoomLevel);
    return map;
  }

  ClearViewPortChangeListener(map: any): void {
    google.maps.event.clearListeners(map, 'idle');
  };

  TiltMap(map: any, degree: number = 0): void {
    map.setTilt(degree);
  };

  MapRefresh(map: any) {
    setTimeout(() => {
      google.maps.event.trigger(map, "resize");
    }, 1000);
  };


  RightClick(map: any) {
   google.maps.event.trigger(map, "rightclick");
  };


  SetCenter(map: any, latitude: number, longitude: number) {
    setTimeout(() => {
      map.setCenter(this.GetLatLng(latitude, longitude));
    }, 1000);
  };

  MoveMapCenter(map, latitude, longitude, requireAnimation = false) {
    if (requireAnimation)
      this.animatedMapMovement(map, latitude, longitude, 10, 0);
    else
      map.panTo(this.GetLatLng(latitude, longitude));
  };

  FitMapToMarkers(map: any, markers: Array<any>, requireAnimation = false) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].getPosition());
    }

    map.fitBounds(bounds);
  };

  GetLatLng(latitude: number, longitude: number): any {
    return new google.maps.LatLng(latitude, longitude);
  };

  GetCenter(map) {
    if (!map)
      return null;
    return this.getLatLngObject(map.getCenter());
  };

  OnMapClick(map, callback: (latlng: LatLng) => any) {
    google.maps.event.addListener(map, 'click', (event) => {
      this._zone.run(() => callback(this.getLatLngObject(event.latLng)));
    });
  }

  PlaceMarker(map: any, latitude: number, longitude: number, isDraggable: boolean = true): any {
    let marker = new google.maps.Marker({
      position: this.GetLatLng(latitude, longitude),
      map: map,
      draggable: isDraggable
    });
    return marker;
  }

  ClearMarkers(markers: Array<any>) {
    if (!markers)
      markers = [];
    for (var index in markers) {
      markers[index].setMap(null);
      markers[index].setVisible(false);
      markers[index] = null;
    }
    markers = [];
    return markers;
  };

  ClearSingleMarker(marker: any) {
    if (!!marker) {
      marker.setMap(null);
      marker.setVisible(false);
    }
  }

  SetMarkerAnimation(marker: any, animation: MapEnum.Animation) {
    switch (animation) {
      case MapEnum.Animation.Bounce:
        marker.setAnimation(google.maps.Animation.BOUNCE);
        break;
      case MapEnum.Animation.Drop:
        marker.setAnimation(google.maps.Animation.DROP);
        break;
    }
    return marker;
  };

  ClearMarkerAnimation(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    };
  };

  OnMarkerDragBegin(marker: any, callback: () => any) {
    google.maps.event.addListener(marker, 'dragstart', (event) => {
      callback();
    });
  };

  OnMarkerDragEnd(marker, callback: (latlng: LatLng) => any) {
    google.maps.event.addListener(marker, 'dragend', (event) => {
      callback(this.getLatLngObject(event.latLng));
    });
  };

  MoveMarker(marker, latitude, longitude) {
    var latlng = this.GetLatLng(latitude, longitude);
    marker.setPosition(latlng);
  };

  ShowInfoWindow(map: any, marker: any, infoWindowContent: string, isAutoPan: boolean = false) {
    var infowindow = this.displayInfoWindow(map, marker, infoWindowContent, isAutoPan);
    return infowindow;
  };

  ClearInfoWindow(infoWindow: any) {
    infoWindow.close();
  };

  OnMarkerClick(marker, callback: (event: any, marker: any, latlng: LatLng) => any) {
    google.maps.event.addListener(marker, 'click', (event) => {
      if (!!callback) {
        this._zone.run(() => callback(event, marker, this.getLatLngObject(event.latLng)));
      }
    });
  };

  OnMarkerHover(marker: any, callback: (event: any, marker: any) => any) {
    google.maps.event.addListener(marker, 'mouseover', (event) => {
      this._zone.run(() => callback(event, marker));
    });
  };

  OnMarkerMouseOut(marker: any, callback: (event: any, marker: any) => any) {
    google.maps.event.addListener(marker, 'mouseout', (event) => {
      this._zone.run(() => callback(event, marker));
    });
  };

  GetMapTypeId(mapType: MapEnum.MapType) {
    switch (mapType) {
      case MapEnum.MapType.Hybrid:
        return google.maps.MapTypeId.HYBRID;
      case MapEnum.MapType.Roadmap:
        return google.maps.MapTypeId.ROADMAP;
      case MapEnum.MapType.Satellite:
        return google.maps.MapTypeId.SATELLITE;
      case MapEnum.MapType.Terrain:
        return google.maps.MapTypeId.TERRAIN;
      default:
        return google.maps.MapTypeId.ROADMAP;
    }
  };

  AddController(map: any, controllerId: string, position: MapEnum.GoogleMapControlPosition): any {
    let googlePosition = this.getPositionValue(position);
    var control = document.getElementById(controllerId);
    map.controls[googlePosition].push(control);
    return map;
  };

  AddSearchBox(map: any, searchBoxId: string, position: MapEnum.GoogleMapControlPosition, addController: boolean = true, onPlaceChanged: (place: any) => any) {
    let input = document.getElementById(searchBoxId);
    if (addController)
      this.AddController(map, searchBoxId, position);
    let autocompleteOptions = {};
    let autocomplete = new google.maps.places.Autocomplete(input, autocompleteOptions);
    autocomplete.bindTo('bounds', map);

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      var place = autocomplete.getPlace();
      this.setDisplay(map, place);
      if (!!onPlaceChanged)
        this._zone.run(() => onPlaceChanged(place));
    });

  }

  GetLocationDetailsFromLatLng(latitude, longitude, callback: (places: any) => any) {
    var latlng = this.GetLatLng(latitude, longitude);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (!!callback) {
          this._zone.run(() => callback(results));
        }
      }
    });
  };

  GetFormattedObjectFromGooglePlaceAddressComponent(addressComponents): FormattedAddress {
    let resultantData: FormattedAddress = new FormattedAddress();
    for (const eachAddress of addressComponents) {
      if (!!eachAddress.types && eachAddress.types.length > 0) {
        if (eachAddress.types[0] == 'street_number') {
          if (!resultantData.MinimumStreetNumber) {
            resultantData.StreetNumber = eachAddress.long_name;
            if (eachAddress.long_name.indexOf('-') > -1) {
              resultantData.MinimumStreetNumber = eachAddress.long_name.split('-')[0];
              resultantData.MaximumStreetNumber = eachAddress.long_name.split('-')[1];
            }
            else {
              resultantData.MinimumStreetNumber = resultantData.MaximumStreetNumber = eachAddress.long_name;
            }
          }
        }
        else if (eachAddress.types[0] == 'route') {
          if (!resultantData.StreetNameShort) {
            resultantData.StreetNameLong = eachAddress.long_name;
            resultantData.StreetNameShort = eachAddress.short_name;
          }
        }
        else if (eachAddress.types[0] == 'locality') {
          if (!resultantData.City)
            resultantData.City = eachAddress.long_name;
        }
        else if (eachAddress.types[0] == 'administrative_area_level_2') {
          if (!resultantData.CountyName)
            resultantData.CountyName = eachAddress.long_name;
        }
        else if (eachAddress.types[0] == 'administrative_area_level_1') {
          if (!resultantData.StateCode) {
            resultantData.StateName = eachAddress.long_name;
            resultantData.StateCode = eachAddress.short_name;
          }
        }
        else if (eachAddress.types[0] == 'country') {
          if (!resultantData.CountryCode) {
            resultantData.CountryName = eachAddress.long_name;
            resultantData.CountryCode = eachAddress.short_name;
          }
        }
        else if (eachAddress.types[0] == 'postal_code') {
          if (!resultantData.ZipCode)
            resultantData.ZipCode = eachAddress.long_name;
        }
      }
    }
    return resultantData;
  };

  // Map Drawing Management Begins

  AddDrawMenu(map: any, position: MapEnum.GoogleMapControlPosition, ...drawingModes: MapEnum.DrawMode[]): any {
    let drawModes = new Set<string>();
    for (let mode of drawingModes) {
      switch (mode) {
        case MapEnum.DrawMode.Circle:
          drawModes.add('circle');
          break;
        case MapEnum.DrawMode.Polygon:
          drawModes.add('polygon');
          break;
        case MapEnum.DrawMode.Polyline:
          drawModes.add('polyline');
          break;
        case MapEnum.DrawMode.Rectangle:
          drawModes.add('rectangle');
          break;
      }
    }
    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: this.getPositionValue(position),
        drawingModes: Array.from(drawModes.values())
      },
      circleOptions: {
        fillOpacity: 0.2,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1
      }
    });
    drawingManager.setMap(map);
    return drawingManager;
  };

  OnMapOverlayComplete(drawingManager: any, mode: MapEnum.DrawMode, callback: (event: any) => any) {
    google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
      switch (mode) {
        case MapEnum.DrawMode.Circle:
          if (event.type == 'circle') {
            callback(event.overlay);
          }
          break;
        case MapEnum.DrawMode.Polygon:
          if (event.type == 'polygon') {
            callback(event.overlay);
          }
          break;
        case MapEnum.DrawMode.Polyline:
          if (event.type == 'polyline') {
            callback(event.overlay);
          }
          break;
        case MapEnum.DrawMode.Rectangle:
          if (event.type == 'rectangle') {
            callback(event.overlay);
          }
          break;
      }
    });
  }

  FitMapToPolygon(map: any, polygon: any) {
    var bounds = new google.maps.LatLngBounds();
    for (let latLng of polygon.latLngs.getArray()[0].getArray()) {
      var ll = this.GetLatLng(latLng.lat(), latLng.lng());
      bounds.extend(ll);
    }
    map.fitBounds(bounds);
  };

  OnDrawingModeChange(drawingManager: any, callback: () => any) {
    google.maps.event.addListener(drawingManager, "drawingmode_changed", callback);
  }

  DrawPolygonOnMap = function (map: any, latLngList: Array<LatLng>, polyLines: any, isFitMap: boolean = true, color: string = '#FF3333', zIndex = 1000) {
    if (latLngList == null)
      return null;
    var bounds = new google.maps.LatLngBounds();
    if (!polyLines)
      polyLines = [];

    var poly = [];
    latLngList.forEach((LatLng) => {
      var ll = this.GetLatLng(LatLng.Latitude, LatLng.Longitude);
      poly.push(ll);
      bounds.extend(ll);
    });
    var polyObj = new google.maps.Polyline({
      path: poly,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    polyObj.setMap(map);
    polyLines.push(polyObj);


    if (isFitMap)
      map.fitBounds(bounds);

    return polyLines;
  };

  ClearPolygons(draws) {
    if (draws != null) {
      draws.forEach(shape => {
        this.ClearPolygon(shape);
      });
    }
    draws = [];
    return draws;
  };

  ClearPolygon(polygon) {
    if (polygon != null)
      polygon.setMap(null);
  };

  // Map Drawing Management Ends

  // Fusion table layer addition begin

  LoadFusionTableLayer(map: any, fusionTableId: string, geometryFieldName: string): any {
    var layer = new google.maps.FusionTablesLayer({
      query: {
        select: geometryFieldName,
        from: fusionTableId
      }
    });
    layer.setMap(map);
    return layer;
  }

  StyleFusionLayer(layer: any, polygonOptions: PolygonStyleOption, polylineOptions: PolygonStyleOption): any {
    let style: Array<any> = new Array<any>();
    let styleObj: any = {};
    if (polygonOptions) {
      styleObj.polygonOptions = polygonOptions;
    }
    if (polylineOptions) {
      styleObj.polylineOptions = polylineOptions;
    }
    style.push(styleObj);
    layer.set('styles', style);
    return layer;
  }

  ShowFusionTableLayer(map: any, layer: any): any {
    layer.setMap(map);
    return layer;
  }

  HideFusionTableLayer(map: any, layer: any): any {
    layer.setMap(null);
    return layer;
  }

  // Fusion table layer addition end

  private animatedMapMovement(map, latitude, longitude, totalSteps, currentStep) {
    if (totalSteps == currentStep)
      return false;
    var center = this.GetCenter(map);
    var LatDiff = latitude - center.Latitude;
    var LngDiff = longitude - center.Longitude;
    LatDiff = LatDiff / totalSteps;
    LngDiff = LngDiff / totalSteps;
    center.Latitude += LatDiff;
    center.Longitude += LngDiff;
    setTimeout(() => {
      map.panTo(this.GetLatLng(center.Latitude, center.Longitude));
      currentStep++;
      this.animatedMapMovement(map, latitude, longitude, totalSteps, currentStep);
    }, 60);
  };

  // Draw polygon with latitude and longitude points

  DrawPoly(map, latlggArray) {
    var latlng = [];
    latlggArray.forEach(loc => {
      latlng.push(new google.maps.LatLng(loc.lat, loc.lng));
    });
    let mapPoly = new google.maps.Polygon({
      paths: latlggArray,
      strokeColor: '#D94825',
      strokeOpacity: 0.8,
      strokeWeight: 5,
      fillOpacity: 0.2,
      editable: true
    });
    mapPoly.setMap(map);

    return mapPoly;
  }

  // Draw circle with latitude and longitude points

  DrawCircle(map, latLng, radius) {

    var circle = new google.maps.Circle({
      strokeColor: '#D94825',
      strokeWeight: 5,
      fillOpacity: 0.2,
      map: map,
      center: latLng,
      radius: radius,
      editable: true
    });

    return circle;

  }

  DrawPolygon(map, drawingMode) {
    var drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: false,
      drawingControlOptions: {
        //  position: this.getPositionValue(position),
        drawingModes: drawingMode
      },

      polygonOptions: {
        fillOpacity: 0.2,
        strokeColor: '#D94825',
        strokeWeight: 5,
        zIndex: 1,
        editable:true
      },
      circleOptions: {
        fillOpacity: 0.2,
        strokeWeight: 5,
        strokeColor: '#D94825',
        clickable: false,
        editable: true,
        zIndex: 1
      }
    });
    drawingManager.setMap(map);
    if (drawingMode == 'polygon')
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    else if (drawingMode == 'circle')
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.CIRCLE);
    return drawingManager;
  }

}
