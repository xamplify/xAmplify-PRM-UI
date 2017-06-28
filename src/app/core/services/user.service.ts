import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }     from 'rxjs/Rx';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { User } from '../models/user';

import { AuthenticationService } from '../services/authentication.service';
import { ReferenceService } from './reference.service';

@Injectable()
export class UserService {
    
    private token: string;

    loggedInUserData:User;

URL = this.authenticationService.REST_URL;

constructor(
    private http: Http,
    private authenticationService: AuthenticationService, private refService : ReferenceService) {
}

getUsers(): Observable<User[]> {
    // get users from api
    return this.http.get('/api/users', this.authenticationService.getOptions())
        .map((response: Response) => response.json());
}

signUp(data:User){
    console.log(data);
    return this.http.post(this.URL+"register/signup/user",data)
    .map(this.extractData)
    .catch(this.handleError);
   
}

sendPassword(emailId:string){
    return this.http.get(this.URL+"register/forgotpassword?emailId="+emailId)
    .map(this.extractData)
    .catch(this.handleError);
   
}

updatePassword(data:any){
  console.log(data);
    return this.http.post(this.URL+"admin/updatePassword?access_token="+this.authenticationService.access_token,data)
    .map(this.extractData)
    .catch(this.handleError);
}

comparePassword(data:any){
    return this.http.post(this.URL+"admin/comparePassword",data,this.authenticationService.getOptions())
    .map(this.extractData)
    .catch(this.handleError);
}

updateUserProfile(data:any,userId:number){
    
    return this.http.post(this.URL+"admin/updateUser/"+userId+"?access_token="+this.authenticationService.access_token,data)
    .map(this.extractData)
    .catch(this.handleError);
}

private extractData(res: Response) {
    console.log(res);
    let body = res;
    console.log("response.json(): "+body);
    return body || {};
}

private handleError(error: any) {
    var body = error['_body'];
    console.log(body);
    if(body!=""){
        var response = JSON.parse(body);
        if(response.message!=undefined){
            return Observable.throw(response.message);
        }else{
            return Observable.throw(response.error);
        }
        
    }else{
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(error);
    }
   
}

}
