import {Injectable} from '@angular/core';
import {ApiBaseService} from './api-base.service';

@Injectable()
export class UserPreferencesService extends ApiBaseService {

  public saveUserPreferences(UserPreferences): any {
    return this.httpPost(this._serviceURL + 'user-preferences/', JSON.stringify(UserPreferences), true);
    // return this.httpPost('http://localhost:3000/api/user-preferences/', JSON.stringify(UserPreferences), true);
  }

  public getUserPreferences(userId, type, screen): any {
    return this.httpGet(this._serviceURL + 'user-preferences/' + +userId + '/' + type + '/' + screen);
    // return this.httpGet('http://localhost:3000/api/user-preferences/' + userId + '/' + type + '/' + screen);
  }
}
