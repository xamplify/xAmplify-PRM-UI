import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { AuthenticationService } from "app/core/services/authentication.service";
import { Observable } from "rxjs/Observable";
import { SamlSsoLoginComponent } from './saml-sso-login.component';
import { SamlSecurity } from '../models/samlsecurity';

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

  saveOauthSsoConfiguration(oauthSso: any): Observable<SamlSecurity> {
    const url = this.authenticationService.REST_URL + "oauth/sso/save?access_token=" + this.authenticationService.access_token;
    return this.http.post(url, oauthSso)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
