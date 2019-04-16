import { ApiBaseService } from './api-base.service';
import { Injectable } from '@angular/core';
import { SelectOption, SpecificUse } from '../models/SelectOption';



@Injectable()

export class LookupService extends ApiBaseService {
  GetPropertyTypeList(): Array<SelectOption> {
    let propertyTypes: Array<SelectOption> = new Array<SelectOption>();

    let type = new SelectOption();
    type.Id = 3;
    type.IsSelected = false;
    type.Name = 'Industrial';
    propertyTypes.push(type);

    type = new SelectOption();
    type.Id = 5;
    type.IsSelected = false;
    type.Name = 'Office';
    propertyTypes.push(type);

    type = new SelectOption();
    type.Id = 2;
    type.IsSelected = false;
    type.Name = 'Retail';
    propertyTypes.push(type);

    type = new SelectOption();
    type.Id = 4;
    type.IsSelected = false;
    type.Name = 'Multi-Dwelling';
    propertyTypes.push(type);

    type = new SelectOption();
    type.Id = 7;
    type.IsSelected = false;
    type.Name = 'Land';
    propertyTypes.push(type);


    // type = new SelectOption();
    // type.Id = 6;
    // type.IsSelected = false;
    // type.Name = 'Hospitality';
    // propertyTypes.push(type);

    // type = new SelectOption();
    // type.Id = 7;
    // type.IsSelected = false;
    // type.Name = 'Speciality';
    // propertyTypes.push(type);

    return propertyTypes;
  }


  GetSpecificUseListList(): Array<SpecificUse> {
    let specificUse: Array<SpecificUse> = new Array<SpecificUse>();

    let type = new SpecificUse();
    type.SpecificUseId = 1;
    type.SpecificUseName = "General Purpose";
    type.PropertyTypeId = 2;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 2;
    type.SpecificUseName = "Strata";
    type.PropertyTypeId = 2;
    type.IsSelected = false;
    specificUse.push(type);


    type = new SpecificUse();
    type.SpecificUseId = 3;
    type.SpecificUseName = "Creative/Loft";
    type.PropertyTypeId = 2;
    type.IsSelected = false;
    specificUse.push(type);


    type = new SpecificUse();
    type.SpecificUseId = 4;
    type.SpecificUseName = "Government";
    type.PropertyTypeId = 2;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 5;
    type.SpecificUseName = "Medical";
    type.PropertyTypeId = 2;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 6;
    type.SpecificUseName = "Light Industrial";
    type.PropertyTypeId = 1;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 7;
    type.SpecificUseName = "Heavy Manufacturing";
    type.PropertyTypeId = 1;
    type.IsSelected = false;
    specificUse.push(type);


    type = new SpecificUse();
    type.SpecificUseId = 8;
    type.SpecificUseName = "Flex R&D";
    type.PropertyTypeId = 1;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 9;
    type.SpecificUseName = "Incubator";
    type.PropertyTypeId = 1;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 10;
    type.SpecificUseName = "Truck Terminal";
    type.PropertyTypeId = 1;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 11;
    type.SpecificUseName = "Warehouse - Bulk";
    type.PropertyTypeId = 1;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 12;
    type.SpecificUseName = "Warehouse - Distribution";
    type.PropertyTypeId = 1;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 13;
    type.SpecificUseName = "Warehouse - Freezer/Cooler";
    type.PropertyTypeId = 1;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 14;
    type.SpecificUseName = "Warehouse - Underground";
    type.PropertyTypeId = 1;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 15;
    type.SpecificUseName = "Anchored Strip Center";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 16;
    type.SpecificUseName = "Automotive";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 17;
    type.SpecificUseName = "Community Center";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 18;
    type.SpecificUseName = "Convenience/Strip Center";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 19;
    type.SpecificUseName = "Fashion Speciality Center";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 20;
    type.SpecificUseName = "Freestanding - Bank";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 21;
    type.SpecificUseName = "Freestanding - Big Box";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 22;
    type.SpecificUseName = "Freestanding - Other";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 23;
    type.SpecificUseName = "Gas Station/Convenience Store";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 24;
    type.SpecificUseName = "General/Street Retail";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 25;
    type.SpecificUseName = "Life Style Center";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);


