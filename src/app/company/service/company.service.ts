import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { UtilService } from 'app/core/services/util.service';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { Company } from '../models/company';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyService {
  isCompanyModalPopUp:boolean = false;
  companyUrl = this.authenticationService.REST_URL + "companies/";
  
  constructor(private authenticationService: AuthenticationService, private _http: Http, private logger: XtremandLogger, private utilService: UtilService) { }

  saveCompany(company: Company){
    return this._http.post(this.companyUrl + "?access_token=" + this.authenticationService.access_token, company)
    .catch(this.handleError);
  }
  
  handleError(error: any) {
    return Observable.throw(error);
  }
}
