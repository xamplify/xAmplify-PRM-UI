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
import { User } from '../../core/models/user';
import { DealType } from '../models/deal-type';
import { DealQuestions } from '../models/deal-questions';
import { DealDynamicProperties } from '../models/deal-dynamic-properties';
import {DashboardAnalyticsDto} from "app/dashboard/models/dashboard-analytics-dto";

@Injectable()
export class DealRegistrationService
{

    URL = this.authenticationService.REST_URL + "deals/";

    constructor(private http: Http, private authenticationService: AuthenticationService, private logger: XtremandLogger)
    {

    }
    getPartnerLeadServices(userId:number,companyId:number){
        return this.http.get(this.URL + "partnerLeadAccess/" +userId+"/"+ companyId + "?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }
    getVendorLeadServices(userId:number,companyId:number){
        return this.http.get(this.URL + "vendorLeadAccess/" +userId+"/"+ companyId + "?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
    }
    getSuperorId(userId:number){
        return this.http.get(this.URL + "getSuperiorId/" +userId+ "?access_token=" + this.authenticationService.access_token)
        .map(this.extractData)
        .catch(this.handleError);
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

    getDealsCountByStatus(userId: number,status:string)
    {
        return this.http.get(this.URL + status+"/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }
    getPartnerDealsCountByStatus(userId: number,status:string)
    {
        return this.http.get(this.URL + "partner/"+ status+"/" + userId + "?access_token=" + this.authenticationService.access_token)
            .map(this.extractData)
            .catch(this.handleError);
    }


    getDeal(campaignId: number, userId: number)
    {
        return this.http.post(this.URL + campaignId + "/" + userId + "?access_token=" + this.authenticationService.access_token, {})
            .map(this.extractData)
            .catch(this.handleError);
    }
    getDealById(dealId: number,userId:number)
    {
        return this.http.post(this.URL + "fetch/"+dealId + "/"+userId+"?access_token=" + this.authenticationService.access_token, {})
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

    listLeadsByStatus(pagination: Pagination,status:string)
    {
        var url = this.URL + "lead/"+status+"?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, pagination)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listPartnerLeadsByStatus(pagination: Pagination,status:string)
    {
        var url = this.URL + "partner/lead/"+status+"?access_token=" + this.authenticationService.access_token;
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


    getLeadData(user: any)
    {
        console.log(user)
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
    updateLead(deal: DealRegistration)
    {
        var url = this.URL + "update-lead?access_token=" + this.authenticationService.access_token;
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
    changeDealStatus(dealId: number, status: string,user:User)
    {

        var url = this.URL + dealId + "/status/" + status + "?access_token=" + this.authenticationService.access_token;
        return this.http.post(url,user)
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
    deleteProperty(question: DealDynamicProperties)
    {
        var url = this.URL + "properties/delete?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, question)
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateCommentStats(data:any)
    {
        var url = this.URL + "/comment-stats/save?access_token=" + this.authenticationService.access_token;

        return this.http.post(url, data)
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


    saveDealTypes(dealTypes: DealType[],userId:number)
    {
        var url = this.URL + "deal-type/list/"+userId+"?access_token=" + this.authenticationService.access_token;
        return this.http.post(url, dealTypes)
            .map(this.extractData)
            .catch(this.handleError);
    }
    deleteDealType(dealType: DealType)
    {   
        var url = this.URL + "deal-type/delete/?access_token=" + this.authenticationService.access_token;
        dealType.createdBy = this.authenticationService.getUserId();
        return this.http.post(url, dealType)
            .map(this.extractData)
            .catch(this.handleError);
    }
    listDealTypes(userId:number)
    {
        var url = this.URL + "deal-type/list/"+userId+"?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    isSfEnabledForParentCampaign(dealId:number): Observable<boolean>
    {
        var url = this.URL + "validate-sf-enabled/"+dealId+"?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getOpportunitesAnalyticsForVendor(userId:number) {
        const url =  this.authenticationService.REST_URL +'dashboard/views/opportunities/vendor/analytics/'+userId+'?access_token=' + this.authenticationService.access_token;
        return this.http.get(url,"")
            .map(this.extractData)
            .catch(this.handleError);
    }

    getOpportunitesAnalyticsForPartner(dto: DashboardAnalyticsDto) {
        const url =  this.authenticationService.REST_URL +'dashboard/views/opportunities/partner/analytics/?access_token=' + this.authenticationService.access_token;
        return this.http.post(url,dto)
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
    
    syncLeadsWithSalesforce(selectedCampaignId: number, loggedInUserId: number, partnerId: number) {
        return this.http.get( this.authenticationService.REST_URL + 'salesforce/'+loggedInUserId+'/'+selectedCampaignId+'/'+partnerId+'/leads/sync?access_token=' + this.authenticationService.access_token,"" )
      .map( this.extractData ).catch( this.handleError );
     }

     listDealTypesByCompanyId(companyId:number)
    {
        var url = this.URL + "deal-type/list/company/"+companyId+"?access_token=" + this.authenticationService.access_token;
        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

}
