import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportService } from '../../core/services/report.service';
import 'rxjs/add/operator/distinct';
import { SharedDataService } from '../../core/services/shareddata.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../core/services/api-property.service';
import { SuiteService } from '../../core/services/suite.service';
import { ReportInfo } from '../../core/models/ReportInfo';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Http } from '@angular/http';
import { LookupService } from '../../core/services/lookup.service';
import { ContactService } from '../../core/services/contact.service';
import { environment } from '../../../environments/environment';
import pageSettings from '../../config/page-settings';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-ulm-report-edit',
  templateUrl: './ulm-report-edit.component.html',
  styleUrls: ['./ulm-report-edit.component.css']
})
export class UlmReportEditComponent implements OnInit {

  pageSettings;
  selectedProperties: Array<any>;
  mediaList: Array<any>;
  headerHTML: string;
  footerHTML: string;
  selectedReportList: Array<ReportInfo>;
  status: string;
  ulmKey: number;
  reportList: any;
  selectedReportTemplate: Array<ReportInfo>;
  propertyTypeOptions: Array<any>;
  constructionStatusOptions: Array<any>;
  buildingClassOptions: Array<any>;
  tenancyOptions: Array<any>;
  listingTypeOptions: Array<any>;
  specificUseTypeOptions: Array<any>;
  spaceTypeOptions: Array<any>;
  possessionTypeOptions: Array<any>;
  ulmData: any;
  ExpiryDate: any;
  loginCompanyId: number;
  loginCompanyDetails: any;
  listingList: Array<any>;
  editedListingList: Array<any>;
  count:number = 0;
  constructor(private route: ActivatedRoute
    , private _sharedDataService: SharedDataService
    , private _propertyService: PropertyService
    , private _suiteService: SuiteService
    , private _http: Http
    , private _router: Router
    , private _reportService: ReportService
    , private _lookupService: LookupService
    , private _contactService: ContactService
    , private toastr: ToastrService) {

    this.status = null;

    this.route.params.subscribe(params => {
      this.ulmKey = params['key'];
    });

    

    // To get footer HTML.
    this._http.get('assets/templates/footer.html')
      .map(response => response.text())
      .subscribe(html => {
        this.footerHTML = html;
      });

    // To get header HTML.
    this._http.get('assets/templates/header.html')
      .map(response => response.text())
      .subscribe(html => {
        this.headerHTML = html;
      });

    const brochureReports = [];
    this._reportService.GetReportList().forEach(report => {
      if (report.ReportType === 'brochure') {
        brochureReports.push(report);
      }
    });
    this.reportList = [];
    brochureReports.forEach(report => {
      this._http.get(report.ReportUrl).subscribe(result => {
        this.reportList.push({
          type: report.entitySubtype,
          template: result.text(),
          report: report
        })
      })
    });

    /* Property Type Dropdown Options */
    this._lookupService.GetAllPropertyType().subscribe(result => {
      const propertyTypes = JSON.parse(result['_body']).responseData || [];
      this.propertyTypeOptions = [];
      propertyTypes.forEach(type => {
        this.propertyTypeOptions.push(type.UseTypeName);
      });
    });

    /* Construction Status Dropdown Options */
    this._lookupService.GetAllConstructStatus().subscribe(result => {
      const constructionStatuses = JSON.parse(result['_body']).responseData || [];
      this.constructionStatusOptions = [];
      constructionStatuses.forEach(status => {
        this.constructionStatusOptions.push(status.ConstructionStatusName);
      });
    });

    /* Building CLass Dropdown Options */
    this._lookupService.getBuildingClass().subscribe(result => {
      const buildingClasses = JSON.parse(result['_body']).responseData || [];
      this.buildingClassOptions = [];
      buildingClasses.forEach(type => {
        this.buildingClassOptions.push(type.ClassTypeName);
      });
    });

    /* Tenancy Dropdown Options */
    this._lookupService.getAllTenancy().subscribe(result => {
      const tenancyList = JSON.parse(result['_body']).responseData || [];
      this.tenancyOptions = [];
      tenancyList.forEach(type => {
        this.tenancyOptions.push(type.TenancyName);
      });
    });

    /* Listing Type Dropdown Options */
    this._lookupService.GetListingType().subscribe(result => {
      const listingTypeList = JSON.parse(result['_body']).responseData || [];
      this.listingTypeOptions = [];
      listingTypeList.forEach(type => {
        this.listingTypeOptions.push(type.ListingTypeName);
      });
    });

    /* Specific Use Type Dropdown Options */
    this._lookupService.GetAllSpecificUse().subscribe(result => {
      const specificUseTypeList = JSON.parse(result['_body']).responseData || [];
      this.specificUseTypeOptions = [];
      specificUseTypeList.forEach(type => {
        this.specificUseTypeOptions.push(type.SpecificUsesName);
      });
    });

    /* Space Type Dropdown Options */
    this._lookupService.GetSpaceType().subscribe(result => {
      const spaceTypeList = JSON.parse(result['_body']).responseData || [];
      this.spaceTypeOptions = [];
      spaceTypeList.forEach(type => {
        this.spaceTypeOptions.push(type.SpaceTypeName);
      });
    });

    /* Possession Type Dropdown Options */
    this._lookupService.GetPossessionType().subscribe(result => {
      const possessionTypeList = JSON.parse(result['_body']).responseData || [];
      this.possessionTypeOptions = [];
      possessionTypeList.forEach(type => {
        this.possessionTypeOptions.push(type.PossessionTypeName);
      });
    });
  }

