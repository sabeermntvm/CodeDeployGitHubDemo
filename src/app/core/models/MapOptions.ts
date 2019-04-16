import * as MapEnum from './MapEnum';

export class MapOptions {
    public MapType: MapEnum.MapType;
    public MapId: string;
    public ZoomLevel: number;
    public MinZoom: number;
    public MaxZoom: number;
    public CenterLat: number;
    public CenterLng: number;
    public IsMapTypeChangable: boolean;
    public IsDraggable: boolean;
    public FullscreenControl: boolean;
    public RequireCtrlToZoom: boolean;
    public FeaturesToHide: Array<MapEnum.MapFeatures>;
    public  StreetViewControl: boolean;
    constructor(mapId: string) {
        this.MapId = mapId;
        this.MapType = MapEnum.MapType.Roadmap;
        this.ZoomLevel = 5;
        this.CenterLat = 32.7568257;
        this.CenterLng = -97.0215761;
        this.IsMapTypeChangable = false;
        this.IsDraggable = true;
        this.FullscreenControl = true;
        this.RequireCtrlToZoom = true;
        this.FeaturesToHide = new Array<MapEnum.MapFeatures>();
        this.StreetViewControl = true;
    }

    SetAllOptions = function (mapType: MapEnum.MapType, zoomLevel: number, minZoom: number, maxZoom: number, centerLat: number, centerLng: number, isDraggable: boolean, isMapTypeChangable: boolean): void {
        this.MapType = mapType;
        this.ZoomLevel = zoomLevel;
        this.MinZoom = minZoom;
        this.MaxZoom = maxZoom;
        this.CenterLat = centerLat;
        this.CenterLng = centerLng;
        this.IsMapTypeChangable = isMapTypeChangable;
        this.IsDraggable = isDraggable;
    }

    SetBasicOptions = function (mapType: MapEnum.MapType, zoomLevel: number, minZoom: number, maxZoom: number, centerLat: number, centerLng: number): void {
        this.MapType = mapType;
        this.ZoomLevel = zoomLevel;
        this.MinZoom = minZoom;
        this.MaxZoom = maxZoom;
        this.CenterLat = centerLat;
        this.CenterLng = centerLng;
    }

}


// import * as MapEnum from './MapEnum';
// import { MapService } from 'app/modules/map-module/service/map-service.service';
// import { MapType } from './MapEnum';

// export class MapOptions {
//     public MapType: MapEnum.MapType;
//     public MapId: string;
//     public ZoomLevel: number;
//     public MinZoom: number;
//     public MaxZoom: number;
//     public CenterLat: number;
//     public CenterLng: number;
//     public IsMapTypeChangable: boolean;
//     public IsDraggable: boolean;
//     public FullscreenControl: boolean;
//     public RequireCtrlToZoom: boolean;
//     public FeaturesToHide: Array<MapEnum.MapFeatures>;

//     private _mapService: MapService = new MapService();

//   constructor(mapId: string) {
//         this.MapId = mapId;
//         this.MapType = MapEnum.MapType.Roadmap;
//         this.ZoomLevel = 5;
//         this.CenterLat = 32.7568257;
//         this.CenterLng = -97.0215761;
//         this.IsMapTypeChangable = false;
//         this.IsDraggable = true;
//         this.FullscreenControl = true;
//         this.RequireCtrlToZoom = true;
//         this.FeaturesToHide = new Array<MapEnum.MapFeatures>();
//     }
//     SetAllOptions = function (mapType: MapEnum.MapType, zoomLevel: number, minZoom: number, maxZoom: number, centerLat: number, centerLng: number, isDraggable: boolean, isMapTypeChangable: boolean): void {
//         this.MapType = mapType;
//         this.ZoomLevel = zoomLevel;
//         this.MinZoom = minZoom;
//         this.MaxZoom = maxZoom;
//         this.CenterLat = centerLat;
//         this.CenterLng = centerLng;
//         this.IsMapTypeChangable = isMapTypeChangable;
//         this.IsDraggable = isDraggable;
//     }

//     SetBasicOptions = function (mapType: MapEnum.MapType, zoomLevel: number, minZoom: number, maxZoom: number, centerLat: number, centerLng: number): void {
//         this.MapType = mapType;
//         this.ZoomLevel = zoomLevel;
//         this.MinZoom = minZoom;
//         this.MaxZoom = maxZoom;
//         this.CenterLat = centerLat;
//         this.CenterLng = centerLng;
//     }

//     GenerateMapOptionsForGoogle(): any {
//         let result: any = {};
//         result.center = this._mapService.GetLatLng(this.CenterLat, this.CenterLng);
//         result.draggable = this.IsDraggable;
//         if (this.FullscreenControl != null){
//             result.fullscreenControl = this.FullscreenControl;
//         }
//         result.mapTypeId = this._mapService.GetMapTypeId(this.MapType);
//         result.zoom = this.ZoomLevel;
//         result.maxZoom = this.MaxZoom;
//         result.minZoom = this.MinZoom;
//         if(!this.RequireCtrlToZoom){
//             result.gestureHandling = 'greedy';
//         }else{
//             result.gestureHandling = 'cooperative';
//         }
//         return result;
//     }


// }
