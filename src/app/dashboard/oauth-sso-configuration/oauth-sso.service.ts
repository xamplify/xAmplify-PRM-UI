import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { AuthenticationService } from "app/core/services/authentication.service";
import { Observable } from "rxjs/Observable";
import { OauthSso } from '../models/oauth-sso';

@Injectable()
export class OauthSsoService {

  constructor(private http: Http, private authenticationService: AuthenticationService) { }


  extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body || {};
  }

  handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
    return Observable.throw(error);
  }

  
  getOauthSsoConfigurationDetails(userId:number){
    const url = this.authenticationService.REST_URL + "oauth/sso/getDetails?userId=" + userId + "&access_token=" + this.authenticationService.access_token;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  saveOrUpdateOauthSsoConfiguration(oauthSso: any): Observable<OauthSso> {
    let saveOrUpdateUrl = "oauth/sso/save"; 
    if (oauthSso.id !== undefined && oauthSso.id > 0) {
      saveOrUpdateUrl = "oauth/sso/update"
    }

    const url = this.authenticationService.REST_URL + saveOrUpdateUrl +"?access_token=" + this.authenticationService.access_token;
    return this.http.post(url, oauthSso)
      .map(this.extractData)
      .catch(this.handleError);
  }

  login(companyProfileName: any) {
    const url = this.authenticationService.REST_URL+ `/oauth/sso/authorize/${companyProfileName}`;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

}
