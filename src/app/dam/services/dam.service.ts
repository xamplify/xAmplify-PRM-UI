import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Pagination } from "app/core/models/pagination";

@Injectable()
export class DamService {
  URL = this.authenticationService.REST_URL + "dam/";
  constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger) { }
 
  list(pagination: Pagination) {
    return this.http.post(this.URL + "list?access_token=" + this.authenticationService.access_token,pagination)
        .map(this.extractData)
        .catch(this.handleError);
  }


  
  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  handleError(error: any) {
    return Observable.throw(error);
  }
}
