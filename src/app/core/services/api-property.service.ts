import { Injectable } from '@angular/core';
import { ApiBaseService } from './api-base.service';
import { Property } from '../models/Property';
import { SelectOption } from '../models/SelectOption';
import { Observable } from 'rxjs/Rx';
import { EnumCountry } from '../enumerations/country';

@Injectable()
export class PropertyService extends ApiBaseService {

    public GetDataFromJSON(url): Observable<any> {

        const response = this.getJSON(url);
        return response;

    }

    public GetPropertyDetailsById(id): any {
        return this.httpGet(this._serviceURL + 'property/propertyDetails/' + id);
    }

    public GetRecentProperties(): any {
        return this.httpGet(this._serviceURL + 'property/recentProperties/');
    }

    public GetRecentPropertiesStatistics(): any {
        return this.httpGet(this._serviceURL + 'property/recentPropertiesStatistics/');
    }

    public GetRecentPropertiesAdded(): any {
        return this.httpGet(this._serviceURL + 'property/recentPropertiesAdded/');
    }

    public GetRecentPropertiesMyListing(): any {
        return this.httpGet(this._serviceURL + 'property/recentPropertiesMyListing/');
    }

    public getListingsByPropertyId(property_Id): any {
        return this.httpGet(this._serviceURL + 'listing/ListingDetails/' + property_Id);
    }

    public getRecentMarketActivityCounts(range): any {
        return this.httpGet(this._serviceURL + 'property/dashboardListing/' + range, null, false);
    }

    public getSpaceBreakDown(loggedInUserId): any {
        return this.httpGet(this._serviceURL + 'property/spaceBreakDown/' + loggedInUserId);
    }

    public getListingByListingId(listing_Id): any {
        return this.httpGet(this._serviceURL + 'listing/ListingsbyListingId/' + listing_Id);
    }

    public GetContactsByPropertyId(property_Id): any {
        return this.httpGet(this._serviceURL + '/property/contacts/' + property_Id);
    }

    public GetAllPropertyMediaByPropertyId(property_Id): any {
        return this.httpGet(this._serviceURL + 'media/getAllPropMedia/' + property_Id)
    }

    public GetProperties(url, data) {
        return this.httpPost(url, data);
    }

    public GetDetailsByPropertyId(list, id): any {
        var obj = this.findObjectByKey(list, 'PropertyId', id);
        return obj;
    }



    public GetPropertiesOnCircle(propertyList, centerLat: number, centerLng: number, radius: number, generalUses: SelectOption[]): Array<Property> {
        let response: Array<Property> = new Array<Property>();
        // let properties = this.GetPropertyList();

        // let properties=this._sharedDataService.allProperties;
        let properties = propertyList;
        for (let property of properties) {
            if (this.isInArea(centerLat, centerLng, radius, property) && this.IsPropertyInSelectedGeneralUse(property, generalUses)) {
                response.push(property);
            }
        }

        return response;
    }

    public GetPropertiesOnPolygon(propertyList, latlngArray: any, generalUses: SelectOption[]): Array<Property> {
        let response: Array<Property> = new Array<Property>();
        //   let properties = this.GetPropertyList();
        //let properties = this._sharedDataService.allProperties;
        let properties = propertyList;
        let inside = false;
        for (let property of properties) {
            inside = false;
            let x = property.Latitude, y = property.Longitude;
            for (let i = 0, j = latlngArray.length - 1; i < latlngArray.length; j = i++) {
                let xi = latlngArray[i].lat(), yi = latlngArray[i].lng();
                let xj = latlngArray[j].lat(), yj = latlngArray[j].lng();

                let intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) {
                    inside = !inside;
                }
            }
            if (inside && this.IsPropertyInSelectedGeneralUse(property, generalUses)) {
                response.push(property);
            }
        }

