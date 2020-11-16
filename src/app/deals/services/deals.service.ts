import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Pagination } from '../../core/models/pagination';
import { Deal } from '../models/deal';

@Injectable()
export class DealsService {
	URL = this.authenticationService.REST_URL + "deal/";

  constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger) { }
  
  listDealsForVendor(pagination: Pagination) {
    return this.http.post(this.URL + `/list/v?access_token=${this.authenticationService.access_token}`, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listDealsForPartner(pagination: Pagination) {
    return this.http.post(this.URL + `/list/p?access_token=${this.authenticationService.access_token}`, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getPipelines(createdForCompanyId:number, userId:number) {
    return this.http.get(this.authenticationService.REST_URL + `/pipeline/DEAL/${userId}/${createdForCompanyId}/list?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  isSalesForceEnabled(createdForCompanyId:number, loggedInUserId:number)
    {
      return this.http.get(this.URL + `validate-sf-enabled/${createdForCompanyId}/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  saveOrUpdateDeal(deal: Deal) {
    let url = this.URL;
    if (deal.id > 0) {
      url = url + `edit`;            
    }
    return this.http.post(url + `?access_token=${this.authenticationService.access_token}`, deal)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getDeal(dealId:number, userId:number) {
    return this.http.get(this.URL + `${dealId}/${userId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  deleteDeal(deal: Deal) {
    return this.http.post(this.URL + `/delete?access_token=${this.authenticationService.access_token}`, deal)
   .map(this.extractData)
   .catch(this.handleError);
 }

getCampaignDealPipeline(campaignId:number, userId:number) {
  return this.http.get(this.authenticationService.REST_URL + `/pipeline/DEAL/campaign/${campaignId}/${userId}?access_token=${this.authenticationService.access_token}`)
  .map(this.extractData)
  .catch(this.handleError);
}

getSalesforcePipeline(createdForCompanyId:number, userId:number) {
  return this.http.get(this.authenticationService.REST_URL + `/pipeline/DEAL/salesforce/${createdForCompanyId}/${userId}?access_token=${this.authenticationService.access_token}`)
  .map(this.extractData)
  .catch(this.handleError);
}

changeDealStatus(deal: Deal) {
  return this.http.post(this.URL + `/status/change?access_token=${this.authenticationService.access_token}`, deal)
 .map(this.extractData)
 .catch(this.handleError);
}

getCounts(userId:number) {
  return this.http.get(this.URL + `/counts/${userId}?access_token=${this.authenticationService.access_token}`)
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
