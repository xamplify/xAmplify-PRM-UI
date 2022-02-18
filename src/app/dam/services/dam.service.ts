import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Pagination } from "app/core/models/pagination";
import { DamPostDto } from '../models/dam-post-dto';
import { DamPublishPostDto } from '../models/dam-publish-post-dto';
import { DamUploadPostDto } from '../models/dam-upload-post-dto';
import { DamAnalyticsPostDto } from '../models/dam-analytics-post-dto';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class DamService {
  URL = this.authenticationService.REST_URL + "dam/";
  playbooksUrl = this.authenticationService.REST_URL+"playbooks/"
  constructor(private http: HttpClient, private authenticationService: AuthenticationService, private logger: XtremandLogger) { }

  list(pagination: Pagination) {
    return this.utilPostListMethod("list", pagination);
  }
  listPublishedAssets(pagination: Pagination) {
    return this.utilPostListMethod("listPublishedAssets", pagination);
  }

  listPartners(pagination: Pagination) {
    return this.utilPostListMethod("listPartners", pagination);
  }

  listPublishedPartners(pagination: Pagination) {
    return this.utilPostListMethod("listPublishedPartners", pagination);
  }

  listPublishedPartnersAnalytics(pagination: Pagination) {
    return this.utilPostListMethod("listPublishedPartnersAnalytics", pagination);
  }

  publish(damPostDto: DamPublishPostDto) {
    return this.http.post(this.URL + "publish?access_token=" + this.authenticationService.access_token, damPostDto)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateDownloadOptions(input: any) {
    return this.http.post(this.URL + "updateDownloadOptions?access_token=" + this.authenticationService.access_token, input)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDownloadOptions(alias: string) {
    return this.http.get(this.URL + "getDownloadOptions/" + alias + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listPublishedPartnersByDamId(damId: number) {
    return this.http.get(this.URL + "listPublishedPartneshipIdsByDamId/" + damId + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listHistory(pagination: Pagination) {
    return this.utilPostListMethod("listHistory", pagination);
  }

  getById(id: number, isPartnerView: boolean) {
    let url = isPartnerView ? 'getPublishedAssetById' : 'getById';
    return this.http.get(this.URL + url + "/" + id + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAssetDetailsById(id: number) {
    return this.http.get(this.URL + "getAssetDetailsById/" + id + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  save(damPostDto: DamPostDto) {
    return this.utilPostSaveOrUpdateMethod("save", damPostDto);
  }

  updatePublishedAsset(damPostDto: DamPostDto) {
    return this.utilPostSaveOrUpdateMethod("updatePublishedAsset", damPostDto);
  }

  


  delete(damUploadPostDTO: DamUploadPostDto) {
    return this.http.post(this.URL + "delete?access_token=" + this.authenticationService.access_token, damUploadPostDTO)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deletePartner(id: number) {
    return this.http.get(this.URL + "deletePartner/" + id + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }


  utilPostSaveOrUpdateMethod(url: string, postObject: any) {
    return this.http.post(this.URL + url + "?access_token=" + this.authenticationService.access_token, postObject)
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveDamAnalytics(damAnalyticsPostDto: DamAnalyticsPostDto) {
    return this.http.post(this.URL + "saveDamAnalytics?access_token=" + this.authenticationService.access_token, damAnalyticsPostDto)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDamAnalyticsTilesInfo(pagination:Pagination) {
    return this.http.get(this.URL + "showPartnerDetailsWithAnalyticsCount/" + pagination.campaignId + "/"+pagination.userId+"?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listDamAnalytics(pagination: Pagination) {
    return this.utilPostListMethod("listDamAnalytics", pagination);
  }
  
  checkDamIdAndPartnerId(damId:number,partnerId:number){
    return this.http.get(this.URL  + "checkDamAndPartnerId/"+damId+"/"+partnerId+"?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  checkDamPartnerId(damPartnerId:number){
    return this.http.get(this.URL  + "checkDamPartnerId/"+damPartnerId+"?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  uploadOrUpdate(formData: FormData, damUploadPostDto: DamUploadPostDto, isAdd: boolean) {
    formData.append('damUploadPostDTO', new Blob([JSON.stringify(damUploadPostDto)],
      {
        type: "application/json"
      }));
    let url = isAdd ? 'upload-content' : 'update';
    return this.http.post(this.URL + url + "?access_token=" + this.authenticationService.access_token, formData)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSharedAssetDetailsById(id: number) {
   return this.utilGetMethod("getSharedAssetDetailsById/" + id);
  }

  previewAssetById(id:number){
    return this.utilGetMethod("previewAssetById/" + id);
  }

  /**********Partners / Partner List Modal Popup APIS*************/
  findPublishedPartnershipIdsByDamId(id:number,moduleName:string){
    let url = this.findApiPrefixUrlByModule(moduleName);
    return this.callGetMethod(url+"findPublishedPartnershipIds/"+id);
  }

  findPublishedPartnerGroupIdsByDamId(id:number,moduleName:string){
    let url = this.findApiPrefixUrlByModule(moduleName);
    return this.callGetMethod(url+"findPublishedPartnerGroupIds/"+id);
  }

  findPublishedPartnerIds(damId:number,moduleName:string){
    let url = this.findApiPrefixUrlByModule(moduleName);
    return this.callGetMethod(url+"findPublishedPartnerIds/"+damId);
  }

  isPublishedToPartnerGroups(damId:number,moduleName:string){
    let url = this.findApiPrefixUrlByModule(moduleName);
    return this.callGetMethod(url+"isPublishedToPartnerGroups/"+damId);
  }

  private findApiPrefixUrlByModule(moduleName:string){
    let url = "";
    if("dam"==moduleName){
       url= this.URL;
    }else if("playbooks"==moduleName){
      url = this.playbooksUrl;
    }
    return url;
  }

  private callGetMethod(url:string){
    return this.http.get(url + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }


  /**********Partners / Partner List Modal Popup APIS*************/

  private utilGetMethod(url: string) {
    return this.http.get(this.URL + url + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

 private utilPostListMethod(url: string, pagination: Pagination) {
    return this.http.post(this.URL + url + "?access_token=" + this.authenticationService.access_token, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  extractData(res: Response) {
    let body = res;
    return body || {};
  }

  handleError(error: any) {
    return Observable.throw(error);
  }
  // upload content from cloud storage
  downloadFromGDrive(downloadLink: string, fileName: string, oauthToken: string): Observable<any> {
      fileName = fileName.replace(/[^a-zA-Z0-9.]/g, '');
      var suffix = fileName.substring(fileName.lastIndexOf("."));
      var prefix = fileName.substring(0, fileName.lastIndexOf("."));
      fileName = prefix + suffix;
      console.log('file path in service' + downloadLink + 'file name' + fileName + 'oauthToken' + oauthToken);
      const url = this.URL + '?access_token=' + this.authenticationService.access_token +
          '&downloadLink=' + downloadLink + '&fileName=' + fileName + '&oauthToken=' + oauthToken +
          '&userId=' + this.authenticationService.user.id;
      return this.http.post(url, "")
          .catch(this.handleError);
}
}
