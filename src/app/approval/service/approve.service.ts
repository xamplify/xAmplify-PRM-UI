import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Pagination } from 'app/core/models/pagination';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { MultiSelectCommentDto } from '../models/multi-select-comment-dto';
import { ApprovalControlSettingsDTO } from '../models/approval-control-settings-dto';
import { CommentDto } from 'app/common/models/comment-dto';

@Injectable()
export class ApproveService {

  QUERY_PARAMETERS = '?access_token=' + this.authenticationService.access_token;
  approveUrl = this.authenticationService.REST_URL + "approve";
  damUrl = this.authenticationService.REST_URL + "dam";
  COMMENTS_PREFIX_URL = this.authenticationService.REST_URL+'/comments';
  DAM_PREFIX_URL = this.authenticationService.REST_URL + "dam";

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

  /** XNFR-824 start **/
  loadUserDetailsWithApprovalStatus(entityId: number, moduleType: string) {
    let url = this.COMMENTS_PREFIX_URL + '/loadUserDetailsWithApprovalStatus/'+entityId+'/'+moduleType+ this.QUERY_PARAMETERS;
    return this.authenticationService.callGetMethod(url);
  }

  loadCommentsAndTimelineHistory(entityId: number, moduleType: string) {
    let url = this.COMMENTS_PREFIX_URL + '/loadCommentsAndTimelineHistory/'+entityId+'/'+moduleType+ this.QUERY_PARAMETERS;
    return this.authenticationService.callGetMethod(url);
  }

  updateApprovalStatusAndSaveComment(commentDto:CommentDto) {
    let url = this.COMMENTS_PREFIX_URL + `/updateApprovalStatusAndSaveComment?access_token=${this.authenticationService.access_token}`;
    return this.authenticationService.callPostMethod(url, commentDto);
  }
  /** XNFR-824 end **/

  /** XNFR-813 **/
  getStatusTileCountsByModuleType(moduleType: string) {
    let loggedInUserId = this.authenticationService.getUserId();
    let url = this.DAM_PREFIX_URL+'/getStatusTileCountsByModuleType/'+loggedInUserId+'/'+moduleType+ this.QUERY_PARAMETERS;
    return this.authenticationService.callGetMethod(url);
  }

  getApprovalConfigurationSettingsByUserId() {
    let userId = this.authenticationService.getUserId();
    let url = this.authenticationService.REST_URL + "admin/getApprovalConfigurationSettingsByUserId/" + userId + this.QUERY_PARAMETERS;
    return this.authenticationService.callGetMethod(url);
  }
  
  updateApprovalConfigurationSettings(saveAssetApprovalStatus: any) {
    let url = this.authenticationService.REST_URL + "admin/updateApprovalConfigurationSettings" + this.QUERY_PARAMETERS;
    return this.authenticationService.callPutMethod(url, saveAssetApprovalStatus);
  }

  listTeamMembersForApprovalControlManagement(pagination: Pagination) {
    let userId = this.authenticationService.getUserId();
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let filterKeyRequestParam = pagination.filterKey != undefined && pagination.filterKey != null ?
      "&filterKey=" + pagination.filterKey : "";
    let findAllUrl = this.approveUrl + "/listTeamMembersForApprovalControlManagement/" + userId + this.QUERY_PARAMETERS + pageableUrl + filterKeyRequestParam;
    return this.authenticationService.callGetMethod(findAllUrl);
  }

  saveOrUpdateApprovalControlSettings(approvalControlSettingsDTOs: Array<ApprovalControlSettingsDTO>) {
    let userId = this.authenticationService.getUserId();
    let url = this.approveUrl + `/saveOrUpdateApprovalControlSettings`+`/`+userId+`?access_token=${this.authenticationService.access_token}`;
    return this.authenticationService.callPostMethod(url, approvalControlSettingsDTOs);
  }

  getApprovalPrivileges(loggedInUserId: number, createdById: number) {
    let url = this.approveUrl + "/getApprovalPrivileges/" + loggedInUserId + "/" + createdById + this.QUERY_PARAMETERS;
    return this.authenticationService.callGetMethod(url);
  }

  checkApprovalPrivilegeManager() {
    let loggedInUserId = this.authenticationService.getUserId();
    let url = this.approveUrl + "/checkApprovalPrivilegeManager/" + loggedInUserId + this.QUERY_PARAMETERS;
    return this.authenticationService.callGetMethod(url);
  }

  getFileTypes(loggedInUserCompanyId: any, categoryId: number) {
    if (undefined == categoryId) {
      categoryId = 0;
    }
    let url = this.damUrl + "/findFileTypes/" + loggedInUserCompanyId + "/" + categoryId + this.QUERY_PARAMETERS;
    return this.authenticationService.callGetMethod(url);
  }

  sendReminderToApprovers(entityId: number, moduleType: string) { 
    let loggedInUserId = this.authenticationService.getUserId();
    let url = this.approveUrl + "/sendReminderToApprovers/" + loggedInUserId + '/' + entityId + '/' + moduleType + this.QUERY_PARAMETERS;
    return this.authenticationService.callGetMethod(url);
  }

}
