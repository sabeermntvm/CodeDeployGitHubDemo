import { Injectable } from '@angular/core';
import { ApiBaseService } from './api-base.service';
import { Tenant } from '../models/Tenant';
import { Broker } from '../models/Broker';

@Injectable()
export class TenantService extends ApiBaseService {
    public GetTenants = function (): Tenant[] {
        const tenants: Tenant[] = new Array<Tenant>();
        const tenant: Tenant = new Tenant();
        tenant.TenantId = 1;
        tenant.TenantName = 'ABC Company';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '(214) 123-4567';
        tenant.Url = 'www.abc.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '12:30pm';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 3500;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '12';
        tenant.TotalEmployees = 45;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Legal Firm';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '10/1/2017';
        tenant.ImageUrl = 'assets/images/Property.png';

        let buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'billjones@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-346-7643';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'fredjonson@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-346-7643';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);
        return tenants;
    }


    public GetTenantsSearchResult = function (): Tenant[] {
        const tenants: Tenant[] = new Array<Tenant>();

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 1;
        tenant.TenantName = 'Lithium Technologies';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '555-346-7643';
        tenant.Url = 'www.Lithium.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '31 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 3456;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '24';
        tenant.TotalEmployees = 27;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Legal Firm';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '10/1/2017';
        tenant.ImageUrl = 'assets/images/Property.png';

        const buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'billjones@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-346-7643';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.FloorNumber = 2;
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'fredjonson@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-346-7643';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 2;
        tenant.TenantName = 'Corpoate Services Ltd';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '678-486-8833';
        tenant.Url = 'www.Corpoate.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '43 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 6;
        tenant.OccupiedSF = 1125;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '26';
        tenant.TotalEmployees = 45;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Utilities';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '1/9/2017';
        tenant.ImageUrl = 'assets/images/Property.png';

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'jones@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '678-486-8833';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'jonson@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '678-486-8833';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 2;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 3;
        tenant.TenantName = 'Draxin Trust';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '458-621-9797';
        tenant.Url = 'www.Draxin.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '8 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 4500;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '20';
        tenant.TotalEmployees = 13;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Manufacturing';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '9/8/2017';
        tenant.ImageUrl = 'assets/images/Property.png';

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'bill@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '458-621-9797';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'fred@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '458-621-9797';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 2;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 4;
        tenant.TenantName = 'Clearwater';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '555-678-5463';
        tenant.Url = 'www.Clearwater.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '23 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 15000;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '30';
        tenant.TotalEmployees = 75;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Construction';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '3/31/2017';
        tenant.ImageUrl = 'assets/images/Property.png';

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'sam@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-678-5463';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'john@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-678-5463';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 3;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 5;
        tenant.TenantName = 'Energy Stars';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '555-754-9812';
        tenant.Url = 'www.Energy.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '12 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 3278;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '48';
        tenant.TotalEmployees = 17;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Legal Firm';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '12/13/2017';
        tenant.ImageUrl = 'assets/images/Property.png';

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'jack@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-754-9812';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'michal@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-754-9812';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 4;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 6;
        tenant.TenantName = 'Blue Wavves';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '555-489-5783';
        tenant.Url = 'www.Blue.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '60 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 2127;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '46';
        tenant.TotalEmployees = 8;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Manufacturing';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '10/1/2017';
        tenant.ImageUrl = 'assets/images/Property.png';

        // let buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'samual@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-489-5783';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'federic@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-489-5783';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 4;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 7;
        tenant.TenantName = 'Panxoast Traders';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '678-379-4546';
        tenant.Url = 'www.Panxoast.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '45 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 1543;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '42';
        tenant.TotalEmployees = 12;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Legal Firm';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '1/1/2018';
        tenant.ImageUrl = 'assets/images/Property.png';

        // let buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'jacob@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '678-379-4546';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'dani@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '678-379-4546';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 4;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 8;
        tenant.TenantName = 'Pasywiff Partners';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '678-486-8839';
        tenant.Url = 'www.Pasywiff.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '52 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 6433;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '55';
        tenant.TotalEmployees = 28;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Construction';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '2/2/2018';
        tenant.ImageUrl = 'assets/images/Property.png';

        // let buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'danial@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '678-486-8839';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'decruse@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '678-486-8839';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 5;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 9;
        tenant.TenantName = 'Lightstone Advances';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '555-999-5783';
        tenant.Url = 'www.Lightstone.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '2 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 2899;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '53';
        tenant.TotalEmployees = 33;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Manufacturing';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '1/11/2017';
        tenant.ImageUrl = 'assets/images/Property.png';

        // let buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'johnsamuel@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-999-5783';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'laven@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-999-5783';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 5;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 10;
        tenant.TenantName = 'WPAX';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '555-678-5436';
        tenant.Url = 'www.WPAX.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '7 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 7500;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '62';
        tenant.TotalEmployees = 41;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Construction';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '1/1/2018';
        tenant.ImageUrl = 'assets/images/Property.png';

        // let buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'sara@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-678-5436';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'sarajohnson@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-678-5436';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 6;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 11;
        tenant.TenantName = 'Swissmatch';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '678-766-8839';
        tenant.Url = 'www.Swissmatch.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '34 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 7500;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '64';
        tenant.TotalEmployees = 86;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Legal Firm';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '10/1/2017';
        tenant.ImageUrl = 'assets/images/Property.png';

        // let buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'tom@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '678-766-8839';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'jerry@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '678-766-8839';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 6;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 12;
        tenant.TenantName = 'Lionshark Investments';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '554-897-9878';
        tenant.Url = 'www.Lionshark.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '19 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 15000;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '70';
        tenant.TotalEmployees = 67;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Manufacturing';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '10/1/2017';
        tenant.ImageUrl = 'assets/images/Property.png';

        // let buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'jimmy@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '554-897-9878';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'dongly@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '554-897-9878';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 7;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 13;
        tenant.TenantName = 'Zentree Wealth Mgmt';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '555-754-9662';
        tenant.Url = 'www.Zentree.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '4 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 15000;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '80';
        tenant.TotalEmployees = 132;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Legal Firm';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '1/9/2018';
        tenant.ImageUrl = 'assets/images/Property.png';

        // let buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'anna@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-754-9662';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'anie@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-754-9662';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 8;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);

        var tenant: Tenant = new Tenant();
        tenant.TenantId = 14;
        tenant.TenantName = 'Lee Foundations';
        tenant.Street = '7509 Crestwood Blvd';
        tenant.City = 'Birmingham';
        tenant.State = 'AL';
        tenant.ZipCode = '35210';
        tenant.Phone = '555-766-9885';
        tenant.Url = 'www.Lee.com';
        tenant.EstimatedMoveInDate = new Date(2017, 5, 4);
        tenant.EstimatedTimeAtLocation = '37 Months';
        tenant.Headquaters = 'Birmingham, AL';
        tenant.Industry = 'Aaron';
        tenant.IsOwnerOwned = false;
        tenant.LocalEmployees = 200;
        tenant.OccupiedSF = 15000;
        tenant.PercentageOfBuildings = 55;
        tenant.StarRating = '3 star';
        tenant.SuiteNumber = '101';
        tenant.TotalEmployees = 75;
        tenant.TotalSF = 3500;
        tenant.SIC = 7372;
        tenant.NAICS = 'Construction';
        tenant.TenantStatus = 'Move In';
        tenant.CompanyName = 'CBRE';
        tenant.Type = '10/1/2017';
        tenant.ImageUrl = 'assets/images/Property.png';

        // let buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'abc@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-766-9885';
        buyerBroker.BrokerName = 'Cal Brokers';
        tenant.Contacts = new Array<Broker>();
        tenant.Contacts.push(buyerBroker);

        // buyerBroker = new Broker();
        buyerBroker.BrokerAddress = 'cdf@gmail.com';
        buyerBroker.BrokerCompany = 'Manager';
        buyerBroker.BrokerPhone = '555-766-9885';
        buyerBroker.BrokerName = 'California Real Estates';
        tenant.FloorNumber = 10;
        tenant.Contacts.push(buyerBroker);

        tenants.push(tenant);
        return tenants;
    }


    public tenantSearch(userdata: any) {

        const response = this.httpPost(this._serviceURL + 'tenant/search/', JSON.stringify(userdata), true);
        return response;
    }

    public getTenantByPropertyID(propertyID: any, entityID:any) {

        let data ={PropertyID:propertyID, LoginEntityID:entityID};

        const response = this.httpPost(this._serviceURL + 'tenant/propertytenant/', JSON.stringify(data), true);
        return response;
    }

    public getTenantDetails(tenantID: any, tenantStageID:any, entityID:any) {
        let data ={TenantID:tenantID, TenantStageID:tenantStageID, LoginEntityID:entityID};
        const response = this.httpPost(this._serviceURL + 'tenant/tenantdetails/', JSON.stringify(data), true);
        return response;
    }


    public getSICCodes() {
        const response = this.httpGet(this._serviceURL + 'lookup/SICCode/');
        return response;
    }

}
