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

@Injectable()
export class LmsService {

  URL = this.authenticationService.REST_URL + "lms";
  learningTrack:LearningTrack;

  constructor(private http: HttpClient,private authenticationService: AuthenticationService, private logger: XtremandLogger) { }

  saveOrUpdate(learningTrack: LearningTrack) {
    let url = this.URL;
    if(learningTrack.id > 0){
      url = url + "/edit"
    } else{
      url = url + "/save"
    }
    return this.http.post(url + "?access_token=" + this.authenticationService.access_token, learningTrack)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPartnerCompaniesByUserId(userId: number) {
    return this.http.get(this.URL + "/" + userId + "/partner/companies?access_token=" + this.authenticationService.access_token)
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

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  private handleError(error: any) {
    return Observable.throw(error);
  }
}