  ngOnInit() {
    this.pageSettings = pageSettings;
    pageSettings.pageEmpty = true;
    const expiryDays = `${environment.ULMLinkExpiryDays}`;
    this.selectedReportList = [];
    this.selectedProperties = [];
    this.selectedReportTemplate = [];
     this.listingList= [];
     this.editedListingList=[];
    this._reportService.getULMDetailsByKey(this.ulmKey).subscribe(ulmResponse => {
      this.ulmData = JSON.parse(ulmResponse['_body']).responseData.ulm[0];
      this._contactService.GetAgentById(this.ulmData.SentByUserID).subscribe(resultData => {
        if (!JSON.parse(resultData['_body']).error)
          var a = JSON.parse(resultData['_body']).responseData[0];
          this.getLoggedInCompanyDetails(a.BranchID);
    
      /*
      1. Calculating difference between current date and expiry date and
      updating the satus field to 'Expiry' if the differance is 0 or
      negative.
      2. If expiry date is not set, created date + the constant number of
      days is set as the expiry date
      */
      var currentDate = new Date();
      if (this.ulmData.ExpiryDate == null) {
        this.ExpiryDate = new Date(this.ulmData.CreateTime);
        this.ExpiryDate.setDate(this.ExpiryDate.getDate() + expiryDays);
      }
      else
        this.ExpiryDate = new Date(this.ulmData.ExpiryDate);
      var diff = Math.abs(this.ExpiryDate.getTime() - currentDate.getTime());
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      if (diffDays == 0 || diffDays < 0) {
        this.ulmData.Status = "Expired";
        this._reportService.saveULMDetails(this.ulmData).subscribe(result => {
        })
      }
      this.status = this.ulmData.Status;
      if (this.status === 'Complete') {
        const reportList = JSON.parse(this.ulmData.ReceivedHtml);
        reportList.forEach(report => {
          report.hasUserUpdated = true;
          this.selectedReportList.push(report);
        })
      } else if (this.status === 'Sent' || this.status === 'In Progress') {
        this._reportService.getULMListingsByULMId(this.ulmData.UserListingManagementID).subscribe(ulmListingData => {
          const ulmListings = JSON.parse(ulmListingData['_body']).responseData.ulmListings;
          const propIdList = [];
          const listingIdList = [];
          ulmListings.forEach(ulmListing => {
            if (ulmListing.HasUserUpdated && ulmListing.ReceivedHtml) {
              const report = JSON.parse(ulmListing.ReceivedHtml);
              report.ulmListingId = ulmListing.ULMListingID;
              report.hasUserUpdated = true;
              this.selectedReportList.push(report);
              localStorage.setItem('selectedReport', JSON.stringify(this.selectedReportList));
            } else {
              if (ulmListing.PropertyID && propIdList.indexOf(ulmListing.PropertyID) === -1) {
                propIdList.push(ulmListing.PropertyID)
              }
              if (ulmListing.ListingID && listingIdList.indexOf(ulmListing.ListingID) === -1) {
                listingIdList.push(ulmListing.ListingID)
              }
            }
          });

          this._reportService.getListingsWithSuiteReport({
            PropertyID: propIdList.join(','),
            ListingID: listingIdList.join(',')
          }).subscribe(result => {
            const responseData = JSON.parse(result['_body']).responseData;
            const propertyList = responseData.Property;
            const listingsList = responseData.Listing;
            const suiteList = responseData.Suite;
            const agentList = responseData.Agents;
            ulmListings.forEach((ulmListing, index) => {
              if (!(ulmListing.HasUserUpdated && ulmListing.ReceivedHtml)) {
                const propertyDetail = {
                  propertyInfo: null,
                  listingInfo: null,
                  suiteList: null,
                  contactList: null,
                  PropertyMedia: null
                };
                if (ulmListing.PropertyID) {
                  propertyDetail.propertyInfo = propertyList.find(prop => prop.PropertyID === ulmListing.PropertyID);
                }
                if (ulmListing.ListingID) {
                  propertyDetail.listingInfo = listingsList.find(listing => listing.ListingID === ulmListing.ListingID);
                  propertyDetail.suiteList = suiteList.filter(suite => suite.ListingID === ulmListing.ListingID);
                  propertyDetail.contactList = agentList.filter(contact => contact.ListingID === ulmListing.ListingID);
                }
                this.selectedProperties[index] = propertyDetail;

                this.reportList.forEach(report1 => {
                  if (report1.type === propertyDetail.propertyInfo.PropertyUse) {
                    this.selectedReportTemplate[index] = report1;
                  }
                });
                if (!this.selectedReportTemplate[index]) {
                  this.selectedReportTemplate[index] = this.reportList[0];
                }

                /*this._propertyService.GetAllPropertyMediaByPropertyId(ulmListing.PropertyID).subscribe(mediaResult => {
                  this.selectedProperties[index].PropertyMedia = JSON.parse(mediaResult['_body']).responseData[0];
                });*/
                this.saveNewlySelectedData(this.selectedReportTemplate[index],
                  this.selectedProperties[index], index, ulmListing.ULMListingID);
              }
            });
          });
        });
      }
    });
  });
    
  }
  ngOnDestroy()
  {
    pageSettings.pageEmpty = false;
  }
  getLoggedInCompanyDetails(loginCompanyId) {
    this._contactService.getLoggedInCompanyDetailsById(
      loginCompanyId
    ).subscribe(resultData => {
      if (!JSON.parse(resultData['_body']).error)
        this.loginCompanyDetails = JSON.parse(resultData['_body']).responseData[0];
  });
  }
  saveNewlySelectedData(reportInfo, prop, index, ULMListingID) {
    this.headerHTML = this._reportService.replaceData(this.headerHTML, this.loginCompanyDetails, null, 0);
    this.footerHTML = this._reportService.replaceData(this.footerHTML, this.loginCompanyDetails, null, 0);
    const updatereport = new ReportInfo();
    const reportTmplHtml = reportInfo.template;
    const reportTmpl = $(reportTmplHtml);
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
              let listingAgentsTmplHtml = "",listingCompanyTmplHtml = "";
              if (!!reportTmpl.find('#listing-agents-list') && reportTmpl.find('#listing-agents-list').length > 0) {
                listingAgentsTmplHtml = reportTmpl.find('#listing-agents-list')[0].outerHTML;
                reportTmpl.find('#listing-agents-list')[0].remove();
              }
              if (!!reportTmpl.find('#listing-company') && reportTmpl.find('#listing-company').length > 0) {
                listingCompanyTmplHtml = reportTmpl.find('#listing-company')[0].outerHTML;
                reportTmpl.find('#listing-company')[0].remove();
              }
    const report = reportInfo.report;
    const replacePropData = Object.assign(prop.propertyInfo, prop.listingInfo);
    report.HTML = this._reportService.replaceData(reportTmpl.html(), replacePropData, null, index);

    let suiteHtml = '';
    if (prop.suiteList && prop.suiteList.length > 0) {
      prop.suiteList.forEach(suite => {
        suiteHtml += this._reportService.replaceData(suiteTmplHtml, suite, null, index);
      });
      const htmlElement = document.createElement('div');
      htmlElement.innerHTML = report.HTML;
      const htmlDom = $(htmlElement);
      htmlDom.find('.suite-tbody').append(suiteHtml);
      report.HTML = htmlDom[0].innerHTML;
    }

    let contactHtml = '';
    if (prop.contactList && prop.contactList.length > 0) {
      prop.contactList.forEach(contact => {
        contactHtml += this._reportService.replaceData(listingCompanyTmplHtml, contact, null, index);
        contactHtml += this._reportService.replaceData(listingAgentsTmplHtml, contact, null, index);
      });
      const htmlElement = document.createElement('div');
      htmlElement.innerHTML = report.HTML;
      const htmlDom = $(htmlElement);
      htmlDom.find('#listing-company-list').append(contactHtml);
      report.HTML = htmlDom[0].innerHTML;
    }else
    {
      let contact = {CompanyName: " ",Email: null,FullName: " ",ListingID: null,OfficeMobile : ""};
      contactHtml += this._reportService.replaceData(listingCompanyTmplHtml, contact, null, index);
      contactHtml += this._reportService.replaceData(listingAgentsTmplHtml, contact, null, index);
      const htmlElement = document.createElement('div');
      htmlElement.innerHTML = report.HTML;
      const htmlDom = $(htmlElement);
      htmlDom.find('#listing-company-list').append(contactHtml);
      report.HTML = htmlDom[0].innerHTML;
    }

    updatereport.ReportId = report.ReportId;
    updatereport.ReportType = report.ReportType;
    updatereport.ReportName = report.ReportName;
    updatereport.ReportOrder = report.ReportOrder;
    updatereport.ReportUrl = report.ReportUrl;
    updatereport.IsSelected = true;
    updatereport.PreviewImage = report.PreviewImage;
    updatereport.isEditable = report.isEditable;

    this.footerHTML = this.footerHTML.replace('abs-position', '');
    if (report.hasFooter) {
      report.HTML += this.footerHTML;
    }

    if (report.hasHeader) {
      report.HTML = this.headerHTML + report.HTML;
    }
    updatereport.HTML = report.HTML;

    updatereport.ulmListingId = ULMListingID;
    updatereport.hasUserUpdated = false;
    this.listingList.push(ULMListingID);

    this.selectedReportList.push(updatereport);
    localStorage.setItem('selectedReport', JSON.stringify(this.selectedReportList));
    this.editFields(updatereport);
    const instance = this;
    setTimeout(function () {
     instance.addHandlers(ULMListingID);
    }, 1500);
  }

