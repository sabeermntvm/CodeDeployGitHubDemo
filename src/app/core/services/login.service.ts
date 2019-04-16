import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject ,  ReplaySubject } from 'rxjs/Rx';
import { ApiBaseService } from './api-base.service';
import {UserModel} from '../models/login';
import { map ,  distinctUntilChanged } from 'rxjs/operators';


@Injectable()
export class LoginService extends ApiBaseService {

private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
public isAuthenticated = this.isAuthenticatedSubject.asObservable();


get UserInfo(): UserModel {
    if (localStorage.getItem('currentUser')) {
        // logged in so return true
        let user = Object.assign(new UserModel(), JSON.parse(localStorage.getItem('currentUser')));
        if(user){
            return user;
        }else{
            return null;
        }
    }
}


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
}
logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
}

}

    