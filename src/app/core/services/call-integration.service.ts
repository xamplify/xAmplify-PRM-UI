import { Injectable } from '@angular/core';
import { ReferenceService } from './reference.service';
import { ActivatedRoute } from '@angular/router';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Http } from '@angular/http';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { Pagination } from '../models/pagination';

@Injectable()
export class CallIntegrationService {

  URL = this.authenticationService.REST_URL + "/call";
  ACCESS_TOKEN_URL = "?access_token=" + this.authenticationService.access_token;

  constructor(private authenticationService: AuthenticationService, private _http: Http, private logger: XtremandLogger, private referenceService: ReferenceService) { }

  checkConfigurationByType(type: string) {
    let url = this.URL + "/authorize/" + type + "/" + this.authenticationService.getUserId() + this.ACCESS_TOKEN_URL;
    this.logger.info(url);
    return this.authenticationService.callGetMethod(url);
  }

  handleCallIntegrationCallbackByType(code: string, type: string): Observable<String> {
    let url = this.URL + "/oauth/callback/" + type + "/" + this.authenticationService.getUserId() + "?code=" + code;
    this.logger.info(url);
    if (this.referenceService.checkIsValidString(code)) {
      let vanityUrlFilter = localStorage.getItem('vanityUrlFilter');
      let vanityUserId = localStorage.getItem('vanityUserId');
      if (vanityUrlFilter) {
        return this.authenticationService.callGetMethod(this.URL + "/oauth/callback/" + type + "/" + vanityUserId + "?code=" + code);
      } else {
        return this.authenticationService.callGetMethod(url);
      }
    }
  }

  getIntegrationDetails(type:string) {
    return this.authenticationService.callGetMethod(this.URL + `/${type}/${this.authenticationService.getUserId()}/user/info?access_token=${this.authenticationService.access_token}`);
  }

  setActiveCall(request: any) {
    request.userId = this.authenticationService.getUserId();
    return this.authenticationService.callPostMethod(this.URL + `/active?access_token=${this.authenticationService.access_token}`, request);
  }

  unlinkCall(type: any) {
    return this.authenticationService.callGetMethod(this.URL + '/' + type + "/unlink/call/" + this.authenticationService.getUserId() + this.ACCESS_TOKEN_URL)
  }

  getActiveCallIntegration() {
    return this.authenticationService.callGetMethod(this.URL + `/active/${this.authenticationService.getUserId()}?access_token=${this.authenticationService.access_token}`);
  }

  fetchAllCallActivities(callActivityPagination: Pagination, type: any, isCompanyJourney:boolean) {
    let pageableUrl = this.referenceService.getPagebleUrl(callActivityPagination);
    let loggedInUserIdParameter = '&loggedInUserId='+this.authenticationService.getUserId();
    let isCompanyJourneyParameter = '&isCompanyJourney='+isCompanyJourney;
    let contactIdParameter = '&contactId=' + (callActivityPagination.contactId != undefined && callActivityPagination.contactId > 0 ? callActivityPagination.contactId : 0);
    let userListIdParameter = '&userListId=' + (callActivityPagination.userListId != undefined && callActivityPagination.userListId > 0 ? callActivityPagination.userListId : 0);
    let typeParameter = this.referenceService.isValidString(type) ? '&type='+type : '';
    pageableUrl = pageableUrl + loggedInUserIdParameter + isCompanyJourneyParameter + contactIdParameter + userListIdParameter + typeParameter;
    let url = this.URL + "/fetchAllCallActivities" + this.ACCESS_TOKEN_URL + pageableUrl;
    return this.authenticationService.callGetMethod(url);
  }

}
