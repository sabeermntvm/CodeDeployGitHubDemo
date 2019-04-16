import { Component, OnInit,Input } from '@angular/core';
import { PropertyService } from '../../core/services/api-property.service';
import { PagerService } from '../../core/services/pager.service';
import { CommunicationModel, CommunicationService } from '../../core/services/communication.service';
import { LoginService } from '../../core/services/login.service';

@Component({
  selector: 'app-propertytenant',
  templateUrl: './propertytenant.component.html',
  styleUrls: ['./propertytenant.component.css']
})
export class PropertytenantComponent implements OnInit {

  @Input() propertyId;

  
  evCompanyList : Array<any> = [];
  evproviderTenants:Array<any> = [];
  evorginalProviderData:any;
  evpager: any = {};
  evCount:any;

  nevmCompanyList : Array<any> = [];
  nevmproviderTenants:Array<any> = [];
  nevmorginalProviderData:any;
  nevmpager: any = {};
  nevmCount: any;

  nevsCompanyList : Array<any> = [];
  nevsproviderTenants:Array<any> = [];
  nevsorginalProviderData:any;
  nevspager: any = {};
  nevsCount:  any;

  numbers:any;
  IsLoaded:boolean = false;
  loginEntityID: number;
  branchID : number = 0;
  branchName: string = "";
  tier:number;
  tenantView:number=0;

  tenantLoaderdata1: boolean = true;
  tenantLoaderdata2: boolean = true;
  tenantLoaderdata3: boolean = true;

  constructor(private _propertyService : PropertyService
    , private _loginService: LoginService, public communicationService: CommunicationService,private pagerService: PagerService) { 
    this.loginEntityID = this._loginService.UserInfo.EntityID;

    

/*     this.route.params.subscribe(params => {
      
     
      
    }); */
  }

  ngOnInit() {
    //this.propertyId = params['id'];
    this.evCompanyList= [];
    this.evproviderTenants= [];
    this.evorginalProviderData= [];
    this.evpager= {};
    this.evCount= 0;

    this.nevmCompanyList = [];
    this.nevmproviderTenants =[];
    this.nevmorginalProviderData=[];
    this.nevmpager = {};
    this.nevmCount=0;
  
    this.nevsCompanyList = [];
    this.nevsproviderTenants = [];
    this.nevsorginalProviderData = [];
    this.nevspager = {};
    this.nevsCount=0;
    this.tenantView = 1;

    this.GetTenantMatrixGetByPropertyID();
    this.GetTenantMatrixNonVerifiedMultipleGetByPropertyID(); 
    this.GetTenantMatrixNonVerifiedSingleGetByPropertyID();
  }
  close(){    
   this.tenantView = 1;
  }

  reloadView = function (status: number) {
    this.tenantView = status;
  }
  branchView(branchId : number, branchName: string, tier:number){
    let communicationModel: CommunicationModel = new CommunicationModel();
    communicationModel.Key = 'CompanyBranch';
    communicationModel.data = branchId;
    this.communicationService.broadcast(communicationModel);
    this.branchID = branchId;
    this.branchName = branchName;
    this.tier = tier;
    this.reloadView(2);

  }
    

  GetTenantMatrixGetByPropertyID(){
    const response_details = this._propertyService.getTenantMatrixGetByPropertyID(this.propertyId, this.loginEntityID);
      response_details.subscribe(result => {
        let data = JSON.parse(result['_body']);
        if (data) {
          this.evCompanyList = data.responseData[0];
          this.tenantLoaderdata1 = false;
          let ProviderList = data.responseData[1];
          let ProviderDetailDataList = data.responseData[2]; 
          this.evproviderTenants.push({Title:"Company Name", VerifiedList:this.evCompanyList});
          ProviderList.forEach(provider=>{
            let providerVerifed:Array<any>=[];  
            this.evCompanyList.forEach(company=>{
              let cpd = ProviderDetailDataList.find(x=>x.BranchID == company.BranchID && x.ProviderID == provider.ProviderID);
              if(cpd && cpd.HasVerified)
              providerVerifed.push(cpd.HasVerified);
              else
              providerVerifed.push(0);
            });
            this.evproviderTenants.push({Title:provider.DisplayText, VerifiedList:providerVerifed});
          });   
          
          this.evorginalProviderData = JSON.parse(JSON.stringify(this.evproviderTenants)); 

          this.evpager = this.pagerService.getPager(this.evCompanyList.length, 1, 10);
          this.evproviderTenants.forEach(x=>{
            x.VerifiedList = x.VerifiedList.slice(this.evpager.startIndex, this.evpager.endIndex + 1)
            this.evCount=Array(x.VerifiedList.length).fill(0).map((x,i)=>i);
          });
      }
    });
  }


