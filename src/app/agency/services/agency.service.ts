import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Pagination } from "app/core/models/pagination";

@Injectable()
export class AgencyService {
  ACCESS_TOKEN_SUFFIX_URL = "?access_token="+this.authenticationService.access_token;
  AGENCY_PREFIX_URL = this.authenticationService.REST_URL + "agency";
  AGENCY_URL = this.AGENCY_PREFIX_URL+this.ACCESS_TOKEN_SUFFIX_URL;
  constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger) { }

  /***Get All Agencies****/
  findAll(pagination:Pagination){
    let page = pagination.pageIndex;
    let size = pagination.maxResults;
    let searchKey = pagination.searchKey;
    let sort = pagination.sortcolumn+","+pagination.sortingOrder;
    let findAllUrl = this.AGENCY_URL+"&page="+page+"&size="+size+"&sort="+sort+"&search="+searchKey;
    return this.http.get(findAllUrl,"")
          .map(this.authenticationService.extractData)
          .catch(this.authenticationService.handleError);
  }
}
