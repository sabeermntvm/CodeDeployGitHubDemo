import { Component, OnInit } from '@angular/core';
import { SuggestionsService } from '../core/services/suggestions.service';
import { LoginService } from '../core/services';
import { SuggestionSearchCriteria } from '../core/models/SuggestionSearchCriteria';
import { PagerService } from '../core/services/pager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-suggestions',
  templateUrl: './my-suggestions.component.html',
  styleUrls: ['./my-suggestions.component.css']
})
export class MySuggestionsComponent implements OnInit  {

  sugSearchCriteria: SuggestionSearchCriteria;
  typeList = ['Property', 'Listing', 'Contact', 'Media', 'Tenant', 'Transaction', 'Suite'];
  type: string = '';
  status: string = '';
  filterid: number = null;

  suggestionlist: Array<any> = [];
  TypeSortOrder: string = 'Descending';
  PropertyNameSortOrder: string = 'Descending';
  FieldNameSortOrder: string = 'Ascending';
  SuggestedValueSortOrder: string = 'Ascending';
  SuggestionCommentSortOrder: string = 'Ascending';
  CreatedDateSortOrder:string = 'Ascending';
  SuggestionStatusSortOrder: string = 'Ascending';
  SentByUserNameSortOrder: string = 'Ascending';
  UserCompanyNameSortOrder: string = 'Ascending';
  PropertyIDSortOrder: string = 'Ascending';
  pager: any = {};
  currentPage : number;
  pageSize :number =10;
  UserID: number;
  totalsize :number;
  startDate: number = null;
  endDate: number = null;
  currentDate=new Date;
  minDate={year:this.currentDate.getFullYear()-75,month:1,day:1};
  maxDate={year:this.currentDate.getFullYear(),month:this.currentDate.getMonth()+1,day:this.currentDate.getDate()};
  Isloader :boolean = false;

  constructor(public suggestionservice: SuggestionsService, private pagerService: PagerService , public _loginService: LoginService
    , private _router: Router)  {
  }

  ngOnInit() {
    const loginData = this._loginService.UserInfo;
    if (loginData) {
      this.UserID = loginData.EntityID;
    }
    this.sugSearchCriteria = new SuggestionSearchCriteria();
    this.sugSearchCriteria.StartingIndex = 1;
    this.sugSearchCriteria.OffsetValue = 10;
    this.sugSearchCriteria.SentUserId = this.UserID;
  this.getsuggestions(this.sugSearchCriteria);
}


getsuggestions(searchobj :SuggestionSearchCriteria){
  this.Isloader = true;
  this.suggestionservice.suggestionSearch(searchobj).subscribe(summaryResponse => {
    this.suggestionlist = JSON.parse(summaryResponse['_body']).responseData.suggestions;
    this.suggestionlist.forEach(item => {
      item.ItemDetails = JSON.parse(item.ItemDetails);
    });
    this.totalsize = JSON.parse(summaryResponse['_body']).responseData.rowscount[0].count;
    this.pager = this.pagerService.getPager(this.totalsize, this.currentPage, this.pageSize);
    this.Isloader = false;
  });
}



sortProperty(SortParam, sortOrder) {  
  this.sugSearchCriteria.SortParam = SortParam;
  this.sugSearchCriteria.SortDirection = sortOrder;
  this.getsuggestions(this.sugSearchCriteria);

  switch (SortParam) {
    case 'type':
      if (sortOrder == 'Ascending')
        this.TypeSortOrder = 'Descending';
      else
        this.TypeSortOrder = 'Ascending';
      break;
    case 'PropertyName':
      if (sortOrder == 'Ascending')
        this.PropertyNameSortOrder = 'Descending';
      else
        this.PropertyNameSortOrder = 'Ascending';
      break;
      case 'FieldName':
      if (sortOrder == 'Ascending')
        this.FieldNameSortOrder = 'Descending';
      else
        this.FieldNameSortOrder = 'Ascending';
      break;
      case 'SuggestedValue':
      if (sortOrder == 'Ascending')
        this.SuggestedValueSortOrder = 'Descending';
      else
        this.SuggestedValueSortOrder = 'Ascending';
      break;
      case 'CreatedDate':
      if (sortOrder == 'Ascending')
        this.CreatedDateSortOrder = 'Descending';
      else
        this.CreatedDateSortOrder = 'Ascending';
      break;
      case 'SuggestionComment':
      if (sortOrder == 'Ascending')
        this.SuggestionCommentSortOrder = 'Descending';
      else
        this.SuggestionCommentSortOrder = 'Ascending';
      break;
      case 'SuggestionStatus':
      if (sortOrder == 'Ascending')
        this.SuggestionStatusSortOrder = 'Descending';
      else
        this.SuggestionStatusSortOrder = 'Ascending';
      break;
      case 'SentByUserName':
      if (sortOrder == 'Ascending')
        this.SentByUserNameSortOrder = 'Descending';
      else
        this.SentByUserNameSortOrder = 'Ascending';
      break;
      case 'UserCompanyName':
      if (sortOrder == 'Ascending')
        this.UserCompanyNameSortOrder = 'Descending';
      else
        this.UserCompanyNameSortOrder = 'Ascending';
      break;
      case 'PropertyID':
      if (sortOrder == 'Ascending')
        this.PropertyIDSortOrder = 'Descending';
      else
        this.PropertyIDSortOrder = 'Ascending';
      break;
  }
}



FiltertypeChange(type) {
  this.sugSearchCriteria.TypeFilter = type;
 this.getsuggestions(this.sugSearchCriteria);
}

FilterstatusChange(status) {
  this.sugSearchCriteria.StatusFilter = status;
 this.getsuggestions(this.sugSearchCriteria);
}

FilterPropertyIdChange(id) {
  this.sugSearchCriteria.PropertyIdFilter = id;
  this.getsuggestions(this.sugSearchCriteria);
}

onStartDateChange(startdate){
  if(startdate && startdate.year){
    this.sugSearchCriteria.StartDate = startdate.year + '-' + startdate.month + '-' + startdate.day ;
  }else{
    this.sugSearchCriteria.StartDate = null;
  }
  
  this.getsuggestions(this.sugSearchCriteria);
}


onEndDateChange(enddate){
  if(enddate && enddate.year){
    this.sugSearchCriteria.EndDate = enddate.year + '-' + enddate.month + '-' + enddate.day;
  }else{
    this.sugSearchCriteria.EndDate = null;
  }

this.getsuggestions(this.sugSearchCriteria);
}

setPage(page: number) {
  this.currentPage = page;
  this.sugSearchCriteria.StartingIndex = this.currentPage;
    this.sugSearchCriteria.OffsetValue = 10;
  this.getsuggestions(this.sugSearchCriteria);
}


public showListingDetails(PropertyId, ListingID) {
  if(PropertyId){
  this._router.navigate(['/property/propertySummary', PropertyId]);
}
}

setDate(date) {
  return new Date(date);
}

}
