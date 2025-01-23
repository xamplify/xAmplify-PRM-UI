import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { MultiSelectCommentDto } from '../models/multi-select-comment-dto';

@Injectable()
export class ApproveService {

  QUERY_PARAMETERS = '?access_token=' + this.authenticationService.access_token;
  approveUrl = this.authenticationService.REST_URL + "approve";
  damUrl = this.authenticationService.REST_URL + "dam";

  constructor(private http: Http, public httpClient: HttpClient, private authenticationService: AuthenticationService,
    private referenceService: ReferenceService
  ) { }


  getAllApprovalList(pagination: Pagination) {
    let userId = this.authenticationService.getUserId();
    let findAllUrl = this.approveUrl + "/getAllApprovalList/" + userId + this.QUERY_PARAMETERS;
    return this.authenticationService.callPostMethod(findAllUrl, pagination);
  }

  getStatusTileCounts(filterType: any) {
    let userId = this.authenticationService.getUserId();
    let filterByRequestParameter = filterType != undefined ? '&filterBy=' + filterType : '';
    let findAllUrl = this.approveUrl + "/getStatusTileCounts/" + userId + this.QUERY_PARAMETERS + filterByRequestParameter;
    return this.authenticationService.callGetMethod(findAllUrl);
  }

  updateApprovalStatusAndComment(commentDto: MultiSelectCommentDto) {
    let userId = this.authenticationService.getUserId();
    let updateApprovalStatusUrl = this.approveUrl + "/updateApprovalStatus/" + userId + this.QUERY_PARAMETERS;
    return this.authenticationService.callPostMethod(updateApprovalStatusUrl, commentDto);
  }


  getFileTypes(loggedInUserCompanyId: any, categoryId: number) {
    if (undefined == categoryId) {
      categoryId = 0;
    }
    let url = this.damUrl + "/findFileTypes/" + loggedInUserCompanyId + "/" + categoryId + this.QUERY_PARAMETERS;
    return this.authenticationService.callGetMethod(url);
  }

}
