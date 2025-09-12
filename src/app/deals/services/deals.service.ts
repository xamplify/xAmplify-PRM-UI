import { Injectable } from '@angular/core';
import { AuthenticationService } from "app/core/services/authentication.service";
import { Http, Response, RequestOptions, Headers } from "@angular/http";
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { Observable } from "rxjs";
import { Pagination } from '../../core/models/pagination';
import { Deal } from '../models/deal';
import { VanityLoginDto } from 'app/util/models/vanity-login-dto';
import { DealDynamicProperties } from 'app/deal-registration/models/deal-dynamic-properties';
import { UtilService } from 'app/core/services/util.service';
import { ReferenceService } from 'app/core/services/reference.service';
declare var $:any;

@Injectable()
export class DealsService {
 
  
	URL = this.authenticationService.REST_URL + "deal/";

  constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger,private utilService:UtilService,private referenceService: ReferenceService) { }
  
  listDealsForVendor(pagination: Pagination) {
    return this.http.post(this.URL + `/list/v?access_token=${this.authenticationService.access_token}`, pagination)
      .map(this.extractData)
      .catch(this.handleError);
  }

  listDealsForPartner(pagination: Pagination) {
     /****XNFR-252*****/
     let companyProfileName = this.authenticationService.companyProfileName;
     let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
     if(xamplifyLogin){
         pagination.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
     }
     /****XNFR-252*****/
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


getCounts(vanityLoginDto:VanityLoginDto) {
   /****XNFR-252*****/
   let companyProfileName = this.authenticationService.companyProfileName;
   let xamplifyLogin =  companyProfileName== undefined || companyProfileName.length==0; 
   if(xamplifyLogin){
    vanityLoginDto.loginAsUserId = this.utilService.getLoggedInVendorAdminCompanyUserId();
  }
   /***XNFR-252***/
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
  return null;
}

listPartnersForCampaign(pagination: Pagination) {
  return null;
}

listCampaignLeads(pagination: Pagination) {
  return null;
}

listCampaignsForPartner(pagination: Pagination) {
  return null;
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


getStageNamesForVendor(userId:number) {
  return this.http.get(this.URL + `/list/v/stages/${userId}?access_token=${this.authenticationService.access_token}`)
  .map(this.extractData)
  .catch(this.handleError);
}

getStageNamesForPartnerByVendorCompanyId(userId:number, vendorCompanyId:number) {
  return this.http.get(this.URL + `/list/p/stages/${userId}/${vendorCompanyId}?access_token=${this.authenticationService.access_token}`)
  .map(this.extractData)
  .catch(this.handleError);
}

getStageNamesForCampaign(campaignId:number, userId:number){
  return null;
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
    return null;
  }
  getStageNamesOfCampaign(userId:number) {
    return null;
  }
  getStageNamesForPartner1(userId:number){
    return this.http.get(this.URL + `/list/partner/stages/${userId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }
  getStagenamesForPartnerCompanyId(companyId:number){
    return this.http.get(this.URL + `/partner/company/stages/${companyId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }
  
  getCRMPipelines(createdForCompanyId: number, loggedInUserId: number, type: any, halopsaTicketTypeId: any) {
    return this.http.get(this.authenticationService.REST_URL + `/pipeline/DEAL/${type}/${createdForCompanyId}/${loggedInUserId}/${halopsaTicketTypeId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }
  
  downloadDeals(pagination: Pagination, userId: number){
    let url = this.URL + "download/" + userId + "?access_token=" + this.authenticationService.access_token
    return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
  }

  getActiveCRMPipelines(createdForCompanyId: number, loggedInUserId: number, campaignId: number, type: any, halopsaTicketTypeId: number) {
    return this.http.get(this.authenticationService.REST_URL + `/crm/active/pipelines/${createdForCompanyId}/${loggedInUserId}/${campaignId}/${type}/${halopsaTicketTypeId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  getDealPipelinesForView(dealId: number, loggedInUserId: number) {
    return this.http.get(this.authenticationService.REST_URL + `/deal/view/pipelines/${dealId}/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }

  findAllRegisteredByUsersForPartnerView() {
    let loggedInUserId = this.authenticationService.getUserId();
    return this.http.get(this.authenticationService.REST_URL + `/deal/findRegisteredByUsersForPartnerView/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
    .map(this.extractData)
    .catch(this.handleError);
  }
  findAllRegisteredByUsers() {
    let loggedInUserId = this.authenticationService.getUserId();
      return this.http.get(this.authenticationService.REST_URL + `/deal/findRegisteredByUsers/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }
  findAllRegisteredByCompanies() {
    let loggedInUserId = this.authenticationService.getUserId();
      return this.http.get(this.authenticationService.REST_URL + `/deal/findRegisteredByCompanies/${loggedInUserId}?access_token=${this.authenticationService.access_token}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  findAllRegisteredByUsersByCampaignIdAndPartnerCompanyId(campaignId: any,partnerCompanyId:number) {
    let isValidPartnerCompanyId = partnerCompanyId!=undefined && partnerCompanyId>0;
    let loggedInUserId = this.authenticationService.getUserId();
    let url = "";
    if(isValidPartnerCompanyId){
      url = this.authenticationService.REST_URL + `/deal/findRegisteredByUsersByPartnerCompanyId/${partnerCompanyId}/${campaignId}?access_token=${this.authenticationService.access_token}`;
    }else{
      url = url = this.authenticationService.REST_URL + `/deal/findRegisteredByUsersByCampaignId/${loggedInUserId}/${campaignId}?access_token=${this.authenticationService.access_token}`;
    }
    return this.http.get(url)
    .map(this.extractData)
    .catch(this.handleError);
 }

 findDealAndLeadInfoForComments(dealId: any) {
  let convertedDealId = dealId!=undefined ? dealId:0;
  let url = this.authenticationService.REST_URL+"deal/findDealAndLeadInfoAndComments/"+convertedDealId+"?access_token="+this.authenticationService.access_token;
  return this.authenticationService.callGetMethod(url);
}

findVendorDetailsWithSelfDealsCount(campaignId:any, loggedInUserId:any) {
    let requestCampaignId = (campaignId != undefined && campaignId > 0)? "&campaignId="+campaignId:"&campaignId="+0;
    let requestLoggedInUserId = "&loggedInUserId="+loggedInUserId;
    let url = this.authenticationService.REST_URL+"deal/findVendorDetailsWithSelfDealsCount"+"?access_token="+this.authenticationService.access_token+requestCampaignId+requestLoggedInUserId;
    return this.authenticationService.callGetMethod(url);
  }

  /**XNFR-553**/
  findDealsAndCountByContactId(contactId:number, vanityUrlFilter:boolean, vendorCompanyName:string, isCompanyJourney:boolean) {
    let loggedInUserId = this.authenticationService.getUserId();
    let loggedInUserIdRequestParam = loggedInUserId!=undefined && loggedInUserId>0 ? "&loggedInUserId="+loggedInUserId:"&loggedInUserId=0";
    let contactIdRequestParam = contactId!=undefined && contactId>0 ? "&contactId="+contactId:"&contactId=0";
    let vanityUrlFilterParam = vanityUrlFilter!=undefined?"&vanityUrlFilter="+vanityUrlFilter:"";
    let vendorCompanyNameParam = vendorCompanyName!=undefined ? "&vendorCompanyName="+vendorCompanyName:"";
    let isCompanyJourneyParam = "&isCompanyJourney="+isCompanyJourney;
    let dealRequestDtoParam = $.trim(loggedInUserIdRequestParam+contactIdRequestParam+vanityUrlFilterParam+vendorCompanyNameParam+isCompanyJourneyParam);
    let url = this.authenticationService.REST_URL + "deal/fetchContactAssociatedDealsAndCount" + "?access_token="+this.authenticationService.access_token + dealRequestDtoParam;
    return this.authenticationService.callGetMethod(url);
  }

  getContactsForContactAttachment(pagination: Pagination) {
    let loggedInUserId = this.authenticationService.getUserId();
    let pageableUrl = this.referenceService.getPagebleUrl(pagination);
    let url = this.authenticationService.REST_URL + "deal/fetchContactsForDealAttachment/" + loggedInUserId + "?access_token=" + this.authenticationService.access_token + pageableUrl;
    return this.authenticationService.callGetMethod(url);
  }

  fetchTotalDealAmount(companyId:any, vanityUrlFilter:boolean, vendorCompanyName:string) {
    let loggedInUserId = this.authenticationService.getUserId();
    let loggedInUserIdRequestParam = loggedInUserId!=undefined && loggedInUserId>0 ? "&loggedInUserId="+loggedInUserId:"&loggedInUserId=0";
    let contactIdRequestParam = companyId!=undefined && companyId>0 ? "&contactId="+companyId:"&contactId=0";
    let vanityUrlFilterParam = vanityUrlFilter!=undefined?"&vanityUrlFilter="+vanityUrlFilter:"";
    let vendorCompanyNameParam = vendorCompanyName!=undefined ? "&vendorCompanyName="+vendorCompanyName:"";
    let dealRequestDtoParam = $.trim(loggedInUserIdRequestParam+contactIdRequestParam+vanityUrlFilterParam+vendorCompanyNameParam);
    let url = this.authenticationService.REST_URL + "deal/fetchTotalDealAmount" + "?access_token=" + this.authenticationService.access_token + dealRequestDtoParam;
    return this.authenticationService.callGetMethod(url);
  }
 

}
