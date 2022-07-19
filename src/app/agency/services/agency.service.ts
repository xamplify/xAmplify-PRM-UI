import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Pagination } from "app/core/models/pagination";
import { ReferenceService } from './../../core/services/reference.service';

@Injectable()
export class AgencyService {
  ACCESS_TOKEN_SUFFIX_URL = "?access_token="+this.authenticationService.access_token;
  AGENCY_PREFIX_URL = this.authenticationService.REST_URL + "agencies";
  AGENCY_URL = this.AGENCY_PREFIX_URL+this.ACCESS_TOKEN_SUFFIX_URL;
  constructor(private http: Http, private authenticationService: AuthenticationService, 
    private logger: XtremandLogger,private referenceService:ReferenceService) { }

  /***Get All Agencies****/
  findAll(pagination:Pagination){
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let findAllUrl = this.AGENCY_URL+pageableUrl;
    return this.http.get(findAllUrl,"")
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }

  /***Get All Modules */
  findAllModules(){
    let url = this.AGENCY_URL+"/modules";
    return this.http.get(url,"")
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }
}
