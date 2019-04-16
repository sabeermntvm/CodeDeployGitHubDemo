export class SuggestionSearchCriteria {
    SortParam: string ;
    SortDirection: string;
    StartingIndex: number;
    OffsetValue: number;
    StartDate: string = null;
    EndDate: string = null;
    TypeFilter: string = null;
    StatusFilter: string = null;
    PropertyIdFilter: number = null;
    SentUserId: number = null;
    IsActive: boolean = false;

}
