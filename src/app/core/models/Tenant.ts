import { Broker } from "./Broker";


export class Tenant {


    TenantId: number;
    TenantName: string;
    Street: string;
    City: string;
    State: string;
    ZipCode: string;
    Url: string;
    Phone: string;
    StarRating: string;
    SuiteNumber: string;
    OccupiedSF: number;
    TotalEmployees: number;
    LocalEmployees: Number;
    TotalSF: number;
    PercentageOfBuildings: number;
    IsOwnerOwned: boolean;
    EstimatedMoveInDate: Date;
    EstimatedTimeAtLocation: string;
    NAICS: string;
    SIC: number;
    Industry: string;
    Headquaters: string;
    ImageUrl: string;
    Type: string;
    CompanyName: string;
    TenantStatus: string;
    FloorNumber: number;

    Contacts: Broker[];
    PropertyId: any;
    Floor: any;
    Website: any;

}