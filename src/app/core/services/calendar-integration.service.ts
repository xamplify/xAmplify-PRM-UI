import { Injectable } from '@angular/core';
import { ReferenceService } from './reference.service';
import { ActivatedRoute } from '@angular/router';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Http } from '@angular/http';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';

@Injectable()
export class CalendarIntegrationService {

  constructor(private authenticationService: AuthenticationService, private _http: Http, private logger: XtremandLogger, private activatedRoute: ActivatedRoute, private refService: ReferenceService) { }

  checkConfigurationByType(type: string) {
    let url = this.authenticationService.REST_URL + "authorize/" + type + "/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token;
    this.logger.info(url);
    return this.authenticationService.callGetMethod(url);
  }

  handleCalendarCallbackByType(code: string, type: string): Observable<String> {
    let url = this.authenticationService.REST_URL + "oauth/callback/" + type + "/" + this.authenticationService.getUserId() + "?code=" + code;
    this.logger.info(url);
    if (this.refService.checkIsValidString(code)) {
      let vanityUrlFilter = localStorage.getItem('vanityUrlFilter');
      let vanityUserId = localStorage.getItem('vanityUserId');
      if (vanityUrlFilter) {
        return this.authenticationService.callGetMethod(this.authenticationService.REST_URL + "oauth/callback/" + type + "/" + vanityUserId + "?code=" + code);
      } else {
        return this.authenticationService.callGetMethod(url);
      }
    }
  }

  vanityConfigCalendly() {
    return this.authenticationService.callGetMethod(this.authenticationService.REST_URL + "/authorize/calendly/" + localStorage.getItem('vanityUserId'));
  }

  getIntegrationDetails(type:string) {
    return this.authenticationService.callGetMethod(this.authenticationService.REST_URL + `/${type}/${this.authenticationService.getUserId()}/user/info?access_token=${this.authenticationService.access_token}`);
  }

  setActiveCalendar(request: any) {
    request.userId = this.authenticationService.getUserId();
    return this.authenticationService.callPostMethod(this.authenticationService.REST_URL + `calendar/active?access_token=${this.authenticationService.access_token}`, request);
  }

  unlinkCalendar(type: any) {
    return this.authenticationService.callGetMethod(this.authenticationService.REST_URL + type + "/unlink/calendar/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token)
  }

  getActiveCalendarDetails() {
    return this.authenticationService.callGetMethod(this.authenticationService.REST_URL + "calendar/active/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token);
  }

}
