import { Injectable } from '@angular/core';
import { Property } from '../models/Property';
import { Listing } from '../models/Listing';
import { PropertyMedia } from '../models/MediaType';
import { PropertySearchCriteria } from '../models/PropertySearchCriteria';
import { Transaction } from '../models/Transaction';
import { Lease } from '../models/Lease';
import { TenantSearchCriteria } from '../models/TenantSearchCriteria';
import { TransactionSearchCriteria } from '../models/TransactionSearchCriteria';
import { ReportInfo } from '../models/ReportInfo';
import { environment } from '../../../environments/environment';
import { LeaseSearchCriteria } from '../models/LeaseSearchCriteria';


@Injectable()
export class SharedDataService {
    private _searchProperties: Array<Property>;
    private _IsGlobalsearch: boolean;
    private _selectedProperties: Array<Property>;
    private _reportDisplayOrder: Array<any>;
    private _allProperties: Array<Property>;
    private _listings: Array<Listing>;
    private _mediaList: Array<PropertyMedia>;
    private _propertyTypeList: any;
    private _companyList: any;
    private _specificuseList: any;
    private _searchCriteria: PropertySearchCriteria;
    private _searchResultCount: number;
    private _searchTransactions: Array<Transaction>;
    private _leaseRateTypeList: any;
    private _transactionSearchCriteria: TransactionSearchCriteria;
    private _transactionSearchResultCount: number;
    private _searchTransactionMap: Array<Transaction>;
    private _tenantSearchCriteria: TenantSearchCriteria;
    private _tenantSearchResultCount: number;
    private _tenantSearchResult: Array<any>;
    private _buildingClassList: Array<any>;
    private _tenancyList: Array<any>;
    private _selectedReportList: Array<ReportInfo>;
    private _selectedReportSortList: Array<ReportInfo>;
    private _selectedReportProperties: Array<Property>;
    private _selectedPropertListingDetails: Array<Property>;
    private _saleConditions:Array<any>;
    private _saleTypes:Array<any>;

    private _searchLeaseTransactionList: Array<Lease>;
    private _leaseSearchCriteria: LeaseSearchCriteria;
    private _leaseSearchResultCount: number;
    private _searchLeaseTransactionMap:  Array<Lease>;
    private _selectedPropertyPin : any;
    private _selectedPropertyDetails:any;
    private _selectedTenantPin : any;
    private _tenantmultidataset:any;
    private _tenantsingledataset:any;
    private _IsSinglePin: boolean;
    private _leasemultidataset:any;
    private _leasesingledataset:any;
    private _selectedLeasePin : any;
    private _selectedSalePin : any;
    private _salemultidataset:any;
    private _salesingledataset:any;
    private _searchCriteriaMapPin : any;
    private _PropertyID:number;
    private _leaseInfo:any;
    private _leaseInfoMulti : any;

    private _branchIdData : number;
    private _TenantStageIdData : number;
    constructor() {
    }


    get IsGlobalsearch(): boolean {
        return this._IsGlobalsearch;
    }
    set IsGlobalsearch(val: boolean) {
        this._IsGlobalsearch = val;
    }


    get searchProperties(): Array<Property> {
        if (this._searchProperties == null || this._searchProperties.length <= 0) {
            this._searchProperties = JSON.parse(localStorage.getItem('PropertySearchResult'))
        }
        return this._searchProperties;
    }
    set searchProperties(propertyList: Array<Property>) {
        this._searchProperties = propertyList;
        localStorage.setItem('PropertySearchResult', JSON.stringify(propertyList));
    }

    get selectedProperties(): Array<Property> {

        if (this._selectedProperties == null || this._selectedProperties.length <= 0) {
            this.searchProperties.forEach(prop => {
                if (prop.isSelected)
                    this._selectedProperties.push(prop);
            });
        }

        return this._selectedProperties;
    }
    set selectedProperties(propertyList: Array<Property>) {
        this._selectedProperties = propertyList;
    }

