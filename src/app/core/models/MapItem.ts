export class MapItem{
    public MapPins : Array<any>;
    public DrawingOptions : any;
    public InfoWindow: any;
    public Polygons: Array<any>;
    constructor(){
        this.MapPins = new Array<any>();
        this.Polygons = new Array<any>();
    }
}