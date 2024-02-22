import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Company } from '../models/company';
import { Observable } from 'rxjs';
import { Pagination } from 'app/core/models/pagination';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CompanyService {
  isCompanyModalPopUp:boolean = false;
  companyUrl = this.authenticationService.REST_URL + "companies/";
  
  constructor(private authenticationService: AuthenticationService, private http: Http, private logger: XtremandLogger, private utilService: UtilService, public httpClient: HttpClient,) { }

  saveCompany(company: Company){
    return this.httpClient.post(this.companyUrl + "?access_token=" + this.authenticationService.access_token, company)
    .catch(this.handleError);
  }

  editCompany(company: Company){
    return this.httpClient.post(this.companyUrl + "edit/?access_token=" + this.authenticationService.access_token, company)
    .catch(this.handleError);
  }

   getCompaniesList(pagination: Pagination) {
      return this.httpClient.post(this.companyUrl + "list/?access_token=" +this.authenticationService.access_token, pagination)
        .catch(this.handleError);
    }

  getCompanyById(id: number, loggedInUserId: number) {
    return this.http.get(this.companyUrl + "/id/" + id + "/loggedInUserId/" + loggedInUserId + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  } 
   getCounts(loggedInUserId: number){
    return this.http.get(this.companyUrl + "counts/loggedInUserId/" + loggedInUserId + "?access_token=" + this.authenticationService.access_token)
    .map(this.extractData)
    .catch(this.handleError);
   }

  deleteCompany(id: number, loggedInUserId: number) {
    return this.http.delete(this.companyUrl + "/id/" + id + "/loggedInUserId/" + loggedInUserId + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  } 

  syncCompanyContactLists(loggedInUserId: number){
    return this.http.get(this.companyUrl + "/migration/company/contacts/" + loggedInUserId + "?access_token=" + this.authenticationService.access_token)
    .map(this.extractData)
    .catch(this.handleError);
   }

  private extractData(res: Response) {
    const body = res.json();
    // return body || {};
    return body;
}
  handleError(error: any) {
    return Observable.throw(error);
  }
}