    get reportDisplayOrder(): Array<any> {
        return this._reportDisplayOrder;
    }
    set reportDisplayOrder(reportOrderList: Array<any>) {
        this._reportDisplayOrder = reportOrderList;
    }

    get selectedPropertyPin(): any {
        return this._selectedPropertyPin;
    }
    set selectedPropertyPin(selectedProperty: any) {
        this._selectedPropertyPin = selectedProperty;
    }

    get allProperties(): Array<Property> {
        return this._allProperties;
    }
    set allProperties(propertyList: Array<Property>) {
        this._allProperties = propertyList;
    }

    get propertyListings(): Array<Listing> {
        return this._listings;
    }
    set propertyListings(listings: Array<Listing>) {
        this._listings = listings;
    }

    get mediaList(): Array<PropertyMedia> {
        return this._mediaList;
    }
    set mediaList(media: Array<PropertyMedia>) {
        this._mediaList = media;
        this.mediaList.forEach(value => {
            value.Path = `${environment.MediaS3Base}` + `${environment.MediaS3Path}` + "/" + value.PropertyID + "/" + value.Path;
        });
    }

    get propertyTypes(): any {
        return this._propertyTypeList;
    }
    set propertyTypes(propertyTypeList: any) {
        this._propertyTypeList = propertyTypeList;
    }

    get companies(): any {
        return this._companyList;
    }
    set companies(companyList: any) {
        this._companyList = companyList;
    }

    get specificUses(): any {
        return this._specificuseList;
    }
    set specificUses(specificuseList: any) {
        this._specificuseList = specificuseList;
    }

    get searchCriteria(): any {
        if (this._searchCriteria == null) {
          //  this._searchCriteria = JSON.parse(localStorage.getItem('PropertySearchCriteria'))
        }
        return this._searchCriteria;
    }
    set searchCriteria(criteria: any) {
        this._searchCriteria = criteria;
      //  localStorage.setItem('PropertySearchCriteria', JSON.stringify(criteria));
    }

    get searchResultCount(): any {
        if (this._searchResultCount == null) {
         //   this._searchResultCount = JSON.parse(localStorage.getItem('PropertySearchResultCount'))
        }
        return this._searchResultCount;
    }
    set searchResultCount(count: any) {
        this._searchResultCount = count;
       // localStorage.setItem('PropertySearchResultCount', JSON.stringify(count));
    }

    get transactionSearchCriteria(): TransactionSearchCriteria {
        if (this._transactionSearchCriteria == null) {
         //   this._transactionSearchCriteria = JSON.parse(localStorage.getItem('TransactionSearchCriteria'))
        }
        return this._transactionSearchCriteria;
    }

    set transactionSearchCriteria(value: TransactionSearchCriteria) {
        this._transactionSearchCriteria = value;
       // localStorage.setItem('TransactionSearchCriteria', JSON.stringify(value));
    }

    get searchTransactions(): Array<Transaction> {
        if (this._searchTransactions == null) {
          //  this._searchTransactions = JSON.parse(localStorage.getItem('TransactionSearchResult'))
        }
        return this._searchTransactions;
    }

    set searchTransactions(value: Array<Transaction>) {
        this._searchTransactions = value;
        //localStorage.setItem('TransactionSearchResult', JSON.stringify(value));
    }

    get searchTransactionMap(): Array<Transaction> {
        return this._searchTransactionMap;
    }

    set searchTransactionMap(value: Array<Transaction>) {
        this._searchTransactionMap = value;
    }

    get transactionSearchResultCount(): number {
        if (this._transactionSearchResultCount == null) {
         //   this._transactionSearchResultCount = JSON.parse(localStorage.getItem('TransactionSearchResultCount'))
        }
        return this._transactionSearchResultCount;
    }

    set transactionSearchResultCount(value: number) {
        this._transactionSearchResultCount = value;
      //  localStorage.setItem('TransactionSearchResultCount', JSON.stringify(value));
    }

    get leaseRateTypes(): any {
        return this._leaseRateTypeList;
    }
    set leaseRateTypes(leaseRateTypeList: any) {
        this._leaseRateTypeList = leaseRateTypeList;
    }

