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

  constructor(private http: Http, public httpClient: HttpClient,private authenticationService: AuthenticationService,
     private referenceService:ReferenceService
  ) { }


  getAllApprovalList(pagination: Pagination) {
    let userId = this.authenticationService.getUserId();
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let filterKeyRequestParam = pagination.filterKey != undefined && pagination.filterKey != null ?
      "&filterKey=" + pagination.filterKey : "";
    let findAllUrl = this.approveUrl + "/getAllApprovalList/" + userId + this.QUERY_PARAMETERS + pageableUrl + filterKeyRequestParam;
    return this.authenticationService.callGetMethod(findAllUrl);
  }

  getStatusTileCounts(filterType: any, toDateFilter: string, fromDateFilter: string, timeZone: string) {
    let userId = this.authenticationService.getUserId();
    let filterByRequestParameter = filterType != undefined ? '&filterBy=' + filterType : '';
    let fromDateFilterStringParam = fromDateFilter != undefined && fromDateFilter.length > 0 ? "&fromDateFilterString=" + fromDateFilter : "";
    let toDateFilterStringParam = toDateFilter != undefined && toDateFilter.length > 0 ? "&toDateFilterString=" + toDateFilter : "";
    let timeZoneParam = timeZone != null ? "&timeZone=" + timeZone : "";
    let findAllUrl = this.approveUrl + "/getStatusTileCounts/" + userId + this.QUERY_PARAMETERS + filterByRequestParameter
      + fromDateFilterStringParam + toDateFilterStringParam + timeZoneParam;
    return this.authenticationService.callGetMethod(findAllUrl);
  }

  updateApprovalStatusAndComment(commentDto: MultiSelectCommentDto) {
    let userId = this.authenticationService.getUserId();
    let updateApprovalStatusUrl = this.approveUrl + "/updateApprovalStatus/" + userId + this.QUERY_PARAMETERS;
    return this.authenticationService.callPostMethod(updateApprovalStatusUrl, commentDto);
  }


}
