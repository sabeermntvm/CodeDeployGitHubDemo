import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject ,  ReplaySubject } from 'rxjs/Rx';
import { ApiBaseService } from './api-base.service';
import {UserModel} from '../models/login';
import { map ,  distinctUntilChanged } from 'rxjs/operators';


@Injectable()
export class AnalyticsService extends ApiBaseService {

    public getAskRentComparison(dimentions:any){
        const response = this.httpPost(this._serviceURL + '/analytics/askrentcomparison/', JSON.stringify(dimentions));
        return response;
    }

    
    public getAskRentComparisonWeighted(dimentions:any){
        const response = this.httpPost(this._serviceURL + '/analytics/askrentcomparisonweighted/', JSON.stringify(dimentions));
        return response;
    }

    public getVacantSummaryComparison(dimentions:any){
        const response = this.httpPost(this._serviceURL + '/analytics/vacantsummarycomparison/', JSON.stringify(dimentions));
        return response;
    }

    public getStackVacancyRateComparison(dimentions:any){
        const response = this.httpPost(this._serviceURL + '/analytics/stackvacancyratecomparison/', JSON.stringify(dimentions));
        return response;
    }

    public getVacancyRateComparison(dimentions:any){
        const response = this.httpPost(this._serviceURL + '/analytics/vacancyratecomparison/', JSON.stringify(dimentions));
        return response;
    }
 


/* 
public login(userdata: any) {      
    const response = this.httpPost(this._serviceURL + 'user/login/', JSON.stringify(userdata));
    this.isAuthenticatedSubject.next(true);
    return response.pipe(map(
        data => {
            let userInfo = JSON.parse(data['_body']);
            if(userInfo != null && userInfo.responseData != null && userInfo.responseData.Response && userInfo.responseData.Response.length>0 ){
            if(userInfo.responseData.Response[0].ResponseCode > 0 && userInfo.responseData.UserInfo !=null && userInfo.responseData.UserInfo.length>0){
            localStorage.setItem('currentUser', JSON.stringify(userInfo.responseData.UserInfo[0]));
            return true;
            }else{
            return userInfo.responseData.Response[0].ErrorMessage;
            }
        }
           return null; 
        }
        ));
} */

}

    