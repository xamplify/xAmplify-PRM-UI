import { Injectable } from '@angular/core';
import {  Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../../core/services/authentication.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { TracksPlayBook } from '../models/tracks-play-book';
import { HttpClient } from "@angular/common/http";
import { TracksPlayBookType } from '../models/tracks-play-book-type.enum';
import { UtilService } from 'app/core/services/util.service';


@Injectable()
export class TracksPlayBookUtilService {

  trackURL = this.authenticationService.REST_URL + "lms";
  playBookURL = this.authenticationService.REST_URL + "playbook";

  constructor(private http: HttpClient,private authenticationService: AuthenticationService, private logger: XtremandLogger,private utilService:UtilService) { }

  saveOrUpdate(formData: FormData, tracksPlayBook: TracksPlayBook) {
    let url = this.trackURL;
    if (tracksPlayBook.id > 0) {
      url = url + "/edit"
    } else {
      url = url + "/save"
    }
    formData.append('learningTrack', new Blob([JSON.stringify(tracksPlayBook)],
      {
        type: "application/json"
      }));
    return this.http.post(url + "?access_token=" + this.authenticationService.access_token, formData)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPartnerCompaniesByUserId(userId: number) {
    return this.http.get(this.trackURL + "/" + userId + "/partner/companies?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPartnerCompanies(pagination: Pagination) {
    return this.http.post(this.trackURL + "/partner/companies?access_token=" + this.authenticationService.access_token, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  validateSlug(tracksPlayBook: TracksPlayBook) {
    return this.http.post(this.trackURL + "/slug/validate?access_token=" + this.authenticationService.access_token, tracksPlayBook)
      .map(this.extractData)
      .catch(this.handleError);
  }

  list(pagination: Pagination, isPartner: boolean) {
    let url = this.trackURL + "/list/";
    if (isPartner) {
      url = url + "p";
      /****XNFR-252*****/
      let companyProfileName = this.authenticationService.companyProfileName;
      let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
      if(xamplifyLogin){
          pagination.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
      }
      /****XNFR-252*****/
    } else {
      url = url + "v";
    }
    return this.http.post(url + "?access_token=" + this.authenticationService.access_token, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getById(id: number) {
    return this.http.get(this.trackURL + "/" + id + "/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteById(tracksPlayBook: TracksPlayBook) {
    return this.http.post(this.trackURL + "/delete?access_token=" + this.authenticationService.access_token, tracksPlayBook)
      .map(this.extractData)
      .catch(this.handleError);
  }

  changePublish(id: number, isPublish: boolean) {
    return this.http.get(this.trackURL + "/" + id + "/publish/" + isPublish + "/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getBySlug(companyId: number,slug: string,type:string) {
    let url = "";
    if(type == undefined || type == TracksPlayBookType[TracksPlayBookType.TRACK]){
      url = this.trackURL;
    } else if(type == TracksPlayBookType[TracksPlayBookType.PLAYBOOK]){
      url = this.playBookURL;
    }
    return this.http.get(url + "/" + companyId + "/" + slug + "/" + this.authenticationService.getUserId() + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updatePartnerProgress(progress: TracksPlayBook) {
    return this.http.post(this.trackURL + "/p/progress?access_token=" + this.authenticationService.access_token, progress)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAnalytics(pagination:Pagination){
    return this.http.post(this.trackURL + "/analytics?access_token=" + this.authenticationService.access_token, pagination)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getPartnerAnalytics(pagination:Pagination){
    return this.http.post(this.trackURL + "/partner/analytics?access_token=" + this.authenticationService.access_token, pagination)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getPartnerDetailedAnalytics(pagination:Pagination){
    return this.http.post(this.trackURL + "/partner/analytics/activities?access_token=" + this.authenticationService.access_token, pagination)
    .map(this.extractData)
    .catch(this.handleError);
  }

  downloadBeeTemplate(obj:TracksPlayBook){
    return this.http.post(this.trackURL + "/download/pdf?access_token=" + this.authenticationService.access_token, obj)
    .map(this.extractData)
    .catch(this.handleError);
  }

  saveAsPlayBook(tracksPlayBook:TracksPlayBook){
    return this.http.post(this.trackURL + "/save-as?access_token=" + this.authenticationService.access_token, tracksPlayBook)
    .map(this.extractData)
    .catch(this.handleError);
  }

  validateTitle(tracksPlayBook:TracksPlayBook){
    return this.http.post(this.trackURL + "/title/validate?access_token=" + this.authenticationService.access_token, tracksPlayBook)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getPartnerFormAnalytics(tracksPlayBook:TracksPlayBook){
    return this.http.post(this.trackURL + "/partner/quiz/analytics?access_token=" + this.authenticationService.access_token, tracksPlayBook)
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
