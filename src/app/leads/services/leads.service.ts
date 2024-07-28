import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Pagination } from '../../core/models/pagination';
import { Lead } from '../models/lead';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { DealComments } from 'app/deal-registration/models/deal-comments';
import { UtilService } from 'app/core/services/util.service';
import { LeadCustomFieldDto } from '../models/lead-custom-field';

@Injectable()
export class LeadsService {

  URL = this.authenticationService.REST_URL + "lead/";
  ACCESS_TOKEN_SUFFIX_URL = "?access_token="+this.authenticationService.access_token;
  constructor(private http: Http, private authenticationService: AuthenticationService,
    private logger: XtremandLogger, private utilService: UtilService) { }

  listLeadsForVendor(pagination: Pagination) {
    return this.http.post(this.URL + `/list/v?access_token=${this.authenticationService.access_token}`, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listLeadsForPartner(pagination: Pagination) {
    /****XNFR-252*****/
    let companyProfileName = this.authenticationService.companyProfileName;
    let xamplifyLogin = companyProfileName == undefined || companyProfileName.length == 0;
    if (xamplifyLogin) {
      pagination.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
    }
    /****XNFR-252*****/
    return this.http.post(this.URL + `/list/p?access_token=${this.authenticationService.access_token}`, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getLead(leadId: number, userId: number) {
    return this.http.get(this.URL + `${leadId}/${userId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getLeadByCampaign(campaignId: number, userId: number, loggedInUserId: number) {
    return this.http.get(this.URL + `${userId}/campaign/${campaignId}/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getVendorList(userId: number) {
    let url = this.URL + "/" + userId + "/vendors";
    /****XNFR-252*****/
    let subDomain = this.authenticationService.getSubDomain();
    if (subDomain.length == 0) {
      let loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
      if (loginAsUserId > 0) {
        url += "/loginAsUserId/" + loginAsUserId;
      }
    }
    /****XNFR-252*****/
    return this.http.get(url + "?access_token=" + this.authenticationService.access_token)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPipelines(createdForCompanyId: number, userId: number) {
    return this.http.get(this.authenticationService.REST_URL + `/pipeline/LEAD/${userId}/${createdForCompanyId}/list?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCampaignLeadPipeline(campaignId: number, userId: number) {
    return this.http.get(this.authenticationService.REST_URL + `/pipeline/LEAD/campaign/${campaignId}/${userId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCreatedForCompanyIdByCampaignId(campaignId: number, userId: number) {
    return this.http.get(this.URL + `campaign/${campaignId}/createdForCompanyId/${userId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveOrUpdateLead(lead: Lead) {
    let url = this.URL;
    if (lead.id > 0) {
      url = url + `edit`;
    }
    return this.http.post(url + `?access_token=${this.authenticationService.access_token}`, lead)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteLead(lead: Lead) {
    return this.http.post(this.URL + `/delete?access_token=${this.authenticationService.access_token}`, lead)
      .map(this.extractData)
      .catch(this.handleError);
  }



  getCounts(vanityLoginDto: VanityLoginDto) {
    /****XNFR-252*****/
    let companyProfileName = this.authenticationService.companyProfileName;
    let xamplifyLogin = companyProfileName == undefined || companyProfileName.length == 0;
    if (xamplifyLogin) {
      vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();

    }
    /***XNFR-252***/
    return this.http.post(this.URL + `/counts?access_token=${this.authenticationService.access_token}`, vanityLoginDto)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getViewType(vanityLoginDto: VanityLoginDto) {
    return this.http.post(this.URL + `/view/type?access_token=${this.authenticationService.access_token}`, vanityLoginDto)
      .map(this.extractData)
      .catch(this.handleError);
  }

  syncLeadsWithSalesforce(userId: number) {
    return this.http.get(this.authenticationService.REST_URL + `/salesforce/${userId}/leads/sync?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  syncLeadsWithMicrosoft(userId: number) {
    return this.http.get(this.authenticationService.REST_URL + `/microsoft/${userId}/leads/sync?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  syncLeadsWithActiveCRM(userId: number) {
    return this.http.get(this.authenticationService.REST_URL + `/crm/active/leads/sync/${userId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getSalesforcePipeline(createdForCompanyId: number, userId: number) {
    return this.http.get(this.authenticationService.REST_URL + `/pipeline/LEAD/salesforce/${createdForCompanyId}/${userId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCompanyIdByCompanyProfileName(companyProfileName: string, userId: number) {
    return this.http.get(this.URL + `vanity/${companyProfileName}/${userId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listCampaignsForVendor(pagination: Pagination) {
    return this.http.post(this.URL + `campaign/list/v?access_token=${this.authenticationService.access_token}`, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listPartnersForCampaign(pagination: Pagination) {
    return this.http.post(this.URL + `campaign/partner/list/v?access_token=${this.authenticationService.access_token}`, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listCampaignLeads(pagination: Pagination) {
    return this.http.post(this.URL + `campaign/lead/list?access_token=${this.authenticationService.access_token}`, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listCampaignsForPartner(pagination: Pagination) {
    /****XNFR-252*****/
    let companyProfileName = this.authenticationService.companyProfileName;
    let xamplifyLogin = companyProfileName == undefined || companyProfileName.length == 0;
    if (xamplifyLogin) {
      pagination.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
    }
    /****XNFR-252*****/
    return this.http.post(this.URL + `campaign/list/p?access_token=${this.authenticationService.access_token}`, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveComment(comment: DealComments) {
    return this.http.post(this.URL + `/comment/save?access_token=${this.authenticationService.access_token}`, comment)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getConversation(leadId: number, userId: number) {
    return this.http.get(this.URL + `/${leadId}/chat/${userId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateChatStatistics(comment: DealComments) {
    return this.http.post(this.URL + `/chat/stats?access_token=${this.authenticationService.access_token}`, comment)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getStageNamesForVendor(userId: number) {
    return this.http.get(this.URL + `/list/v/stages/${userId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getStageNamesForPartner1(userId: number) {
    return this.http.get(this.URL + `/list/p/stages/${userId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getStageNamesForPartner(vanityLoginDto: VanityLoginDto) {
    return this.http.post(this.URL + `/list/p/stages?access_token=${this.authenticationService.access_token}`, vanityLoginDto)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getStageNamesForPartnerInCampaign(userId: number) {
    return this.http.get(this.URL + `campaign/lead/stages/${userId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getStageNamesForCampaign(campaignId: number, userId: number) {
    return this.http.get(this.URL + `campaign/lead/stages/${campaignId}/${userId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server   error';
    return Observable.throw(error);
  }

  changeLeadStatus(lead: Lead) {
    return this.http.post(this.URL + `/status/change?access_token=${this.authenticationService.access_token}`, lead)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCRMPipelines(createdForCompanyId: number, loggedInUserId: number, type: any, halopsaTicketTypeId: any) {
    return this.http.get(this.authenticationService.REST_URL + `/pipeline/LEAD/${type}/${createdForCompanyId}/${loggedInUserId}/${halopsaTicketTypeId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }


  downloadLeads(pagination: Pagination, userId: number) {
    let url = this.URL + "download/" + userId + "?access_token=" + this.authenticationService.access_token
    return this.http.post(url, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }


  /*******XNFR-426*******/
  updateLeadApprovalStatus(lead: Lead) {
    return this.http.post(this.URL + `/update/leadApprovalStatus?access_token=${this.authenticationService.access_token}`, lead)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /*** XNFR-505 ***/
  getLeadsForLeadAttachment(pagination: Pagination) {
    let companyProfileName = this.authenticationService.companyProfileName;
    let xamplifyLogin = companyProfileName == undefined || companyProfileName.length == 0;
    if (xamplifyLogin) {
      pagination.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
    }
    return this.http.post(this.URL + `/getLeadsForLeadAttachment/p?access_token=${this.authenticationService.access_token}`, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /*** XNFR-521 ***/
  getLeadPipelinesForView(leadId: number, loggedInUserId: number) {
    return this.http.get(this.authenticationService.REST_URL + `/lead/view/pipelines/${leadId}/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  findAllRegisteredByCompanies() {
    let loggedInUserId = this.authenticationService.getUserId();
    return this.http.get(this.authenticationService.REST_URL + `/lead/findRegisteredByCompanies/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  findAllRegisteredByUsers() {
    let loggedInUserId = this.authenticationService.getUserId();
    return this.http.get(this.authenticationService.REST_URL + `/lead/findRegisteredByUsers/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  findAllRegisteredByUsersForPartnerView() {
    let loggedInUserId = this.authenticationService.getUserId();
    return this.http.get(this.authenticationService.REST_URL + `/lead/findRegisteredByUsersForPartnerView/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  findAllRegisteredByCompaniesForPartnerView() {
    let loggedInUserId = this.authenticationService.getUserId();
    return this.http.get(this.authenticationService.REST_URL + `/lead/findRegisteredByCompaniesForPartnerView/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }


  findAllRegisteredByUsersByCampaignIdAndPartnerCompanyId(campaignId: any, partnerCompanyId: number) {
    let isValidPartnerCompanyId = partnerCompanyId != undefined && partnerCompanyId > 0;
    let loggedInUserId = this.authenticationService.getUserId();
    let url = "";
    if (isValidPartnerCompanyId) {
      url = this.authenticationService.REST_URL + `/lead/findRegisteredByUsersByPartnerCompanyId/${partnerCompanyId}/${campaignId}?access_token=${this.authenticationService.access_token}`;
    } else {
      url = url = this.authenticationService.REST_URL + `/lead/findRegisteredByUsersByCampaignId/${loggedInUserId}/${campaignId}?access_token=${this.authenticationService.access_token}`;
    }
    return this.http.get(url)
      .map(this.extractData)
      .catch(this.handleError);
  }

  /*** XNFR-592 ***/
  getLeadCustomFields() {
    let loggedInUserId = this.authenticationService.getUserId();
    return this.http.get(this.authenticationService.REST_URL + `/lead/custom/fields/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveCustomLeadFields(leadCustomFields: LeadCustomFieldDto[]) {
    let loggedInUserId = this.authenticationService.getUserId();
    return this.http.post(this.authenticationService.REST_URL + `/lead/save/custom/fields/${loggedInUserId}?access_token=${this.authenticationService.access_token}`, leadCustomFields)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getLeadCustomFieldsByVendorCompany(vendorCompanyId: number) {
    return this.http.get(this.authenticationService.REST_URL + `/lead/vendor/custom/fields/${vendorCompanyId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  findLeadAndLeadInfoForComments(leadId: any) {
    let convertedLeadId = leadId!=undefined ? leadId:0;
    let url = this.authenticationService.REST_URL+"lead/findLeadAndLeadInfoAndComments/"+convertedLeadId+"?access_token="+this.authenticationService.access_token;
   return this.authenticationService.callGetMethod(url);
  }

  findLeadPipeLines(lead: Lead) {
    let createdForCompanyId = lead.createdForCompanyId;
    let ticketId = lead.halopsaTicketTypeId;
    let loggedInUserId = this.authenticationService.getUserId();
    let vendorCompanyIdRequestParam = createdForCompanyId!=undefined && createdForCompanyId>0 ? "&vendorCompanyId="+createdForCompanyId:0;
    let ticketIdParameter = ticketId!=undefined && ticketId>0 ? "&ticketTypeId="+ticketId:0;
    let loggedInUserIdRequestParam = loggedInUserId!=undefined && loggedInUserId>0 ? "&loggedInUserId="+loggedInUserId:0;
    let url = this.authenticationService.REST_URL+"pipeline/findLeadPipeLines"+this.ACCESS_TOKEN_SUFFIX_URL+vendorCompanyIdRequestParam+loggedInUserIdRequestParam+ticketIdParameter;
    return this.authenticationService.callGetMethod(url);
  
  }

  findPipelineStagesByPipelineId(pipelineId:number){
    let url = this.authenticationService.REST_URL+"pipeline/findPipelineStages/"+pipelineId+this.ACCESS_TOKEN_SUFFIX_URL;
    return this.authenticationService.callGetMethod(url);

  }
  


}
