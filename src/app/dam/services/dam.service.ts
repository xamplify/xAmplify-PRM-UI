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
import { HttpClient, HttpRequest } from "@angular/common/http";
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { UtilService } from 'app/core/services/util.service';
import { ReferenceService } from 'app/core/services/reference.service';


@Injectable()
export class DamService {
 
  URL = this.authenticationService.REST_URL + "dam/";
  playbooksUrl = this.authenticationService.REST_URL+"playbooks/";
  ACCESS_TOKEN_SUFFIX_URL = "?access_token=";
  DAM_PREFIX_URL = this.authenticationService.REST_URL + "dam";
  DAM_URL = this.DAM_PREFIX_URL+this.ACCESS_TOKEN_SUFFIX_URL;
  ispreviousAssetIsProcessing = false;
  uploadAssetInProgress : boolean = false;
  
  constructor(private http: HttpClient, private authenticationService: AuthenticationService, 
    private logger: XtremandLogger,private utilService:UtilService,private referenceService:ReferenceService) { }

  list(pagination: Pagination) {
    return this.utilPostListMethod("list", pagination);
  }
  listPublishedAssets(pagination: Pagination) {
    /****XNFR-252*****/
    let companyProfileName = this.authenticationService.companyProfileName;
    let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
    if(xamplifyLogin){
        pagination.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
    }
    /****XNFR-252*****/
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
    return this.http.get(this.URL + "getAssetDetailsById/" + id +"/"+ this.authenticationService.user.id + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  save(damPostDto: DamPostDto) {
    return this.utilPostSaveOrUpdateMethod("save", damPostDto);
  }

  updatePublishedAsset(damPostDto: DamPostDto) {
    return this.utilPostSaveOrUpdateMethod("updatePublishedAsset", damPostDto);
  }

  updatePDFData(damPostDto: DamPostDto){
    return this.http.put(this.URL + "updatePDFData?access_token=" + this.authenticationService.access_token,damPostDto)
      .map(this.extractData)
      .catch(this.handleError);
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
      let url: string = "";
      if (!damUploadPostDto.cloudContent) {
          url = isAdd ? 'upload-content' : 'update';
      } else {
          url = isAdd ? 'upload-cloud-content' : 'update';
      }
      formData.append('damUploadPostDTO', new Blob([JSON.stringify(damUploadPostDto)],
          {
              type: "application/json"
          }));
      return this.http.post(this.URL + url + "?access_token=" + this.authenticationService.access_token, formData)
          .map(this.extractData)
          .catch(this.handleError);
  }

  uploadVideo(formData: FormData, damUploadPostDto: DamUploadPostDto) {
      formData.append('damUploadPostDTO', new Blob([JSON.stringify(damUploadPostDto)],
          {
              type: "application/json"
          }));
      if (!damUploadPostDto.cloudContent && damUploadPostDto.source!= 'webcam') {
          let requestURL = this.URL + "upload-content?access_token=" + this.authenticationService.access_token;
          const req = new HttpRequest('POST', requestURL, formData, {
              reportProgress: true,
              responseType: 'json'
          });
          return this.http.request(req);
      } else {
    	  let url = damUploadPostDto.source!= 'webcam'?'upload-cloud-content' : 'upload-content';
          let requestURL = this.URL + url +"?access_token=" + this.authenticationService.access_token;
          return this.http.post(requestURL, formData)
              .map(this.extractData)
              .catch(this.handleError);
      }
  }
  
  processVideo(formData: FormData, damUploadPostDto: DamUploadPostDto, path : string) {
      formData.append('damUploadPostDTO', new Blob([JSON.stringify(damUploadPostDto)],
          {
              type: "application/json"
          }));
      return this.http.post(this.URL + "process-video?path="+path+"&access_token=" + this.authenticationService.access_token, formData)
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

  findFileTypes(companyId: number,categoryId:number) {
    if(undefined==categoryId){
      categoryId = 0;
    }
    return this.utilGetMethod("findFileTypes/" + companyId+"/"+categoryId);
   }

   findFileTypesForPartnerView(vanityLoginDto:VanityLoginDto,categoryId:number){
     vanityLoginDto.userId = this.authenticationService.getUserId();
     if(undefined==categoryId){
      categoryId = 0;
    }
    return this.http.post(this.URL + "findFileTypesForPartnerView/"+categoryId+ "?access_token=" + this.authenticationService.access_token, vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
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
  
  assetPath(pagination: Pagination) {
    return this.http.post(this.URL + "list/" + "?access_token=" + this.authenticationService.access_token, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  changeAsParentAsset(id: number) {
    return this.http.put(this.URL + "changeAsParentAsset/"+id+"/"+this.authenticationService.getUserId()+"?access_token=" + this.authenticationService.access_token,"")
      .map(this.extractData)
      .catch(this.handleError);
  }

  /********XNFR-342****/
  findAssetsToShare(pagination:Pagination){
    let userId = this.authenticationService.getUserId();
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let findAllUrl = this.DAM_PREFIX_URL+'/findAllUnPublishedAndFilteredPublishedAssets/'+userId+'/'+pagination.userListId+'/'+pagination.partnerId+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token+pageableUrl;
    return this.authenticationService.callGetMethod(findAllUrl);
  }
  
  /**** XBI-2133 ****/
  fetchWhiteLabeledContentSharedByVendorCompanies(companyId: number) {
    return this.utilGetMethod("sharedByVendorCompany/" + companyId);
  }

  findSharedAssetsByCompaniesForPartnerView(vanityLoginDto:VanityLoginDto) {
    return this.http.post(this.URL + "findSharedAssetsByCompaniesForPartnerView/?access_token=" + this.authenticationService.access_token, vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
  }

   /**** XNFR-543 ****/
  findPartnerCompanies(pagination: Pagination,damId:number) {
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let userId = this.authenticationService.getUserId();
    let findAllUrl = this.DAM_PREFIX_URL+'/findAllPartners/damId/'+damId+'/userId/'+userId+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token+pageableUrl;
    return this.authenticationService.callGetMethod(findAllUrl);
  }

   /**** XNFR-543 ****/
   findPartnerCompanyUsers(pagination: Pagination) {
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let findAllUrl = this.DAM_PREFIX_URL+'/findAllPartnerCompanyUsers/id/'+pagination.id+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token+pageableUrl;
    return this.authenticationService.callGetMethod(findAllUrl);
  }




}
