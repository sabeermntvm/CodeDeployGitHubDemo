import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Response, Headers, RequestOptions, Http } from '@angular/http';
import { ReportService } from '../../core/services/report.service';
import { ReportInfo } from '../../core/models/ReportInfo';
import { SharedDataService } from '../../core/services//shareddata.service';
import { CommunicationService, CommunicationModel } from '../../core/services/communication.service';
import { PropertyService } from '../../core/services/api-property.service';
import { Property } from '../../core/models/Property';
import { SuiteService } from '../../core/services/suite.service';
import { forkJoin } from "rxjs/observable/forkJoin";
import { ContactService } from '../../core/services/contact.service';
import { LoginService } from '../../core/services/login.service';
import { Subscription } from 'rxjs';
declare var $: any;
declare var require: any;
/* declare var config: any;
const constants = config.prototype.constants(); */
// const CryptoJS = require('crypto-js');
@Component({
  selector: 'app-reportselection',
  templateUrl: './reportselection.component.html',
  styleUrls: ['./reportselection.component.scss']
})
export class ReportSelectionComponent implements OnInit {


  showHeader: boolean = false;
  selectedReport: ReportInfo;
  reportList: Array<ReportInfo>;
  isReportSelected: boolean = false;
  selectedReportList: Array<ReportInfo>;
  recentSelection: Array<ReportInfo>;
  @Input() public selectedReportType: string;
  headerHTML: string;
  footerHTML: string;
  unselectedReports: Array<ReportInfo>;
  userName: string;
  selectedProperties: Array<any>;
  brochureLandscapeReportList: Array<ReportInfo>;
  loginCompanyId: number;
  loginCompanyDetails: any;
  selectReportSubscription: Subscription;
  deleteReportSubscription: Subscription;
  sortReportSubscription: Subscription;
  constructor(private _location: Location
    , private _reportService: ReportService
    , private _http: Http
    , private _sharedDataService: SharedDataService
    , private _CommService: CommunicationService
    , private _propertyService: PropertyService
    , private _suiteService: SuiteService
    , private _contactService: ContactService
    , private _loginService: LoginService) {
    this.selectedReport = new ReportInfo();
    this.reportList = new Array<ReportInfo>();
    this.selectedReportList = new Array<ReportInfo>();
    this.unselectedReports = new Array<ReportInfo>();
    this.brochureLandscapeReportList = new Array<ReportInfo>();

    this.loginCompanyId = this._loginService.UserInfo.CompanyID;
    this.userName = this._loginService.UserInfo.PersonName;


    // To show selected report
    this.selectReportSubscription = this._CommService.subscribe("SelectReportType").subscribe((data) => {
      this.reportList = new Array<ReportInfo>();
      this.selectedReportType = data.data;
      this.selectedReportList = new Array<ReportInfo>();
      this.loadReport();
    });



    this.deleteReportSubscription = this._CommService.subscribe("DeleteReport").subscribe((data) => {
      this.reportList = new Array<ReportInfo>();
      this.selectedReportType = data.data;
      this.selectedReportList = new Array<ReportInfo>();
      this.loadReport();
    });


    // To sort report based on property order.
    this.sortReportSubscription = this._CommService.subscribe("reportSort").subscribe((data) => {
      this.selectedReportList = new Array<ReportInfo>();
      let tempPropList = this.selectedProperties;
      this.selectedProperties = [];
      this._sharedDataService.selectedReportProperties.forEach(data => {
        tempPropList.forEach(temp => {
          if (temp.propertyInfo.PropertyID == data.PropertyID) {
            this.selectedProperties.push(temp);
          }
          this._sharedDataService.selectedPropertListingDetails = this.selectedProperties;
        });

      });
      this._reportService.GetReportList().forEach(report => {
        if (report.ReportId == data.data) {
          this.saveNewlySelectedData(report);
        }
      });
      //this.selectReport(data.data);   
    });

    // To get footer HTML.
    this._http.get("assets/templates/footer.html")
      .map(response => response.text())
      .subscribe(html => {
        this.footerHTML = html;

      });

    // To get header HTML.
    this._http.get("assets/templates/header.html")
      .map(response => response.text())
      .subscribe(html => {
        this.headerHTML = html;
      });


    this.selectedProperties = new Array<Property>();
    let propIdList = [];
    const listingIdList = [];
    this._sharedDataService.selectedProperties.forEach(property => {
      if (property.PropertyId && propIdList.indexOf(property.PropertyId) === -1) {
        propIdList.push(property.PropertyId)
      }
      if (property.ListingID && listingIdList.indexOf(property.ListingID) === -1) {
        if(typeof property.ListingID === 'number')
        listingIdList.push(property.ListingID)
        else
        {
          var array = property.ListingID.split(',');
          array.forEach(element => {
            if(element)
            {
              listingIdList.push(element);
            }
          });
        }
      }
    });
  
    if (!!listingIdList && listingIdList.length > 0)
      propIdList = [];
    this._reportService.getListingsWithSuiteReport({
      PropertyID: propIdList.join(','),
      ListingID: listingIdList.join(',')
    }).subscribe(reportData => {
      const responseData = JSON.parse(reportData['_body']).responseData;
      const propertyList = responseData.Property;
      const listingsList = responseData.Listing;
      const suiteList = responseData.Suite;
      const agentList = responseData.Agents;
      this._sharedDataService.selectedProperties.forEach((property, index) => {
        const propertyDetail = {
          propertyInfo: null,
          listingInfo: null,
          suiteList: null,
          contactList: null,
          allInfo: null
        };
        if (property.PropertyId) {
          propertyDetail.propertyInfo = propertyList.find(prop => prop.PropertyID === property.PropertyId);
        }
        if (property.ListingID) {
          if(typeof property.ListingID === 'number'){
            propertyDetail.listingInfo = listingsList.find(listing1 => listing1.ListingID === property.ListingID);
            propertyDetail.suiteList = suiteList.filter(suite => suite.ListingID === property.ListingID);
            propertyDetail.contactList = agentList.filter(contact => contact.ListingID === property.ListingID);  
            let selectedProp = JSON.parse(JSON.stringify(this._sharedDataService.selectedProperties));
          let all = Object.assign(propertyList.find(prop => prop.PropertyID === property.PropertyId),
            propertyDetail.propertyInfo, propertyDetail.listingInfo);
          propertyDetail.allInfo = JSON.parse(JSON.stringify(all));
          this.selectedProperties.push(propertyDetail);
          }
          else
          {
            var array = property.ListingID.split(',');
            array.forEach(element => {
                const propertyDetail = {
                  propertyInfo: null,
                  listingInfo: null,
                  suiteList: null,
                  contactList: null,
                  allInfo: null
                };
                if (property.PropertyId) {
                  propertyDetail.propertyInfo = propertyList.find(prop => prop.PropertyID === property.PropertyId);
                }
              if(element)
              {
                propertyDetail.listingInfo = (listingsList.find(listing1 => listing1.ListingID === Number(element)));
                propertyDetail.suiteList = (suiteList.filter(suite => suite.ListingID === Number(element)));
                propertyDetail.contactList = (agentList.filter(contact => contact.ListingID === Number(element)));  
                let selectedProp = JSON.parse(JSON.stringify(this._sharedDataService.selectedProperties));
              let all = Object.assign(propertyList.find(prop => prop.PropertyID === property.PropertyId),
                propertyDetail.propertyInfo, propertyDetail.listingInfo);
              propertyDetail.allInfo = JSON.parse(JSON.stringify(all));
              this.selectedProperties.push(propertyDetail);
              this._sharedDataService.searchProperties.forEach(prop => {
                if (prop.isSelected)
                  prop.isSelected=false;
                  prop.ListingID=null;
              });
              }
            });
          }
          
        } else {
          let propListings = listingsList.filter(listing1 => listing1.PropertyID === property.PropertyId);
          if (!!propListings && propListings.length > 0) {
            propListings.forEach(list => {
              const propDetail1 = {
                propertyInfo: null,
                listingInfo: null,
                suiteList: null,
                contactList: null,
                allInfo: null
              };
              let propertyInfo = propertyList.find(prop => prop.PropertyID === property.PropertyId);
              propDetail1.listingInfo = list;
              propDetail1.suiteList = suiteList.filter(suite => suite.ListingID === list.ListingID);
              propDetail1.contactList = agentList.filter(contact => contact.ListingID === list.ListingID);
              let selectedProp = JSON.parse(JSON.stringify(this._sharedDataService.selectedProperties));
              let all = Object.assign(propertyList.find(prop => prop.PropertyID === property.PropertyId),
                propDetail1.propertyInfo, propDetail1.listingInfo);
              propDetail1.allInfo = JSON.parse(JSON.stringify(all));
              this.selectedProperties.push(propDetail1);

            });
          } else {
            let selectedProp = JSON.parse(JSON.stringify(this._sharedDataService.selectedProperties));
            let all = Object.assign(propertyList.find(prop => prop.PropertyID === property.PropertyId),
              propertyDetail.propertyInfo);

            propertyDetail.allInfo = JSON.parse(JSON.stringify(all));
            this.selectedProperties.push(propertyDetail);
          }
        }
      });
     
      this._sharedDataService.selectedReportProperties = propertyList;
      this._sharedDataService.selectedPropertListingDetails = this.selectedProperties;
    });


  }
  ngOnDestroy() {
    this.selectReportSubscription.unsubscribe();
    this.deleteReportSubscription.unsubscribe();
    // this.sortReportSubscription.unsubscribe();
  }
  ngOnInit() {
    this.getLoggedInCompanyDetails();
    this.loadReport();

  }