  editFields(report) {
    if (!report.hasUserUpdated) {

      const instance = this;
      const reportHtmlElement = document.createElement('div');
      reportHtmlElement.innerHTML = report.HTML;
      const html = $(reportHtmlElement);

      html.find('.edittext').each(function (index, value) {
        value.contentEditable = true;
      });

      /* Property Type Dropdown */
      html.find('[data-dropdown-type="propertyType"]').each(function (index, value) {
        value.innerHTML = instance.addDropdown(instance.propertyTypeOptions, value.innerText);
      });

      /* Construction Status Dropdown */
      html.find('[data-dropdown-type="constructionStatus"]').each(function (index, value) {
        value.innerHTML = instance.addDropdown(instance.constructionStatusOptions, value.innerText);
      });

      /* Building CLass Dropdown */
      html.find('[data-dropdown-type="buildingClass"]').each(function (index, value) {
        value.innerHTML = instance.addDropdown(instance.buildingClassOptions, value.innerText);
      });

      /* Tenancy Dropdown */
      html.find('[data-dropdown-type="tenancy"]').each(function (index, value) {
        value.innerHTML = instance.addDropdown(instance.tenancyOptions, value.innerText);
      });

      /* Vacant Dropdown */
      html.find('[data-dropdown-type="vacant"]').each(function (index, value) {
        value.innerHTML = instance.addDropdown(['Yes', 'No'], value.innerText);
      });

      /* Listing Type Dropdown */
      html.find('[data-dropdown-type="listingType"]').each(function (index, value) {
        value.innerHTML = instance.addDropdown(instance.listingTypeOptions, value.innerText);
      });

      /* Specific Use Type Dropdown */
      html.find('[data-dropdown-type="specificUse"]').each(function (index, value) {
        value.innerHTML = instance.addDropdown(instance.specificUseTypeOptions, value.innerText);
      });

      /* Space Type Dropdown */
      html.find('[data-dropdown-type="spaceType"]').each(function (index, value) {
        value.innerHTML = instance.addDropdown(instance.spaceTypeOptions, value.innerText);
      });

      /* Possession Use Type Dropdown */
      html.find('[data-dropdown-type="possessionType"]').each(function (index, value) {
        let possessionTypeSelected = null;
        let dateSelected = null;
        if (!!value.innerText) {
          if (instance.possessionTypeOptions.indexOf(value.innerText) > -1) {
            possessionTypeSelected = value.innerText;
          } else {
            possessionTypeSelected = 'Date';
            dateSelected = new Date(value.innerText).toISOString().split('T')[0];
          }
        }
        let selectText = '<select contentEditable = false class="width-50" id="possessionType' + index + '">';
        instance.possessionTypeOptions.forEach(option => {
          if (option === possessionTypeSelected) {
            selectText += '<option selected>' + option + '</option>'
          } else {
            selectText += '<option>' + option + '</option>'
          }
        });
        selectText += '</select>';
        if (possessionTypeSelected === 'Date') {
          selectText += '<input class="width-50" id="possessionTypeDate' + index + '" value="' + dateSelected + '" type="date"/>';
        } else {
          selectText += '<input style="visibility:hidden" class="width-50" id="possessionTypeDate' + index + '" type="date" disabled/>';
        }
        value.innerHTML = selectText;
      });

      const preEditRightImg = html.find('.prev-edit-right-img');
      preEditRightImg.each((i, value) => {
        value.children[0].onclick = function () {
          const selectedProp = instance.selectedProperties.find(prop => prop.PropertyId === value.getAttribute('prop-id'));
          const mediaData = selectedProp.PropertyMedia;
          mediaData.forEach((media, index) => {
            mediaData[index].url = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + '/Media/Thumbnail/300x300/' + media.Path;
          });
          instance.mediaList = mediaData;
          $('#testmodal').modal('show');
        };
      });
      report.HTML = html[0].innerHTML;
    }
  }

