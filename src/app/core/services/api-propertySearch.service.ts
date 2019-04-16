import { Injectable } from '@angular/core';
import { ApiBaseService } from './api-base.service';
import { Property } from '../models/Property';

@Injectable()
export class PropertySearchService extends ApiBaseService {

public PropertySearch(allPropertyList,checkedValues,SearchList):any{
let propertyList: Array<Property>;
var propertyList_temp;
propertyList=new Array<Property>();

    if(checkedValues && checkedValues.length > 0){
    checkedValues.forEach(childObj=> {
      propertyList_temp = allPropertyList.filter(property => property.GeneralUse ===childObj )
      propertyList = propertyList.concat(propertyList_temp);
   })
  }
  else {propertyList = allPropertyList}


  if(SearchList.ListingType == 'lease_sale')
  {
    propertyList = propertyList.filter(property => property.ListingType === 'lease' || property.ListingType === 'sale')
  }
  else if(SearchList.ListingType == '' || SearchList.ListingType == undefined){
    propertyList = propertyList;

  }
  else{
    propertyList = propertyList.filter(property => property.ListingType == SearchList.ListingType)
  }
  SearchList.MinAvailableSpace =SearchList.MinAvailableSpace!=null ?SearchList.MinAvailableSpace : 0;
  propertyList = propertyList.filter(property => property.GrossBuildingArea >= SearchList.MinAvailableSpace)
    
  if(SearchList.MaxAvailableSpace!=null && SearchList.MaxAvailableSpace!=undefined  && SearchList.MaxAvailableSpace!="" )
  propertyList = propertyList.filter(property => property.GrossBuildingArea <= SearchList.MaxAvailableSpace)

  SearchList.MinLeaseRate =SearchList.MinLeaseRate!=null ?SearchList.MinLeaseRate : 0;
  propertyList = propertyList.filter(property => property.LeaseRate >= SearchList.MinLeaseRate)


if(SearchList.MaxLeaseRate!=null && SearchList.MaxLeaseRate!=undefined  && SearchList.MaxLeaseRate!="" )
  propertyList = propertyList.filter(property => property.LeaseRate <= SearchList.MaxLeaseRate)

  SearchList.MinBuildingSize =SearchList.MinBuildingSize!=null ?SearchList.MinBuildingSize : 0;
  propertyList = propertyList.filter(property => property.BuildingSize >= SearchList.MinBuildingSize)

  if(SearchList.MaxBuildingSize!=null && SearchList.MaxBuildingSize!=undefined  && SearchList.MaxBuildingSize!="" )
  propertyList = propertyList.filter(property => property.BuildingSize <= SearchList.MaxBuildingSize)


 SearchList.MinSalePrice =SearchList.MinSalePrice!=null ?SearchList.MinSalePrice : 0;
  propertyList = propertyList.filter(property => property.SalePrice >= SearchList.MinSalePrice)

  if(SearchList.MaxSalePrice!=null && SearchList.MaxSalePrice!=undefined  && SearchList.MaxSalePrice!="" )
  propertyList = propertyList.filter(property => property.SalePrice <= SearchList.MaxSalePrice)

if(SearchList.ExcludeNegotiableRate == '' || SearchList.ExcludeNegotiableRate == undefined){
    propertyList = propertyList;

  }
  else{
    propertyList = propertyList.filter(property => property.ExcludeNegotiableRate == SearchList.ExcludeNegotiableRate)
  }

  if(SearchList.Tenancy == '' || SearchList.Tenancy == undefined){
    propertyList = propertyList;

  }
  else{
    propertyList = propertyList.filter(property => property.Tenancy == SearchList.Tenancy)
  }

   if(SearchList.TermType == '' || SearchList.TermType == undefined){
    propertyList = propertyList;

  }
  else{
    propertyList = propertyList.filter(property => property.TermType == SearchList.TermType)
  }

  if(SearchList.ConstructionStatus == '' || SearchList.ConstructionStatus == undefined){
    propertyList = propertyList;

  }
  else{
    propertyList = propertyList.filter(property => property.ConstructionStatus == SearchList.ConstructionStatus)
  }

  SearchList.MinOccupancyPercent =SearchList.MinOccupancyPercent!=null ?SearchList.MinOccupancyPercent : 0;
  propertyList = propertyList.filter(property => property.OccupancyPercent >= SearchList.MinOccupancyPercent)

  if(SearchList.MaxOccupancyPercent!=null && SearchList.MaxOccupancyPercent!=undefined  && SearchList.MaxOccupancyPercent!="" )
  propertyList = propertyList.filter(property => property.OccupancyPercent <= SearchList.MaxOccupancyPercent)


if(SearchList.MinDateAvailable!=null && SearchList.MinDateAvailable !=undefined &&  SearchList.MinDateAvailable!="")
propertyList = propertyList.filter(property => this.parseDate(property.DateAvailable) >= this.parseDate(SearchList.MinDateAvailable))

if(SearchList.MaxDateAvailable!=null && SearchList.MaxDateAvailable !=undefined &&  SearchList.MaxDateAvailable!="")
propertyList = propertyList.filter(property => this.parseDate(property.DateAvailable) <= this.parseDate(SearchList.MaxDateAvailable))
 

// SearchList.MinDateAvailable =SearchList.MinDateAvailable!=null ?SearchList.MinDateAvailable : 0;
//    propertyList = propertyList.filter(property => property.DateAvailable >= SearchList.MinDateAvailable)

//   if(SearchList.MaxDateAvailable!=null && SearchList.MaxDateAvailable!=undefined  && SearchList.MaxDateAvailable!="" )
//    propertyList = propertyList.filter(property => property.DateAvailable <= SearchList.MaxDateAvailable)


return propertyList;

}
parseDate(dateString: string): Date {

    if (dateString) {
        return new Date(dateString);
    } else {
        return null;
    }
} 
}