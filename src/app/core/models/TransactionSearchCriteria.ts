import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class TransactionSearchCriteria {

  public PropertyType: string;
  public ListingType: string;
  public MetroId: number;
  public CountryId: number;
  public CouncilId: number;
  public SubMarketId: number;
  public CityId: string;
  public NeighbourhoodId: number;
  public ZipCode: string;
  public buyer: string;
  public seller: string;
  public SpecificUseId: string;
  public SalePriceMin: number;
  public SalePriceMax: number;
  public AskingPriceMin: number;
  public AskingPriceMax: number;
  public SoldSFMin: number;
  public SoldSFMax: number;
  public PolygonText: string;
  public CentreLatitude: number;
  public CentreLongitude: number;
  public CircleRadius: number;
  public StartingIndex: number;
  public OffsetValue: number;
  public SortBy: string;
  public SortDirection: string;
  public IsMapSearch: boolean;
  public LatlngArray: any;
  public Contacts: string;
  public SaleDateMin: string;
  public SaleDateMax: string;
  public SaleDateMinFormat: NgbDateStruct;
  public SaleDateMaxFormat: NgbDateStruct;
  public PercentageOccupiedMin: string;
  public PercentageOccupiedMax: string;
  public citySearchText: string;
  public zipcodeSearchText: string;
  public NetOperatingIncomeMin : number;
  public NetOperatingIncomeMax : number;
  public SaleType : string;
  public SaleCondition:string;
  public CapRateMin : number;
  public CapRateMax : number;
  public SWLat:number;
  public SWLng:number;
  public NELat:number;
  public NELng:number;
  
}