        return response;
    }

    public SearchProperties(propList: Array<Property>, searchText: string, generalUses: SelectOption[]): Array<Property> {
        let response: Array<Property> = new Array<Property>();
        //   let properties = this.GetPropertyList();

        let properties = propList;

        for (let property of properties) {
            let isPropertyFound = false;
            if (!!searchText) {
                if (property.PropertyName.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1) {
                    isPropertyFound = true;
                } else if (property.Address.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1) {
                    isPropertyFound = true;
                } else if (property.City.toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) > -1) {
                    isPropertyFound = true;
                } else if (property.PropertyId.toString() == searchText) {
                    isPropertyFound = true;
                }
            } else {
                isPropertyFound = true;
            }
            if (isPropertyFound && this.IsPropertyInSelectedGeneralUse(property, generalUses)) {
                response.push(property);
            }
        }
        return response;
    }

    public findObjectByKey(array, key, value) {

        for (var i = 0; i < array.length; i++) {
            if (array[i][key] == value) {
                return array[i];
            }
        }
        return null;
    }

    public GetPropertiesInSelectedGeneralUses(properties: Array<Property>, generalUses: SelectOption[]): Array<Property> {
        let response: Array<Property> = new Array<Property>();
        for (let property of properties) {
            if (this.IsPropertyInSelectedGeneralUse(property, generalUses)) {
                response.push(property);
            }
        }
        return response;
    }

    private IsPropertyInSelectedGeneralUse(property: Property, generalUses: SelectOption[]): boolean {
        let checkedGeneralUses: Array<string> = new Array<string>();
        for (let generaluse of generalUses) {
            if (generaluse.IsSelected) {
                checkedGeneralUses.push(generaluse.Name);
            }
        }
        if (checkedGeneralUses.length == 0) {
            return true;
        } else if (checkedGeneralUses.indexOf(property.GeneralUse) > -1) {
            return true;
        }
        return false;
    }

    private isInArea(centerLat: number, centerLng: number, radius: number, property: Property) {
        var R = 6371;
        var lat1 = property.Latitude;
        var lon1 = property.Longitude;
        var lat2 = centerLat;
        var lon2 = centerLng;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return (d * 1000 <= radius)
    };

    public propertySearch(userdata: any) {
        const response = this.httpPost(this._serviceURL + 'property/search/', JSON.stringify(userdata), true);
        return response;
    }

    public convertUnit(countryId, from, to, value) {

        if (countryId === EnumCountry.Australia) {
            if (from === 'SF' && to === 'SqM') {
                // tslint:disable-next-line:curly
                if (value)
                    value = value * 0.092903;

            } else if (from === 'SqM' && to === 'SF') {
                // tslint:disable-next-line:curly
                if (value)
                    value = value / 0.092903;
            } else if (from === 'ft' && to === 'M') {
                // tslint:disable-next-line:curly
                if (value)
                    value = value / 0.3048;
            } else if (from === 'M' && to === 'ft') {
                // tslint:disable-next-line:curly
                if (value)
                    value = value * 0.3048;
            } else if (from === 'HA' && to === 'SF') {
                if (value)
                    value = value * 107639;
            } else if (from === 'SF' && to === 'HA') {
                if (value)
                    value = value / 107639;
            }
            return value;
        }
    }



    public GetParcelDetailsByPropertyId(id): any {
        return this.httpGet(this._serviceURL + 'property/propertyParcelDetails/' + id);
    }

    public getListingAgentsByListingId(id): any {
        return this.httpGet(this._serviceURL + 'listing/Agents/' + id);
    }

    public getTenantsByPropertyId(id): any {
        return this.httpGet(this._serviceURL + 'property/tenants/' + id);
    }
    public getTenantDetailsBySuiteId(id): any {
        return this.httpGet(this._serviceURL + 'tenant/detail/' + id);
    }

    public getListingAgentsByPropertyId(id): any {
        return this.httpGet(this._serviceURL + 'property/listingAgents/' + id);
    }


    public getAgentsByCompanyId(id): any {
        return this.httpGet(this._serviceURL + 'contacts/branch/agents/' + id);
    }


    public getMediaByRelation(relationshipId, Id): any {
        return this.httpGet(this._serviceURL + 'media/getAllMediaRelation/' + relationshipId + '/' + Id);
    }

    public getSaleTransactionsByPropertyId(PropertyId): any {
        let data = { RelationID: PropertyId, RelationType: 'Property' }
        return this.httpPost(this._serviceURL + 'property/saleTransactions/', data);
    }
    public getSaleTransactionBySaleId(id): any {
        return this.httpGet(this._serviceURL + 'property/saleCompDetails/' + id);
    }

    public getSaleListingMedia(relationshipId, listingId): any {
        return this.httpGet(this._serviceURL + 'media/getAllMediaRelation/' + relationshipId + '/' + listingId);
    }
    public getTenantMatrixGetByPropertyID(propertyID: any, entityId: any) {
        const idrequest = { PropertyID: propertyID, LoginEntityID: entityId };
        const response = this.httpPost(this._serviceURL + 'property/TenantMatrix/', JSON.stringify(idrequest));
        return response;
    }

    public getTenantMatrixGetDetailsByID(branchID: any, entityId: any) {
        const idrequest = { BranchID: branchID, LoginEntityID: entityId };
        const response = this.httpPost(this._serviceURL + 'property/TenantMatrixDetails/', JSON.stringify(idrequest));
        return response;
    }

    public getTenantMatrixNonVerifiedGetDetailsByID(branchID:any, entityId:any) {
        const idrequest = { BranchID: branchID, LoginEntityID:entityId };
        const response = this.httpPost(this._serviceURL + 'property/tenantmatrixdetailsnonverified/', JSON.stringify(idrequest));
        return response;
        }


    public getTenantMatrixNonVerifedGetByPropertyID(propertyID: any, entityId: any, isSingleProvider: number) {
        const idrequest = { PropertyID: propertyID, LoginEntityID: entityId, IsSingleProvider: isSingleProvider };
        const response = this.httpPost(this._serviceURL + 'property/nonverifiedtenantmatrix/', JSON.stringify(idrequest));
        return response;
    }

    public saveTenantDetails(tenantJSON: any, changeLogJSON: string, entityId: any) {
        const tenantrequest = { TenantJSON: tenantJSON, ChangeLogJSON: changeLogJSON, LoginEntityID: entityId };
        const response = this.httpPost(this._serviceURL + 'tenant/savedetails/', JSON.stringify(tenantrequest));
        return response;
    }

    public getLeaseTransactionsByPropertyId(data:any,entityId:any): any {
        const bound = { data: data, LoginEntityID: entityId };
        return this.httpPost(this._serviceURL + 'property/leaseTransactions/',JSON.stringify(bound));
    }
    public GetMyListing(LoginEntityID:any): any {
        return this.httpPost(this._serviceURL + 'property/myListing/', JSON.stringify({LoginEntityID :LoginEntityID}));

    }
}
