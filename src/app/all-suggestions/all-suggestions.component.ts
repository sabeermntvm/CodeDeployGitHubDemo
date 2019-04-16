import { Component, OnInit, Injectable } from '@angular/core';
import { SuggestionsService } from '../core/services/suggestions.service';
import { SuggestionSearchCriteria } from '../core/models/SuggestionSearchCriteria';
import { SharedDataService } from '../core/services/shareddata.service';
import { Suggestion } from '../core/models/suggestion';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '../core/services/pager.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-all-suggestions',
  templateUrl: './all-suggestions.component.html',
  styleUrls: ['./all-suggestions.component.css']
})
export class AllSuggestionsComponent implements OnInit {

  sugSearchCriteria: SuggestionSearchCriteria;

  typeList = ['Property', 'Listing', 'Contact', 'Media', 'Tenant', 'Transaction' , 'Suite'];
  type: string = '';
  status: string = '';
  filterid :number = null;

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
  totalsize :number;
  Isloader :boolean = false;

  startDate: number = null;
  endDate: number = null;
  currentDate=new Date;
  minDate={year:this.currentDate.getFullYear()-75,month:1,day:1};
  maxDate={year:this.currentDate.getFullYear(),month:this.currentDate.getMonth()+1,day:this.currentDate.getDate()};
  constructor(public suggestionservice: SuggestionsService, private pagerService: PagerService,
    private service: SuggestionsService,
    public _router: Router,
    private datepipe: DatePipe) {
  }

  ngOnInit() {
    this.sugSearchCriteria = new SuggestionSearchCriteria();
    this.sugSearchCriteria.StartingIndex = 1;
    this.sugSearchCriteria.OffsetValue = 10;
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
  this.Isloader = true;
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

statusChange(suggestion){
  suggestion.CreatedDate = null;
  suggestion.UpdateTime = null;
  this.service.saveSuggestion(suggestion);
}

public showListingDetails(PropertyId, ListingID) {
  if(PropertyId){
  this._router.navigate(['/property/propertySummary', PropertyId]);
}
  // if (ListingID === null || ListingID === undefined) {   
  //   this._router.navigate(['/property/propertySummary', PropertyId]);
  // } else {
  //   this._router.navigate(['/property/propertySummary', PropertyId, ListingID]);
  // }
}

setDate(date) {
  return new Date(date);
}

}
