//import { NumberSymbol } from "@angular/common/src/i18n/locale_data_api";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";


export class PropertySearchCriteria {

    // GeneralUse: string;
    // SpecificUse: string;
    // ListingType: string;
    // MinAvailableSpace: number;
    // MaxAvailableSpace: number;
    // MinBuildingSize: number;
    // MaxBuildingSize: number;
    // MinLeaseRate: number;
    // MaxLeaseRate: number;
    // MinSalePrice: number;
    // MaxSalePrice: number;
    // MinOccupancyPercent: number;
    // MaxOccupancyPercent: number;
    // MinDateAvailable: string;
    // MaxDateAvailable: string;
    // ExcludeNegotiableRate: string;
    // TermType: string;
    // Tenancy: string;
    // ConstructionStatus: string;

    public PropertyType: string;
    public ListingType: string;
    public MetroId: number;
    public CountryId: number;
    public CompanyId: number;
    public CouncilId: number;
    public SubMarketId: number;
    public CityId: string;
    public NeighbourhoodId: number;
    public ZipCode: string;
    public SpecificUseId: string;
    public BuildingSizeMin: number;
    public BuildingSizeMax: number;

    public BuildingClass: string;
    public Floors: number;
    public YearBuilt: number;
    public PropertyName: string;
    //coma seperated string
    public SelectedAgents: string;
    public StreetMin: string;
    public StreetMax: string;
    public StreetName: string;
    public ParcelNumber: string;
    public TotalAvailableMin: number;
    public TotalAvailableMax: number;
    // public SuiteLevelAvailableMin: number;
    // public SuiteLevelAvailableMax: number;
    public LeaseRateMin: number;
    public LeaseRateMax: number;
    public SalePriceMin: number;
    public SalePriceMax: number;
    public SubLeaseCategory: string;
    public PolygonText: string;
    public CentreLatitude: number;
    public CentreLongitude: number;
    public CircleRadius: number;

    public SuiteLevel: boolean;
    public IsContiguous: boolean;
    public StartingIndex: number;
    public OffsetValue: number;
    public SortParam: string;
    public SortDirection: string;
    public IsMapSearch: boolean;
    public LatlngArray: any;
    public PropertyId: number;
    public SearchValue: string;
    public SalePricePerSFMin: number;
    public SalePricePerSFMax: number;
    public LeaseRateType: string;
    public Tenancy: string;
    public LotSizeSFMin: number;
    public LotSizeSFMax: number;
    public citySearchText: string;
    public zipcodeSearchText:string;

    SWLat:number;
    SWLng:number;
    NELat:number;
    NELng:number;

    public CreatedDateMinFormat : NgbDateStruct;
    public CreatedDateMaxFormat : NgbDateStruct;
    CreatedDateMin:any = null;
    CreatedDateMax:any = null;



}