    type = new SpecificUse();
    type.SpecificUseId = 26;
    type.SpecificUseName = "Neighbourhood Center";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);


    type = new SpecificUse();
    type.SpecificUseId = 27;
    type.SpecificUseName = "Outlet Center";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);


    type = new SpecificUse();
    type.SpecificUseId = 28;
    type.SpecificUseName = "Power Center";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);


    type = new SpecificUse();
    type.SpecificUseId = 29;
    type.SpecificUseName = "Regional Center";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);


    type = new SpecificUse();
    type.SpecificUseId = 30;
    type.SpecificUseName = "Restaurant - Fast Food";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 31;
    type.SpecificUseName = "Restaurant - Full Service";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);


    type = new SpecificUse();
    type.SpecificUseId = 32;
    type.SpecificUseName = "Super Regional Center";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);

    type = new SpecificUse();
    type.SpecificUseId = 33;
    type.SpecificUseName = "Theme/Festival Center";
    type.PropertyTypeId = 3;
    type.IsSelected = false;
    specificUse.push(type);




    return specificUse;

  }

  public GetAllPropertyType() {
    const response = this.httpGet(this._serviceURL + 'lookup/propertyType');
    return response;
  }

  public GetAllSpecificUse() {
    const response = this.httpGet(this._serviceURL + 'lookup/specificUse');
    return response;
  }

  public CitySearch(searchText, countryId) {
    const response = this.httpGet(this._serviceURL + 'lookup/citySearch/' + searchText + '/' + countryId);
    return response;
  }

  public ZipCodeSearch(searchText, countryId) {
    const response = this.httpGet(this._serviceURL + 'lookup/zipSearch/' + searchText + '/' + countryId);
    return response;
  }
  public getLeaseRateType() {
    const response = this.httpGet(this._serviceURL + 'LookUp/leaseType');
    return response;
  }

  public getBuildingClass() {
    const response = this.httpGet(this._serviceURL + 'LookUp/classType');
    return response;
  }

  public getAllTenancy() {
    const response = this.httpGet(this._serviceURL + 'LookUp/tenancy');
    return response;
  }

  public getAllCompany(companyInfo) {
    const response = this.httpPost(this._serviceURL + '/LookUp/ecrecompany', companyInfo);
    return response;
  }

  public SearchCompanyList(term: string, entityId: number) {
    const data = { CompanyId: null, SearchId: term, EntityId: entityId };
    const response = this.httpPost(this._serviceURL + '/LookUp/ecrecompany', JSON.stringify(data));
    return response;
  }

  public getCompanyAgents(companyId) {
    const response = this.httpGet(this._serviceURL + '/LookUp/company/agent/' + companyId + '/' + null);
    return response;
  }

  public GetAllConstructStatus() {
    const response = this.httpGet(this._serviceURL + 'lookup/constructStatus');
    return response;
  }

  public GetListingType() {
    const response = this.httpGet(this._serviceURL + 'lookup/listingType');
    return response;
  }

  public GetSpaceType() {
    return this.httpGet(this._serviceURL + 'lookup/spaceType');
  }

  public GetPossessionType() {
    return this.httpGet(this._serviceURL + 'lookup/possessionType');
  }
  public GetAllListingStatus(listingType: number = 0) {
    const response = this.httpGet(this._serviceURL + 'lookup/listingStatus/' + listingType);
    return response;
  }
  public GetSaleConditions() {
    const response = this.httpGet(this._serviceURL + 'lookup/SaleConditionsGetAll');
    return response;
  }
  public GetSaleType() {
    const response = this.httpGet(this._serviceURL + 'lookup/saleTypes');
    return response;
  }

  public GetLeaseContactCompany(searchText, contactTypeId) {        
    const response = this.httpGet(this._serviceURL + 'lookup/leaseContactCompany/' + searchText + '/' + contactTypeId);
    return response;    
  }
  public GetSaleSellerContactCompany(searchText) {        
    const response = this.httpGet(this._serviceURL + 'lookup/saleSellerCompany/' + searchText);
    return response;    
  }
  public GetSaleBuyerContactCompany(searchText) {        
    const response = this.httpGet(this._serviceURL + 'lookup/saleBuyerCompany/' + searchText);
    return response;    
  }
}
