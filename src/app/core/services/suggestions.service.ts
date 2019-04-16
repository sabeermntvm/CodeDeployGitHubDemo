import {Injectable} from '@angular/core';
import {ApiBaseService} from './api-base.service';
import {Suggestion} from '../models/suggestion';

@Injectable()
export class SuggestionsService extends ApiBaseService {


  public saveSuggestion(suggestion: Suggestion): any {
    return this.httpPost(this._serviceURL + 'mysuggestions/', suggestion);
  }

  public suggestionSearch(userdata: any) {
    return this.httpPost(this._serviceURL + 'suggestions/search', JSON.stringify(userdata), true);    
  }
}
