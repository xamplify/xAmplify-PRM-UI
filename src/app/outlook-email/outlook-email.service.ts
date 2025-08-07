import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { EmailThread } from './models/email-thread';

@Injectable()
export class OutlookEmailService {
  private URL = this.authenticationService.REST_URL + '/email/threads';
  private ACCESS_TOKEN_URL = 'access_token=' + this.authenticationService.access_token;

  constructor(private http: Http, private authenticationService: AuthenticationService) {}

  getGmailThreads(accessToken:string): Observable<EmailThread[]> {
    const url = this.URL + '/gmail?token='+ accessToken + '&'+this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url)
     .map(res => res.data as EmailThread[]);
  }

  fetchThreadById(threadId: string): Observable<EmailThread[]> {
    const url = this.URL + '/thread/' + threadId + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url)
     .map(res => res.data as EmailThread[]);
  }

   getOutlookThreads(accessToken:string) {
    const url = this.URL + '/outlook?token='+ accessToken + '&'+this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url);
  }

  authorizeGmail(){
     const url = this.URL + '/gmail/authorize' + '?'+this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url)
  }
   authorizeOutlook(){
     const url = this.URL + '/outlook/authorize' + '?'+this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url)
  }

  getAccessToken(){
     const url = this.URL + '/mail/accessToken/'+this.authenticationService.getUserId()+ '?'+this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url)
  }
}
