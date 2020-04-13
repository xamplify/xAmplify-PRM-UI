import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { AuthenticationService } from "app/core/services/authentication.service";
import { Observable } from "rxjs/Observable";
import { VanityURL } from "../models/vanity.url";
import { DashboardAnalyticsDto } from "app/dashboard/models/dashboard-analytics-dto";


@Injectable()
export class VanityURLService {

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  getVanityURLDetails(companyProfileName: string): Observable<VanityURL> {
    const url = this.authenticationService.REST_URL + "v_url/companyDetails/" + companyProfileName;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  checkUserWithCompanyProfile(companyProfileName: string, emailId: string) {
    const url = this.authenticationService.REST_URL + "v_url/validateUser/" + companyProfileName + '?emailId=' + emailId;
    return this.http.get(url).map(this.extractData).catch(this.handleError);
  }

  checkVanityURLDetails() {
    //console.log("Router URL :" + window.location.href);
    //console.log("Router URL :" + window.location.hostname);

     //let url = "key.xamplify.com";
    //let url = "TGAInfoSolutions.xamplify.com";
    let url =window.location.hostname;

    if (!url.includes("release")) {
      let domainName = url.split('.');
      if (domainName.length > 2) {
        this.authenticationService.vanityURLEnabled = true;
        this.authenticationService.companyProfileName = domainName[0];
        if (this.authenticationService.v_companyName == undefined || this.authenticationService.v_companyLogoImagePath == undefined) {
          this.getVanityURLDetails(this.authenticationService.companyProfileName).subscribe(result => {
            this.authenticationService.v_companyName = result.companyName;
            this.authenticationService.vanityURLink= result.vanityURLink;
            //this.authenticationService.v_companyLogoImagePath = "assets/images/logo.jpg";
            this.authenticationService.v_companyLogoImagePath = this.authenticationService.MEDIA_URL + result.companyLogoImagePath;
          }, error => {
            console.log(error);
          });
        }
      }
    }
  }

  addVanityUrlFilterDTO(dto: DashboardAnalyticsDto) {
    dto.userId = this.authenticationService.getUserId();
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