  selectImage(propId, url) {
    $('div[prop-id=' + propId + ']')[0].children[0].src = url;
  }

  addHandlers(ulmListingID) {
    const instance = this;
    $('.btn-add-listing').each(function (index, value) {
      value.onclick = function (a) {
        let suiteRowHtml = '<tr class="suite-row">';
        const colCount = $(this).closest('.rep-prev-left').find('.em-table thead tr th').length;
        for (let i = 0; i < colCount; i++) {
          suiteRowHtml += '<td> <span class="edittext bold" contenteditable="true"></span></td>';
        }

        $(this).closest('.rep-prev-left').find('.em-table tbody').append(suiteRowHtml);
      };
    });

    $('#listing' + ulmListingID + '').each((i, value) => {
      value.oninput = function (a) {
        instance.editLisitngList(ulmListingID);
      }
    });
    $('[contenteditable=true]').each((i, value) => {
      value.oninput = function (a) {
        $(this).addClass('bold');
      }
    });

    $('select[id^="possessionType"]').each((i, value) => {
      const index = value.id.split('possessionType')[1];
      const selectedInput = $('input[id^="possessionTypeDate' + index + '"]')[0];
      value.onchange = function () {
        if (value.value === 'Date') {
          selectedInput.disabled = false;
          selectedInput.style.visibility = 'visible';
        } else {
          selectedInput.disabled = true;
          selectedInput.style.visibility = 'hidden';
          selectedInput.value = '';
        }
      }
    })
  }
  editLisitngList(ulmListingId)
  {
    this.editedListingList.find(x=>x==ulmListingId)?null:this.editedListingList.push(ulmListingId);
  }
  addDropdown(options, selectedValue) {
    let selectText = '<select contentEditable = false>';
    options.forEach(option => {
      if (option === selectedValue) {
        selectText += '<option selected>' + option + '</option>'
      } else {
        selectText += '<option>' + option + '</option>'
      }
    });
    selectText += '</select>';
    return selectText;
  };

