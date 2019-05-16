import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { EmailTemplate } from '../models/email-template';
import { EmailSpamScore } from '../models/email-spam-score';
import { AuthenticationService } from '../../core/services/authentication.service';

@Injectable()
export class EmailSpamCheckService {
  URL = this.authenticationService.REST_URL + '/mail/spam/';
  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  listEmailSpamScoresByEmailTemplateId(emailTemplateId: number) {
    return this.http.get(this.URL + `template/${emailTemplateId}?access_token=${this.authenticationService.access_token}`)
      .map(this.authenticationService.extractData)
      .catch(this.authenticationService.handleError);
  }

  getEmailSpamScoreById(id: number) {
    return this.http.get(this.URL + `${id}?access_token=${this.authenticationService.access_token}`)
      .map(this.authenticationService.extractData)
      .catch(this.authenticationService.handleError);
  }

  getEmailSpamScoreByToEmail(toEmail: string) {
    return this.http.get(this.URL + `${toEmail}?access_token=${this.authenticationService.access_token}`)
      .map(this.authenticationService.extractData)
      .catch(this.authenticationService.handleError);
  }

  test(toEmail: string){
    return this.http.get(`https://www.mail-tester.com/${toEmail}&format=json`)
      .map(this.authenticationService.extractData)
      .catch(this.authenticationService.handleError);
  }

  send(emailSpamScore: EmailSpamScore){
    return this.http.post(this.URL + `send?access_token=${this.authenticationService.access_token}`, emailSpamScore)
      .map(this.authenticationService.extractData)
      .catch(this.authenticationService.handleError);
  }

  updateScore(emailSpamScore: EmailSpamScore){
    return this.http.post(this.URL + `update?access_token=${this.authenticationService.access_token}`, emailSpamScore)
      .map(this.authenticationService.extractData)
      .catch(this.authenticationService.handleError);
  }

  updateScoreInEmailTemplate(emailTemplate: EmailTemplate) {
    return this.http.post(this.URL + `update-email-template?access_token=${this.authenticationService.access_token}`, emailTemplate)
      .map(this.authenticationService.extractData)
      .catch(this.authenticationService.handleError);
  }
}
