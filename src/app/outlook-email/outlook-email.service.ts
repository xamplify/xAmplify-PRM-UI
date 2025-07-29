import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { EmailThread } from './models/email-thread';

@Injectable()
export class OutlookEmailService {
  private URL = this.authenticationService.REST_URL + '/email/outlook';
  private ACCESS_TOKEN_URL = '?access_token=' + this.authenticationService.access_token;

  constructor(private http: Http, private authenticationService: AuthenticationService) {}

  fetchThreads(): Observable<EmailThread[]> {
    const url = this.URL + '/threads' + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url)
      .map(res => res.data as EmailThread[]);
  }

  fetchThreadById(threadId: string): Observable<EmailThread> {
    const url = this.URL + '/thread/' + threadId + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url)
      .map(res => res.data as EmailThread);
  }
}