  getLoggedInCompanyDetails() {
    this._contactService.getLoggedInCompanyDetailsById(
      this.loginCompanyId
    ).subscribe(resultData => {
      if (!JSON.parse(resultData['_body']).error)
        this.loginCompanyDetails = JSON.parse(resultData['_body']).responseData[0];
    });
  }

  // To show selected report preview.
  loadReport() {
    this.showHeader = true;
    this.isReportSelected = false;
    if (!!this._sharedDataService.selectedReportList && this._sharedDataService.selectedReportList.length > 0) {
      this.selectedReportList = this._sharedDataService.selectedReportList;
    }

    //   let landscapeBrochureCount = 0;
    this.brochureLandscapeReportList = new Array<ReportInfo>();
    this._reportService.GetReportList().forEach(report => {
      let count = 0;
      if (report.ReportType == this.selectedReportType) {

        if (this.selectedReportList.length > 0) {

          this.selectedReportList.forEach(rep => {
            if (rep.ReportId != report.ReportId) {
              count++;
            } else {
              report.IsSelected = true;
            }

            // if (rep.ReportType == 'brochure' && rep.reportLayout === 'landscape')
            //   landscapeBrochureCount++;

          });
        } else
          count++;
        if (count > 0) {

          // if (report.ReportType !== 'brochure' || (report.reportLayout !== 'landscape' || landscapeBrochureCount === 0)) {
          if (report.isDefault) {
            this.reportList.push(report);
          }

        }
        if (report.ReportType === 'brochure' && report.reportLayout === 'landscape') {
          //  landscapeBrochureCount++;
          this.brochureLandscapeReportList.push(report);
        }
      }
    });

    if (this.selectedReportList.length > 0) {

      let selCount = 0;
      this.selectedReportList.forEach(selReport => {
        if (selReport.IsSelected)
          selCount++;
      });
      if (selCount > 0)
        this.isReportSelected = true;
    }
  }
  // loadAllSelectedReport(delReport) {


