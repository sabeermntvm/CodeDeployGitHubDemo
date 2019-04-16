import { Injectable } from '@angular/core';
import { ApiBaseService } from './api-base.service';
import { Transaction } from '../models/Transaction';
import { Broker } from '../models/Broker';

@Injectable()

export class TransactionService extends ApiBaseService
{

    public GetSaleCompGetDetailsById(id): any {
      return this.httpGet(this._serviceURL + 'property/saleCompDetails/' + id);
    }

    public saleTransactionSearch(userdata: any) {
      const response = this.httpPost(this._serviceURL + 'saleTransaction/search/', JSON.stringify(userdata), true);
      return response;
    }
  
    public GetTransactions():Transaction[]
    {
        let transactions = new Array<Transaction>();
        let buyerbrokerList = new Array<Broker>();

        var transaction = new Transaction();
        transaction.AskingRate =1000;
        transaction.BldgPSQFT = 1000;
        transaction.BuyerAddress = "100 NE Pkwy";
        transaction.BuyerName = "John John";
        // transaction.BuyerPhone = 1234567890;
        transaction.CapRate = 1000;
        transaction.DeedFileNumber = 121112;
        transaction.ExpirationDate = '12/23/2022';
        transaction.ListingComments = "Test Comments";
        transaction.ListPrice = '10000';
        transaction.LoanDocNumber = 1000;
        transaction.LotPSQFT = 10000;
        transaction.OccupancyPercentage = 100;
        transaction.OperatingCosts =1000;
        transaction.PricePerSF = '$12.17';
        transaction.OccupancyDate = '1/31/2018';
        transaction.SaleDate ='12-1-2017';
        transaction.SalePrice = '1000';
        transaction.SellerAddress = "100 NE Pkwy";
        transaction.SellerName= "John John";
        // transaction.SellerPhone=1234567890;
        transaction.SFLeased = '1000';
        transaction.SFSold = '1000';
        transaction.SimpleLeaseFee = 1000;
        transaction.SoldSQLFT =1000;
        transaction.SoldSQLFT = 1000;
        transaction.Tenant = "Grand Preview";
        transaction.Term = 10;
        transaction.TransactionComments = "Comments";
        transaction.SignDate = '12/23/2017';
        transaction.TransactionId =1221;
        transaction.Type = 'Sale'
        transaction.RecordedDate = '12/23/2017';
        transaction.ListDate = '12/23/2017';

        let buyerBroker = new Broker();
        buyerBroker.BrokerAddress = "100 NE Pkwy";
        buyerBroker.BrokerCompany = "ABC Company";
        buyerBroker.BrokerPhone= '1234567890';
        buyerBroker.BrokerName = 'Cal Brokers';
        transaction.BuyerBrokers = new Array<Broker>();
        transaction.BuyerBrokers.push(buyerBroker);

        
        var landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers = new Array<Broker>();
        transaction.LandlordBrokers.push(landlordBrokers);

        landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers.push(landlordBrokers);

        var tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "407 Cecil Drive";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers = new Array<Broker>();
        transaction.TenantBrokers.push(tenantBrokers);

        tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "2343 Roe St";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers.push(tenantBrokers);

        transactions.push(transaction);
        



        return transactions;
    }