    get tenantSearchCriteria(): any {

        if (this._tenantSearchCriteria == null) {
         //   this._tenantSearchCriteria = JSON.parse(localStorage.getItem('TenantSearchCriteria'))
        }
        return this._tenantSearchCriteria;
    }
    set tenantSearchCriteria(tenantSearch: any) {
        this._tenantSearchCriteria = tenantSearch;
     //   localStorage.setItem('TenantSearchCriteria', JSON.stringify(tenantSearch));
    }


    get tenantSearchResultCount(): any {
        if (this._tenantSearchResultCount == null) {
          //  this._tenantSearchResultCount = JSON.parse(localStorage.getItem('TenantSearchResultCount'))
        }
        return this._tenantSearchResultCount;
    }
    set tenantSearchResultCount(searchResultCount: any) {
        this._tenantSearchResultCount = searchResultCount;
       // localStorage.setItem('TenantSearchResultCount', JSON.stringify(searchResultCount));
    }

    get tenantSearchResult(): any {

        if (this._tenantSearchResult == null || this._tenantSearchResult.length <= 0) {
            //this._tenantSearchResult = JSON.parse(localStorage.getItem('TenantSearchResult'))
        }
        return this._tenantSearchResult;
    }
    set tenantSearchResult(searchResult: any) {
        this._tenantSearchResult = searchResult;
      //  localStorage.setItem('TenantSearchResult', JSON.stringify(searchResult));
    }

    get buildingClass(): any {
        return this._buildingClassList;
    }
    set buildingClass(buildingClassList: any) {
        this._buildingClassList = buildingClassList;
    }

    get tenancyList(): any {
        return this._tenancyList;
    }
    set tenancyList(tenancy: any) {
        this._tenancyList = tenancy;
    }

    get selectedReportList(): any {
        return this._selectedReportList;
    }
    set selectedReportList(selectedReprot: any) {
        this._selectedReportList = selectedReprot;
    }

    get selectedReportSortList(): any {
        return this._selectedReportSortList;
    }
    set selectedReportSortList(sortList: any) {
        this._selectedReportSortList = sortList;
    }

    get selectedReportProperties(): any {
        return this._selectedReportProperties;
    }
    set selectedReportProperties(sortList: any) {
        this._selectedReportProperties = sortList;
    }
    get selectedPropertListingDetails(): any {
        return this._selectedPropertListingDetails;
    }
    set selectedPropertListingDetails(listing: any) {
        this._selectedPropertListingDetails = listing;
    }
    get saleConditionsList(): any {
        return this._saleConditions;
    }
    set saleConditionsList(saleConditionsLists: any) {
        this._saleConditions = saleConditionsLists;
    }
      get saleTypesList(): any {
        return this._saleTypes;
    }
    set saleTypesList(_saleTypesList: any) {
        this._saleTypes = _saleTypesList;
    }
    get leaseSearchCriteria(): any {
        if (this._leaseSearchCriteria == null) {
         //   this._leaseSearchCriteria = JSON.parse(localStorage.getItem('LeaseSearchCriteria'))
        }
        return this._leaseSearchCriteria;
    }
    set leaseSearchCriteria(leaseSearch: any) {
        this._leaseSearchCriteria = leaseSearch;
      //  localStorage.setItem('LeaseSearchCriteria', JSON.stringify(leaseSearch));
    }
    get leaseSearchResultCount(): any {
        if (this._leaseSearchResultCount == null) {
          //  this._leaseSearchResultCount = JSON.parse(localStorage.getItem('LeaseSearchResultCount'))
        }
        return this._leaseSearchResultCount;
    }
    set leaseSearchResultCount(searchResultCount: any) {
        this._leaseSearchResultCount = searchResultCount;
      //  localStorage.setItem('LeaseSearchResultCount', JSON.stringify(searchResultCount));
    }    
    get searchLeaseTransactionList(): Array<Lease> {
        if (this._searchLeaseTransactionList == null) {
         //   this._searchLeaseTransactionList = JSON.parse(localStorage.getItem('LeaseSearchResultList'))
        }
        return this._searchLeaseTransactionList;
    }
    set searchLeaseTransactionList(value: Array<Lease>) {
        this._searchLeaseTransactionList = value;
       // localStorage.setItem('LeaseSearchResultList', JSON.stringify(value));
    }
    get searchLeaseTransactionMap(): Array<Lease> {
        if (this._searchLeaseTransactionMap == null) {
           // this._searchLeaseTransactionMap = JSON.parse(localStorage.getItem('LeaseMapSearchResults'))
        }
        return this._searchLeaseTransactionMap;
    }
    set searchLeaseTransactionMap(value: Array<Lease>) {
        this._searchLeaseTransactionMap = value;
      //  localStorage.setItem('LeaseMapSearchResults', JSON.stringify(value));
    }

