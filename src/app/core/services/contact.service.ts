import { Injectable } from '@angular/core';
import { ApiBaseService } from './api-base.service';
import { Contact } from '../models/Contact';
import { TenantBranch } from '../models/tenantBranch';


@Injectable()
export class ContactService extends ApiBaseService {

    public GetContacts = function (): Contact[] {

        let contactList = new Array<Contact>();

        let contact = new Contact();
        contact.ContactType = "True Owner";
        contact.CompanyName = "Kauffman Organization";
        contact.ContactName = "Steven J Kauffman";
        contact.Street = "450 7th Ave";
        contact.City = "New York";
        contact.State = "NY";
        contact.Zip = "10023";
        contact.PhoneNo = "212-739-7053";
        contact.Fax = "212-999-5555";
        contact.Email='stevenjkauffman@kauffman.com';
        contact.Website='http://www.kauffmanorganization.com/';

        contactList.push(contact);


        contact = new Contact();

        contact.ContactType = "Recorded Owner";
        contact.CompanyName = "Frost Bank LLC";
        contact.ContactName = "John Dempsey";
        contact.Street = "401 Congress Ave";
        contact.City = "Austin";
        contact.State = "TX";
        contact.Zip = "555-435-7890";
        contact.PhoneNo = "";
        contact.Fax = "";
       


        contactList.push(contact);


        contact = new Contact();


        contact.ContactType = "Leasing Agent 1";
        contact.CompanyName = "CBRE";
        contact.ContactName = "Mike Dowd";
        contact.Street = "500 W 2nd St"
        contact.City = "Austin";
        contact.State = "TX";
        contact.Zip = "78701";
        contact.PhoneNo = "555-435-7890";
        contact.Fax = "";
        contact.Email='mikedowd@cbre.com';
        contact.Website='www.cbre.com';
      



        contactList.push(contact);


        contact = new Contact();

        contact.ContactType = "Leasing Agent 2";
        contact.CompanyName = "CBRE";
        contact.ContactName = "Sally Jones";
        contact.Street = "500 W 2nd St";
        contact.City = "Austin";
        contact.State = "TX";
        contact.Zip = "78701";
        contact.PhoneNo = "555-435-6548";
        contact.Fax = "234-789-1212";
        contact.Email='sallyjones@cbre.com';
        contact.Website='www.cbre.com';
       
        contactList.push(contact);


        contact = new Contact();

        contact.ContactType = "Subleasing Agent";
        contact.CompanyName = "Texas Partners";
        contact.ContactName = "Sam Samson";
        contact.Street = "232 E 50th St";
        contact.City = "Austin";
        contact.State = "TX";
        contact.Zip = "78701";
        contact.PhoneNo = "234-789-1111";;
        contact.Fax = "234-789-1212";
        contact.Email='ssamson@txpartners.com';
        contact.Website='www.txpartners.com';


        contactList.push(contact);


        contact = new Contact();

        contact.ContactType = "Property Manager";
        contact.CompanyName = "Kaffman Organization";
        contact.ContactName = "Sam Stein";
        contact.Street = "401 Congress Ave";
        contact.City = "Austin";
        contact.State = "TX";
        contact.Zip = "78701";
        contact.PhoneNo = "321-456-9876";
        contact.Fax = "";
        contact.Email='samstein@kauffman.com';
        contact.Website='www.kaffmanorganization.com';

        contactList.push(contact);
        return contactList;
    }

    public getLoggedInCompanyDetailsById(contactId): any {
      return this.httpGet(this._serviceURL + 'contacts/company/' + contactId) 
    }

    public GetAgentById(EntityId:number){
        const response = this.httpGet(this._serviceURL +'contacts/agentdetails/'+ EntityId);
        return response;
    }
    //tenant search
    public GetTenantSearchList(tenant:TenantBranch) {
        const response = this.httpPost(this._serviceURL + 'contacts/tenants', JSON.stringify(tenant));
        return response;
    }

}