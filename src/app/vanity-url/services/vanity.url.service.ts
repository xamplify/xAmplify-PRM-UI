import { Injectable, Inject } from "@angular/core";
import { Http, Response } from "@angular/http";
import { AuthenticationService } from "app/core/services/authentication.service";
import { Observable } from "rxjs/Observable";
import { VanityURL } from "../models/vanity.url";
import { DashboardAnalyticsDto } from "app/dashboard/models/dashboard-analytics-dto";
import { Pagination } from "app/core/models/pagination";
import { VanityEmailTempalte } from "app/email-template/models/vanity-email-template";
import { Title, DOCUMENT } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { EnvService } from "app/env.service";
import { CustomLoginTemplate } from "app/email-template/models/custom-login-template";
import { ReferenceService } from "app/core/services/reference.service";
import { Properties } from "app/common/models/properties";

@Injectable()
export class VanityURLService {
  
  properties:Properties = new Properties();
  URL = this.authenticationService.REST_URL;
  ACCESS_TOKEN_SUFFIX_URL = "?access_token=";
  CUSTOM_LINK_PREFIX_URL = this.authenticationService.REST_URL + "customLinks";
  DASHBOARD_BUTTON_PREFIX_URL = this.authenticationService.REST_URL + "dashboardButtons";
  CUSTOM_LINK_URL = this.CUSTOM_LINK_PREFIX_URL+this.ACCESS_TOKEN_SUFFIX_URL;

  constructor(private http: Http, private authenticationService: AuthenticationService, private titleService: Title,
     @Inject(DOCUMENT) private _document: HTMLDocument, private router: Router,public envService: EnvService,
     public referenceService:ReferenceService) { }