    // get LeaseInfo(): any {
    //     if (this._leaseInfo == null) {
    //         this._leaseInfo = JSON.parse(localStorage.getItem('leaseInfo'))
    //     }
    //     return this._leaseInfo;
    // }
    // set LeaseInfo(leaseInfo:any) {
    //     this._leaseInfo = leaseInfo;
    //     localStorage.setItem('leaseInfo', JSON.stringify(leaseInfo));
    // }
    get PropertyID(): any {
        if (this._PropertyID == null) {
            this._PropertyID = JSON.parse(localStorage.getItem('PropertyID'))
        }
        return this._PropertyID;
    }
    get selectedPropertyDetails(): any {
        return this._selectedPropertyDetails;
    }
    set selectedPropertyDetails(details: any) {
        this._selectedPropertyDetails = details;
    }
    get selectedTenantMultiDetails(): any {
        return this._tenantmultidataset;
    }
    set selectedTenantMultiDetails(details: any) {
        this._tenantmultidataset = details;
    }
    get selectedTenantSingleDetails(): any {
        return this._tenantsingledataset;
    }
    set selectedTenantSingleDetails(details: any) {
        this._tenantsingledataset = details;
    }
    get selectedTenantPin(): any {
        return this._selectedTenantPin;
    }
    set selectedTenantPin(selectedTenant: any) {
        this._selectedTenantPin = selectedTenant;
    }
    get IsSinglePin(): boolean {
        return this._IsSinglePin;
    }
    set IsSinglePin(val: boolean) {
        this._IsSinglePin = val;
    }
    get selectedLeaseMultiDetails(): any {
        return this._leasemultidataset;
    }
    set selectedLeaseMultiDetails(details: any) {
        this._leasemultidataset = details;
    }
    get selectedLeaseSingleDetails(): any {
        return this._leasesingledataset;
    }
    set selectedLeaseSingleDetails(details: any) {
        this._leasesingledataset = details;
    }
    get selectedLeasePin(): any {
        return this._selectedLeasePin;
    }
    set selectedLeasePin(selectedLease: any) {
        this._selectedLeasePin = selectedLease;
    }
    get selectedSaleMultiDetails(): any {
        return this._salemultidataset;
    }
    set selectedSaleMultiDetails(details: any) {
        this._salemultidataset = details;
    }
    get selectedSaleSingleDetails(): any {
        return this._salesingledataset;
    }
    set selectedSaleSingleDetails(details: any) {
        this._salesingledataset = details;
    }
    get selectedSalePin(): any {
        return this._selectedSalePin;
    }
    set selectedSalePin(selectedSale: any) {
        this._selectedSalePin = selectedSale;
    }

    get searchCriteriaMapPin(): any {
        return this._searchCriteriaMapPin;
    }
    set searchCriteriaMapPin(criteria: any) {
        this._searchCriteriaMapPin = criteria;
      //  localStorage.setItem('PropertySearchCriteria', JSON.stringify(criteria));
    }

    get setBranchID(): any {
        return this._branchIdData;
    }
    set setBranchID(id: any) {
        this._branchIdData = id;
    }

    get setTenantStageID(): any {
        return this._TenantStageIdData;
    }
    set setTenantStageID(id: any) {
        this._TenantStageIdData = id;
    }
}
