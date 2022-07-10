import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Pagination } from "app/core/models/pagination";

@Injectable()
export class AgencyService {
  ACCESS_TOKEN_SUFFIX_URL = "?"+this.authenticationService.access_token;
  AGENCY_PREFIX_URL = this.authenticationService.REST_URL + "agency";
  AGENCY_URL = this.AGENCY_PREFIX_URL+this.ACCESS_TOKEN_SUFFIX_URL;
  FIND_ALL_AGENCIES_URL = this.AGENCY_PREFIX_URL+"findAll"+this.ACCESS_TOKEN_SUFFIX_URL;
  constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger) { }

  /***Get All Agencies****/
  findAll(pagination:Pagination){
    return this.http.post(this.FIND_ALL_AGENCIES_URL,pagination)
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }
}