    public GetSaleTransactions():Transaction[]
    {
        let transactions = new Array<Transaction>();
        let buyerbrokerList = new Array<Broker>();

        var transaction = new Transaction();
        transaction.AskingRate =23424;
        transaction.BldgPSQFT = 23432;
        transaction.BuyerAddress = "4602 W Pkwy";
        transaction.BuyerName = "Adam Joan";
        transaction.BuyerPhone = 1234567890;
        transaction.CapRate = 4.50;
        transaction.DeedFileNumber = 7896;
        // transaction.ExpirationDate = new Date(2022, 12, 23);
        transaction.ListingComments = "Test Comments";
        transaction.ListPrice = '$4,350,000';
        transaction.LoanDocNumber = 311124;
        transaction.LotPSQFT = 34545;
        transaction.OccupancyPercentage = 78;
        transaction.OperatingCosts =234;
        transaction.PricePerSF = '$12.17';
        // transaction.OccupancyDate = new Date(2017, 12, 1);       
        transaction.SalePrice = '$4,200,000';
        transaction.SellerAddress = "100 NE Pkwy";
        transaction.SellerName= "John John";
        transaction.SellerPhone=1234567890;
        transaction.SFLeased = '345,000';
        transaction.SFSold = '345,000'        ;
        transaction.SimpleLeaseFee = 2342;
        transaction.SoldSQLFT =3243;
        transaction.SoldSQLFT = 23423;
        transaction.Tenant = "Grand Preview";
        transaction.Term = 10;
        transaction.TransactionComments = "Comments";
        // transaction.SignDate = new Date(2017, 11, 31);
        transaction.TransactionId =23432;
        transaction.Type = 'Sale'
        transaction.RecordedDate = '12/15/201';
        transaction.ListDate = '5/12/2017';
        transaction.SaleDate = '11/31/2017';

        let buyerBroker = new Broker();
        buyerBroker.BrokerAddress = "4602 E Pkwy";
        buyerBroker.BrokerCompany = "Joan's Company";
        buyerBroker.BrokerPhone= '555-342-6765';
        buyerBroker.BrokerName = 'Cal Brokers';
        buyerBroker.BrokerEmail = 'calbroke@joan.com'
        transaction.BuyerBrokers = new Array<Broker>();
        transaction.BuyerBrokers.push(buyerBroker);

        buyerBroker = new Broker();
        buyerBroker.BrokerAddress = "2343 Blue Walley";
        buyerBroker.BrokerCompany = "ABC Company";
        buyerBroker.BrokerPhone= '555-342-6765';
        buyerBroker.BrokerName = 'California Real Estates';
        buyerBroker.BrokerEmail = 'info@abc.com';
        transaction.BuyerBrokers.push(buyerBroker);


        let sellerBroker = new Broker();
        sellerBroker.BrokerAddress = "7002 Crabapple Ln";
        sellerBroker.BrokerCompany = "Viacommers LLC";
        sellerBroker.BrokerPhone= '555-342-6765';
        sellerBroker.BrokerName = 'Stalin Abra';
        sellerBroker.BrokerEmail = 'sabra@viaconners.com';
        transaction.SellerBrokers = new Array<Broker>();
        transaction.SellerBrokers.push(sellerBroker);

        sellerBroker = new Broker();
        sellerBroker.BrokerAddress = "2343 Roe St";
        sellerBroker.BrokerCompany = "Real Rulers";
        sellerBroker.BrokerPhone= '555-342-6765';
        sellerBroker.BrokerName = 'Cal Real Estates Group';
        sellerBroker.BrokerEmail = 'cal.adam@realrulers.com';
        transaction.SellerBrokers.push(sellerBroker);


        transactions.push(transaction);
        



        return transactions;
    }

