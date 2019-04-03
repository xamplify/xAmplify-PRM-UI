import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../../core/services/authentication.service';
import { Pagination } from '../../core/models/pagination';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { DealRegistration } from '../models/deal-registraton';
import { DealComments } from '../models/deal-comments';

@Injectable()
export class DealRegistrationService1
{

    URL = this.authenticationService.REST_URL + "deals/";

    constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger)
    {

    }

    getTotalDeals(userId: number)
    {
        return this.http.get(this.URL + "total/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getTotalLeads(userId: number)
    {
        return this.http.get(this.URL + "leads/total/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getTotalLeadsByPartner(userId: number)
    {
        return this.http.get(this.URL + "partner/leads/total/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getTotalDealsByPartner(userId: number)
    {
        return this.http.get(this.URL + "partner/total/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getApprovedDeals(userId: number)
    {
        return this.http.get(this.URL + "approved/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getApprovedDealsByPartner(userId: number)
    {
        return this.http.get(this.URL + "partner/approved/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getRejectedDeals(userId: number)
    {
        return this.http.get(this.URL + "rejected/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getRejectedDealsByPartner(userId: number)
    {
        return this.http.get(this.URL + "partner/rejected/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getOpenedDeals(userId: number)
    {
        return this.http.get(this.URL + "opened/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getDealsOnHold(userId: number)
    {
        return this.http.get(this.URL + "hold/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getClosedDeals(userId: number)
    {
        return this.http.get(this.URL + "closed/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getOpenedDealsByPartner(userId: number)
    {
        return this.http.get(this.URL + "partner/opened/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getDealsOnHoldByPartner(userId: number)
    {
        return this.http.get(this.URL + "partner/hold/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getClosedDealsByPartner(userId: number)
    {
        return this.http.get(this.URL + "partner/closed/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getDeal(campaignId: number, userId: number)
    {
        return this.http.post(this.URL + campaignId + "/" + userId + "?access_token=" + this.authenticationService.access_token, {})
            .map(this.extractData)
            .catch(this.handleError);
    }
    getDealById(dealId: number)
    {
        return this.http.post(this.URL + dealId + "?access_token=" + this.authenticationService.access_token, {})
            .map(this.extractData)
            .catch(this.handleError);
    }



    listCampaigns(pagination: Pagination)
    {
        var url = this.URL + "campaigns?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listCampaignsByDeals(pagination: Pagination)
    {
        var url = this.URL + "campaignsByDeals?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listCampaignsByPartner(pagination: Pagination)
    {
        var url = this.URL + "partner/campaigns?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listCampaignsDealsByPartner(pagination: Pagination)
    {
        var url = this.URL + "partner/campaignsByDeals?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listCampaignPartners(pagination: Pagination)
    {
        var url = this.URL + "partners?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listCampaignPartnersByDeals(pagination: Pagination)
    {
        var url = this.URL + "partnersByDeals?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getCampaignPartnerById(id: number)
    {
        var url = this.URL + "partners/" + id + "?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }


    listLeads(pagination: Pagination)
    {
        var url = this.URL + "leads?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listAllLeads(pagination: Pagination)
    {
        var url = this.URL + "lead/list?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listAllDeals(pagination: Pagination)
    {
        var url = this.URL + "list?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }


    listApprovedLeads(pagination: Pagination)
    {
        var url = this.URL + "lead/approved?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listHoldLeads(pagination: Pagination)
    {
        var url = this.URL + "lead/hold?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listRejectedLeads(pagination: Pagination)
    {
        var url = this.URL + "lead/rejected?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listOpenedLeads(pagination: Pagination)
    {
        var url = this.URL + "lead/opened?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listClosedLeads(pagination: Pagination)
    {
        var url = this.URL + "lead/closed?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }


    listLeadsByPartner(pagination: Pagination)
    {
        var url = this.URL + "partner/leads?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listAllLeadsByPartner(pagination: Pagination)
    {
        var url = this.URL + "partner/lead/list?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listAllDealsByPartner(pagination: Pagination)
    {
        var url = this.URL + "partner/list?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }


    listApprovedLeadsByPartner(pagination: Pagination)
    {
        var url = this.URL + "partner/lead/approved?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    listRejectedLeadsByPartner(pagination: Pagination)
    {
        var url = this.URL + "partner/lead/rejected?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listOpenedLeadsByPartner(pagination: Pagination)
    {
        var url = this.URL + "partner/lead/opened?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listClosedLeadsByPartner(pagination: Pagination)
    {
        var url = this.URL + "partner/lead/closed?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listOnHoldLeadsByPartner(pagination: Pagination)
    {
        var url = this.URL + "partner/lead/hold?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getLeadData(user: any)
    {
        let userId = user.userId;
        let userListId = user.userListId;
        return this.http.get(this.URL + "user-list/" + userListId + "/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);

    }
    saveDeal(deal: DealRegistration)
    {
        var url = this.URL + "save?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, deal)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateDeal(deal: DealRegistration)
    {
        var url = this.URL + "update?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, deal)
            .map(this.extractData)
            .catch(this.handleError);
    }

    acceptDeal(dealId: number)
    {

        var url = this.URL + dealId + "/accept?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    changeDealStatus(dealId: number, status: string)
    {

        var url = this.URL + dealId + "/status/" + status + "?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    rejectDeal(dealId: number)
    {

        var url = this.URL + dealId + "/reject?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getDealCreatedBy(createdBy: number)
    {

        var url = this.URL + "/user/" + createdBy + "?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getDealStatus(id: number): any
    {
        var url = this.URL + "/" + id + "/status" + "?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**    
     * 
     *  Manage Comments
     * 
     * */

    getComments(dealId: number)
    {
        var url = this.URL + dealId + "/comments?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getCommentsCount(id: any): any
    {
        var url = this.URL + id + "/comments/count?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getCommentsByProperty(dealId: number, propertyId: number)
    {
        var url = this.URL + dealId + "/property/" + propertyId + "/comments?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    saveComment(dealId: number, comment: DealComments)
    {
        var url = this.URL + dealId + "/comments/save?access_token=" + this.authenticationService.access_token;

        return this.http.post(url, comment)
            .map(this.extractData)
            .catch(this.handleError);
    }
    deleteComments(comment: DealComments)
    {
        var url = this.URL + "comments/delete?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, comment)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getForms(userId: number)
    {
        var url = this.authenticationService.REST_URL + "users/" + userId + "/forms/list?access_token=" + this.authenticationService.access_token;

        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getFormById(userId: number, formId: number)
    {
        var url = this.authenticationService.REST_URL + "users/" + userId + "/forms/" + formId + "?access_token=" + this.authenticationService.access_token;

        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }


    getEmailLogCountByCampaignAndUser(campaignId: number, userid: any): any
    {
        var url = this.URL + "emaillog/" + campaignId + "/" + userid + "?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response)
    {
        let body = res.json();
        return body || {};
    }


    private handleError(error: any)
    {
        console.log(error)
        return Observable.throw(error);
    }

}
