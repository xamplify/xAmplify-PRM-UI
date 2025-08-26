import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { EmailThread } from './models/email-thread';
import { EmailRequestDto } from './models/email-request-dto';

@Injectable()
export class OutlookEmailService {
  private URL = this.authenticationService.REST_URL + '/email/threads';
  private ACCESS_TOKEN_URL = 'access_token=' + this.authenticationService.access_token;
  private _content: any;
  constructor(private http: Http, private authenticationService: AuthenticationService) { }
  setContent(content: any) {
    this._content = content;
  }

  getContent() {
    return this._content;
  }
  getGmailThreads(accessToken: string) {
    const url = this.URL + '/gmail?token=' + accessToken + '&' + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url);
  }

  fetchThreadById(threadId: string) {
    const url = this.URL + '/thread/' + threadId + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url);
  }

  getOutlookThreads(accessToken: string){
    const url = this.URL + '/outlook?token=' + accessToken + '&' + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url);
  }

  authorizeGmail() {
    const url = this.URL + '/gmail/authorize' + '?' + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url)
  }
  authorizeOutlook() {
    const url = this.URL + '/outlook/authorize' + '?' + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url)
  }

  getAccessToken() {
    const url = this.URL + '/mail/accessToken/' + this.authenticationService.getUserId() + '?' + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url)
  }

  checkConfigurationByType(type: string) {
    let url = this.URL + "/authorize/" + type + "/" + this.authenticationService.getUserId() + '?' + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url);
  }

  sendOrReply(sendTestEmailDto: EmailRequestDto, formData: FormData) {
    formData.append('emailRequestDTO', new Blob([JSON.stringify(sendTestEmailDto)], {
      type: "application/json"
    }));
    const url = this.URL + '/mail/send-reply?' + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callPostMethod(url, formData);
  }

  replyMail(sendTestEmailDto: EmailRequestDto, formData: FormData, isForward:boolean) {
    formData.append('emailRequestDTO', new Blob([JSON.stringify(sendTestEmailDto)], {
      type: "application/json"
    }));
    const forward = isForward ? 'forward': 'reply';
    const url = this.URL + '/mail/'+forward+'?' + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callPostMethod(url, formData);
  }

  // forwardMail(sendTestEmailDto: EmailRequestDto, formData: FormData) {
  //   formData.append('emailRequestDTO', new Blob([JSON.stringify(sendTestEmailDto)], {
  //     type: "application/json"
  //   }));
  //   const url = this.URL + '/mail/forward?' + this.ACCESS_TOKEN_URL;
  //   return this.authenticationService.callPostMethod(url, formData);
  // }

  fetchGmailsByThreadId(accessToken: string, threadId: string) {
    const url = this.URL + '/gmail/preview?token=' + accessToken + '&threadId=' + threadId + '&' + this.ACCESS_TOKEN_URL;
    return this.authenticationService.callGetMethod(url);
  }

}
