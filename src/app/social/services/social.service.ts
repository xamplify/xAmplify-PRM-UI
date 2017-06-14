import {Injectable} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable }     from 'rxjs/Rx';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import {SocialStatus} from "../models/social-status";

import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable()
export class SocialService {
    URL = this.authenticationService.REST_URL;
    public access_token: string;
    public REST_URL: string;

    constructor(private http: Http, private router: Router, 
                private authenticationService: AuthenticationService, private activatedRoute: ActivatedRoute) {
    	this.REST_URL = "http://localhost:8080/xtremand-rest/";
    }
    
    
    login(socialProvider:string):Observable<String>{
        return this.http.get(this.URL+socialProvider+"/login")
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    callback(socialProvider:string): Observable<String>{
        let queryParam: string;
        this.activatedRoute.queryParams.subscribe(
           (param: any) => {
            let oauth_token = param['oauth_token'];
            let oauth_verifier = param['oauth_verifier'];
            let denied = param['denied'];
            let code = param['code'];
            let error_code = param['error_code'];
            let error_message = param['error_message'];
            let error_description = param['error_description'];

            if(oauth_token != null && oauth_verifier != null)
                queryParam = "?oauth_token="+oauth_token+"&oauth_verifier="+oauth_verifier;
            else if(denied != null)
                queryParam = "?denied="+denied;
            else if(error_code != null && (error_message != null || error_description != null))
                queryParam = "?error_code="+error_code+"&error_message="+error_message;
            else
                queryParam = "?code="+code;
          });
        return this.http.get(this.URL+socialProvider+"/callback"+queryParam)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    listAccounts(userId: number, source: string){
        return this.http.get(this.URL+'social/accounts?access_token='+
                this.authenticationService.access_token+'&userId='+userId+'&source='+source)
        .map(this.extractData)
        .catch(this.handleError); 
    }
    
    listEvents(){
        return this.http.get(this.URL+"social/update-status?access_token="+this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError); 
    }
    
    updateStatus(socialStatus: SocialStatus){
        return this.http.post(this.URL+"social/update-status?access_token="+this.authenticationService.access_token,socialStatus)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    deleteStatus(socialStatus: SocialStatus){
        return this.http.post(this.URL+"social/delete-status?access_token="+this.authenticationService.access_token,socialStatus)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    uploadMedia(formData: FormData){
        let headers = new Headers();
        headers.set('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.URL+"social/upload-media?access_token="+this.authenticationService.access_token, formData, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    removeMedia(fileName: String){
        return this.http.get(this.URL+"social/remove-media?access_token="+this.authenticationService.access_token+"&fileName="+fileName)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    listVideos(){
        return this.http.get(this.URL+"admin/listVideosNew?access_token="+this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    private extractData(res: Response) {
        let body = res.json();
        console.log(body);
        return body || {};
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
        return Observable.throw(errMsg);
    }
    
}