  onSave() {
    if(this.editedListingList.length<=0){
    $('[data-dropdown-type="possessionType"]').each((index1, possessionTypeElement) => {
      const possessionTypeHtml = $(possessionTypeElement);
      if(possessionTypeHtml.find('select')[0]){
      if (possessionTypeHtml.find('select')[0].value === 'Date') {
        possessionTypeElement.innerHTML = possessionTypeHtml.find('input')[0].value
      } else {
        possessionTypeElement.innerHTML = possessionTypeHtml.find('select')[0].value;
      }
    }
    });
    $('[data-dropdown-type]').each(function (index, value) {
      if ($(value).find('select').length > 0) {
        value.innerHTML = $(value).find('select')[0].value;
      }
    });
    $('.edittext').each((index, value) => {
      value.contentEditable = false;
    });
    $('.btn-add-listing').remove();
    $('.prev-edit').each((i, result) => {
      this.selectedReportList[i].HTML = result.innerHTML;
    });
    this.ulmData.Status = 'Complete';
    this.ulmData.ReviewStatus = 'Ready For Review';
    this.ulmData.ReceivedHtml = JSON.stringify(this.selectedReportList);
    this._reportService.saveULMDetails(this.ulmData).subscribe(result => {
      this.status = this.ulmData.Status;
    });
  }
  else
  {
    this.toastr.error('Please submit all the edited listings!');
    // alert("Please submit all the edited listings")
  }
  }
  saveListing(ulmListingId) {
    this.editedListingList.splice(this.editedListingList.findIndex(x=>x==ulmListingId), 1);
    $('#listing' + ulmListingId + '').each((i, value) => {
      const selectedReport = this.selectedReportList.find(report => {
        return report.ulmListingId === ulmListingId
      });
      const htmlElement = $(value);
      htmlElement.find('[data-dropdown-type="possessionType"]').each((index1, possessionTypeElement) => {
        const possessionTypeHtml = $(possessionTypeElement);
        if(possessionTypeHtml.find('select')[0]){
        if (possessionTypeHtml.find('select')[0].value === 'Date') {
          possessionTypeElement.innerHTML = possessionTypeHtml.find('input')[0].value
        } else {
          possessionTypeElement.innerHTML = possessionTypeHtml.find('select')[0].value;
        }
      }
      });
      htmlElement.find('[data-dropdown-type]').each(function (index1, dropDownElement) {
        const dropDownHtml = $(dropDownElement);
        if (dropDownHtml.find('select').length > 0) {
          dropDownElement.innerHTML = dropDownHtml.find('select')[0].value;
        }
      });
      htmlElement.find('.edittext').removeAttr('contenteditable');
      htmlElement.find('.btn-add-listing').remove();
      const index = this.selectedReportList.indexOf(selectedReport);
      this.selectedReportList[index].HTML = htmlElement[0].innerHTML;
      this._reportService.saveULMListing({
        ULMID: this.ulmData.UserListingManagementID,
        ULMListingID: ulmListingId,
        ReceivedHtml: JSON.stringify(this.selectedReportList[index]),
        HasUserUpdated: 1
      }).subscribe(result => {
        this.ulmData.ListingsUpdated = this.ulmData.ListingsUpdated + 1;
        $('.prev-edit').each((i1, result1) => {
          this.selectedReportList[i1].HTML = result1.innerHTML;
        });
        this.ulmData.ReceivedHtml = JSON.stringify(this.selectedReportList);
        this.ulmData.Status = 'In Progress';
        this.ulmData.HasUserUpdated = 1;
        this._reportService.saveULMDetails(this.ulmData).subscribe(ulm => {
          this.selectedReportList[index].hasUserUpdated = true;
        });
      });
    })
  }
}
