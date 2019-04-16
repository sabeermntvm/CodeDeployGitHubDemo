
const apiRootUrl = 'http://api.intrepidcre.com/rest/service/';
const propertyRoot = apiRootUrl + 'property/';


 export class APIConstants {
    public static get GET_PROPERTY_BY_ID(): string { return propertyRoot + 'details/'; };
  }