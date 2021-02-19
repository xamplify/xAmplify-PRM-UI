import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Pagination } from '../../core/models/pagination';
import { Lead } from '../models/lead';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';

@Injectable()
export class LeadsService {
  URL = this.authenticationService.REST_URL + "lead/";
  constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger) { }

  listLeadsForVendor(pagination: Pagination) {
    return this.http.post(this.URL + `/list/v?access_token=${this.authenticationService.access_token}`, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listLeadsForPartner(pagination: Pagination) {
    return this.http.post(this.URL + `/list/p?access_token=${this.authenticationService.access_token}`, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getLead(leadId:number, userId:number) {
    return this.http.get(this.URL + `${leadId}/${userId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getLeadByCampaign(campaignId:number, userId:number, loggedInUserId:number) {
    return this.http.get(this.URL + `${userId}/campaign/${campaignId}/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getVendorList(userId:number) {
    return this.http.get(this.URL + `/${userId}/vendors?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getPipelines(createdForCompanyId:number, userId:number) {
    return this.http.get(this.authenticationService.REST_URL + `/pipeline/LEAD/${userId}/${createdForCompanyId}/list?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getCampaignLeadPipeline(campaignId:number, userId:number) {
    return this.http.get(this.authenticationService.REST_URL + `/pipeline/LEAD/campaign/${campaignId}/${userId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getCreatedForCompanyIdByCampaignId(campaignId:number, userId:number) {
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

  // getCounts(userId:number) {
  //   return this.http.get(this.URL + `/counts/${userId}?access_token=${this.authenticationService.access_token}`)
  //   .map(this.extractData)
  //   .catch(this.handleError);
  // }

  getCounts(vanityLoginDto:VanityLoginDto) {
    return this.http.post(this.URL + `/counts?access_token=${this.authenticationService.access_token}`, vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getViewType(vanityLoginDto:VanityLoginDto) {
    return this.http.post(this.URL + `/view/type?access_token=${this.authenticationService.access_token}`, vanityLoginDto)
    .map(this.extractData)
    .catch(this.handleError);
  }

  syncLeadsWithSalesforce(userId:number) {
    return this.http.get(this.authenticationService.REST_URL + `/salesforce/${userId}/leads/sync?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getSalesforcePipeline(createdForCompanyId:number, userId:number) {
    return this.http.get(this.authenticationService.REST_URL + `/pipeline/LEAD/salesforce/${createdForCompanyId}/${userId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getCompanyIdByCompanyProfileName(companyProfileName:string, userId:number) {
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
    return this.http.post(this.URL + `campaign/list/p?access_token=${this.authenticationService.access_token}`, pagination)
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

}
