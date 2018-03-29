import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http'

@Injectable()
export class ParterService {
  URL =  this.authenticationService.REST_URL;

  constructor(public authenticationService: AuthenticationService, public httpClient: HttpClient) { }
  partnerReports(companyId:number): Observable<any> {
    const url = this.URL + 'partner/analytics?access_token=' + this.authenticationService.access_token+
    '&companyId=' + companyId;
    return this.httpClient.get(url)
        .catch(this.handleError);
}
handleError(error: any) {
  const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
  return Observable.throw(error);
}
}
