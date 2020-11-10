import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Pagination } from "app/core/models/pagination";
import {DamPostDto} from '../models/dam-post-dto';
import { DamPublishPostDto } from '../models/dam-publish-post-dto';
import { DamUploadPostDto } from '../models/dam-upload-post-dto';
import { DamAnalyticsPostDto } from '../models/dam-analytics-post-dto';

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

  listPublishedPartners(pagination: Pagination) {
    return this.utilPostListMethod("listPublishedPartners",pagination);
  }

  listPublishedPartnersAnalytics(pagination:Pagination){
    return this.utilPostListMethod("listPublishedPartnersAnalytics",pagination);
  }

  publish(damPostDto:DamPublishPostDto){
    return this.http.post(this.URL +"publish?access_token=" + this.authenticationService.access_token,damPostDto)
    .map(this.extractData)
    .catch(this.handleError);
  }

  updateDownloadOptions(input:any){
    return this.http.post(this.URL +"updateDownloadOptions?access_token=" + this.authenticationService.access_token,input)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getDownloadOptions(alias:string){
    return this.http.get(this.URL +"getDownloadOptions/"+alias+"?access_token=" + this.authenticationService.access_token)
    .map(this.extractData)
    .catch(this.handleError);
  }

  listPublishedPartnersByDamId(damId:number){
    return this.http.get(this.URL +"listPublishedPartneshipIdsByDamId/"+damId+"?access_token=" + this.authenticationService.access_token)
    .map(this.extractData)
    .catch(this.handleError);
  }

  listHistory(pagination: Pagination) {
   return this.utilPostListMethod("listHistory",pagination);
  }

  getById(id:number,isPartnerView:boolean){
    let url = isPartnerView ? 'getPublishedAssetById':'getById';
    return this.http.get(this.URL +url+"/"+id+"?access_token=" + this.authenticationService.access_token)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getAssetDetailsById(id:number){
    return this.http.get(this.URL +"getAssetDetailsById/"+id+"?access_token=" + this.authenticationService.access_token)
    .map(this.extractData)
    .catch(this.handleError);
  }

  save(damPostDto:DamPostDto){
    return this.utilPostSaveOrUpdateMethod("save",damPostDto);
  }

  updatePublishedAsset(damPostDto:DamPostDto){
    return this.utilPostSaveOrUpdateMethod("updatePublishedAsset",damPostDto);
  }

  getSharedAssetDetailsById(id:number){
    return this.http.get(this.URL+"getSharedAssetDetailsById/"+id+"?access_token=" + this.authenticationService.access_token)
    .map(this.extractData)
    .catch(this.handleError);
  }


  delete(damUploadPostDTO:DamUploadPostDto){
    return this.http.post(this.URL +"delete?access_token=" + this.authenticationService.access_token,damUploadPostDTO)
    .map(this.extractData)
    .catch(this.handleError);
  }

  deletePartner(id:number){
    return this.http.get(this.URL +"deletePartner/"+id+"?access_token=" + this.authenticationService.access_token,"")
    .map(this.extractData)
    .catch(this.handleError);
  }
  
  
  utilPostSaveOrUpdateMethod(url:string,postObject:any){
    return this.http.post(this.URL +url+ "?access_token=" + this.authenticationService.access_token,postObject)
    .map(this.extractData)
    .catch(this.handleError);
  }


  utilPostListMethod(url:string,pagination:Pagination){
    return this.http.post(this.URL +url+"?access_token=" + this.authenticationService.access_token,pagination)
    .map(this.extractData)
    .catch(this.handleError);
  }

  saveDamAnalytics(damAnalyticsPostDto:DamAnalyticsPostDto){
    return this.http.post(this.URL +"saveDamAnalytics?access_token=" + this.authenticationService.access_token,damAnalyticsPostDto)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getDamAnalyticsTilesInfo(damPartnerId:number){
    return this.http.get(this.URL +"showPartnerDetailsWithAnalyticsCount/"+damPartnerId+"?access_token=" + this.authenticationService.access_token)
    .map(this.extractData)
    .catch(this.handleError);
  }

  listDamAnalytics(pagination:Pagination){
    return this.utilPostListMethod("listDamAnalytics",pagination);
  }

  uploadAsset(formData:FormData,damUploadPostDto:DamUploadPostDto){
    formData.append('damUploadPostDTO', new Blob([JSON.stringify(damUploadPostDto)],
    {
      type: "application/json"
    }));

  return this.http.post(this.URL + "upload?access_token=" + this.authenticationService.access_token, formData)
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