  getVanityURLDetails(companyProfileName: string): Observable<VanityURL> {
    const url = this.authenticationService.REST_URL + "v_url/companyDetails/" + companyProfileName;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  checkUserWithCompanyProfile(companyProfileName: string, emailId: string) {
    const url = this.authenticationService.REST_URL + "v_url/validateUser/" + companyProfileName + '?emailId=' + emailId;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  getCompanyProfileNameByCompanyName(companyName: string) {
    const url = this.authenticationService.REST_URL + "v_url/getCompanyProfileName/" + companyName + '?access_token=' + this.authenticationService.access_token;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  findCompanyProfileNameByCompanyId(companyId:number){
    const url = this.authenticationService.REST_URL + "v_url/findCompanyProfileName/" + companyId + '?access_token=' + this.authenticationService.access_token;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  saveCustomLinkDetails(customLink: any,moduleType:string,formData:FormData) {
    let url = "";
    let postBody:any;
    postBody = customLink;
    if(moduleType==this.properties.dashboardButtons){
      url = this.authenticationService.REST_URL + "v_url/save/dashboardButton?access_token=" + this.authenticationService.access_token;
    }else if(moduleType==this.properties.newsAndAnnouncements){
      url = this.CUSTOM_LINK_URL+this.authenticationService.access_token;
    }else if(moduleType==this.properties.dashboardBanners){
      url = this.CUSTOM_LINK_PREFIX_URL+"/dashboardBanners"+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
      formData.append("customLinkDto",new Blob([JSON.stringify(customLink)], {type: "application/json"}));
      postBody = formData;
    }
    return this.http.post(url, postBody)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCustomLinkDetailsById(id: number) {
    let url = this.CUSTOM_LINK_PREFIX_URL+'/id/'+id+'/loggedInUserId/'+this.authenticationService.getUserId()+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
    return this.authenticationService.callGetMethod(url);
  }

  updateCustomLinkDetails(customLink: any,moduleType:string,formData:FormData) {
    let url = "";
    let postBody:any;
    postBody = customLink;
    if(moduleType==this.properties.dashboardButtons){
      url = this.authenticationService.REST_URL + "v_url/update/dashboardButton" + "?access_token=" + this.authenticationService.access_token;
      return this.http.put(url, postBody)
      .map(this.extractData)
      .catch(this.handleError);
    }else if(moduleType==this.properties.newsAndAnnouncements){
      url = this.CUSTOM_LINK_PREFIX_URL+'/'+customLink.id+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
      return this.http.put(url, postBody)
      .map(this.extractData)
      .catch(this.handleError);
    }else if(moduleType==this.properties.dashboardBanners){
      url = this.CUSTOM_LINK_PREFIX_URL+"/dashboardBanners/"+customLink.id+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
      formData.append("customLinkDto",new Blob([JSON.stringify(customLink)], {type: "application/json"}));
      postBody = formData;
      return this.http.post(url, postBody)
      .map(this.extractData)
      .catch(this.handleError);
    }
    
    
  }

  findCustomLinks(pagination: Pagination) {
    if(pagination.filterKey==this.properties.dashboardButtons){
      let encodedSearchKey = this.referenceService.getEncodedUri(pagination.searchKey);
      const url = this.authenticationService.REST_URL + "v_url/getDashboardButtons?searchKey="+encodedSearchKey + "&access_token=" + this.authenticationService.access_token;
      return this.http.post(url, pagination)
        .map(this.extractData)
        .catch(this.handleError);
    }else{
      let userId = this.authenticationService.getUserId();
      let pageableUrl = this.referenceService.getPagebleUrl(pagination);
      let urlPrefix = pagination.filterKey==this.properties.newsAndAnnouncements ? 'newsAndAnnouncements':'dashboardBanners';
      let companyProfileName = this.authenticationService.companyProfileName;
      let findAllUrl = this.CUSTOM_LINK_PREFIX_URL+'/'+urlPrefix+'/userId/'+userId+'/domainName/'+companyProfileName+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token+pageableUrl;
      return this.authenticationService.callGetMethod(findAllUrl);
    }
    
  }

  getDashboardButtonsForCarousel(companyProfileName: string) {
    let userId = this.authenticationService.getUserId();
    const url = this.authenticationService.REST_URL + "v_url/getDashboardButtons/" + companyProfileName + "/"+userId+"?access_token=" + this.authenticationService.access_token;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  deleteCustomLink(id: number,moduleType:string) {
    let url = "";
    if(moduleType==this.properties.dashboardButtons){
      url = this.authenticationService.REST_URL + "v_url/delete/dashboardButton/" + id + "?access_token=" + this.authenticationService.access_token;
      return this.http.get(url).map(this.extractData).catch(this.handleError);
    }else if(moduleType==this.properties.newsAndAnnouncements || moduleType==this.properties.dashboardBanners){
      url = this.CUSTOM_LINK_PREFIX_URL+'/id/'+id+'/loggedInUserId/'+this.authenticationService.getUserId()+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
      return this.authenticationService.callDeleteMethod(url);
    }
    
  }

  getCustomLinkIcons(iconsFilePath: string): Observable<any> {
    return this.http.get(iconsFilePath).map(this.extractData).catch(this.handleError);
  }

  getVanityEmailTemplates(pagination: Pagination) {
    const url = this.authenticationService.REST_URL + "v_url/getEmailTemplates" + "?access_token=" + this.authenticationService.access_token;
    return this.http.post(url, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getAllTemplatesDuplicates() {
    return this.http.get(this.URL + "v_url/getDuplicateTemplates/" +this.authenticationService.getUserId()+ "?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
}
  saveOrUpdateEmailTemplate(vanityEmailTemplate: VanityEmailTempalte) {
    const url = this.authenticationService.REST_URL + "v_url/saveOrUpdate/emailTemplate" + "?access_token=" + this.authenticationService.access_token;
    return this.http.post(url, vanityEmailTemplate)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteEmailTempalte(id: number) {
    const url = this.authenticationService.REST_URL + "v_url/delete/emailTemplate/" + id + "?access_token=" + this.authenticationService.access_token;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }
  //XNFR-233
  getCustomLoginTemplates(pagination: Pagination) {
    const url = this.authenticationService.REST_URL + "v_url/getLoginTemplates" + "?access_token=" + this.authenticationService.access_token;
    return this.http.post(url, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }
  saveCustomLoginTemplate(customLoginTemplate:CustomLoginTemplate){
    const url = this.authenticationService.REST_URL + "v_url/saveOrUpdate/customLoginTemplate" + "?access_token=" + this.authenticationService.access_token;
    return this.http.post(url, customLoginTemplate)
      .map(this.extractData)
      .catch(this.handleError);
  }
  deleteCustomLogInTemplateById(id: number) {
    const url = this.authenticationService.REST_URL + "v_url/delete/customLogInTemplate/" + id + "/loggedInUserId/"+this.authenticationService.getUserId()+ "?access_token=" + this.authenticationService.access_token;
    return this.http.delete(url).map(this.extractData).catch(this.handleError);
  }
  getLogInTemplateById(id:number,loggedInUserId:number) {
      const url = this.authenticationService.REST_URL + "v_url/customLogInTemplateId/" + id +"/loggedInUserId/"+ loggedInUserId;
      return this.http.get(url).map(this.extractData).catch(this.handleError);
  }
 
  getActiveLoginTemplate(companyProfileName:number){
    const url = this.authenticationService.REST_URL + "v_url/active/loginTemplate/"+ companyProfileName;
      return this.http.get(url).map(this.extractData).catch(this.handleError);
  }
  getFinalScreenTableView(){
    const url = this.authenticationService.REST_URL + "v_url/active/loginTemplate/table/show/"+this.authenticationService.getUserId()+ "?access_token=" + this.authenticationService.access_token;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }
//XNFR-2333
/**** XNFR-416 *****/
getImageFile(imageUrl: string,name:any): Observable<File> {
  return new Observable((observer) => {
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], name, { type: 'image/jpeg' });
        observer.next(file);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  });
}
/**** XNFR-416 *****/
  isVanityURLEnabled() {
   let url = window.location.hostname;
    let isLocalHost = this.envService.SERVER_URL.indexOf('localhost')>-1 && 
    this.envService.CLIENT_URL.indexOf('localhost')>-1;
    url = this.setUrlForLocalHost(isLocalHost, url);
    if (!url.includes("192.168") && !url.includes("172.16")) {
      let domainName = url.split('.');
      if (domainName.length > 2) {
        if(url.includes("xamplify.co") || url.includes("xamplify.io")){
          this.authenticationService.companyProfileName = domainName[0];
          this.setVanityVariables(this.authenticationService.companyProfileName);
        }else{
          let subDomain  = this.getCustomDomain(url);
          console.log(url+" is the url And Custom Domain : "+subDomain);
          let companyProfileName = this.authenticationService.companyProfileName;
          if(companyProfileName==undefined || companyProfileName==""){
            this.authenticationService.getCompanyProfileNameByCustomDomain(subDomain+".").subscribe(
              response=>{
                let statusCode = response.statusCode;
                if(statusCode == 200){
                  this.authenticationService.companyProfileName = response.data;
                  this.setVanityVariables(this.authenticationService.companyProfileName);
                }else{
                  this.referenceService.showSweetAlertErrorMessage("Invalid Custom Domain");
                  this.router.navigate( ['/vanity-domain-error'] );
                }
              
              },error=>{
                this.referenceService.showSweetAlertErrorMessage("Invalid Custom Domain");
              });
          }else{
            console.log("API is not needed to get the company profile name");
          }
        }
        return true;
      }
    }
  }

  private getCustomDomain(url:string) {
    var textBeforeLogin = url.replace(/\/login$/, "");
    textBeforeLogin = textBeforeLogin.replace(/https?:\/\/|\/$/g, "");
    return textBeforeLogin;
  }

  private setUrlForLocalHost(isLocalHost: boolean, url: string) {
    if (isLocalHost) {
      let domainName = this.envService.domainName;
      if (domainName != "" && domainName != window.location.hostname) {
        var dotCount = (domainName.match(/\./g) || []).length;
        if (dotCount == 0) {
          url = this.envService.domainName + ".xamplify.co";
        } else {
          url = "https://"+this.envService.domainName+"/login";
        }
      }
    }
    return url;
  }

  private setVanityVariables(companyProfileNameOrDomain:string) {
    this.authenticationService.vanityURLEnabled = true;
    if(companyProfileNameOrDomain.includes('.')){
      this.authenticationService.setCustomDomainUrl(companyProfileNameOrDomain);
    }else{
      this.authenticationService.setDomainUrl();
    }
    if (!this.authenticationService.vanityURLUserRoles) {
      let currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const parsedObject = JSON.parse(currentUser);
        this.authenticationService.vanityURLUserRoles = parsedObject.roles;
      }
    }
  }

  checkVanityURLDetails() {
    if (this.authenticationService.v_companyName == undefined || this.authenticationService.v_companyLogoImagePath == undefined) {
      this.getVanityURLDetails(this.authenticationService.companyProfileName).subscribe(result => {
        this.authenticationService.v_companyName = result.companyName;
        this.authenticationService.vanityURLink = result.vanityURLink;   
        if(!result.enableVanityURL){
          this.router.navigate( ['/vanity-domain-error'] );
          return;
        }     
        this.authenticationService.v_showCompanyLogo = result.showVendorCompanyLogo;
        this.authenticationService.v_companyLogoImagePath = this.authenticationService.MEDIA_URL + result.companyLogoImagePath;
        this.authenticationService.v_companyBgImagePath2 = this.authenticationService.MEDIA_URL + result.backgroundLogoStyle2;
        if (result.companyBgImagePath) {
          this.authenticationService.v_companyBgImagePath = this.authenticationService.MEDIA_URL + result.companyBgImagePath;
        } else {
          this.authenticationService.v_companyBgImagePath = "assets/images/stratapps.jpeg";
        }
        if(result.backgroundLogoStyle2){
          this.authenticationService.v_companyBgImagePath2 = this.authenticationService.MEDIA_URL + result.backgroundLogoStyle2
        } else {
          this.authenticationService.v_companyBgImagePath2 = "assets/images/stratapps.jpeg";
        }
        this.authenticationService.v_companyFavIconPath = result.companyFavIconPath;
        this.authenticationService.loginScreenDirection = result.loginScreenDirection;
        this.setVanityURLTitleAndFavIcon();        
      }, error => {
        console.log(error);
      });
    }
  }



  addVanityUrlFilterDTO(dto: DashboardAnalyticsDto) {
    if (this.authenticationService.getUserId()) {
      dto.userId = this.authenticationService.getUserId();
    }
    let companyProfileName = this.authenticationService.companyProfileName;
    if (companyProfileName != undefined && companyProfileName != "") {
      dto.vanityUrlFilter = true;
      dto.vendorCompanyProfileName = companyProfileName;
    } else {
      dto.vanityUrlFilter = false;
    }
    return dto;
  }

  public setVanityURLTitleAndFavIcon() {
    if (this.authenticationService.v_companyName){      
      this.titleService.setTitle(this.authenticationService.v_companyName);
    }
    if(this.authenticationService.v_companyFavIconPath) {
      if(this.isVanityURLEnabled()){
        this._document.getElementById('appFavicon').setAttribute('href', this.authenticationService.MEDIA_URL + this.authenticationService.v_companyFavIconPath);
      }
    }
  }



  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
    return Observable.throw(error);
  }

  /**** 18-02-2024 Add !important end of the style attributes ********/
  sanitizeHtmlWithImportant(htmlString: string): string {
    // Regular expression to find inline style declarations
    const styleRegex = /style="([^"]*)"/g;
    const modifiedHtml = htmlString.replace(styleRegex, (match, styleAttributes) => {
      const attributes = styleAttributes.split(';');
      let modifiedAttributes = '';
      attributes.forEach(attribute => {
        // If the attribute is for color, add !important
        const trimmedAttribute = attribute.trim();
        if (trimmedAttribute.startsWith('color:') && !trimmedAttribute.endsWith('!important')) {
          modifiedAttributes += `${trimmedAttribute} !important;`;
        } else {
          modifiedAttributes += `${trimmedAttribute};`;
        }
      });
      return `style="${modifiedAttributes}"`;
    });
    return modifiedHtml;
  }
    /**** 18-02-2024  Add !important end of the style attributes ********/

    isDashboardButtonPublished(id: number) {
      let url = this.DASHBOARD_BUTTON_PREFIX_URL+'/isPublished/'+id+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token;
      return this.authenticationService.callGetMethod(url);
    }

    /***XNFR-599****/
    findAllPublishedAndUnPublishedDashboardButtons(pagination: Pagination) {
      let userId = this.authenticationService.getUserId();
      let pageableUrl = this.referenceService.getPagebleUrl(pagination);
      let findAllUrl = this.DASHBOARD_BUTTON_PREFIX_URL+'/published-and-unpublished/loggedInUserId/'+userId+'/userListId/'+pagination.userListId+'/partnerUserId/'+pagination.partnerId+this.ACCESS_TOKEN_SUFFIX_URL+this.authenticationService.access_token+pageableUrl;
      return this.authenticationService.callGetMethod(findAllUrl);
    }

    /** XNFR-618 **/
    getVanityUrlDetailsbyCompanyProfileName(companyProfileName: string){
      const url = this.authenticationService.REST_URL + "v_url/company/details/by/profile/name/"+ companyProfileName;
      return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

  getHtmlBody(id: number) {
    const userId = this.authenticationService.getUserId();
    const accessToken = this.authenticationService.access_token;

    const url = `${this.URL}v_url/getHtmlBody/${id}?userId=${userId}&access_token=${accessToken}`;

    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getTemplateId(emailId: any, isInactivePartnersDiv: any) {
    const userId = this.authenticationService.getUserId();
    const url = this.authenticationService.REST_URL + "v_url/get-template-id"
      + '?emailId=' + emailId + '&userId=' + userId + '&isInactivePartnersDiv=' + isInactivePartnersDiv
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  getSupportEmailIdByCompanyProfileName(companyProfileName: string) {
    let url = this.authenticationService.REST_URL + 'v_url/supportEmailIdByCompanyProfileName/' + companyProfileName;
    return this.authenticationService.callGetMethod(url);
  }

}