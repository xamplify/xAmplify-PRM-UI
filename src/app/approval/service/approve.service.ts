import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';

@Injectable()
export class ApproveService {

  QUERY_PARAMETERS = '?access_token=' + this.authenticationService.access_token;
  approveUrl = this.authenticationService.REST_URL + "approve";

  constructor(private http: Http, public httpClient: HttpClient,private authenticationService: AuthenticationService,
     private referenceService:ReferenceService
  ) { }


  getPendingApprovalDamAndLMS(pagination: Pagination) {
    let userId = this.authenticationService.getUserId();
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let findAllUrl = this.approveUrl + "/getPendingApprovalList/" + userId + this.QUERY_PARAMETERS + pageableUrl;
    return this.authenticationService.callGetMethod(findAllUrl);
  }


}
