import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Response, Headers, RequestOptions, Http } from '@angular/http';
import { Observable, Subject } from 'rxjs/Rx';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiBaseService {

  private spinnerCounter: number;

  // constructor(private _http: HttpClient) { }
   apiAuthKey = `${environment.APIBasicAuthKey}`;
  _getHeaders: any;
  _serviceURL: string;
  _countryCode: any;
  constructor(private _http: Http, private _spinnerService: Ng4LoadingSpinnerService) {

    // tslint:disable-next-line:max-line-length
    this._getHeaders = new Headers({
      'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
        , 'Authorization': 'Basic ' + btoa(this.apiAuthKey) 
    });

    this._serviceURL = `${environment.baseUrl}`;
    this.spinnerCounter = 0;
  }

  private generateParam(data: object): HttpParams {
    let params = new HttpParams();
    // tslint:disable-next-line:forin
    for (const i in data) {
      params = params.append(i, data[i]);
    }
    return params;
  }

  protected httpGet(url: string, data: object = null, showSpinner: boolean = true): Observable<Response> {
    let params = new HttpParams();
    const headers = this._getHeaders;
    if (data != null) {
      params = this.generateParam(data);
    }
    const response = this._http.get(url, { params: params, headers: headers });
    return this.buildResult(response, showSpinner);
  }

  protected httpPost(url: string, data: any, showSpinner: boolean = true): Observable<Response> {
    const response = this._http.post(url, data, { headers: this._getHeaders });
    return this.buildResult(response, showSpinner);
  }

  private buildResult(response: Observable<Response>, showSpinner: boolean): Observable<Response> {
    if (showSpinner) {
      this.spinnerCounter++;
    }

    if (this.spinnerCounter == 1) {
      this._spinnerService.show();
    }

    let result = new Subject<Response>();
    response.subscribe(data => {
      if (showSpinner) {
        this.spinnerCounter--;
      }
      if (this.spinnerCounter <= 0) {
        this._spinnerService.hide();
      }

      result.next(data);
    },
      err => {
        if (showSpinner) {
          this.spinnerCounter--;
        }
        if (this.spinnerCounter <= 0) {
          this._spinnerService.hide();
        }

        result.error(err);
      });

    return result;
  }

  protected getJSON(url): Observable<any> {

    return this._http.get(url)
      .map(res => res.json());

  }

}
