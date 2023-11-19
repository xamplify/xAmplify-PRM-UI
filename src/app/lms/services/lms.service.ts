import { Injectable } from '@angular/core';
import {  Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { LearningTrack } from '../models/learningTrack';
import { HttpClient } from "@angular/common/http";
import { ReferenceService } from 'app/core/services/reference.service';

@Injectable()
export class LmsService {

  URL = this.authenticationService.REST_URL + "lms";
  ACCESS_TOKEN_SUFFIX_URL = "?access_token=";
  LMS_URL = URL+this.ACCESS_TOKEN_SUFFIX_URL;

  constructor(private http: HttpClient,private authenticationService: AuthenticationService,
     private logger: XtremandLogger,private referenceService:ReferenceService) { }

  saveOrUpdate(formData: FormData, learningTrack: LearningTrack) {
    let url = this.URL;
    if (learningTrack.id > 0) {
      url = url + "/edit"
    } else {
      url = url + "/save"
    }
    formData.append('learningTrack', new Blob([JSON.stringify(learningTrack)],
      {
        type: "application/json"
      }));
    return this.http.post(url + "?access_token=" + this.authenticationService.access_token, formData)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPartnerCompaniesByUserId(userId: number) {
    return this.http.get(this.URL + "/" + userId + "/partner/companies?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPartnerCompanies(pagination: Pagination) {
    return this.http.post(this.URL + "/partner/companies?access_token=" + this.authenticationService.access_token, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  validateSlug(learningTrack: LearningTrack) {
    return this.http.post(this.URL + "/slug/validate?access_token=" + this.authenticationService.access_token, learningTrack)
      .map(this.extractData)
      .catch(this.handleError);
  }

  list(pagination: Pagination, isPartner: boolean) {
    let url = this.URL + "/list/";
    if (isPartner) {
      url = url + "p";
    } else {
      url = url + "v";
    }
    return this.http.post(url + "?access_token=" + this.authenticationService.access_token, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getById(id: number) {
    return this.http.get(this.URL + "/" + id + "/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteById(learningTrack: LearningTrack) {
    return this.http.post(this.URL + "/delete?access_token=" + this.authenticationService.access_token, learningTrack)
      .map(this.extractData)
      .catch(this.handleError);
  }

  changePublish(id: number, isPublish: boolean) {
    return this.http.get(this.URL + "/" + id + "/publish/" + isPublish + "/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getBySlug(companyId: number,slug: string) {
    return this.http.get(this.URL + "/" + companyId + "/" + slug + "/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatePartnerProgress(progress: LearningTrack) {
    return this.http.post(this.URL + "/p/progress?access_token=" + this.authenticationService.access_token, progress)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAnalytics(pagination:Pagination){
    return this.http.post(this.URL + "/analytics?access_token=" + this.authenticationService.access_token, pagination)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getPartnerAnalytics(pagination:Pagination){
    return this.http.post(this.URL + "/partner/analytics?access_token=" + this.authenticationService.access_token, pagination)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getPartnerDetailedAnalytics(pagination:Pagination){
    return this.http.post(this.URL + "/partner/analytics/activities?access_token=" + this.authenticationService.access_token, pagination)
    .map(this.extractData)
    .catch(this.handleError);
  }

  downloadBeeTemplate(obj:LearningTrack){
    return this.http.post(this.URL + "/download/pdf?access_token=" + this.authenticationService.access_token, obj)
    .map(this.extractData)
    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError(error: any) {
    return Observable.throw(error);
  }

   /********XNFR-342****/
   findUnPublishedTracks(pagination:Pagination){
    let userId = this.authenticationService.getUserId();
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let findAllUrl = this.URL+'/findAllUnPublishedTracks/'+userId+'/'+pagination.userListId+'/'+pagination.partnerId+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token+pageableUrl;
    return this.authenticationService.callGetMethod(findAllUrl);
  }
}
