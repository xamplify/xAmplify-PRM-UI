import { Injectable, Inject } from "@angular/core";
import { Http, Response, RequestOptions, Headers, ResponseContentType } from "@angular/http";
import { AuthenticationService } from "app/core/services/authentication.service";
import { Observable } from "rxjs/Observable";
import { VanityURL } from "../models/vanity.url";
import { DashboardAnalyticsDto } from "app/dashboard/models/dashboard-analytics-dto";
import { DashboardButton } from "../models/dashboard.button";
import { Pagination } from "app/core/models/pagination";
import { Properties } from "app/common/models/properties";
import { VanityEmailTempalte } from "app/email-template/models/vanity-email-template";
import { Title, DOCUMENT } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Injectable()
export class VanityURLService {


  constructor(private http: Http, private authenticationService: AuthenticationService, private titleService: Title, @Inject(DOCUMENT) private _document: HTMLDocument, private router: Router) { }

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

  saveDashboardButton(dashboardButton: DashboardButton) {
    const url = this.authenticationService.REST_URL + "v_url/save/dashboardButton?access_token=" + this.authenticationService.access_token;
    return this.http.post(url, dashboardButton)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateDashboardButton(dashboardButton: DashboardButton) {
    const url = this.authenticationService.REST_URL + "v_url/update/dashboardButton" + "?access_token=" + this.authenticationService.access_token;
    return this.http.post(url, dashboardButton)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDashboardButtons(pagination: Pagination) {
    const url = this.authenticationService.REST_URL + "v_url/getDashboardButtons" + "?access_token=" + this.authenticationService.access_token;
    return this.http.post(url, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDashboardButtonsForCarousel(companyProfileName: string) {
    const url = this.authenticationService.REST_URL + "v_url/getDashboardButtons/" + companyProfileName + "?access_token=" + this.authenticationService.access_token;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  deleteDashboardButton(id: number) {
    const url = this.authenticationService.REST_URL + "v_url/delete/dashboardButton/" + id + "?access_token=" + this.authenticationService.access_token;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  getDashboardButtonIcons(iconsFilePath: string): Observable<any> {
    return this.http.get(iconsFilePath).map(this.extractData).catch(this.handleError);
  }

  getVanityEmailTemplates(pagination: Pagination) {
    const url = this.authenticationService.REST_URL + "v_url/getEmailTemplates" + "?access_token=" + this.authenticationService.access_token;
    return this.http.post(url, pagination)
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


  isVanityURLEnabled() {
    //console.log("Router URL :" + window.location.href);
    //console.log("Router URL :" + window.location.hostname);

    //let url = "key.xamplify.com";
    //let url = "TGAInfoSolutions.xamplify.com";
    //let url = "analytify.xamplify.com";
    //  let url = "tga.xamplify.com";
   // let url = "movva.xamplify.com";
    let url =window.location.hostname;
    if (!url.includes("release") && !url.includes("192.168")) {
    //let url="JAVG.xamplify.com";
        if (!url.includes("release") && !url.includes("192.168")) {
      let domainName = url.split('.');
      if (domainName.length > 2) {
        this.authenticationService.vanityURLEnabled = true;
        this.authenticationService.companyProfileName = domainName[0];
        if (!this.authenticationService.vanityURLUserRoles) {
          let currentUser = localStorage.getItem('currentUser');
          if (currentUser) {
            const parsedObject = JSON.parse(currentUser);
            this.authenticationService.vanityURLUserRoles = parsedObject.roles;
          }
        }
        return true;
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
        if (result.companyBgImagePath) {
          this.authenticationService.v_companyBgImagePath = this.authenticationService.MEDIA_URL + result.companyBgImagePath;
        } else {
          this.authenticationService.v_companyBgImagePath = "assets/images/stratapps.jpeg";
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
    // let companyProfileName =  JSON.parse(localStorage.getItem('vanityUrlCompanyProfielName'));
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
      this._document.getElementById('appFavicon').setAttribute('href', this.authenticationService.MEDIA_URL + this.authenticationService.v_companyFavIconPath);
    }
  }

  extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body || {};
  }

  handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
    return Observable.throw(error);
  }
}