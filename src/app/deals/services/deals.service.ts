import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Pagination } from '../../core/models/pagination';
import { Deal } from '../models/deal';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { DealDynamicProperties } from 'app/deal-registration/models/deal-dynamic-properties';

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
  return this.http.post(this.authenticationService.REST_URL + `/lead/view/type?access_token=${this.authenticationService.access_token}`, vanityLoginDto)
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
  return this.http.post(this.URL + `campaign/deal/list?access_token=${this.authenticationService.access_token}`, pagination)
    .map(this.extractData)
    .catch(this.handleError);
}

listCampaignsForPartner(pagination: Pagination) {
  return this.http.post(this.URL + `campaign/list/p?access_token=${this.authenticationService.access_token}`, pagination)
    .map(this.extractData)
    .catch(this.handleError);
}

deleteProperty(comment: DealDynamicProperties) {
  return this.http.post(this.URL + `properties/delete?access_token=${this.authenticationService.access_token}`, comment)
    .map(this.extractData)
    .catch(this.handleError);
}

getConversationByProperty(propertyId:number, userId:number) {
  return this.http.get(this.URL + `/property/${propertyId}/chat/${userId}?access_token=${this.authenticationService.access_token}`)
  .map(this.extractData)
  .catch(this.handleError);
}

getConversation(dealId:number, userId:number) {
  return this.http.get(this.URL + `/${dealId}/chat/${userId}?access_token=${this.authenticationService.access_token}`)
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
  getStageNamesOfV(userId:number) {
    return this.http.get(this.URL + `campaign/deal/list/stages/${userId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }
  getStageNamesOfCampaign(userId:number) {
    return this.http.get(this.URL + `campaign/deal/stages/${userId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }
  getStageNamesForPartner(userId:number){
    return this.http.get(this.URL + `/list/partner/stages/${userId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }
}
