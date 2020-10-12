import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Pagination } from "app/core/models/pagination";
import {DamPostDto} from '../models/dam-post-dto';
import { DamPublishPostDto } from '../models/dam-publish-post-dto';

@Injectable()
export class DamService {
  URL = this.authenticationService.REST_URL + "dam/";
  constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger) { }
 
  list(pagination: Pagination) {
    return this.utilPostListMethod("list",pagination);
  }
  listPublishedAssets(pagination: Pagination) {
    return this.utilPostListMethod("listPublishedAssets",pagination);
  }

  listPartners(pagination: Pagination) {
    return this.utilPostListMethod("listPartners",pagination);
  }
  publish(damPostDto:DamPublishPostDto){
    return this.http.post(this.URL +"publish?access_token=" + this.authenticationService.access_token,damPostDto)
    .map(this.extractData)
    .catch(this.handleError);
  }

  listPublishedPartners(damId:number){
    return this.http.get(this.URL +"listPublishedPartneshipIdsByDamId/"+damId+"?access_token=" + this.authenticationService.access_token)
    .map(this.extractData)
    .catch(this.handleError);
  }

  listHistory(pagination: Pagination) {
   return this.utilPostListMethod("listHistory",pagination);
  }

  

  save(damPostDto:DamPostDto){
    return this.http.post(this.URL + "save?access_token=" + this.authenticationService.access_token,damPostDto)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getById(id:number,isPartnerView:boolean){
    let url = isPartnerView ? 'getPublishedAssetById':'getById';
    return this.http.get(this.URL +url+"/"+id+"?access_token=" + this.authenticationService.access_token)
    .map(this.extractData)
    .catch(this.handleError);
  }



  utilPostListMethod(url:string,pagination:Pagination){
    return this.http.post(this.URL +url+"?access_token=" + this.authenticationService.access_token,pagination)
    .map(this.extractData)
    .catch(this.handleError);
  }
  
  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  handleError(error: any) {
    return Observable.throw(error);
  }
}