    public GetLeaseTransactions():Transaction[]
    {
        let transactions = new Array<Transaction>();
        let buyerbrokerList = new Array<Broker>();

        var transaction = new Transaction();
        transaction.AskingRate = 5.35;
        transaction.BldgPSQFT = 23432;
        transaction.BuyerAddress = "125 NE Adam Pkwy";
        transaction.BuyerName = "Watson's";
        transaction.BuyerPhone = 1234567890;
        transaction.CapRate = 4.50;
        transaction.DeedFileNumber = 121112;
        transaction.ExpirationDate = '12/23/2022';
        transaction.ListingComments = "Test Comments";
        transaction.ListPrice = '4324342';
        transaction.LoanDocNumber = 56342;
        transaction.LotPSQFT = 34545;
        transaction.OccupancyPercentage = 80;
        transaction.OperatingCosts =20456;
        transaction.PricePerSF = '$12.17';
        transaction.OccupancyDate = '1/31/2018';
        transaction.SaleDate ='1-31-2018';
        transaction.SalePrice = '324233';
        transaction.SellerAddress = '56 Avenue';
        transaction.SellerName= 'Michael Andrew';
        transaction.SellerPhone=1234567890;
        transaction.SFLeased = '12,000';
        transaction.SFSold = '2344';
        transaction.SimpleLeaseFee = 2342;
        transaction.SoldSQLFT =3243;
        transaction.SoldSQLFT = 23423;
        transaction.Tenant = 'Watson';
        transaction.Term = 60;
        transaction.TransactionComments = "Comments";
        transaction.SignDate = '12/23/2017';
        transaction.TransactionId =23432;
        transaction.Type = 'Lease'

        transaction.TenantType="Healthgoods";
        transaction.SuiteLeased=101;
        transaction.LeasedSF= '12,000';
        transaction.Floor=1;
        transaction.LeaseRate= 4.75;
        transaction.EffectiveRate=4.65;
        transaction.LeaseRateType="Net";
        transaction.FreeRent= '8 Months';
        transaction.FullFloor="No";
        transaction.TIAllowance=2000;
        transaction.LeaseType="New";
        transaction.LandLordName="City Properties";
        transaction.LandLordAddress="3242 Nale St";
        // transaction.LandLordPhone=1234567890;
        transaction.LandLordEmail="lord@email.com";


        var landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers = new Array<Broker>();
        transaction.LandlordBrokers.push(landlordBrokers);

        landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers.push(landlordBrokers);

        var tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "407 Cecil Drive";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers = new Array<Broker>();
        transaction.TenantBrokers.push(tenantBrokers);

        tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "2343 Roe St";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers.push(tenantBrokers);



        transactions.push(transaction);

        var transaction = new Transaction();
        transaction.AskingRate = 5.35;
        transaction.BldgPSQFT = 23432;
        transaction.BuyerAddress = "125 NE Adam Pkwy";
        transaction.BuyerName = "Watson's";
        transaction.BuyerPhone = 1234567890;
        transaction.CapRate = 4.50;
        transaction.DeedFileNumber = 121112;
        transaction.ExpirationDate = '11/31/2020';
        transaction.ListingComments = "Test Comments";
        transaction.ListPrice = '4324342';
        transaction.LoanDocNumber = 56342;
        transaction.LotPSQFT = 34545;
        transaction.OccupancyPercentage = 80;
        transaction.OperatingCosts =20456;
        transaction.PricePerSF = '$12.17';
        transaction.OccupancyDate = '2/1/2017';
        transaction.SaleDate ='11-31-2017';
        transaction.SalePrice = '324233';
        transaction.SellerAddress = '56 Avenue';
        transaction.SellerName= 'Michael Andrew';
        transaction.SellerPhone=1234567890;
        transaction.SFLeased = '3,000';
        transaction.SFSold = '2344';
        transaction.SimpleLeaseFee = 2342;
        transaction.SoldSQLFT =3243;
        transaction.SoldSQLFT = 23423;
        transaction.Tenant = 'Electro Warehouse';
        transaction.Term = 36;
        transaction.TransactionComments = "Comments";
        transaction.SignDate = '11/31/2017';
        transaction.TransactionId =23432;
        transaction.Type = 'Lease'

        transaction.TenantType="Electronics";
        transaction.SuiteLeased=103;
        transaction.LeasedSF= '3,000';
        transaction.Floor=1;
        transaction.LeaseRate= 5.35;
        transaction.EffectiveRate=5.35;
        transaction.LeaseRateType="Net";
        transaction.FreeRent= 'None';
        transaction.FullFloor="No";
        transaction.TIAllowance=2000;
        transaction.LeaseType="New";
        transaction.LandLordName="City Properties";
        transaction.LandLordAddress="3242 Nale St";
        // transaction.LandLordPhone=1234567890;
        transaction.LandLordEmail="lord@email.com";


        var landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers = new Array<Broker>();
        transaction.LandlordBrokers.push(landlordBrokers);

        landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers.push(landlordBrokers);

        var tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "407 Cecil Drive";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers = new Array<Broker>();
        transaction.TenantBrokers.push(tenantBrokers);

        tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "2343 Roe St";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers.push(tenantBrokers);



        transactions.push(transaction);

        var transaction = new Transaction();
        transaction.AskingRate =9.00;
        transaction.BldgPSQFT = 23432;
        transaction.BuyerAddress = "125 NE Adam Pkwy";
        transaction.BuyerName = "Watson's";
        transaction.BuyerPhone = 1234567890;
        transaction.CapRate = 4.50;
        transaction.DeedFileNumber = 121112;
        transaction.ExpirationDate = '11/15/2024';
        transaction.ListingComments = "Test Comments";
        transaction.ListPrice = '4324342';
        transaction.LoanDocNumber = 56342;
        transaction.LotPSQFT = 34545;
        transaction.OccupancyPercentage = 80;
        transaction.OperatingCosts =20456;
        transaction.PricePerSF = '$12.17';
        transaction.OccupancyDate = '12/1/2017';
        transaction.SaleDate ='11-15-2017';
        transaction.SalePrice = '324233';
        transaction.SellerAddress = '56 Avenue';
        transaction.SellerName= 'Michael Andrew';
        transaction.SellerPhone=1234567890;
        transaction.SFLeased =  '4,500';
        transaction.SFSold = '2344';
        transaction.SimpleLeaseFee = 2342;
        transaction.SoldSQLFT =3243;
        transaction.SoldSQLFT = 23423;
        transaction.Tenant = 'Raffles & Quay';
        transaction.Term = 84;
        transaction.TransactionComments = "Comments";
        transaction.SignDate = '11/15/2017';
        transaction.TransactionId =23432;
        transaction.Type = 'Lease'

        transaction.TenantType="Lawfirm";
        transaction.SuiteLeased=304;
        transaction.LeasedSF= '4,500';
        transaction.Floor=3;
        transaction.LeaseRate= 8.50;
        transaction.EffectiveRate=8.50;
        transaction.LeaseRateType="Net";
        transaction.FreeRent= 'None';
        transaction.FullFloor="No";
        transaction.TIAllowance=2000;
        transaction.LeaseType="New";
        transaction.LandLordName="City Properties";
        transaction.LandLordAddress="3242 Nale St";
        // transaction.LandLordPhone=1234567890;
        transaction.LandLordEmail="lord@email.com";


        var landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers = new Array<Broker>();
        transaction.LandlordBrokers.push(landlordBrokers);

        landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers.push(landlordBrokers);

        var tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "407 Cecil Drive";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        transaction.TenantBrokers = new Array<Broker>();
        transaction.TenantBrokers.push(tenantBrokers);

        tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "2343 Roe St";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';  tenantBrokers.BrokerAddress = "407 Cecil Drive";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers = new Array<Broker>();
        transaction.TenantBrokers.push(tenantBrokers);

        tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "2343 Roe St";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers.push(tenantBrokers);



        transactions.push(transaction);

        

        var transaction = new Transaction();
        transaction.AskingRate =9.00;
        transaction.BldgPSQFT = 23432;
        transaction.BuyerAddress = "125 NE Adam Pkwy";
        transaction.BuyerName = "Watson's";
        transaction.BuyerPhone = 1234567890;
        transaction.CapRate = 4.50;
        transaction.DeedFileNumber = 121112;
        transaction.ExpirationDate = '11/1/2022';
        transaction.ListingComments = "Test Comments";
        transaction.ListPrice = '4324342';
        transaction.LoanDocNumber = 56342;
        transaction.LotPSQFT = 34545;
        transaction.OccupancyPercentage = 80;
        transaction.OperatingCosts =20456;
        transaction.PricePerSF = '$12.17';
        transaction.OccupancyDate = '12/1/2017';
        transaction.SaleDate ='1-1-2017';
        transaction.SalePrice = '324233';
        transaction.SellerAddress = '56 Avenue';
        transaction.SellerName= 'Michael Andrew';
        transaction.SellerPhone=1234567890;
        transaction.SFLeased = '2,350';
        transaction.SFSold = '2344';
        transaction.SimpleLeaseFee = 2342;
        transaction.SoldSQLFT =3243;
        transaction.SoldSQLFT = 23423;
        transaction.Tenant = 'Garuda Air';
        transaction.Term = 36;
        transaction.TransactionComments = "Comments";
        transaction.SignDate = '11/1/2017';
        transaction.TransactionId =23432;
        transaction.Type = 'Lease'

        transaction.TenantType="Travel";
        transaction.SuiteLeased=407;
        transaction.LeasedSF= '2,350';
        transaction.Floor=4;
        transaction.LeaseRate= 7.85;
        transaction.EffectiveRate=7.84;
        transaction.LeaseRateType="Net";
        transaction.FreeRent= '2 Months';
        transaction.FullFloor="No";
        transaction.TIAllowance=2000;
        transaction.LeaseType="Expansion";
        transaction.LandLordName="City Properties";
        transaction.LandLordAddress="3242 Nale St";
        // transaction.LandLordPhone=1234567890;
        transaction.LandLordEmail="lord@email.com";


        var landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers = new Array<Broker>();
        transaction.LandlordBrokers.push(landlordBrokers);

        landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers.push(landlordBrokers);

        var tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "407 Cecil Drive";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers = new Array<Broker>();
        transaction.TenantBrokers.push(tenantBrokers);

        tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "2343 Roe St";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers.push(tenantBrokers);



        transactions.push(transaction);


        var transaction = new Transaction();
        transaction.AskingRate =6.00;
        transaction.BldgPSQFT = 23432;
        transaction.BuyerAddress = "125 NE Adam Pkwy";
        transaction.BuyerName = "Watson's";
        transaction.BuyerPhone = 1234567890;
        transaction.CapRate = 4.5;
        transaction.DeedFileNumber = 121112;
        transaction.ExpirationDate = '11/15/2021';
        transaction.ListingComments = "Test Comments";
        transaction.ListPrice = '4324342';
        transaction.LoanDocNumber = 56342;
        transaction.LotPSQFT = 34545;
        transaction.OccupancyPercentage = 80;
        transaction.OperatingCosts =20456;
        transaction.PricePerSF = '$12.17';
        transaction.OccupancyDate = '11/15/2017';
        transaction.SaleDate ='10-25-2017';
        transaction.SalePrice = '324233';
        transaction.SellerAddress = '56 Avenue';
        transaction.SellerName= 'Michael Andrew';
        transaction.SellerPhone=1234567890;
        transaction.SFLeased = '1,500';
        transaction.SFSold = '2344';
        transaction.SimpleLeaseFee = 2342;
        transaction.SoldSQLFT =3243;
        transaction.SoldSQLFT = 23423;
        transaction.Tenant = 'Top Ramen';
        transaction.Term = 48;
        transaction.TransactionComments = "Comments";
        transaction.SignDate = '10/25/2017';
        transaction.TransactionId =23432;
        transaction.Type = 'Lease'

        transaction.TenantType="Restaurant";
        transaction.SuiteLeased=214;
        transaction.LeasedSF= '1,500';
        transaction.Floor=2;
        transaction.LeaseRate= 5.25;
        transaction.EffectiveRate=5.53;
        transaction.LeaseRateType="Net";
        transaction.FreeRent= '4 Months';
        transaction.FullFloor="No";
        transaction.TIAllowance=2000;
        transaction.LeaseType="New";
        transaction.LandLordName="City Properties";
        transaction.LandLordAddress="3242 Nale St";
        // transaction.LandLordPhone=1234567890;
        transaction.LandLordEmail="lord@email.com";


        var landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers = new Array<Broker>();
        transaction.LandlordBrokers.push(landlordBrokers);

        landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers.push(landlordBrokers);

        var tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "407 Cecil Drive";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers = new Array<Broker>();
        transaction.TenantBrokers.push(tenantBrokers);

        tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "2343 Roe St";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers.push(tenantBrokers);



        transactions.push(transaction);

          
        var transaction = new Transaction();
        transaction.AskingRate =9.00;
        transaction.BldgPSQFT = 23432;
        transaction.BuyerAddress = "125 NE Adam Pkwy";
        transaction.BuyerName = "Watson's";
        transaction.BuyerPhone = 1234567890;
        transaction.CapRate = 4.5;
        transaction.DeedFileNumber = 121112;
        transaction.ExpirationDate = '10/15/2022';
        transaction.ListingComments = "Test Comments";
        transaction.ListPrice = '4324342';
        transaction.LoanDocNumber = 56342;
        transaction.LotPSQFT = 34545;
        transaction.OccupancyPercentage = 80;
        transaction.OperatingCosts =20456;
        transaction.PricePerSF = '$12.17';
        transaction.OccupancyDate = '12/1/2017';
        transaction.SaleDate ='10-15-2017';
        transaction.SalePrice = '324233';
        transaction.SellerAddress = '56 Avenue';
        transaction.SellerName= 'Michael Andrew';
        transaction.SellerPhone=1234567890;
        transaction.SFLeased = '15,000';
        transaction.SFSold = '2344';
        transaction.SimpleLeaseFee = 2342;
        transaction.SoldSQLFT =3243;
        transaction.SoldSQLFT = 23423;
        transaction.Tenant = 'Eiffel Tech';
        transaction.Term = 48;
        transaction.TransactionComments = "Comments";
        transaction.SignDate = '10/152017';
        transaction.TransactionId =23432;
        transaction.Type = 'Lease'

        transaction.TenantType="Technology Services";
        transaction.SuiteLeased=601;
        transaction.LeasedSF= '15,000';
        transaction.Floor=6;
        transaction.LeaseRate= 8.00;
        transaction.EffectiveRate=8.00;
        transaction.LeaseRateType="Net";
        transaction.FreeRent= 'None';
        transaction.FullFloor="Yes";
        transaction.TIAllowance=2000;
        transaction.LeaseType="Renewal";
        transaction.LandLordName="City Properties";
        transaction.LandLordAddress="3242 Nale St";
        // transaction.LandLordPhone=1234567890;
        transaction.LandLordEmail="lord@email.com";


        var landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers = new Array<Broker>();
        transaction.LandlordBrokers.push(landlordBrokers);

        landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers.push(landlordBrokers);

        var tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "407 Cecil Drive";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers = new Array<Broker>();
        transaction.TenantBrokers.push(tenantBrokers);

        tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "2343 Roe St";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers.push(tenantBrokers);



        transactions.push(transaction);

        var transaction = new Transaction();
        transaction.AskingRate =5.15;
        transaction.BldgPSQFT = 23432;
        transaction.BuyerAddress = "125 NE Adam Pkwy";
        transaction.BuyerName = "Watson's";
        transaction.BuyerPhone = 1234567890;
        transaction.CapRate = 4.5;
        transaction.DeedFileNumber = 121112;
        transaction.ExpirationDate = '';
        transaction.ListingComments = "Test Comments";
        transaction.ListPrice = '4324342';
        transaction.LoanDocNumber = 56342;
        transaction.LotPSQFT = 34545;
        transaction.OccupancyPercentage = 80;
        transaction.OperatingCosts =20456;
        transaction.PricePerSF = '$12.17';
        transaction.OccupancyDate = '12/1/2017';
        transaction.SaleDate ='10-1-2017';
        transaction.SalePrice = '324233';
        transaction.SellerAddress = '56 Avenue';
        transaction.SellerName= 'Michael Andrew';
        transaction.SellerPhone=1234567890;
        transaction.SFLeased = '3,500';
        transaction.SFSold = '2344';
        transaction.SimpleLeaseFee = 2342;
        transaction.SoldSQLFT =3243;
        transaction.SoldSQLFT = 23423;
        transaction.Tenant = 'Urgent Care';
        transaction.Term = 48;
        transaction.TransactionComments = "Comments";
        transaction.SignDate = '10/1/2017';
        transaction.TransactionId =23432;
        transaction.Type = 'Lease'

        transaction.TenantType="Healthcare";
        transaction.SuiteLeased=415;
        transaction.LeasedSF= '3,500';
        transaction.Floor=4;
        transaction.LeaseRate= 5.00;
        transaction.EffectiveRate=4.85;
        transaction.LeaseRateType="Net";
        transaction.FreeRent= '7 Months ';
        transaction.FullFloor="No";
        transaction.TIAllowance=2000;
        transaction.LeaseType="New";
        transaction.LandLordName="City Properties";
        transaction.LandLordAddress="3242 Nale St";
        // transaction.LandLordPhone=1234567890;
        transaction.LandLordEmail="lord@email.com";


        var landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers = new Array<Broker>();
        transaction.LandlordBrokers.push(landlordBrokers);

        landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers.push(landlordBrokers);

        var tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "407 Cecil Drive";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers = new Array<Broker>();
        transaction.TenantBrokers.push(tenantBrokers);

        tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "2343 Roe St";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers.push(tenantBrokers);



        transactions.push(transaction);

        var transaction = new Transaction();
        transaction.AskingRate =5.00;
        transaction.BldgPSQFT = 23432;
        transaction.BuyerAddress = "125 NE Adam Pkwy";
        transaction.BuyerName = "Watson's";
        transaction.BuyerPhone = 1234567890;
        transaction.CapRate = 4.5;
        transaction.DeedFileNumber = 121112;
        transaction.ExpirationDate = '9/31/2027';
        transaction.ListingComments = "Test Comments";
        transaction.ListPrice = '4324342';
        transaction.LoanDocNumber = 56342;
        transaction.LotPSQFT = 34545;
        transaction.OccupancyPercentage = 80;
        transaction.OperatingCosts =20456;
        transaction.PricePerSF = '$12.17';
        transaction.OccupancyDate = '1/31/2018';
        transaction.SaleDate ='12-31-2017';
        transaction.SalePrice = '324233';
        transaction.SellerAddress = '56 Avenue';
        transaction.SellerName= 'Michael Andrew';
        transaction.SellerPhone=1234567890;
        transaction.SFLeased = '5,050';
        transaction.SFSold = '2344';
        transaction.SimpleLeaseFee = 2342;
        transaction.SoldSQLFT =3243;
        transaction.SoldSQLFT = 23423;
        transaction.Tenant = 'SitBank';
        transaction.Term = 120;
        transaction.TransactionComments = "Comments";
        transaction.SignDate = '9/31/17';
        transaction.TransactionId =23432;
        transaction.Type = 'Lease'

        transaction.TenantType="Financial";
        transaction.SuiteLeased=822;
        transaction.LeasedSF= '5,050';
        transaction.Floor=8;
        transaction.LeaseRate= 3.75;
        transaction.EffectiveRate=3.75;
        transaction.LeaseRateType="Net";
        transaction.FreeRent= 'None ';
        transaction.FullFloor="No";
        transaction.TIAllowance=2000;
        transaction.LeaseType="New";
        transaction.LandLordName="City Properties";
        transaction.LandLordAddress="3242 Nale St";
        // transaction.LandLordPhone=1234567890;
        transaction.LandLordEmail="lord@email.com";


        var landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers = new Array<Broker>();
        transaction.LandlordBrokers.push(landlordBrokers);

        landlordBrokers = new Broker();
        landlordBrokers.BrokerAddress = "3121 Blue Parkway";
        landlordBrokers.BrokerCompany = "Agency CRE";
        landlordBrokers.BrokerPhone= '555-342-6765';
        landlordBrokers.BrokerName = 'John Adams';
        landlordBrokers.BrokerEmail = 'johnadams@newagebrokers.com';
        transaction.LandlordBrokers.push(landlordBrokers);

        var tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "407 Cecil Drive";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers = new Array<Broker>();
        transaction.TenantBrokers.push(tenantBrokers);

        tenantBrokers = new Broker();
        tenantBrokers.BrokerAddress = "2343 Roe St";
        tenantBrokers.BrokerCompany = "Tenant Direct";
        tenantBrokers.BrokerPhone= '555-739-3057';
        tenantBrokers.BrokerName = 'Steve McDaniels';
        tenantBrokers.BrokerEmail = 'steve.mcdaniels@tenantdirect.com';
        transaction.TenantBrokers.push(tenantBrokers);



        transactions.push(transaction);




        return transactions;
    }
    public GetLeaseCompGetDetailsById(id): any {
        return this.httpGet(this._serviceURL + 'property/leaseCompDetails/' + id);
      }

      
      public LeaseTransactionSearch(userdata: any) {
        const response = this.httpPost(this._serviceURL + 'leaseTransaction/searchCRE/', JSON.stringify(userdata), true);
        return response;
      }
}