  GetTenantMatrixNonVerifiedMultipleGetByPropertyID(){
    const response_details = this._propertyService.getTenantMatrixNonVerifedGetByPropertyID(this.propertyId, this.loginEntityID,0);
      response_details.subscribe(result => {
        let data = JSON.parse(result['_body']);
        if (data) {
          this.nevmCompanyList = data.responseData[0];
          this.tenantLoaderdata2 = false;
          let ProviderList = data.responseData[1];
          let ProviderDetailDataList = data.responseData[2];  
          this.nevmproviderTenants.push({Title:"Company Name", VerifiedList:this.nevmCompanyList});
            ProviderList.forEach(provider=>{
            let providerVerifed:Array<any>=[];  
            this.nevmCompanyList.forEach(company=>{
              let cpd = ProviderDetailDataList.find(x=>x.Tenant_Stage_Id == company.TenantID && x.ProviderID == provider.ProviderID);
              if(cpd && cpd.HasVerified)
              providerVerifed.push(cpd.HasVerified);
              else
              providerVerifed.push(0);
            });
            this.nevmproviderTenants.push({Title:provider.DisplayText, VerifiedList:providerVerifed});
          });   
          
          this.nevmorginalProviderData = JSON.parse(JSON.stringify(this.nevmproviderTenants)); 

          this.nevmpager = this.pagerService.getPager(this.nevmCompanyList.length, 1, 10);
          this.nevmproviderTenants.forEach(x=>{
            x.VerifiedList = x.VerifiedList.slice(this.nevmpager.startIndex, this.nevmpager.endIndex + 1);
            this.nevmCount=Array(x.VerifiedList.length).fill(0).map((x,i)=>i);
          });
      }
    });
  }

  GetTenantMatrixNonVerifiedSingleGetByPropertyID(){
    const response_details = this._propertyService.getTenantMatrixNonVerifedGetByPropertyID(this.propertyId, this.loginEntityID,1);
      response_details.subscribe(result => {
        let data = JSON.parse(result['_body']);
        if (data) {
          this.nevsCompanyList = data.responseData[0];
          this.tenantLoaderdata3 = false;
          let ProviderList = data.responseData[1];
          let ProviderDetailDataList = data.responseData[2];  
          this.nevsproviderTenants.push({Title:"Company Name", VerifiedList:this.nevsCompanyList});
            ProviderList.forEach(provider=>{
            let providerVerifed:Array<any>=[];  
            this.nevsCompanyList.forEach(company=>{
              let cpd = ProviderDetailDataList.find(x=>x.Tenant_Stage_Id == company.TenantID && x.ProviderID == provider.ProviderID);
              if(cpd && cpd.HasVerified)
              providerVerifed.push(cpd.HasVerified);
              else
              providerVerifed.push(0);
            });
            this.nevsproviderTenants.push({Title:provider.DisplayText, VerifiedList:providerVerifed});
          });   
          
          this.nevsorginalProviderData = JSON.parse(JSON.stringify(this.nevsproviderTenants)); 
          this.nevspager = this.pagerService.getPager(this.nevsCompanyList.length, 1, 10);
          this.nevsproviderTenants.forEach(x=>{
            x.VerifiedList = x.VerifiedList.slice(this.nevspager.startIndex, this.nevspager.endIndex + 1);
            this.nevsCount=Array(x.VerifiedList.length).fill(0).map((x,i)=>i);
          });
      }
    });


  }


  setevPage(page: number) {
    if (page < 1 || page > this.evpager.totalPages) {
      return;
    }
    this.evpager = this.pagerService.getPager(this.evCompanyList.length, page, 10);
    this.evproviderTenants = JSON.parse(JSON.stringify(this.evorginalProviderData));  
    this.evproviderTenants.forEach(x=>{
      x.VerifiedList = x.VerifiedList.slice(this.evpager.startIndex, this.evpager.endIndex + 1);
      this.evCount=Array(x.VerifiedList.length).fill(0).map((x,i)=>i);
    });
  }


  setnevmPage(page: number) {
    if (page < 1 || page > this.nevmpager.totalPages) {
      return;
    }
    this.nevmpager = this.pagerService.getPager(this.nevmCompanyList.length, page, 10);
    this.nevmproviderTenants = JSON.parse(JSON.stringify(this.nevmorginalProviderData));  
    this.nevmproviderTenants.forEach(x=>{
      x.VerifiedList = x.VerifiedList.slice(this.nevmpager.startIndex, this.nevmpager.endIndex + 1)
      this.nevmCount=Array(x.VerifiedList.length).fill(0).map((x,i)=>i);
    })
  }

      

  setnevsPage(page: number) {
    if (page < 1 || page > this.nevspager.totalPages) {
      return;
    }
    this.nevspager = this.pagerService.getPager(this.nevsCompanyList.length, page, 10);
    this.nevsproviderTenants = JSON.parse(JSON.stringify(this.nevsorginalProviderData));  
    this.nevsproviderTenants.forEach(x=>{
      x.VerifiedList = x.VerifiedList.slice(this.nevspager.startIndex, this.nevspager.endIndex + 1)
      this.nevsCount=Array(x.VerifiedList.length).fill(0).map((x,i)=>i);
    })
  }

}