  //   this.showHeader = true;
  //   this.isReportSelected = false;
  //   let landscapeBrochureCount = 0;
  //   this.brochureLandscapeReportList = new Array<ReportInfo>();
  //   this._reportService.GetReportList().forEach(report => {
  //     if (report.ReportType == this.selectedReportType) {
  //       if (report.ReportType !== 'brochure' || (report.reportLayout !== 'landscape' || landscapeBrochureCount === 0)) {
  //         this.reportList.push(report);
  //       }
  //       if (report.ReportType === 'brochure' && report.reportLayout === 'landscape') {
  //         landscapeBrochureCount++;
  //         this.brochureLandscapeReportList.push(report);
  //       }
  //     }

  //   });
  // }
  // To show selected report HTML.
  selectReport(reportId: number) {
    this.recentSelection = new Array<ReportInfo>();
    this.selectedReport = new ReportInfo();
    this.selectedReportList = new Array<ReportInfo>();

    if (!!this._sharedDataService.selectedReportList && this._sharedDataService.selectedReportList.length > 0) {
      this.selectedReportList = this._sharedDataService.selectedReportList;
    }
    this.reportList.forEach(report => {
      if (report.ReportId == reportId) {
        this.selectedReport = report;

        this.isReportSelected = true;
        report.IsSelected = true;

        if (this.selectedReportList.length <= 0) {
          this.saveNewlySelectedData(report);
        }
        else {
          let count = 0;
          this.selectedReportList.forEach(data => {
            if (data.ReportId == report.ReportId) {
              count++;
              this.recentSelection.push(data);
            }
          });
          if (count == 0) {
            this.saveNewlySelectedData(report);
          }
        }
        let communicationModel = new CommunicationModel();
        communicationModel.Key = "reportPageSelected";
        communicationModel.data = report;
        this._CommService.broadcast(communicationModel);
      } else {
        //  report.IsSelected = false;
      }
    });


  }
  saveNewlySelectedData(report) {
    
    this.headerHTML = this._reportService.replaceData(this.headerHTML, this.loginCompanyDetails, null, 0);
    this.footerHTML = this._reportService.replaceData(this.footerHTML, this.loginCompanyDetails, null, 0);
    if (report.ReportType === 'brochure' && report.reportLayout === 'landscape' && report.IsSelected) {
      if (this.brochureLandscapeReportList.filter(x => x.ReportId == report.ReportId).length == 0) {
        this.brochureLandscapeReportList.push(report);
      }
    }
    if (report.isEditable && report.ReportType !== 'coverpage') {

      let count = 0;
      if (report.isMultiProperty) {

        let reportHTML: string = "";
        this.selectedProperties.forEach((prop, index) => {

          this._http.get(report.ReportUrl)
            .map(response => response.text())
            .subscribe(html => {
              let htmlElement = document.createElement('div');
              htmlElement.innerHTML = html;
              const reportTmpl = $(htmlElement);
              let contactsTmplHtml = "";

              if (!!reportTmpl.find('.listing-contact-row') && reportTmpl.find('.listing-contact-row').length > 0) {
                contactsTmplHtml = reportTmpl.find('.listing-contact-row')[0].outerHTML;
                reportTmpl.find('.listing-contact-row')[0].remove();
              }


              let listingAgentsTmplHtml = "";
              if (!!reportTmpl.find('#listing-agents') && reportTmpl.find('#listing-agents').length > 0) {
                listingAgentsTmplHtml = reportTmpl.find('#listing-agents')[0].outerHTML;
                reportTmpl.find('#listing-agents')[0].remove();
              }
              let listingCompanyTmplHtml = "";
              if (!!reportTmpl.find('#listing-company') && reportTmpl.find('#listing-company').length > 0) {
                listingCompanyTmplHtml = reportTmpl.find('#listing-company')[0].outerHTML;
                reportTmpl.find('#listing-company')[0].remove();
              }



              let contactHtml = '';
              if (prop.contactList && prop.contactList.length > 0) {
                prop.contactList.forEach(contact => {
                  contactHtml += this._reportService.replaceData(contactsTmplHtml, contact, null, index);
                });
                let htmlElement = document.createElement('div');
                htmlElement.innerHTML = html;
                let htmlDom = $(htmlElement);
                htmlDom.find('.listing-contact').append(contactHtml);
                html = htmlDom[0].innerHTML;
              }




              let listingAgentsHtml = "";
              let listingComapnyHtml = "";
              let listingAgentMainHtml = "";
              if (prop.contactList && prop.contactList.length > 0) {

                let agentList = [];
                let companyList = [];
                let compContactList = [];
                let agentCount = 2;
                prop.contactList.forEach((contact, index) => {

                  let count = 0;
                  if (compContactList.filter(x => x.CompanyName == contact.CompanyName).length == 0) {
                    agentList = [];
                    prop.contactList.forEach((agent, ind) => {
                      let newAgent = new Object;
                      if (agent.CompanyName == contact.CompanyName && count < agentCount) {
                        agentList.push({ FullName: agent.FullName, OfficeMobile: agent.OfficeMobile, CompanyName: agent.CompanyName });
                        count++;
                      }
                    });
                    compContactList.push({ CompanyName: contact.CompanyName, AgentList: agentList });
                  }

                });
                compContactList.forEach((contact, index) => {

                  if (index < 2) {
                    listingComapnyHtml += this._reportService.replaceData(listingCompanyTmplHtml, contact, null, index);
                    contact.AgentList.forEach(agent => {
                      listingAgentsHtml += this._reportService.replaceData(listingAgentsTmplHtml, agent, null, index);
                    });
                    let htmlElement = document.createElement('div');
                    htmlElement.innerHTML = listingComapnyHtml;
                    let htmlDom = $(htmlElement);
                    htmlDom.find('#listing-agents-list').append(listingAgentsHtml);
                    listingComapnyHtml = htmlDom[0].innerHTML;

                    listingAgentMainHtml += listingComapnyHtml

                    //  listingComapnyHtml += htmlDom.find('#listing-agents-list').append(listingAgentsHtml);
                    listingAgentsHtml = "";
                    listingComapnyHtml = "";
                  }
                });

                let htmlElement = document.createElement('div');
                htmlElement.innerHTML = html;
                let htmlDom = $(htmlElement);

                htmlDom.find('#listing-company-list')[0].innerHTML = listingAgentMainHtml;
                //htmlDom.find('#listing-company-list').append(htmlDom.find('#listing-agents-list').append(listingAgentsHtml));
                html = htmlDom[0].innerHTML;
              }

              reportHTML += this._reportService.replaceData(html, prop.allInfo, null, index);
              if ((index + 1) === this.selectedProperties.length || ((index + 1) % report.pageBreak == 0)) {

                if (report.hasFooter)
                  reportHTML += this.footerHTML;

                if (report.hasHeader)
                  reportHTML = this.headerHTML + reportHTML;

                report.HTML = reportHTML;
                const newReport = Object.assign({}, report);
                this.selectedReportList.push(newReport);
                this.recentSelection.push(newReport);
                this._sharedDataService.selectedReportList = this.selectedReportList;
                reportHTML = '';
              }
            });
        });

      }
      else {

        this.selectedProperties.forEach((prop, index) => {
          let selectedBrochureReport = null;
          selectedBrochureReport = report;
          if (report.reportLayout === 'landscape') {

            this.brochureLandscapeReportList.forEach(report1 => {
              if (report1.entitySubtype != "" && report.entitySubtype != "") {
                if (prop.allInfo.PropertyUse === report1.entitySubtype && report.ReportId == report1.ParentReportId) {
                  selectedBrochureReport = report1;
                }
              }
            });
          }


          let updatereport = new ReportInfo();
          this._http.get(selectedBrochureReport.ReportUrl)
            .map(response => response.text())
            .subscribe(reportTmplHtml => {

              let htmlElement = document.createElement('div');
              htmlElement.innerHTML = reportTmplHtml;
              const reportTmpl = $(htmlElement);

              let suiteTmplHtml = "";
              if (!!reportTmpl.find('.suite-row') && reportTmpl.find('.suite-row').length > 0) {
                suiteTmplHtml = reportTmpl.find('.suite-row')[0].outerHTML;
                reportTmpl.find('.suite-row')[0].remove();
              }
              let contactsTmplHtml = "";
              if (!!reportTmpl.find('.listing-contact-row') && reportTmpl.find('.listing-contact-row').length > 0) {
                contactsTmplHtml = reportTmpl.find('.listing-contact-row')[0].outerHTML;
                reportTmpl.find('.listing-contact-row')[0].remove();
              }

              let listingAgentsTmplHtml = "";
              if (!!reportTmpl.find('#listing-agents') && reportTmpl.find('#listing-agents').length > 0) {
                listingAgentsTmplHtml = reportTmpl.find('#listing-agents')[0].outerHTML;
                reportTmpl.find('#listing-agents')[0].remove();
              }
              let listingCompanyTmplHtml = "";
              if (!!reportTmpl.find('#listing-company') && reportTmpl.find('#listing-company').length > 0) {
                listingCompanyTmplHtml = reportTmpl.find('#listing-company')[0].outerHTML;
                reportTmpl.find('#listing-company')[0].remove();
              }


              selectedBrochureReport.HTML = this._reportService.replaceData(reportTmpl.html(), prop.allInfo, null, index);

              let suiteHtml = '';
              if (prop.suiteList && prop.suiteList.length > 0) {
                prop.suiteList.forEach(suite => {
                  suiteHtml += this._reportService.replaceData(suiteTmplHtml, suite, null, index);
                });
                let htmlElement = document.createElement('div');
                htmlElement.innerHTML = selectedBrochureReport.HTML;
                let htmlDom = $(htmlElement);
                htmlDom.find('.suite-tbody').append(suiteHtml);
                selectedBrochureReport.HTML = htmlDom[0].innerHTML;
              } else {

                suiteHtml = "<tr class='suite-row'><td colspan='12' style='text-align:center; font-size:12px;'>No active suites currently available</td></tr>";
                let htmlElement = document.createElement('div');
                htmlElement.innerHTML = selectedBrochureReport.HTML;
                let htmlDom = $(htmlElement);
                htmlDom.find('.suite-tbody').append(suiteHtml);
                selectedBrochureReport.HTML = htmlDom[0].innerHTML;
              }

              let contactHtml = '';
              let contactList = [];
              if (prop.contactList && prop.contactList.length > 0) {

                prop.contactList.forEach((contact, index) => {
                  let count = 0;
                  if (prop.contactList.filter(x => x.CompanyName != contact.CompanyName).length == 0) {

                    contactList.push({ FullName: contact.FullName, OfficeMobile: contact.OfficeMobile, CompanyName: contact.CompanyName, Email: contact.Email });

                  } else {
                    prop.contactList.forEach((agent, ind) => {

                      if (contactList.filter(x => x.CompanyName == contact.CompanyName).length < 2) {
                        if (agent.CompanyName == contact.CompanyName && count < 2) {

                          contactList.push({ FullName: agent.FullName, OfficeMobile: agent.OfficeMobile, CompanyName: agent.CompanyName, Email: contact.Email });
                          count++;
                        }
                      }
                    });
                  }

                });
                contactList.forEach((contact, index) => {
                  if (index < 4)
                    contactHtml += this._reportService.replaceData(contactsTmplHtml, contact, null, index);
                });

                let htmlElement = document.createElement('div');
                htmlElement.innerHTML = selectedBrochureReport.HTML;
                let htmlDom = $(htmlElement);
                htmlDom.find('.listing-contact').append(contactHtml);
                selectedBrochureReport.HTML = htmlDom[0].innerHTML;
              }

              let listingAgentsHtml = "";
              let listingComapnyHtml = "";
              let listingAgentMainHtml = ""
              let count = 0;
              if (prop.contactList && prop.contactList.length > 0) {
                let count = 0;
                let agentList = [];
                let companyList = [];
                let compContactList = [];
                let agentCount = 2;
                // limit agent list to 2 for brochure landscape template.
                // if (selectedBrochureReport.ReportId == 111)
                //   agentCount = 2;

                prop.contactList.forEach((contact, index) => {
                  count = 0;
                  if (compContactList.filter(x => x.CompanyName == contact.CompanyName).length == 0) {
                    agentList = [];
                    if (prop.contactList.filter(x => x.CompanyName != contact.CompanyName).length == 0 && selectedBrochureReport.ReportId == 111) {
                      prop.contactList.forEach((agent, ind) => {

                        if (agent.CompanyName == contact.CompanyName && count < 4) {
                          agentList.push({ FullName: agent.FullName, OfficeMobile: agent.OfficeMobile, CompanyName: agent.CompanyName });
                          count++;
                        }
                        if (compContactList.length == 0 && (count == 2 || ind == prop.contactList.length - 1)) {
                          compContactList.push({ CompanyName: contact.CompanyName, AgentList: agentList });
                          agentList = [];
                        }
                        if (compContactList.length < 2 && (count == 4 || ind == prop.contactList.length - 1)) {
                          compContactList.push({ CompanyName: " ", AgentList: agentList });
                          agentList = [];
                        }
                      });

                    } else {
                      prop.contactList.forEach((agent, ind) => {

                        if (agent.CompanyName == contact.CompanyName && count < agentCount) {
                          agentList.push({ FullName: agent.FullName, OfficeMobile: agent.OfficeMobile, CompanyName: agent.CompanyName });
                          count++;
                        }

                      });
                      compContactList.push({ CompanyName: contact.CompanyName, AgentList: agentList });

                    }
                  }

                });
                compContactList.forEach((contact, index) => {

                  if (index < 2) {
                    listingComapnyHtml += this._reportService.replaceData(listingCompanyTmplHtml, contact, null, index);
                    contact.AgentList.forEach(agent => {
                      listingAgentsHtml += this._reportService.replaceData(listingAgentsTmplHtml, agent, null, index);
                    });
                    let htmlElement = document.createElement('div');
                    htmlElement.innerHTML = listingComapnyHtml;
                    let htmlDom = $(htmlElement);
                    htmlDom.find('#listing-agents-list').append(listingAgentsHtml);
                    listingComapnyHtml = htmlDom[0].innerHTML;

                    listingAgentMainHtml += listingComapnyHtml

                    //  listingComapnyHtml += htmlDom.find('#listing-agents-list').append(listingAgentsHtml);
                    listingAgentsHtml = "";
                    listingComapnyHtml = "";
                  }
                });
                let htmlElement = document.createElement('div');
                htmlElement.innerHTML = selectedBrochureReport.HTML;
                let htmlDom = $(htmlElement);
                htmlDom.find('#listing-company-list').append(listingAgentMainHtml);
                //  htmlDom.find('#listing-company-list').append(htmlDom.find('#listing-agents-list').append(listingAgentsHtml));
                selectedBrochureReport.HTML = htmlDom[0].innerHTML;
              }
              updatereport.ReportId = selectedBrochureReport.ReportId;
              updatereport.ReportType = selectedBrochureReport.ReportType;
              updatereport.ReportName = selectedBrochureReport.ReportName;
              updatereport.ReportOrder = selectedBrochureReport.ReportOrder;
              updatereport.ReportUrl = selectedBrochureReport.ReportUrl;
              updatereport.IsSelected = true;
              updatereport.PreviewImage = selectedBrochureReport.PreviewImage;
              updatereport.isEditable = selectedBrochureReport.isEditable;
              updatereport.reportLayout = selectedBrochureReport.reportLayout;
              updatereport.ParentReportId = selectedBrochureReport.ParentReportId;
              updatereport.reportTitle = selectedBrochureReport.reportTitle;

              if (selectedBrochureReport.hasFooter)
                selectedBrochureReport.HTML += this.footerHTML;

              if (selectedBrochureReport.hasHeader)
                selectedBrochureReport.HTML = this.headerHTML + selectedBrochureReport.HTML;

              updatereport.HTML = selectedBrochureReport.HTML;

              this.selectedReportList.push(updatereport);
              this.recentSelection.push(updatereport);
              this._sharedDataService.selectedReportList = this.selectedReportList;

            });
        });
      }
    } else {

      this._http.get(report.ReportUrl)
        .map(response => response.text())
        .subscribe(html => {

          // report.HTML = this._reportService.replaceData(html, this.selectedProperties[0].allInfo, null, 0);
          report.HTML = this._reportService.replaceData(html, this.loginCompanyDetails, null, 0);
          report.HTML = report.HTML.replace(/##Agent_Name##/gi, this.userName || '')


          if (report.hasFooter)
            report.HTML += this.footerHTML;

          if (report.hasHeader)
            report.HTML = this.headerHTML + report.HTML;


          if (report.ReportType == 'map') {
            this._http.get('assets/templates/map_pin_info.html').map(response => response.text()).subscribe(mapInfoTmplHtml => {
              let mapInfoHtml = '';
              let propertyId = 0;
              this.selectedProperties.forEach((prop, index) => {

                if (propertyId != prop.propertyInfo.PropertyID) {
                  propertyId = prop.propertyInfo.PropertyID;
                  mapInfoHtml += this._reportService.replaceData(mapInfoTmplHtml, prop.allInfo, null, index);

                }
              });
              const htmlElement = document.createElement('div');
              htmlElement.innerHTML = report.HTML;
              const htmlDom = $(htmlElement);
              htmlDom.find('.map-info').append(mapInfoHtml);
              report.HTML = htmlDom[0].innerHTML;
              this.selectedReportList.push(report);
              this.recentSelection.push(report);
              this._sharedDataService.selectedReportList = this.selectedReportList;
            })
          } else {
            this.selectedReportList.push(report);
            this.recentSelection.push(report);
            this._sharedDataService.selectedReportList = this.selectedReportList;
          }
        });
    }

  }

  onClickDoneEdit() {
    let communicationModel = new CommunicationModel();
    communicationModel.Key = "ChangeReportPage";
    communicationModel.data = 'sort';
    this._CommService.broadcast(communicationModel);
  }

} // End of class.
